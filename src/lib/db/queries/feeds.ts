import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

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