import "server-only";

import { auth } from "@clerk/nextjs/server";
import { Role, type Organization, type Role as PrismaRole, type User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AuthErrorCode =
  | "UNAUTHENTICATED"
  | "NO_ACTIVE_ORGANIZATION"
  | "MEMBERSHIP_NOT_FOUND"
  | "INSUFFICIENT_ROLE";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  readonly status: number;

  constructor(code: AuthErrorCode, message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
}

export type AuthContext = {
  user: User;
  org: Organization;
  role: PrismaRole;
};

const roleRank: Record<PrismaRole, number> = {
  [Role.viewer]: 0,
  [Role.member]: 1,
  [Role.admin]: 2,
  [Role.owner]: 3,
};

export function hasRequiredRole(
  currentRole: PrismaRole,
  minimumRole: PrismaRole
): boolean {
  return roleRank[currentRole] >= roleRank[minimumRole];
}

export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth();

  if (!session.userId) {
    throw new AuthError(
      "UNAUTHENTICATED",
      "You must be signed in to access this resource.",
      401
    );
  }

  if (!session.orgId) {
    throw new AuthError(
      "NO_ACTIVE_ORGANIZATION",
      "An active organization is required to access this resource.",
      403
    );
  }

  const membership = await prisma.organizationMember.findFirst({
    where: {
      deletedAt: null,
      organization: {
        clerkOrgId: session.orgId,
        deletedAt: null,
      },
      user: {
        clerkUserId: session.userId,
        deletedAt: null,
      },
    },
    include: {
      organization: true,
      user: true,
    },
  });

  if (!membership) {
    throw new AuthError(
      "MEMBERSHIP_NOT_FOUND",
      "The signed-in user is not a member of the active organization.",
      403
    );
  }

  return {
    user: membership.user,
    org: membership.organization,
    role: membership.role,
  };
}

export async function requireRole(
  minimumRole: PrismaRole
): Promise<AuthContext> {
  const context = await getAuthContext();

  if (!hasRequiredRole(context.role, minimumRole)) {
    throw new AuthError(
      "INSUFFICIENT_ROLE",
      `Requires ${minimumRole} role or higher.`,
      403
    );
  }

  return context;
}
