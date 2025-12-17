# Gator 🐊

A powerful command-line RSS feed aggregator built with TypeScript. Subscribe to your favorite RSS feeds, follow feeds from other users, and browse posts all from your terminal.

## Features

- **User Management** — Register, login, and switch between multiple user accounts
- **Feed Management** — Add RSS feeds and automatically follow them
- **Social Following** — Follow and unfollow feeds added by other users
- **Feed Aggregation** — Automatically fetch and store posts from all feeds at configurable intervals
- **Post Browsing** — Browse the latest posts from your followed feeds
- **PostgreSQL Storage** — Persistent storage with Drizzle ORM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **XML Parsing**: [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)
- **TypeScript Execution**: [tsx](https://github.com/privatenumber/tsx)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/anishpitchuka/Feed_Aggregator.git
   cd Feed_Aggregator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create the configuration file**

   Create a file named `.gatorconfig.json` in your home directory:

   ```bash
   touch ~/.gatorconfig.json
   ```

   Add the following content (replace with your PostgreSQL connection string):

   ```json
   {
     "db_url": "postgresql://username:password@localhost:5432/gator",
     "current_user_name": ""
   }
   ```

4. **Run database migrations**

   ```bash
   npm run generate
   npm run migrate
   ```

## Configuration

The application uses a JSON configuration file located at `~/.gatorconfig.json`:

| Field | Description |
|-------|-------------|
| `db_url` | PostgreSQL connection string |
| `current_user_name` | Currently logged-in user (managed by the app) |

### Example Configuration

```json
{
  "db_url": "postgresql://postgres:mysecretpassword@localhost:5432/gator",
  "current_user_name": "john"
}
```

## Usage

Run commands using:

```bash
npm start <command> [arguments]
```

### Available Commands

#### User Commands

| Command | Description | Example |
|---------|-------------|---------|
| `register <username>` | Create a new user account | `npm start register john` |
| `login <username>` | Switch to an existing user | `npm start login john` |
| `users` | List all registered users | `npm start users` |

#### Feed Commands

| Command | Description | Example |
|---------|-------------|---------|
| `addfeed <name> <url>` | Add a new RSS feed (requires login) | `npm start addfeed "Tech News" https://example.com/rss` |
| `feeds` | List all available feeds | `npm start feeds` |

#### Follow Commands

| Command | Description | Example |
|---------|-------------|---------|
| `follow <feed_url>` | Follow an existing feed (requires login) | `npm start follow https://example.com/rss` |
| `unfollow <feed_url>` | Unfollow a feed (requires login) | `npm start unfollow https://example.com/rss` |
| `following` | List feeds you're following (requires login) | `npm start following` |

#### Aggregation Commands

| Command | Description | Example |
|---------|-------------|---------|
| `agg <interval>` | Start the feed aggregator | `npm start agg 30m` |
| `browse [limit]` | Browse posts from followed feeds (requires login) | `npm start browse 10` |

**Interval formats for `agg` command:**
- `ms` — milliseconds (e.g., `5000ms`)
- `s` — seconds (e.g., `30s`)
- `m` — minutes (e.g., `5m`)
- `h` — hours (e.g., `1h`)

#### Admin Commands

| Command | Description | Example |
|---------|-------------|---------|
| `reset` | Delete all users and cascade delete all data | `npm start reset` |

## Quick Start Example

```bash
# 1. Register a new user
npm start register alice

# 2. Add an RSS feed
npm start addfeed "Hacker News" https://hnrss.org/frontpage

# 3. Start the aggregator (runs until interrupted with Ctrl+C)
npm start agg 10m

# 4. In another terminal, browse your posts
npm start browse 5

# 5. List all feeds and follow another one
npm start feeds
npm start follow https://example.com/another-feed.xml
```

## Project Structure

```
Feed_Aggregator/
├── src/
│   ├── commands/           # CLI command handlers
│   │   ├── aggregate.ts    # Feed aggregation logic
│   │   ├── browse.ts       # Post browsing
│   │   ├── commands.ts     # Command registry
│   │   ├── feed-follows.ts # Follow/unfollow handlers
│   │   ├── feeds.ts        # Feed management
│   │   ├── reset.ts        # Database reset
│   │   └── users.ts        # User management
│   ├── lib/
│   │   ├── db/
│   │   │   ├── migrations/ # SQL migrations
│   │   │   ├── queries/    # Database query functions
│   │   │   ├── index.ts    # Database connection
│   │   │   └── schema.ts   # Drizzle schema definitions
│   │   ├── rss.ts          # RSS feed fetching & parsing
│   │   └── time.ts         # Duration parsing utilities
│   ├── config.ts           # Configuration management
│   ├── index.ts            # Application entry point
│   └── middleware.ts       # Authentication middleware
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json
└── tsconfig.json
```

## Database Schema

The application uses four main tables:

- **users** — User accounts with unique usernames
- **feeds** — RSS feed sources with URLs and ownership
- **feed_follows** — Many-to-many relationship between users and feeds
- **posts** — Aggregated posts from RSS feeds

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the CLI application |
| `npm run generate` | Generate new database migrations |
| `npm run migrate` | Apply pending migrations |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ and TypeScript
