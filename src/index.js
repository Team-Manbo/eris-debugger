const Eris = require('eris')
const fetch = require('node-fetch')

const Commands = require('./commands')
const Utils = require('./utils')

/**
 * @typedef {Function} noPerm
 * @param {Eris.Message} message
 * @returns {any|Promise<any>}
 */

/**
 * @typedef ErisDebuggerOptions
 * @property {string[]} [aliases=['debug', 'debugger']] Aliases of command
 * @property {string[]} [owners] ID of owners
 * @property {string} [prefix] Prefix of Bot
 * @property {any[]} [secrets=[]] Secrets to hide
 * @property {Record<string, any>} [globalVariable={}] Custom global Variable for eval
 * @property {noPerm} [noPerm] Executed when command run by not allowed user
 * @property {boolean} [disableAttachmentExecution=false] Disable attachment execution.
 */

/**
 * @typedef MessageData
 * @property {string} [raw] Raw message content
 * @property {string} [cmd] Command
 * @property {string} [type] Command type
 * @property {string} [args] Arguments given
 */

module.exports = class ErisDebugger {
  /**
   * Main Client of ErisDebugger
   *
   * @param {Eris.Client} client Discord Client
   * @param {ErisDebuggerOptions} options Eris-debugger Options
   */
  constructor (client, { aliases = ['debug', 'debugger'], owners = null, prefix, secrets = [], noPerm, disableAttachmentExecution = false, globalVariable = {}, isOwner = undefined } = {}) {
    if (!(client instanceof Eris.Client)) throw new Error('Invalid `client`. `client` parameter is required.')
    if (noPerm && typeof noPerm !== 'function') throw new Error('`noPerm` parameter must be a Function.')
    if (globalVariable) {
      if (typeof globalVariable !== 'object') throw new Error('`globalVariable` parameter must be an Object.')
      else {
        Object.keys(globalVariable).forEach(el => {
          global[el] = globalVariable[el]
        })
      }
    }

    this.owners = owners

    if (isOwner && !owners) this.owners = []

    client.once('ready', () => {
      if (!this.owners) {
        console.warn('[Eris-Debugger] Owners not given. Fetching from Application.')

        client.getOAuthApplication().then(data => {
          this.owners = data.team?.members?.map(member => member.user.id) || [data.owner.id] || []
          console.info(`[Eris-Debugger] Fetched ${this.owners.length} owner(s): ${this.owners.length > 3 ? this.owners.slice(0, 3).join(', ') + ` and ${this.owners.length - 3} more owners` : this.owners.join(', ')}`)
        })
      }
    })

    this.client = client
    this.process = []
    this.options = { prefix, aliases, secrets, noPerm, disableAttachmentExecution, isOwner }
    if (!this.options.secrets || !Array.isArray(this.options.secrets)) this.options.secrets = []
    if (!this.options.aliases) this.options.aliases = ['debug', 'debugger']
  }

  /**
   * @param {Eris.Message} message Message
   * @returns {Promise<any>|any}
   */
  async run (message) {
    if (this.options.prefix && !message.content.startsWith(this.options.prefix)) return

    const parsed = message.content.replace(this.options.prefix, '').split(' ')
    const codeParsed = Utils.codeBlock.parse(parsed.slice(2).join(' '))

    /**
     * @type {MessageData}
     */
    message.data = {
      raw: message.content,
      cmd: parsed[0],
      type: parsed[1],
      args: codeParsed ? codeParsed[2] : parsed.slice(2).join(' ')
    }
    if (!message.data.args && message.attachments.length > 0 && !this.options.disableAttachmentExecution) {
      const file = message.attachments[0]
      const buffer = await (await fetch(file.url)).buffer()
      const type = { ext: file.filename.split('.').pop(), fileName: file.filename }
      if (['txt', 'js', 'ts', 'sh', 'bash', 'zsh', 'ps'].includes(type.ext)) {
        message.data.args = buffer.toString()
        if (!message.data.type && type.ext !== 'txt') message.data.type = type.ext
      }
    }
    if (this.options.aliases && !this.options.aliases.includes(message.data.cmd)) return
    if (!this.owners.includes(message.author.id)) {
      let isOwner = false

      if (this.options.isOwner) {
        isOwner = await this.options.isOwner(message.author)
      }

      if (!isOwner) {
        if (this.options.noPerm) return this.options.noPerm(message)
        else return
      }
    }

    if (!message.data.type) return Commands.main(message, this)
    switch (message.data.type) {
      case 'sh':
      case 'bash':
      case 'ps':
      case 'powershell':
      case 'shell':
      case 'zsh':
      case 'exec':
        Commands.exec(message, this)
        break
      case 'js':
      case 'javascript':
        Commands.js(message, this)
        break
      case 'shard':
        Commands.shard(message, this)
        break
      case 'jsi':
        Commands.jsi(message, this)
        break
      case 'curl':
        Commands.curl(message, this)
        break
      case 'cat':
        Commands.cat(message, this)
        break
      default:
        message.channel.createMessage({
          content: `Available Options: ${Object.keys(Commands).filter(t => t !== 'main').map(t => `\`${t}\``).join(', ')}`,
          messageReference: { messageID: message.id }
        })
    }
  }

  _addOwner (id) {
    if (this.owners.includes(id)) return
    this.owners.push(id)
    return this.owners
  }

  _removeOwner (id) {
    if (!this.owners.includes(id)) return null
    this.owners.splice(this.owners.indexOf(id), 1)
    return this.owners
  }
}

module.exports.Utils = Utils
module.exports.Commands = Commands
