import { eq, and } from "drizzle-orm";
import { db } from "..";
import { feeds, feedFollows, users } from "../schema";

//inserts a follow record 
export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ feedId, userId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(
      and(
        eq(feedFollows.id, newFeedFollow.id),
        eq(users.id, newFeedFollow.userId),
      ),
    );

  return result;
}

//return all the feeds followed by a given user
export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedname: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}
