const fs = require('fs')
const Eris = require('eris')
const { ProcessManager, HLJS } = require('../utils')

module.exports = async function curl (message, parent) {
  if (!message.data.args) return message.channel.createMessage('Missing Arguments.')
  const filename = message.data.args
  let msg
  fs.readFile(filename, async (err, data) => {
    if (err) msg = new ProcessManager(message, err.toString(), parent, { lang: 'js' })
    else msg = new ProcessManager(message, data.toString(), parent, { lang: HLJS.getLang(filename.split('.').pop()) })
    await msg.init()
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
        action: ({ manager }) => manager.destroy(),
        requirePage: true
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
    ])
  })
}
