require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.TOKEN;
const VC_ID = process.env.VC_ID;

client.on("ready", async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(VC_ID);
        if (!channel || !channel.isVoiceBased()) {
            console.log("Salon vocal introuvable !");
            return;
        }

        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,   // important
            selfMute: true     // reste muet
        });

        console.log(`Connecté au salon vocal : ${channel.name}`);
    } catch (err) {
        console.error("Erreur en rejoignant :", err);
    }
});

// IMPORTANT : Empêche toute déconnexion automatique
client.on("voiceStateUpdate", () => {
    // On ne fait RIEN → pas de leave
});

client.login(TOKEN);
