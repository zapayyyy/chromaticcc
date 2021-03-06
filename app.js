const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const prefix = "/"
const bot = new Discord.Client();

require('./util/eventLoader')(client);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

  client.on(`ready`, member => {
    client.user.setPresence({game: {name: "with " + client.users.size + " members | ch!help" , type: 0}});
});

client.on("ready", () => {
	client.user.setStatus("dnd")
});

client.on("guildCreate", guild => {
guild.createRole({
  name: "Muted",
  color: "070707",
  })
 guild.createRole({
  name: "AFK",
  color: "070707",
  })
let owner = guild.owner
   owner.send("Thanks for adding me to your server. Just a few things to note:\n**1:** The prefix is `ch!`.\n**2:** Commands do not work in DM.\n**3:** Bot is in beta state.")
console.log("+ " + guild + ".")
   });


client.on("guildDelete", guild => {
guild.roles.find('name', "Muted").delete()
console.log("- " + guild + ".")
});
	
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading  ${files.length} commands. 👌`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading command: ${props.help.name}. 👌`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  let permlvl = 0;
  if (message.author.id === "390155343373533195") permlvl = 4;
  return permlvl;
};


client.login(process.env.BOT_TOKEN);
