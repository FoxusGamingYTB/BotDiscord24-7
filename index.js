// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { 
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior
} = require('@discordjs/voice');
const { Readable } = require('stream');

// === Flux audio silencieux (obligatoire pour rester connecté) ===
const silentStream = new Readable({
    read() {
        this.push(Buffer.from([0xF8, 0xFF, 0xFE])); // paquet opus silence
    }
});

// === Setup du bot ===
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.TOKEN;
const VC_ID = process.env.VC_ID;

client.on('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(VC_ID);
        if (!channel || !channel.isVoiceBased()) {
            return console.log("❌ Salon vocal introuvable !");
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        // === Player audio silencieux 24/7 ===
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        const resource = createAudioResource(silentStream);
        player.play(resource);
        connection.subscribe(player);

        console.log(`🔊 Connecté au vocal : ${channel.name} (silence 24/7 activé)`);
    } catch (err) {
        console.error("Erreur :", err);
    }
});

client.login(TOKEN);
