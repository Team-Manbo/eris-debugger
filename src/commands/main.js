const Eris = require('eris')

const { system, DateFormatting } = require('../utils')
const version = require('../../package.json').version

module.exports = async function (message, parent) {
   let summary = `Eris-Debugger v${version}, Eris \`${Eris.VERSION}\`, \`Node.js ${process.version}\` on \`${process.platform}\`\nProcess started at ${DateFormatting.relative(system.processReadyAt())}, bot was ready at ${DateFormatting.relative(parent.client.startTime)}.\n`

  summary += `\nUsing ${system.memory().rss} at this process.\n`
  const cache = `${parent.client.guilds.size} guild(s) and ${parent.client.users.size} user(s)`

  if (parent.client.shards.size > 0) {
    summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.\n\nThis bot is sharded in ${parent.client.shards.size} shard(s).\nCan see ${cache} in this shard.`
  } else summary += `Running on PID ${process.pid}\n\nThis bot is not sharded and can see ${cache}.`

  summary += `\nAverage websocket latency: ${message.channel.guild.shard.latency}ms`

  return message.channel.createMessage(summary)
}
