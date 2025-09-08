import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq } from "drizzle-orm";

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