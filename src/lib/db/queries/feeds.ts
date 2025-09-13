import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq, sql } from "drizzle-orm";

//creates the feed in our required format
export async function createFeed(feedname: string, url: string, userId: string) {
    const result = await db.insert(feeds).values({
        name: feedname,
        url,
        userId,
    })
    .returning();
    
    return firstOrUndefined(result);
}

//returns the feeds table(or db)
export async function getFeeds() {
    return await db.select().from(feeds);
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchAt} desc nulls first`)
    .limit(1);
  return firstOrUndefined(result);
}