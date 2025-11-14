const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once("ready", () => {
  console.log(`Bot connecté : ${client.user.tag}`);

  const voiceChannelId = process.env.VOICE_ID; // ID du vocal
  const channel = client.channels.cache.get(voiceChannelId);

  if (!channel) {
    console.log("Salon vocal introuvable !");
    return;
  }

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true
  });

  console.log("Bot dans le vocal 24/7 ✔");
});

client.login(process.env.TOKEN);
