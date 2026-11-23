# GuildTools

A small Discord utility bot built around slash commands. It keeps the first version intentionally focused: latency checks, server information, user information, and a moderation note command that records a reason in the configured log channel.

## Requirements

- Node.js 20+
- A Discord application and bot token
- The bot invited with `bot` and `applications.commands` scopes

## Setup

```bash
npm install
cp .env.example .env
```

Set `DISCORD_TOKEN`, `CLIENT_ID`, and optionally `GUILD_ID` in `.env`. For development, setting `GUILD_ID` registers commands to one server immediately. Without it, commands are registered globally and can take time to appear.

```bash
npm run deploy
npm start
```

The bot needs the `Manage Messages` permission only if you later add message moderation. The note command requires the bot to be able to send messages in the configured log channel.

## Commands

- `/ping` — API and gateway latency
- `/server` — basic server details
- `/userinfo [user]` — account and server membership details
- `/note user reason` — post a staff note to the configured log channel

This is a starter utility bot, not a full moderation suite. Staff notes are sent to Discord and are not stored in a database.

## License

MIT
