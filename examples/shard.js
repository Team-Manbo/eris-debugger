const Eris = require('eris')
const config = require('./config')

// You can use cluster either with some packages (such as eris-fleet) or make an own cluster manager with cluster package (which i recommend)

const bot = new Eris(config.token, {
    firstShardID: 0,
    lastShardID: 15,
    maxShards: 16,
    getAllUsers: false,
    intents: ['guilds', 'guildMembers', 'guildPresences']
});

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`)
})

bot.on('shardReady', (id) => {
    console.log(`Shard ${id} ready!`)
});

bot.connect()
