create table if not exists "asset" (
  id uuid primary key default gen_random_uuid(),
  "ownerUserId" text not null references "user"(id) on delete cascade,
  bucket text not null,
  "objectKey" text not null unique,
  "originalFileName" text not null,
  "contentType" text not null,
  "sizeBytes" bigint not null,
  embedding vector(1536),
  "createdAt" timestamptz not null default now()
);

create index if not exists asset_owner_created_at_idx on "asset" ("ownerUserId", "createdAt" desc);

create table if not exists "auditLog" (
  id bigserial primary key,
  "actorUserId" text references "user"(id) on delete set null,
  action text not null,
  "targetType" text not null,
  "targetId" text,
  metadata jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now()
);

create index if not exists audit_log_actor_idx on "auditLog" ("actorUserId");
create index if not exists audit_log_created_idx on "auditLog" ("createdAt" desc);
