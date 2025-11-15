// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// Création du client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables d'environnement
const TOKEN = process.env.TOKEN;
const VC_ID = process.env.VC_ID;

// Quand le bot démarre
client.on('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(VC_ID);

        if (!channel || !channel.isVoiceBased()) {
            return console.log("❌ Salon vocal introuvable !");
        }

        // Le bot rejoint et RESTE, quoi qu'il arrive
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        console.log(`🔊 Connecté au vocal : ${channel.name}`);
    } catch (err) {
        console.error("❌ Erreur en rejoignant :", err);
    }
});

// Connexion du bot
client.login(TOKEN);
