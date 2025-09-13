import { parseDuration } from "src/lib/time";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { Feed, NewPost } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if(args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);
  if(!timeBetweenRequests) {
    throw new Error(`invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`);
  }

  console.log(`Collecting feeds every ${timeArg}..`);

  //run first scrape immediately
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
     });
  });
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if(!feed) {
    throw new Error(`No Feeds to fetc, WOOPS!!!`);
  }
  console.log(`Found a feed to fetch`);
  scrapeFeed(feed);
}

export async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);
  
  const feedData = await fetchFeed(feed.url);
  for(let item of feedData.channel.item) {
    console.log(`Found post: ${item.title}`);

    const now = new Date();

    await createPost({
      url: item.link,
      feedId: feed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    } satisfies NewPost);
  }


  console.log(`Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`);
}

export function handleError(err: unknown) {
  console.log(`Error scraping feeds: ${err instanceof Error ? err.message: err}`);
}
