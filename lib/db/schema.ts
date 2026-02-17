import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const statusUpdates = pgTable("status_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  project: text("project").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
