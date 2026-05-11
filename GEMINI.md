# Project Context: Multi-Tenant Document AI

A multi-tenant document management and AI analysis platform built with Next.js, Prisma, and Google Gemini.

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Authentication & Multi-Tenancy:** [Clerk](https://clerk.com/) (Organizations)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **AI Analysis:** [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **File Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling:** Tailwind CSS, Radix UI, Lucide Icons

## Architecture & Conventions

### Multi-Tenancy
Multi-tenancy is driven by **Clerk Organizations**. Users must be signed in and have an active organization selected to access document resources.
- Data synchronization from Clerk to the local database is handled via webhooks in `app/api/webhooks/clerk/route.ts`.
- `lib/auth.ts` provides `getAuthContext()` and `requireRole(role)` helpers to enforce multi-tenant isolation and RBAC.

### Database (Prisma)
- The schema is located at `prisma/schema.prisma`.
- Generated client is in `generated/prisma`.
- Models include `User`, `Organization`, `OrganizationMember`, `Document`, `File`, `DocumentAI`, and `DocumentVersion`.
- Soft deletes are implemented using a `deletedAt` column.

### AI Integration
- `lib/gemini.ts` contains the core AI logic using the `gemini-2.5-flash` model.
- Supports five analysis types: `summary`, `qa`, `sentiment`, `entities`, and `extract`.
- AI results are stored in the `DocumentAI` model.

### UI Components
- UI components are built using Radix UI primitives and styled with Tailwind CSS.
- Standard components are located in `components/ui/`.
- Layout components like `Header` and `Footer` are in `components/ui/common/`.

## Key Commands
- `npm run dev`: Start development server.
- `npx prisma generate`: Generate Prisma client.
- `npx prisma migrate dev`: Run database migrations.
- `npm run lint`: Run ESLint.

## Directory Structure
- `app/`: Next.js App Router (Pages & API routes).
  - `api/webhooks/clerk/`: Clerk webhook handler.
- `components/`: React components.
- `lib/`: Shared utilities (Auth, Prisma, Gemini, Blob).
- `prisma/`: Database schema and migrations.
- `types/`: TypeScript definitions.

## Development Guidelines
- **Always verify multi-tenancy:** When fetching or modifying documents, ensure they belong to the current user's active organization using `getAuthContext()`.
- **Use Server-Only:** `lib/auth.ts` is marked as `server-only` to prevent accidental client-side usage of sensitive auth logic.
- **Error Handling:** Use `AuthError` from `lib/auth.ts` for authentication and authorization failures.
