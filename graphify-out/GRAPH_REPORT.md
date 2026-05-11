# Graph Report - .  (2026-05-11)

## Corpus Check
- 48 files · ~57,942 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 100 nodes · 69 edges · 48 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Clerk Webhooks & User Helpers|Clerk Webhooks & User Helpers]]
- [[_COMMUNITY_Project Overview & Tech Stack|Project Overview & Tech Stack]]
- [[_COMMUNITY_Authentication & Authorization|Authentication & Authorization]]
- [[_COMMUNITY_Document Upload Logic|Document Upload Logic]]
- [[_COMMUNITY_Prisma Internal Helpers|Prisma Internal Helpers]]
- [[_COMMUNITY_File Utilities & Constants|File Utilities & Constants]]
- [[_COMMUNITY_Core Database Models|Core Database Models]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Data Formatting|Data Formatting]]
- [[_COMMUNITY_UI Button Component|UI Button Component]]
- [[_COMMUNITY_Footer Component|Footer Component]]
- [[_COMMUNITY_Header Component|Header Component]]
- [[_COMMUNITY_Gemini AI Integration|Gemini AI Integration]]
- [[_COMMUNITY_CSS Utilities|CSS Utilities]]
- [[_COMMUNITY_TS Declaration|TS Declaration]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Env|Next.js Env]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Prisma Config|Prisma Config]]
- [[_COMMUNITY_Proxy Utility|Proxy Utility]]
- [[_COMMUNITY_Prisma Browser Client|Prisma Browser Client]]
- [[_COMMUNITY_Prisma Client Implementation|Prisma Client Implementation]]
- [[_COMMUNITY_Prisma Input Types|Prisma Input Types]]
- [[_COMMUNITY_Prisma Enums|Prisma Enums]]
- [[_COMMUNITY_Prisma Models|Prisma Models]]
- [[_COMMUNITY_Prisma Namespace|Prisma Namespace]]
- [[_COMMUNITY_Prisma Namespace Browser|Prisma Namespace Browser]]
- [[_COMMUNITY_Document Model Implementation|Document Model Implementation]]
- [[_COMMUNITY_Document AI Model Implementation|Document AI Model Implementation]]
- [[_COMMUNITY_Document Version Model Implementation|Document Version Model Implementation]]
- [[_COMMUNITY_File Model Implementation|File Model Implementation]]
- [[_COMMUNITY_Organization Model Implementation|Organization Model Implementation]]
- [[_COMMUNITY_Organization Invite Model Implementation|Organization Invite Model Implementation]]
- [[_COMMUNITY_Organization Member Model Implementation|Organization Member Model Implementation]]
- [[_COMMUNITY_User Model Implementation|User Model Implementation]]
- [[_COMMUNITY_Prisma Database Instance|Prisma Database Instance]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Vercel Blob Storage|Vercel Blob Storage]]
- [[_COMMUNITY_PostgreSQL Database|PostgreSQL Database]]
- [[_COMMUNITY_Tailwind CSS Styling|Tailwind CSS Styling]]
- [[_COMMUNITY_Radix UI Components|Radix UI Components]]
- [[_COMMUNITY_Document Database Model|Document Database Model]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_SVG Placeholder|SVG Placeholder]]
- [[_COMMUNITY_Vercel Logo Asset|Vercel Logo Asset]]

## God Nodes (most connected - your core abstractions)
1. `handleClerkEvent()` - 8 edges
2. `Multi-Tenant Document AI` - 5 edges
3. `getUserName()` - 4 edges
4. `upsertUser()` - 4 edges
5. `updateUser()` - 4 edges
6. `upsertOrganizationMembership()` - 4 edges
7. `POST()` - 4 edges
8. `uploadDocument()` - 3 edges
9. `getPrimaryEmail()` - 3 edges
10. `getAuthContext()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `uploadDocument()` --calls--> `getAuthContext()`  [INFERRED]
  app\actions\documents.ts → lib\auth.ts
- `uploadDocument()` --calls--> `uploadToBlob()`  [INFERRED]
  app\actions\documents.ts → lib\blob.ts
- `Next.js Breaking Changes Warning` --references--> `Next.js`  [EXTRACTED]
  AGENTS.md → GEMINI.md

## Hyperedges (group relationships)
- **Core Tech Stack** — gemini_nextjs, gemini_clerk, gemini_prisma, gemini_google_gemini, gemini_postgresql [EXTRACTED 1.00]
- **Multi-Tenant Enforcement** — gemini_clerk_organizations, gemini_lib_auth, gemini_webhook_handler [INFERRED 0.90]

## Communities

### Community 0 - "Clerk Webhooks & User Helpers"
Cohesion: 0.25
Nodes (14): getPrimaryEmail(), getResponseError(), getSvixHeaders(), getUserName(), handleClerkEvent(), mapClerkRole(), POST(), softDeleteOrganizationMembership() (+6 more)

### Community 1 - "Project Overview & Tech Stack"
Cohesion: 0.17
Nodes (12): Next.js Breaking Changes Warning, Clerk, Clerk Organizations, DocumentAI Model, Google Generative AI (Gemini 2.5 Flash), Auth Utilities, AI Logic, Next.js (+4 more)

### Community 2 - "Authentication & Authorization"
Cohesion: 0.22
Nodes (6): AuthError, getAuthContext(), hasRequiredRole(), requireRole(), uploadToBlob(), uploadDocument()

### Community 3 - "Document Upload Logic"
Cohesion: 0.67
Nodes (0): 

### Community 4 - "Prisma Internal Helpers"
Cohesion: 0.67
Nodes (0): 

### Community 5 - "File Utilities & Constants"
Cohesion: 0.67
Nodes (0): 

### Community 6 - "Core Database Models"
Cohesion: 0.67
Nodes (3): Organization Model, Prisma Schema, User Model

### Community 7 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Landing Page"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Data Formatting"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "UI Button Component"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Footer Component"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Header Component"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Gemini AI Integration"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "CSS Utilities"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "TS Declaration"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Next.js Env"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Prisma Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Proxy Utility"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Prisma Browser Client"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Prisma Client Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Prisma Input Types"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Prisma Enums"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Prisma Models"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Prisma Namespace"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Prisma Namespace Browser"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Document Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Document AI Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Document Version Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "File Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Organization Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Organization Invite Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Organization Member Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "User Model Implementation"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Prisma Database Instance"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Vercel Blob Storage"
Cohesion: 1.0
Nodes (1): Vercel Blob

### Community 40 - "PostgreSQL Database"
Cohesion: 1.0
Nodes (1): PostgreSQL

### Community 41 - "Tailwind CSS Styling"
Cohesion: 1.0
Nodes (1): Tailwind CSS

### Community 42 - "Radix UI Components"
Cohesion: 1.0
Nodes (1): Radix UI

### Community 43 - "Document Database Model"
Cohesion: 1.0
Nodes (1): Document Model

### Community 44 - "File Icon Asset"
Cohesion: 1.0
Nodes (1): File Icon

### Community 45 - "Globe Icon Asset"
Cohesion: 1.0
Nodes (1): Globe Icon

### Community 46 - "SVG Placeholder"
Cohesion: 1.0
Nodes (1): Human Readable Name

### Community 47 - "Vercel Logo Asset"
Cohesion: 1.0
Nodes (1): Vercel Logo

## Knowledge Gaps
- **17 isolated node(s):** `Prisma ORM`, `Vercel Blob`, `PostgreSQL`, `Tailwind CSS`, `Radix UI` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Landing Page`** (2 nodes): `page.tsx`, `Home()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Formatting`** (2 nodes): `data.ts`, `formatFileSize()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Button Component`** (2 nodes): `cn()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer Component`** (2 nodes): `Footer.tsx`, `footer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Header Component`** (2 nodes): `Header.tsx`, `Header()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gemini AI Integration`** (2 nodes): `analyzeWithGemini()`, `gemini.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CSS Utilities`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TS Declaration`** (1 nodes): `declaration.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Env`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Config`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Proxy Utility`** (1 nodes): `proxy.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Browser Client`** (1 nodes): `browser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Client Implementation`** (1 nodes): `client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Input Types`** (1 nodes): `commonInputTypes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Enums`** (1 nodes): `enums.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Models`** (1 nodes): `models.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Namespace`** (1 nodes): `prismaNamespace.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Namespace Browser`** (1 nodes): `prismaNamespaceBrowser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Document Model Implementation`** (1 nodes): `Document.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Document AI Model Implementation`** (1 nodes): `DocumentAI.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Document Version Model Implementation`** (1 nodes): `DocumentVersion.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Model Implementation`** (1 nodes): `File.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Organization Model Implementation`** (1 nodes): `Organization.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Organization Invite Model Implementation`** (1 nodes): `OrganizationInvite.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Organization Member Model Implementation`** (1 nodes): `OrganizationMember.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model Implementation`** (1 nodes): `User.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Database Instance`** (1 nodes): `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Type Definitions`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Blob Storage`** (1 nodes): `Vercel Blob`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostgreSQL Database`** (1 nodes): `PostgreSQL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind CSS Styling`** (1 nodes): `Tailwind CSS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Radix UI Components`** (1 nodes): `Radix UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Document Database Model`** (1 nodes): `Document Model`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon Asset`** (1 nodes): `File Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon Asset`** (1 nodes): `Globe Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SVG Placeholder`** (1 nodes): `Human Readable Name`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Logo Asset`** (1 nodes): `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Prisma ORM`, `Vercel Blob`, `PostgreSQL` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._