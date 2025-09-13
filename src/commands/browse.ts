import { spec } from "node:test/reporters";
import { getPostsForUsers } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]){
    let limit = 2;
    if(args.length === 1) {
        let specifiedLimit = parseInt(args[0]);
        if(specifiedLimit) {
            limit = specifiedLimit;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`)             
        }
    }

    const posts = await getPostsForUsers(user.id, limit);
    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`============================================================================================================================`);
        console.log("");
    }
    
}
