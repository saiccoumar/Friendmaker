/*Copyright 2021 Sai Coumar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

const { Client, Intents, Permissions } = require('discord.js');
const { syncBuiltinESMExports } = require('module');

var channelsToBePruned = [];
var counter = 0;

const client = new Client({ intents: 
    [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_VOICE_STATES, 
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
    Intents.FLAGS.DIRECT_MESSAGES], 
        fetchAllMembers: true });


client.on("reader", () => {
    // pruneChannels();
    console.log(`logged in as ${client.user.tag}!`)
    let guild = client.guilds.cache.get("Server ID");
    guild.members.cache.filter(member => !member.user.bot).forEach(member => console.log("===>>>", member.user.username));
});


client.on("message", msg => {
    if (msg.content === "tag") {
        counter++;
        let server = msg.guild.id;
        let channel = msg.channel.id;
        msg.reply("tagged");
        const list = client.guilds.cache.get(server).members.cache;
        // console.log(list.length);
        memberList = [];
        list.forEach(member => msg.reply(member.user.username+": "+ member.user.id));
        // list.forEach(member => memberList.push(member));
        // for (var i=0;i<list.length;i++){
        list.forEach(function(member){
            // if(member.user.bot){
                memberList.push(member);
            // }
        });
        
        if (memberList.length > 1){
            channel = createPrivateVoiceChannel(server, counter+"Friendmaker: private-channel", memberList[0],memberList[1]);
        }
        


    }if (msg.content.includes("headpats") && msg.content.includes("give") && msg.content.includes("more")) {
        msg.reply("you get extra headpats");
    } else if (msg.content.includes("headpats") && msg.content.includes("give")) {
        msg.reply("you get headpats");
    }
    

});

// client.on("voiceStateUpdate", async (oldState, newState) => {
//     i
// });


async function createPrivateTextChannel(serverId, channelName, member1id, member2id) {
    const guild = await client.guilds.fetch(serverId);
    const everyoneRole = guild.roles.everyone;
    const channel = await guild.channels.create(channelName, {type: 'text', permissionOverwrites: [{
        type: 'member',
        id: member1id,
        allow: [Permissions.FLAGS.VIEW_CHANNEL]
    }, {
        type: 'member',
        id: member2id,
        allow: [Permissions.FLAGS.VIEW_CHANNEL]
    }, {
        type: 'role',
        id: everyoneRole.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL]
    }, ]});
    return channel;
}

async function createPrivateVoiceChannel(serverId, channelName, member1, member2) {
    const guild = await client.guilds.fetch(serverId);
    const everyoneRole = guild.roles.everyone;
    // const channel = await guild.channels.create(channelName, {type: 'GUILD_VOICE',});
    const channel = await guild.channels.create(channelName, {type: 'GUILD_VOICE', permissionOverwrites: [{
        type: 'member',
        id: member1.user.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL]
    }, {
        type: 'member',
        id: member2.user.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL]
    }, {
        type: 'role',
        id: everyoneRole.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL]
    }, ]});
    let invite = await channel.createInvite({
        maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
        maxUses: 2 // maximum times it can be used
      },)
    // member1.send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.")
    member2.send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.")
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    await sleep(5000);
    console.log("pushed");
    channelsToBePruned.push(serverId+"/"+channel.id);
    

    
}

client.on('voiceStateUpdate', (oldState, newState) => {
    // channel pruning
    pruneChannels();
});
async function pruneChannels(){
        console.log("new prune");
        var indexArr = []
        if (channelsToBePruned.length > 0){
        for (var i=0;i<channelsToBePruned.length;i++){
            
            console.log(channelsToBePruned[i]);
            var channelInfo = channelsToBePruned[i].split("/");
            const guild = await client.guilds.fetch(channelInfo[0]);
            const channel = await guild.channels.cache.get(channelInfo[1]);
            // console.log(channel.name);
            if (channel.members.size < 1){
                indexArr.push(channelsToBePruned[i]);
                console.log("deleted: "+channelsToBePruned[i]+" "+channel.name);
                channel.delete();
                
                // indexArr.push(i);
                
            } 
        }
    }
            
        
        for (var i=0;i<indexArr.length;i++){
            console.log(channelsToBePruned.length);
            // console.log(indexArr[i]);
            const index = channelsToBePruned.indexOf(indexArr[i]);
            if (index > -1) {
                channelsToBePruned.splice(index, 1);
            }
        }
        // console.log("waited");
       
}



client.login('OTIyNDk5OTk1MDcxMDUzODM0.YcCXEg.bVBNgA65hO-H3iEQ41Eqjp5SDVQ');
