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

        // Rejoindre le salon vocal avec mode de chiffrement compatible
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            encryptionMode: 'aead_aes256_gcm_rtpsize' // compatible avec Render
        });

        console.log(`Connecté au salon vocal : ${channel.name}`);
    } catch (err) {
        console.error("Erreur en rejoignant le salon vocal :", err);
    }
});

// Optionnel : loguer les humains dans le salon sans déconnecter
client.on('voiceStateUpdate', (oldState, newState) => {
    const connection = getVoiceConnection(newState.guild.id);
    if (!connection) return;

    const voiceChannel = newState.guild.channels.cache.get(connection.joinConfig.channelId);
    if (!voiceChannel) return;

    const humanMembers = voiceChannel.members.filter(member => !member.user.bot);
    console.log(`Humains dans le salon : ${humanMembers.map(m => m.user.tag).join(', ') || '0'}`);
});

// Connexion du bot
client.login(TOKEN);
