import { getFeedByURL } from "src/lib/db/queries/feeds";
import {createFeedFollow, deleteFeedFollows, getFeedFollowsForUser} from "../lib/db/queries/feed-follows";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

//follows an user
export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  const feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`Feed not found: ${feedURL}`);
  }

  const ffRow = await createFeedFollow(user.id, feed.id);

  console.log(`Feed follow created:`);
  printFeedFollow(ffRow.userName, ffRow.feedName);
}

//shows the list of users that are followed
export async function handlerListFeedFollows(_: string, user: User) {
  
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (feedFollows.length === 0) {
    console.log(`No feed follows found for this user.`);
    return;
  }

  console.log(`Feed follows for user %s:`, user.id);
  for (let ff of feedFollows) {
    console.log(`* %s`, ff.feedname);
  }
}

//prints the username and feedname
export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}

//sends the feed-id and user-id that is to be deleted
export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  if(args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  let feed = await getFeedByURL(feedURL);

  if(!feed) {
    throw new Error(`Feed with ${feedURL} not found`);
  }

  const result = await deleteFeedFollows(feed.id, user.id);
  if(!result) {
    throw new Error(`failed to unfollow ${feed}`);
  }
  console.log(`${feed.name} unfollowed successfully`);
}