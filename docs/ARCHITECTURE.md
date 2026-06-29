# System Architecture

The CSDAC Internship Management Portal is built on a modern, robust, and scalable tech stack tailored for high performance and maintainability.

## Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (Neon/AWS RDS)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (JWT Strategy, RBAC)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons

## Folder Structure

```
internships-app/
├── prisma/                 # Database schema and seed scripts
├── public/                 # Static assets (images, fonts, 3rd party scripts)
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── admin/          # Admin Dashboard (Protected: ADMIN)
│   │   ├── api/            # API Route Handlers
│   │   ├── student/        # Student Portal (Protected: APPLICANT)
│   │   └── (public pages)  # Landing, Auth, etc.
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Primitive UI components (buttons, inputs)
│   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   └── providers/      # Context providers (Auth, SWR)
│   ├── lib/                # Core utilities
│   │   ├── auth.ts         # Authentication configuration
│   │   ├── prisma.ts       # Database singleton
│   │   ├── rate-limit.ts   # In-memory rate limiter
│   │   └── validators.ts   # Zod schemas for API validation
│   └── types/              # Global TypeScript type definitions
└── docs/                   # System Documentation
```

## Authentication Flow (RBAC)

The platform implements Role-Based Access Control using NextAuth.js and Next.js Middleware.

1. **User Login**: Users authenticate using their credentials.
2. **JWT Generation**: NextAuth creates a JWT containing the user's `id` and `role`.
3. **Middleware Interception**: `src/middleware.ts` intercepts all requests to `/admin/*` and `/student/*`.
   - `/admin/*` routes strictly require `role === 'ADMIN'`.
   - `/student/*` routes strictly require `role === 'APPLICANT'`.
4. **API Protection**: Every route in `/api/admin/*` and `/api/student/*` independently verifies the session server-side to prevent malicious requests.

## Caching & Performance

- **Server Components**: Used aggressively to minimize client-side JavaScript bundles.
- **Data Fetching**: `useSWR` handles client-side caching and revalidation.
- **Images**: Served via `next/image` with WebP optimization.
