# EngineersHub: MongoDB → PostgreSQL Migration Plan (MongoDB/Mongoose to Prisma/Postgres)

## 1. Objective

Migrate the backend data layer from **MongoDB (Mongoose)** to **PostgreSQL (Prisma)** while preserving application functionality and minimizing downtime.

This plan is written for the current EngineersHub repository state where:

- Backend API uses **Prisma models** (PostgreSQL).
- Some MongoDB/Mongoose utilities and README references still appear to exist (partially migrated code).

## 2. Current State Assessment (What we know from the repo)

### 2.1 Data layer / ORM

- Prisma/Postgres is actively used in API routes (e.g., `backend/src/routes/auth.js`, `backend/src/routes/jobs.js`, `gigs.js`, `messages.js`, `orders.js`).
- Prisma schema exists at `backend/prisma/schema.prisma` with models:
  - `User`
  - `Job`
  - `Gig`
  - `Bid`
  - `Order`
  - `Message`
  - `Conversation`

### 2.2 Leftovers / inconsistencies

- Mongoose helper code exists (`backend/src/config/helpers.js`, `backend/src/config/index.js`, `backend/src/config/indexes.js`).
- README still references MongoDB in setup instructions.

### 2.3 Implication

- The migration is likely **code-migrated** to Prisma but **data migration** and **cleanup/consistency** steps are not complete.

## 3. High-level Strategy

Perform the migration in phases:

1. **Audit & mapping**: confirm MongoDB collections, fields, and how they map to Prisma models.
2. **Schema alignment**: ensure Prisma schema matches required data contracts.
3. **Data extraction + transformation (ETL)**:
   - extract from Mongo collections
   - transform to Prisma-compatible shapes
   - import into Postgres tables
4. **Validation**: verify counts, referential integrity, and application-level behavior.
5. **Cutover**:
   - switch production traffic to Postgres (and Prisma)
   - monitor errors and performance
6. **Rollback readiness**: keep ability to revert to Mongo if necessary.

## 4. Detailed Work Breakdown

### Phase A — Inventory & Audit

1. **Identify MongoDB collections** (expected based on Mongoose models):
   - `users`, `jobs`, `gigs`, `bids`, `orders`, `messages`, `conversations` (names may vary)
2. **Identify field shapes** in each collection:
   - types: strings vs numbers vs nested objects
   - date representation: ISO strings vs Date
   - arrays and embedded documents
   - how “JSON stored as string” is handled (if present)
3. **Identify ID strategies**:
   - Mongo `_id` values vs Prisma IDs (`cuid()` in schema)
4. **Identify relationships**:
   - `Job.clientId → User.id`
   - `Bid.jobId → Job.id`
   - `Bid.engineerId → User.id`
   - `Order.{clientId, engineerId, gigId} → respective records`
   - `Conversation.participants` and embedded `messages`

**Deliverable:** a mapping table (Mongo collection/fields → Prisma model/fields).

---

### Phase B — Schema Alignment (Prisma/Postgres)

1. Confirm Prisma schema models match application expectations.
2. Pay special attention to fields stored as JSON in Prisma:
   - Prisma schema contains many `Json` types and also some fields stored as `String` but expected to contain JSON.
   - In current routes, some fields are explicitly stringified/parsing (e.g., `avatar`, `education`, `portfolio`, `reviewsList`, `packages`, `unread`, `messages`, `timeline`, `package`).

**Important:** during ETL, ensure the imported data matches runtime parsing expectations:

- If Prisma field type is `Json`, import as proper JSON.
- If Prisma field type is `String` but code expects JSON string, store JSON.stringify(value).

---

### Phase C — Data Extraction & Transformation (ETL)

Recommended approach:

- Use a one-off ETL script (Node.js) that:
  - connects to Mongo
  - connects to Postgres via Prisma
  - processes documents in batches

#### C1) ID mapping strategy

To preserve referential integrity, create explicit mapping tables during ETL:

- `mongoUserId → prismaUserId`
- `mongoJobId → prismaJobId`
- `mongoGigId → prismaGigId`
- `mongoConversationId → prismaConversationId`
- `mongoBidId → prismaBidId`
- `mongoOrderId → prismaOrderId`

Two options:

1. **Let Prisma generate new IDs** (`@default(cuid())`) and store mapping in memory (or temporary DB table).
2. **Use Mongo `_id` as Prisma ID**
   - Only feasible if Prisma schema is adjusted to accept string IDs and avoids `cuid()` default.

Given current schema uses `cuid()`, option (1) is preferred.

#### C2) Mapping rules (examples)

- **User**
  - `role`, `name`, `email`, `password` (hash should already exist; if Mongo password was bcrypt-hashed, import as-is)
  - arrays: `skills`, `services` etc.
  - fields like `avatar`, `education`, `portfolio`, `reviewsList`:
    - if stored as sub-documents in Mongo, import to Prisma `Json` types or stringify if Prisma expects `String` but code parses.

- **Job**
  - `clientId`, `clientName`, `title`, `category`, `type`, budgets, etc.
  - Mongo tags array → Prisma `String[]`

- **Gig**
  - `packages` → Prisma `Json[]` (but current routes sometimes stringify/parse; ensure consistent import)
  - `avatar` → Prisma `Json?`

- **Bid**
  - `jobId`, `engineerId` to link properly
  - `status`, timestamps

- **Order**
  - `package` and `timeline` are `Json?` in Prisma schema.
  - current routes parse `package`/`timeline` if stored as string; prefer storing JSON as JSON if schema is Json, and adjust runtime only if needed.

- **Conversation**
  - `participants` array should include both user IDs as strings.
  - `unread` and `messages` are `Json?` and `Json[]` in schema.
  - runtime code expects possible stringified JSON; ETL should store as JSON types consistently.

#### C3) Batch processing and performance

- Process documents in batches (e.g., 500–2000 per batch).
- Use `createMany` where possible.
- Use transaction boundaries carefully.

---

### Phase D — Import Order (to satisfy foreign keys logically)

Because Prisma models reference IDs (implicitly through fields, not explicit foreign keys in schema), you must import in dependency order:

1. Users
2. Jobs, Gigs
3. Bids, Orders
4. Conversations (requires participant IDs and users)
5. Messages are embedded in Conversation in this schema, so they are imported with conversations.

---

### Phase E — Validation Checklist

After import:

1. **Counts**
   - users/job/gig/bid/order/conversation counts match (or explain deltas).
2. **Uniqueness**
   - verify `User.email` uniqueness.
3. **Referential integrity**
   - sample check: a `Bid.jobId` exists and a `Bid.engineerId` exists.
4. **JSON field integrity**
   - verify `avatar`, `packages`, `messages`, `unread`, `timeline` are in expected format.
5. **Application smoke tests**
   - register/login
   - list jobs/gigs
   - place a bid
   - start conversation + send message
   - order a gig + update order status

---

### Phase F — Cutover & Rollback

#### Cutover

- Ensure environment variables point to Postgres `DATABASE_URL`.
- Keep MongoDB available for rollback.
- Monitor logs for errors.

#### Rollback

- If critical issues occur:
  - revert to Mongo connection / old code path (if maintained)
  - restore any changed environment variables

This repo currently indicates Prisma is the active backend, so rollback should be planned as a **config rollback** plus potential re-deploy to prior containers.

## 5. Risks & Mitigations

1. **Runtime parsing expects JSON strings**
   - Mitigation: ETL will store data in the format the code expects (or adjust code in a follow-up).
2. **ID mapping mismatch**
   - Mitigation: build in-memory mapping and validate during import.
3. **Field type differences**
   - Mitigation: explicit transforms for numbers/dates/booleans and array normalization.
4. **Large datasets**
   - Mitigation: batching, pagination, and disabling heavy logs.
5. **Partial migration code leftovers**
   - Mitigation: keep migration plan doc focused on data migration; separate a follow-up cleanup PR.

## 6. Deliverables Summary

- `MIGRATION_MONGODB_TO_POSTGRES.md` (this document)
- One-off ETL script (recommended; not included yet)
- Post-import validation report (counts + smoke tests)
- Optional: cleanup PR to remove MongoDB/Mongoose remnants

## 7. Next Commands (Repository context)

After completing ETL, run:

- `docker compose up --build -d`
- Run backend health check: `GET /api/health`

If Prisma migrations/seed are later added:

- `npx prisma migrate deploy`
- `npx prisma db seed`

## 8. Appendix: Prisma schema reference

Prisma schema location:

- `backend/prisma/schema.prisma`

Models:

- User, Job, Gig, Bid, Order, Message, Conversation

Note: This plan focuses on importing Mongo documents into these Prisma models.
