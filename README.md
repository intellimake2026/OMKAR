# OMKAR

Open Manufacturing Knowledge and Resources is a responsive Next.js manufacturing-process library designed for deployment on Vercel, with Cloudflare R2 as its content store and Supabase available for application data.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and populate the values locally.
3. Run `pnpm dev`.

The app ships with demo process content, so it remains usable when R2 is not configured. Private credentials are used only by server-side code in `lib/r2.ts`.

The initial Supabase schema is in `supabase/migrations/001_omkar_knowledge.sql`. It separates published revisions from proposed contributions and includes row-level security for visitors, contributors, and administrators.

## Imported process content

The Drive V2 batch adds 15 source profiles and 15 JPEG diagrams. The public catalog is generated in `lib/generated/drive-catalog.json`; original Markdown and images live in the private `omkar` R2 bucket under `content/drive-v2/`. The browser requests documents and images through allowlisted Next.js routes, so R2 credentials remain server-side.

- `/api/content/<slug>` returns normalized Markdown from R2; `?download=1` downloads the original.
- `/api/media/<slug>/<index>` serves only a catalogued image from R2.
- Imported pages support tables, equations, section selection, and image galleries. Raw HTML and remote Markdown images are disabled.
- Original upload keys include a SHA-256 prefix. The uploader refuses to replace mismatched objects and verifies every file by downloading it and comparing the full checksum.
- Originals and ZIPs are excluded from Vercel uploads and Git. Keep the local source archive for future imports.

For this batch, run `python3 scripts/prepare-drive-import.py`, then `node --env-file=.env.local scripts/upload-drive.mjs`. Review `imports/drive-v2/manifest.json` before uploading. New batches need their own reviewed mapping; these commands specifically reproduce the supplied V2 archive.

The deployment requires `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` in Vercel production. Supabase is not needed for this read-only catalog. Changing files in Google Drive does not automatically synchronize them; importing a new batch updates the catalog and requires deployment.

### Capabilities and manufacturing outcomes

`lib/capabilities.ts` defines stable functional capability IDs and separate, evidenced process requirement and machine provision relations. Initial normalization covers selected requirements from End Milling, Drilling, and Broaching, section 5 of the supplied profiles. This is partial coverage. Machine provisions remain undocumented; neither a shared function nor an existing process link establishes equipment suitability. Operating ranges, tooling, configuration, and complete process requirements still need assessment before qualified matching.

`lib/manufacturing-requirements.ts` preserves the six geometry and surface outcome groups separately. Browse them at `/requirements`; `/capabilities` is exclusively functional. Original source documents are unchanged.

Run domain integrity checks with `node --experimental-strip-types --test tests/capability-domains.test.mjs`.

### Machine types and models

`lib/machines.ts` separates generic machine types from manufacturer models. Models reference a stable machine type ID and carry manufacturer, configuration, source evidence, and specifications. No manufacturer models have been documented yet. Capability provisions reference `machineModelId` and include configuration and evidenced operating limits; they must not reference a generic type. Process links on type cards are browsing aids, not model-level compatibility results.

### Three connected libraries

`/processes` is the canonical Process Library; `/process-library` permanently redirects there, preserving query filters. `/capabilities` is the Capability Library, with definition, parameter, constraint, and evidence domains. `/machines` is the Machine Library, separating type and model, with specifications, settings, documentation and model-level offered-capability records. Undocumented fields are explicitly empty.

Knowledge Explorer (`/search`) provides cross-library search and a process-centered relationship view. It displays source-derived `requires` edges and documented model-level `offered by` edges only. Missing edges are unknown, not proof of incompatibility. The imported-source verification disclaimer remains on process profiles.

### Accounts, admin editing, and correction requests

Authentication uses Supabase email/password with verified email, plus optional email sign-in links. All library pages and content APIs require a verified session. `/login`, `/signup`, `/admin/login`, and `/auth/confirm` are public. `/admin` and all publishing/review endpoints additionally check the server-managed `omkar_admins` role table. User metadata cannot grant admin access.

Migration `002_accounts_editing_reports.sql` creates isolated account-role, content override, immutable revision, and correction-request tables. The designated initial admin is granted a role only after that email is verified. Run migrations with the server-side PostgreSQL credentials; do not expose service-role credentials to the browser.

Admins can edit existing process metadata and Markdown, capability names/definitions, and machine-type names/descriptions. Publishing takes effect through the authenticated catalog/content APIs without deployment or approval. Original R2 documents remain preserved. Version checks reject stale writes; every successful publish has an audited revision. Members can submit corrections from any page, see their own requests and administrator responses; admins can resolve or dismiss requests.

Before enabling the production login gate, configure Supabase Auth Site URL to `https://omkar-rust.vercel.app` and allow `https://omkar-rust.vercel.app/auth/confirm`. Confirm email delivery for public users (custom SMTP is required by Supabase for arbitrary recipient addresses). The initial administrator must sign up and verify their own email; no shared admin password is created.

Validation: `node --env-file=.env.production.local scripts/test-auth-integration.mjs` uses temporary verified test users and cleans up its own records. Run only against a staging/unmodified test entry (`capability:gas-compression` must have no managed revision). It covers anonymous access, role escalation denial, RLS, correction privacy, CSRF, direct publishing, revision history and stale edits. It does not send emails or validate email deliverability.
