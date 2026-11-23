const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Check bot and API latency."),
  new SlashCommandBuilder().setName("server").setDescription("Show information about this server."),
  new SlashCommandBuilder()
    .setName("userinfo").setDescription("Show information about a server member.")
    .addUserOption(option => option.setName("user").setDescription("Member to inspect").setRequired(false)),
  new SlashCommandBuilder()
    .setName("note").setDescription("Send a staff note to the configured log channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option.setName("user").setDescription("Member the note concerns").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Context for the staff team").setMaxLength(900).setRequired(true))
];

async function handleCommand(interaction, client) {
  if (interaction.commandName === "ping") {
    await interaction.reply({ content: `Pong. Gateway: ${Math.round(client.ws.ping)} ms.`, ephemeral: true });
    return;
  }

  if (interaction.commandName === "server") {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: "This command only works inside a server.", ephemeral: true });
    const owner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: "Owner", value: owner.user.tag, inline: true },
        { name: "Members", value: String(guild.memberCount), inline: true },
        { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (interaction.commandName === "userinfo") {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = interaction.guild ? await interaction.guild.members.fetch(user.id).catch(() => null) : null;
    const embed = new EmbedBuilder()
      .setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "User ID", value: user.id },
        { name: "Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>` },
        { name: "Joined server", value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "Not a member", inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (interaction.commandName === "note") {
    const channelId = process.env.STAFF_LOG_CHANNEL_ID;
    if (!channelId) {
      await interaction.reply({ content: "STAFF_LOG_CHANNEL_ID is not configured.", ephemeral: true });
      return;
    }
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel?.isTextBased() || !channel.send) {
      await interaction.reply({ content: "The configured staff log channel could not be accessed.", ephemeral: true });
      return;
    }
    const target = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const embed = new EmbedBuilder()
      .setTitle("Staff note")
      .addFields(
        { name: "Member", value: `${target.tag} (${target.id})` },
        { name: "Added by", value: `${interaction.user.tag} (${interaction.user.id})` },
        { name: "Reason", value: reason }
      )
      .setTimestamp()
      .setColor(0xf1c40f);
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: "Staff note posted.", ephemeral: true });
  }
}

module.exports = { commands, handleCommand };
