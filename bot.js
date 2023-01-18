require("dotenv").config(); //to start process from .env file
const { Client, Events, GatewayIntentBits, Partials }=require("discord.js");

const client=new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Reaction],
});

client.once("ready", () =>{
    console.log("BOT IS ONLINE"); //message when bot is online
})
client.login(process.env.TOKEN);

client.on(Events.ClientReady, guild => {
	//const MUSA = guild.roles.find(role => role.name === "MUSA");
	console.log('starting!');
});


//perhaps attach to google sheet
const classArray = ["502","504","505","506","528","531","560","571","577"]


//When a message is reacted, add the role
client.on(Events.MessageReactionAdd, async (reaction, user) => {

	//not super sure what this chunk is
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	
	// get user who reacted
	const reactUser = await reaction.message.guild.members.fetch(user);

	//Roles
	const MUSA = reaction.message.guild.roles.cache.find(role => role.name === "MUSA");
	const MCP = reaction.message.guild.roles.cache.find(role => role.name === "MCP");

	const courseArray = classArray.map(course => reaction.message.guild.roles.cache.find(role => role.name === course));


	
	
	if (reaction.message.content === 'Program?' || reaction.message.content === 'MUSA or MCP') {
		//console.log('member ' +reaction.message.member);
		console.log('user ' +reactUser);

		if (reaction.emoji.name == "💻") {
			reactUser.roles.add(MUSA).catch(console.error);

		}
		if (reaction.emoji.name == "🏙️") {
			reactUser.roles.add(MCP).catch(console.error);
		}
	}

	courseArray.forEach(course => {
		if (reaction.message.content === `CPLN ${course.name}`) {
			console.log(reactUser.name + `has entered CPLN ${course.name}`);
			reactUser.roles.add(course).catch(console.error);
		}
	});


});


//When a message is unreacted, remove the role
client.on(Events.MessageReactionRemove, async (reaction, user) => {


	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

	// get user who reacted
	const reactUser = await reaction.message.guild.members.fetch(user);

	//Roles
	const MUSA = reaction.message.guild.roles.cache.find(role => role.name === "MUSA");
	const MCP = reaction.message.guild.roles.cache.find(role => role.name === "MCP");
	

	
	if (reaction.message.content === 'MUSA or MCP') {
		if (reaction.emoji.name == "💻") {
			reactUser.roles.remove(MUSA).catch(console.error);

		}
		if (reaction.emoji.name == "🏙️") {
			reactUser.roles.remove(MCP).catch(console.error);
		}
	}
});