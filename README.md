# OMKAR

Open Manufacturing Knowledge & Research is a responsive Next.js manufacturing-process library designed for deployment on Vercel, with Cloudflare R2 as its content store and Supabase available for application data.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and populate the values locally.
3. Run `pnpm dev`.

The app ships with demo process content, so it remains usable when R2 is not configured. Private credentials are used only by server-side code in `lib/r2.ts`.

The initial Supabase schema is in `supabase/migrations/001_omkar_knowledge.sql`. It separates published revisions from proposed contributions and includes row-level security for visitors, contributors, and administrators.
