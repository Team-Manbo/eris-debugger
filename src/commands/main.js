const Eris = require('eris')

const { system, DateFormatting } = require('../utils')
const version = require('../../package.json').version

module.exports = async function (message, parent) {
   let summary = `Eris-Debugger \`v${version}\`, Eris \`${Eris.VERSION}\`, \`Node.js ${process.version}\` on \`${process.platform}\`\nProcess started at ${DateFormatting.relative(system.processReadyAt())}, bot was ready at ${DateFormatting.relative(parent.client.startTime)}.\n`

  summary += `\nUsing \`${system.memory().rss}\` in this process.\n`
  const cache = `${parent.client.guilds.size} guild(s) and ${parent.client.users.size} user(s)`

  /* Eris basically starts with internal sharding */
  summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.\n\nThis bot is sharded in ${parent.client.shards.size} shard${parent.client.shards.size > 1 ? "s" : ""}.\n${cache} are cached this shard(\`#${message.channel.guild.shard.id}\` of #{parent.client.shards.size}).`


  summary += `\n\nMax Listerners: ${parent.client.getMaxListeners()}\nAverage shard latency: \`${message.channel.guild.shard.latency}\`ms\nAverage websocket latency: \`${message.channel.guild.shard.latency}\`ms`

  return message.channel.createMessage(summary)
}
