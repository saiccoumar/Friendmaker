const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], fetchAllMembers:true });


client.on("reader", () => {
    console.log(`logged in as ${client.user.tag}!`)
    let guild = client.guilds.cache.get("Server ID");
    guild.members.cache.filter(member => !member.user.bot).forEach(member => console.log("===>>>", member.user.username));
});

client.on("message", msg => {
    if (msg.content === "tag"){
        let server = msg.guild.id;
        let channel = msg.channel.id;
        msg.reply("tagged");
        const list = client.guilds.cache.get(server).members.cache; 
        // console.log(list.length);
        list.forEach(member => console.log(member.user.username)); 
        

    }
});


client.login('OTIyNDk5OTk1MDcxMDUzODM0.YcCXEg.-hg3xed7OccvQnvBXf9BdkBK7WY');