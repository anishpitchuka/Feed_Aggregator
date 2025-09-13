import { time } from "console";
import { isNotNull } from "drizzle-orm";
import { unique } from "drizzle-orm/pg-core";
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { url } from "inspector";
import { toCamel } from "postgres";
import { title } from "process";

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
  lastFetchAt: timestamp("last_fetch_at"),
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


export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title"),
  url: text("url").unique(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, {onDelete: "cascade"}),
});

export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;