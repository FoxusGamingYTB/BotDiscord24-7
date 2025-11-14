// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// Crée le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables d'environnement
const TOKEN = process.env.TOKEN;
const VC_ID = process.env.VC_ID;

// Quand le bot est prêt
client.on('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(VC_ID);
        if (!channel || !channel.isVoiceBased()) return console.log("Salon vocal introuvable !");

        // Rejoindre le salon vocal
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        console.log(`Connecté au salon vocal : ${channel.name}`);
    } catch (err) {
        console.error("Erreur en rejoignant le salon vocal :", err);
    }
});

// Déconnexion si plus d'humains dans le salon
client.on('voiceStateUpdate', (oldState, newState) => {
    const connection = getVoiceConnection(newState.guild.id);
    if (!connection) return; // le bot n'est pas connecté

    const channel = connection.joinConfig.channelId;
    const voiceChannel = newState.guild.channels.cache.get(channel);
    if (!voiceChannel) return;

    // Filtrer les humains
    const humanMembers = voiceChannel.members.filter(member => !member.user.bot);

    if (humanMembers.size === 0) {
        connection.destroy(); // quitte le salon
        console.log('Aucun humain dans le salon, le bot quitte.');
    }
});

// Connexion du bot
client.login(TOKEN);
