// index.js
require('dotenv').config(); // pour récupérer les variables d'environnement
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// Crée le client Discord avec les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Récupération des variables d'environnement
const TOKEN = process.env.TOKEN;
const VC_ID = process.env.VC_ID;

// Événement "ready"
client.on('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    try {
        // On récupère le salon vocal directement via l'API
        const channel = await client.channels.fetch(VC_ID);
        if (!channel || !channel.isVoiceBased()) {
            return console.log("Salon vocal introuvable ou non valide !");
        }

        // Connexion au salon vocal
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

// Connexion du bot
client.login(TOKEN);
