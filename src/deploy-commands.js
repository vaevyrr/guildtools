require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { commands } = require("./commands");

async function main() {
  const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
  if (!DISCORD_TOKEN || !CLIENT_ID) throw new Error("DISCORD_TOKEN and CLIENT_ID are required.");
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  const body = commands.map(command => command.toJSON());
  const route = GUILD_ID
    ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    : Routes.applicationCommands(CLIENT_ID);
  await rest.put(route, { body });
  console.log(`Registered ${body.length} slash commands.`);
}

main().catch(error => {
  console.error("Command registration failed:", error);
  process.exitCode = 1;
});
