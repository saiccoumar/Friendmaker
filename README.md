# Friendmaker
## Instructions
- !summon: sends a message with instructions
- !send interests message: sends a self-assign roles message
- !make roles: makes interest roles for users to assign to themselves
- !prune channels: cleans up excess channels that might get left behind by crashed bots 
- !find a friend: users use this command to find a friend. 
- !cache users: sometimes the user list gets outdated so run this once when the bot gets added/restarted and whenever there's a large influx of new people
- !list users: lists all cached users. This might be a bad idea with 1k people in a server, I used it for testing.
- prune channel requires MANAGE_CHANNELS priviliges. finding friends doesn't require any privileges. Every other command needs ADMIN priviliges.
## How it works
- Friendmaker works kind of like omegle but for discord. It looks for people with similar interest roles and matches you with a random person. It creates a private channel for the people and sends invites to them via DM, so it's possible that people with closed DM's won't recieve the message, but there wasn't a workaround that without sending a message to everyone in the channel.
- Interest roles are added via reacting to a message, which triggers the bot to add roles to the people who react. 
- The bot should prune any friendmaker-made channels on it's own with a 10 minute time delay from when it's made, but the prune channels command exists in case there's an issue.
- Setup for the bot would be running !send interests message so people can assign roles with their interests. Making a bot spam channel is recommended so people can spam their hearts out with find friend requests. Use !summon if you need to find commands you may have forgotten.
