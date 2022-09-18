const Eris= require('eris')
const config = require('./config')

const client = new Eris(config.token)

const ErisDebugger = require('../src')

const Debugger = new ErisDebugger(client, { aliases: ['debug', 'debugger'], prefix: '!', noPerm: (message) => message.channel.createMessage('🚫 You dont have permission to use this command.'), globalVariable: { global_variable: "global scope" } })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator}!`)
})

client.on('messageCreate', async message => {
  // Return if guild doesnt exists
  if (!message.guildID) return
  await Debugger.run(message)

  /* Currently Eris-Debugger doesnt support DM Channel. */
})

client.connect()
