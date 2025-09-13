import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, NewPost, posts } from "../schema";

export async function createPost(post : NewPost) {
    const [result] = await db.insert(posts).values(post).returning().onConflictDoNothing();
    return result;
}

export async function getPostsForUsers(userId: string, limit: number) {
    const result = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId,
            feedName: feeds.name,
        })
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        
    
    return result;
}