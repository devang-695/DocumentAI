import { Role, type Role as PrismaRole } from "@prisma/client";
import { Webhook, WebhookVerificationError } from "svix";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const svixHeadersSchema = z.object({
  "svix-id": z.string().min(1),
  "svix-timestamp": z.string().min(1),
  "svix-signature": z.string().min(1),
});

const clerkEventSchema = z
  .object({
    type: z.string().min(1),
    data: z.unknown(),
  })
  .passthrough();

const emailAddressSchema = z
  .object({
    id: z.string().min(1),
    email_address: z.string().email(),
  })
  .passthrough();

const userDataSchema = z
  .object({
    id: z.string().min(1),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    primary_email_address_id: z.string().nullable(),
    email_addresses: z.array(emailAddressSchema).min(1),
  })
  .passthrough();

const deletedDataSchema = z
  .object({
    id: z.string().min(1),
    deleted: z.boolean().optional(),
  })
  .passthrough();

const organizationDataSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
  })
  .passthrough();

const membershipUserDataSchema = z
  .object({
    user_id: z.string().min(1),
    identifier: z.string().email(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
  })
  .passthrough();

const organizationMembershipDataSchema = z
  .object({
    id: z.string().min(1),
    role: z.string().min(1),
    organization: organizationDataSchema,
    public_user_data: membershipUserDataSchema,
  })
  .passthrough();

type SvixHeaders = z.infer<typeof svixHeadersSchema>;
type ClerkEvent = z.infer<typeof clerkEventSchema>;
type UserData = z.infer<typeof userDataSchema>;
type DeletedData = z.infer<typeof deletedDataSchema>;
type OrganizationData = z.infer<typeof organizationDataSchema>;
type OrganizationMembershipData = z.infer<
  typeof organizationMembershipDataSchema
>;

class WebhookHandlerError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WebhookHandlerError";
    this.status = status;
  }
}

function getSvixHeaders(request: Request): SvixHeaders {
  return svixHeadersSchema.parse({
    "svix-id": request.headers.get("svix-id"),
    "svix-timestamp": request.headers.get("svix-timestamp"),
    "svix-signature": request.headers.get("svix-signature"),
  });
}

function getUserName(
  firstName: string | null,
  lastName: string | null
): string | null {
  const name = [firstName, lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ")
    .trim();

  return name.length > 0 ? name : null;
}

function getPrimaryEmail(data: UserData): string {
  const primaryEmail = data.email_addresses.find(
    (emailAddress): boolean => emailAddress.id === data.primary_email_address_id
  );

  return primaryEmail?.email_address ?? data.email_addresses[0].email_address;
}

function mapClerkRole(clerkRole: string): PrismaRole {
  const normalizedRole = clerkRole.trim().toLowerCase();
  const roles: Record<string, PrismaRole> = {
    owner: Role.owner,
    "org:owner": Role.owner,
    admin: Role.admin,
    "org:admin": Role.admin,
    member: Role.member,
    "org:member": Role.member,
    viewer: Role.viewer,
    "org:viewer": Role.viewer,
  };
  const role = roles[normalizedRole];

  if (!role) {
    throw new WebhookHandlerError(
      `Unsupported Clerk organization role: ${clerkRole}`,
      422
    );
  }

  return role;
}

async function upsertUser(data: UserData): Promise<void> {
  await prisma.user.upsert({
    where: {
      clerkUserId: data.id,
    },
    create: {
      clerkUserId: data.id,
      email: getPrimaryEmail(data),
      name: getUserName(data.first_name, data.last_name),
    },
    update: {
      email: getPrimaryEmail(data),
      name: getUserName(data.first_name, data.last_name),
      deletedAt: null,
    },
  });
}

async function updateUser(data: UserData): Promise<void> {
  await prisma.user.updateMany({
    where: {
      clerkUserId: data.id,
      deletedAt: null,
    },
    data: {
      email: getPrimaryEmail(data),
      name: getUserName(data.first_name, data.last_name),
    },
  });
}

async function softDeleteUser(data: DeletedData): Promise<void> {
  await prisma.user.updateMany({
    where: {
      clerkUserId: data.id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

async function upsertOrganization(data: OrganizationData): Promise<void> {
  await prisma.organization.upsert({
    where: {
      clerkOrgId: data.id,
    },
    create: {
      clerkOrgId: data.id,
      name: data.name,
      slug: data.slug,
    },
    update: {
      name: data.name,
      slug: data.slug,
      deletedAt: null,
    },
  });
}

async function upsertOrganizationMembership(
  data: OrganizationMembershipData
): Promise<void> {
  const role = mapClerkRole(data.role);
  const memberName = getUserName(
    data.public_user_data.first_name,
    data.public_user_data.last_name
  );

  await prisma.$transaction(async (tx): Promise<void> => {
    const organization = await tx.organization.upsert({
      where: {
        clerkOrgId: data.organization.id,
      },
      create: {
        clerkOrgId: data.organization.id,
        name: data.organization.name,
        slug: data.organization.slug,
      },
      update: {
        name: data.organization.name,
        slug: data.organization.slug,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    const user = await tx.user.upsert({
      where: {
        clerkUserId: data.public_user_data.user_id,
      },
      create: {
        clerkUserId: data.public_user_data.user_id,
        email: data.public_user_data.identifier,
        name: memberName,
      },
      update: {
        email: data.public_user_data.identifier,
        name: memberName,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    await tx.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
      create: {
        organizationId: organization.id,
        userId: user.id,
        role,
      },
      update: {
        role,
        deletedAt: null,
      },
    });
  });
}

async function softDeleteOrganizationMembership(
  data: OrganizationMembershipData
): Promise<void> {
  await prisma.$transaction(async (tx): Promise<void> => {
    const organization = await tx.organization.findFirst({
      where: {
        clerkOrgId: data.organization.id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    const user = await tx.user.findFirst({
      where: {
        clerkUserId: data.public_user_data.user_id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!organization || !user) {
      return;
    }

    await tx.organizationMember.updateMany({
      where: {
        organizationId: organization.id,
        userId: user.id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  });
}

async function handleClerkEvent(event: ClerkEvent): Promise<boolean> {
  switch (event.type) {
    case "user.created":
      await upsertUser(userDataSchema.parse(event.data));
      return true;
    case "user.updated":
      await updateUser(userDataSchema.parse(event.data));
      return true;
    case "user.deleted":
      await softDeleteUser(deletedDataSchema.parse(event.data));
      return true;
    case "organization.created":
      await upsertOrganization(organizationDataSchema.parse(event.data));
      return true;
    case "organizationMembership.created":
      await upsertOrganizationMembership(
        organizationMembershipDataSchema.parse(event.data)
      );
      return true;
    case "organizationMembership.deleted":
      await softDeleteOrganizationMembership(
        organizationMembershipDataSchema.parse(event.data)
      );
      return true;
    default:
      return false;
  }
}

function getResponseError(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof WebhookHandlerError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof WebhookVerificationError) {
    return {
      message: "Invalid Clerk webhook signature",
      status: 400,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      message: "Invalid Clerk webhook payload",
      status: 400,
    };
  }

  return {
    message: "Failed to process Clerk webhook",
    status: 500,
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new WebhookHandlerError(
        "CLERK_WEBHOOK_SECRET environment variable is missing",
        500
      );
    }

    const payload = await request.text();
    const headers = getSvixHeaders(request);
    const webhook = new Webhook(webhookSecret);
    const verifiedPayload = webhook.verify(payload, headers);
    const event = clerkEventSchema.parse(verifiedPayload);
    const handled = await handleClerkEvent(event);

    return Response.json({
      received: true,
      handled,
      type: event.type,
    });
  } catch (error: unknown) {
    const responseError = getResponseError(error);

    console.error("Clerk webhook error:", error);

    return Response.json(
      {
        error: responseError.message,
      },
      {
        status: responseError.status,
      }
    );
  }
}
