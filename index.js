/*Copyright 2021 Sai Coumar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http:

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

const { Client, Intents, Permissions } = require('discord.js');
const Discord = require('discord.js')
const config = require('./config.json')

var channelsToBePruned = [];
var interestRoles = ['f:Coding', 'f:Anime', 'f:K-Pop', 'f:Music', 'f:Film', 'f:Food', 'f:Sports', 'f:Fitness and Health', 'f:Beauty', 'f:Gaming', 'f:Art', 'f:Literature', 'f:Science and Technology', 'f:Travel', 'f:Mental Health', 'f:Psychology'];
var interestRoleColors = ['#1ABC9C', '#11806A', '#2ECC71', '#1F8B4C', '#3498DB', '#206694', '#9B59B6', '#71368A', '#E91E63', '#AD1457', '#F1C40F', '#C27C0E', '#E67E22', '#A84300', '#E74C3C', '#992D22'];
var emojiLib = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷', '🐵', '🐸'];
const client = new Client({
    intents:
        [Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES],
    fetchAllMembers: true, partials: ["MESSAGE", "CHANNEL", "REACTION"]
});


client.on("ready", () => {

    console.log(`logged in as ${client.user.tag}!`)
    // let guild = client.guilds.cache.get("Server ID");
    // guild.members.cache.filter(member => !member.user.bot).forEach(member => console.log("===>>>", member.user.username));

});

client.on("message", msg => {
    // let server = msg.guild.id;
    if (msg.content === "!find a friend") {
        let serverId = msg.guild.id;
        let channel = msg.channel.id;

        var memberList = [];

        const list = client.guilds.cache.get(serverId).members.cache;
        // const fetch = msg.guild.members.fetch().then(members => { members.forEach(member => list.push(member)) });

        // TODO: Remove this.
        list.forEach(member => msg.reply(member.user.username + ": " + member.user.id));


        list.forEach(function (member) {
            console.log(member.user.username);
            if (!(member.user.bot || (msg.member.id == member.user.id))) {
                memberList.push(member);
                console.log("pushed!");
            }
            console.log("continue");
        });

        msg.reply("Finding friend!");
        console.log(typeof memberList[0].user.id);

        if (memberList.length > 0) {
            console.log(memberList.length);
            randomPersonID = filter(memberList, msg);
            console.log(memberList[0].user.id)
            console.log(typeof (randomPersonID + ""));
            console.log(randomPersonID);
            console.log(memberList[0].user.id === randomPersonID + "");
            channel = createPrivateVoiceChannel(msg.guild, "Friendmaker: private-channel", randomPersonID, msg.author.id);
        } else {
            msg.reply("Not enough people to find a friend! Sorry...")
        }








    } if (msg.content === "!prune channels") {
        if (msg.channel.permissionsFor(msg.author).has("MANAGE_CHANNELS")) {
            pruneAllChannels(msg.guildId);
        } else {
            msg.reply("You don't have permissions to do that!")
        }
    } if (msg.content === "!make roles") {
        if (msg.channel.permissionsFor(msg.author).has("ADMIN")) {
            makeRoles(msg.guild);
        } else {
            msg.reply("You don't have permissions to do that!")
        }
    } if (msg.content === "!send interests message") {
        if (msg.channel.permissionsFor(msg.author).has("ADMIN")) {
            roles(msg.guild, msg);
        } else {
            msg.reply("You don't have permissions to do that!")
        }
    } if (msg.content === "!summon") {
        var content = "Commands: \n!make roles-recreates all roles\n!send interests message-sends a self-assign roles message\n!prune channels-cleans up Friendmaker channels that may not get deleted accidentally\n!find a friend-finds a friend\n!cache users-updates member list\n!list users-lists all users";
        msg.reply(content);
    } if (msg.content === "!cache users") {
        if (msg.channel.permissionsFor(msg.author).has("ADMIN")) {
            recache(msg.guildId);
            msg.reply("cache updated!")
        } else {
            msg.reply("You don't have permissions to do that!")
        }
    } if (msg.content === "!list users") {
        if (msg.channel.permissionsFor(msg.author).has("ADMIN")) {
            const list = client.guilds.cache.get(msg.guildId).members.cache;
            list.forEach(member => msg.reply(member.user.username + ": " + member.user.id));
        } else {
            msg.reply("You don't have permissions to do that!")
        }
    }
});






async function createPrivateTextChannel(serverId, channelName, member1id, member2id) {
    const guild = await client.guilds.fetch(serverId);
    const everyoneRole = guild.roles.everyone;
    const channel = await guild.channels.create(channelName, {
        type: 'text', permissionOverwrites: [{
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
        },]
    });
    return channel;
}

async function createPrivateVoiceChannel(guild, channelName, member1id, member2id) {
    // const guild = await client.guilds.fetch(serverId);

    const everyoneRole = guild.roles.everyone;
    // process.exit();
    let member1 = await client.users.fetch(member1id);
    let member2 = await client.users.fetch(member2id);
    // 
    const channel = await guild.channels.create(channelName, {
        type: 'GUILD_VOICE', permissionOverwrites: [{
            type: 'member',
            id: member1id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL]
        }, {
            type: 'member',
            id: member2id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL]
        }, {
            type: 'role',
            id: everyoneRole.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL]
        },]
    });
    let invite = await channel.createInvite({
        maxAge: 10 * 60 * 1000,
        maxUses: 2
    })
    try{
        member1.send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.")
        member2.send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.")
    } catch{
        msg.reply("A user has disabled DM's for bots, and an invite can't be sent!");
    }
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    await sleep(10 * 60 * 1000);

    channelsToBePruned.push(serverId + "/" + channel.id);



}

client.on('voiceStateUpdate', (oldState, newState) => {

    pruneChannels();
});
async function pruneChannels() {

    var indexArr = []
    if (channelsToBePruned.length > 0) {
        for (var i = 0; i < channelsToBePruned.length; i++) {


            var channelInfo = channelsToBePruned[i].split("/");
            const guild = await client.guilds.fetch(channelInfo[0]);
            const channel = await guild.channels.cache.get(channelInfo[1]);

            if (channel.members.size < 1) {
                indexArr.push(channelsToBePruned[i]);

                channel.delete();



            }
        }
    }


    for (var i = 0; i < indexArr.length; i++) {


        const index = channelsToBePruned.indexOf(indexArr[i]);
        if (index > -1) {
            channelsToBePruned.splice(index, 1);
        }
    }


}

async function pruneAllChannels(serverId) {
    const guild = await client.guilds.fetch(serverId);
    const channels = guild.channels.cache;
    channels.forEach(channel => {
        if (channel.name === ("Friendmaker: private-channel")) channel.delete();
    });
}

async function roles(guild, message) {
    var localRoles = [];

    for (var i = 0; i < interestRoles.length; i++) {
        var Role = guild.roles.cache.find(r => r.name === interestRoles[i]);
        localRoles.push(Role)
        if (!Role) return message.channel.send("Couldn't find a role. Run the make roles command!");
    }

    // Checking if the message author is a bot.
    if (message.author.bot) return false;

    // Getting the role by ID.
    //  const Role1 = await message.guild.roles.fetch();
    // Making sure the role exists.


    // Creating a filter.
    //  const Filter = (reaction, user) => user.id === message.author.id;
    var embedDescription = "React to this message to add an interest and sign up for Friendmaker!\n";
    for (var i = 0; i < emojiLib.length; i++) {
        embedDescription = embedDescription + emojiLib[i] + " - " + interestRoles[i].substring(2) + '\n';
    }
    // Creating the embed message.
    const Embed = new Discord.MessageEmbed()
        .setDescription(embedDescription);

    // Awaiting for the embed message to be sent.
    const reactionMessage = await message.channel.send({ embeds: [Embed] });

    // Reacting to the embed message.
    for (var i = 0; i < emojiLib.length; i++) {
        await reactionMessage.react(emojiLib[i]);
    }



    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        switch (reaction.emoji.name) {
            case emojiLib[0]:
                message.member.roles.add(localRoles[0]);
                break;
            case emojiLib[1]:
                message.member.roles.add(localRoles[1]);
                break;
            case emojiLib[2]:
                message.member.roles.add(localRoles[2]);
                break;
            case emojiLib[3]:
                message.member.roles.add(localRoles[3]);
                break;
            case emojiLib[4]:
                message.member.roles.add(localRoles[4]);
                break;
            case emojiLib[5]:
                message.member.roles.add(localRoles[5]);
                break;
            case emojiLib[6]:
                message.member.roles.add(localRoles[6]);
                break;
            case emojiLib[7]:
                message.member.roles.add(localRoles[7]);
                break;
            case emojiLib[8]:
                message.member.roles.add(localRoles[8]);
                break;
            case emojiLib[9]:
                message.member.roles.add(localRoles[9]);
                break;
            case emojiLib[10]:
                message.member.roles.add(localRoles[10]);
                break;
            case emojiLib[11]:
                message.member.roles.add(localRoles[11]);
                break;
            case emojiLib[12]:
                message.member.roles.add(localRoles[12]);
                break;
            case emojiLib[13]:
                message.member.roles.add(localRoles[13]);
                break;
            case emojiLib[14]:
                message.member.roles.add(localRoles[14]);
                break;
            case emojiLib[15]:
                message.member.roles.add(localRoles[15]);
                break;
        }
    });
    client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        switch (reaction.emoji.name) {
            case emojiLib[0]:
                message.member.roles.remove(localRoles[0]);
                break;
            case emojiLib[1]:
                message.member.roles.remove(localRoles[1]);
                break;
            case emojiLib[2]:
                message.member.roles.remove(localRoles[2]);
                break;
            case emojiLib[3]:
                message.member.roles.remove(localRoles[3]);
                break;
            case emojiLib[4]:
                message.member.roles.remove(localRoles[4]);
                break;
            case emojiLib[5]:
                message.member.roles.remove(localRoles[5]);
                break;
            case emojiLib[6]:
                message.member.roles.remove(localRoles[6]);
                break;
            case emojiLib[7]:
                message.member.roles.remove(localRoles[7]);
                break;
            case emojiLib[8]:
                message.member.roles.remove(localRoles[8]);
                break;
            case emojiLib[9]:
                message.member.roles.remove(localRoles[9]);
                break;
            case emojiLib[10]:
                message.member.roles.remove(localRoles[10]);
                break;
            case emojiLib[11]:
                message.member.roles.remove(localRoles[11]);
                break;
            case emojiLib[12]:
                message.member.roles.remove(localRoles[12]);
                break;
            case emojiLib[13]:
                message.member.roles.remove(localRoles[13]);
                break;
            case emojiLib[14]:
                message.member.roles.remove(localRoles[14]);
                break;
            case emojiLib[15]:
                message.member.roles.remove(localRoles[15]);
                break;
        }
    });

}

async function makeRoles(guild) {
    console.log(interestRoleColors.length == interestRoles.length);
    for (var i = 0; i < interestRoles.length; i++) {
        var role;
        try {
            role = guild.roles.cache.find(r => r.name === interestRoles[i]);
            console.log("Role Found: " + role.name);
        } catch {
            console.log("Didn't find a role");
            role = guild.roles.create({
                name: interestRoles[i],
                color: interestRoleColors[i],
            })
                .then(console.log)
                .catch(console.error);
        }
        console.log(role.id);
    }

}

function filter(memberList, msg) {
    let authorRoles = [];
    for (var i = 0; i < interestRoles.length; i++) {
        // msg.member.roles.cache.some(r => console.log(r.name));
        var Role = msg.member.roles.cache.some(r => r.name.includes(interestRoles[i]));
        if (Role) {
            console.log(Role);
            authorRoles.push(interestRoles[i]);
        }
    }
    console.log("break " + authorRoles.length);
    var viableMembers = [];
    var counter = 0;
    memberList.forEach(function (memb) {
        console.log(typeof memb.user.id);
        counter++;
        console.log("Counter: " + counter + " " + memb.user.username);
        for (var i = 0; i < interestRoles.length; i++) {
            // msg.member.roles.cache.some(r => console.log(r.name));
            var Role = memb.roles.cache.some(r => r.name.includes(interestRoles[i]));
            if (Role) {
                console.log(Role);
                if (authorRoles.includes(interestRoles[i])) {
                    viableMembers.push(memb);
                    break;
                }
                // authorRoles.push(interestRoles[i]);
            }
        }
    });
    console.log(viableMembers.length);
    let randInt = Math.floor(Math.random() * viableMembers.length);
    console.log("Random integer: " + randInt);
    let randomMember = viableMembers[randInt];
    console.log(randomMember.user.username + " matched with " + msg.member.user.username);
    return randomMember;
}



async function recache(serverID) {
    client.guilds.cache
        .get(serverID)
        .members.fetch()
        .then((members) => {
            console.log(members.size); // 420
            // code...
        });

}

client.login('OTIyNDk5OTk1MDcxMDUzODM0.YcCXEg.DEyR4NRDjk4hBovjU4K5ygAoN1M');
