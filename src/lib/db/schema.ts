import { time } from "console";
import { isNotNull } from "drizzle-orm";
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { url } from "inspector";

//schema for our users table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
            .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

//schema for our feeds table
export type User = typeof users.$inferSelect;
export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export type Feed = typeof feeds.$inferSelect;