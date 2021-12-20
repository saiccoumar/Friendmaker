const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on("reader", () => {
    console.log(`logged in as ${client.user.tag}!`)
});

client.on("message", msg => {
    if (msg.content === "tag"){
        msg.reply("tagged");
    }
});


client.login(process.env.TOKEN);