import { time } from "console";
import { isNotNull } from "drizzle-orm";
import { unique } from "drizzle-orm/pg-core";
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

//schema for our feedfollows table
export const feedFollows = pgTable("feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (t) => ({unq: unique().on(t.userId, t.feedId) }),
);

export type FeedFollow = typeof feedFollows.$inferSelect;

