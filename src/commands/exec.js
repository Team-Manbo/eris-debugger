const child = require('child_process')
const Eris = require('eris')
const { ProcessManager, codeBlock } = require('../utils')

module.exports = async function Exec (message, parent) {
  if (!message.data.args) return message.channel.createMessage('Missing Arguments.')

  const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null)
  // console.log(shell)
  if (!shell) return message.channel.createMessage('Sorry, we are not able to find your default shell.\nPlease set `process.env.SHELL`.')

  const msg = new ProcessManager(message, `$ ${message.data.args}\n`, parent, { lang: 'bash' })
  await msg.init()

  const res = child.spawn(shell, ['-c', (shell === 'win32' ? 'chcp 65001\n' : '') + message.data.args], { encoding: 'utf8' })
  const timeout = setTimeout(() => {
    kill(res, 'SIGTERM')
    message.channel.createMessage({
      content: `Shell timeout occurred.`,
      messageReference: { messageID: message.id }
    })
  }, 180000)
  console.log(res.pid)

  await msg.addAction([
    {
      button: {
        style: Eris.Constants.ButtonStyles.DANGER,
        custom_id: 'erisDebugger$prev',
        label: 'Prev',
        type: Eris.Constants.ComponentTypes.BUTTON
      },
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: {
        style: Eris.Constants.ButtonStyles.SECONDARY,
        custom_id: 'erisDebugger$stop',
        label: 'Stop',
        type: Eris.Constants.ComponentTypes.BUTTON
      },
      action: async ({ res, manager }) => {
        res.stdin.pause()
        const gg = await kill(res)
        console.log(gg)
        msg.add('^C')
        manager.destroy()
      }
    },
    {
      button: {
        style: Eris.Constants.ButtonStyles.PRIMARY,
        custom_id: 'erisDebugger$next',
        label: 'Next',
        type: Eris.Constants.ComponentTypes.BUTTON
      },
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ], { res })

  res.stdout.on('data', (data) => {
    console.log(data.toString())
    msg.add('\n' + data.toString())
  })

  res.stderr.on('data', (data) => {
    msg.add(`\n[stderr] ${data.toString()}`)
  })

  res.on('error', (err) => {
    console.log(err)
    return message.channel.createMessage(`Error occurred while spawning process\n${codeBlock.construct(err.toString(), 'sh')}`)
  })
  res.on('close', (code) => {
    console.log(clearTimeout(timeout))
    msg.add(`\n[status] process exited with code ${code}`)
  })
}

/**
 * @param {any} res
 * @param {NodeJS.Signals} [signal]
 */
function kill (res, signal) {
  if (process.platform === 'win32') return child.exec(`powershell -File "..\\utils\\KillChildrenProcess.ps1" ${res.pid}`, { cwd: __dirname })
  else return res.kill('SIGINT' || signal)
}
