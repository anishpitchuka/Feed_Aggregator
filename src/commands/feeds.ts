import { readConfig } from "src/config";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUser, getUserById } from "../lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { get } from "http";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { printFeedFollow } from "./feed-follows";

//adds feed to the feeds table
export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feedName = args[0];
  const url = args[1];
  
  //creates the feed in our required format
  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFeedFollow(user.name, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, user);
}

//prints the respective values
function printFeed(feed: Feed, user: User) {
  console.log(`*** ID:            ${feed.id}`);
  console.log(`*** Created:       ${feed.createdAt}`);
  console.log(`*** Updated:       ${feed.updatedAt}`);
  console.log(`*** name:          ${feed.name}`);
  console.log(`*** URL:           ${feed.url}`);
  console.log(`*** User:          ${user.name}`);
}

//prints the list feeds of the existing users that have created feeds
export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();
    
    if(feeds.length === 0) {
        console.log(`No Feeds found😔`);
        return;
    }
    
    console.log(`Found ${feeds.length} feeds`);
    
    for(let feed of feeds) {
        const user = await getUserById(feed.userId);
        if(!user) {
            throw new Error(`Failed to find user for the feed: ${feed.name}`);
        }
        printFeed(feed, user);
        console.log(`=============================================================================`);
    }
}
