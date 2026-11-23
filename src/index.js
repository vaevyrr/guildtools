require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { handleCommand } = require("./commands");

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("DISCORD_TOKEN is missing. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    await handleCommand(interaction, client);
  } catch (error) {
    console.error(`Command /${interaction.commandName} failed:`, error);
    const response = { content: "That command ran into an error. Check the bot logs.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response).catch(() => {});
    } else {
      await interaction.reply(response).catch(() => {});
    }
  }
});

client.login(token).catch(error => {
  console.error("Discord login failed:", error);
  process.exitCode = 1;
});
