const fetch = require('node-fetch')
const Eris = require('Eris')
const { ProcessManager, HLJS } = require('../utils')

module.exports = async function curl (message, parent) {
  if (!message.data.args) return message.channel.createMessage('Missing Arguments.')

  let type
  const res = await fetch(message.data.args.split(' ')[0]).then(async r => {
    const text = await r.text()
    try {
      type = 'json'
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      type = HLJS.getLang(r.headers.get('Content-Type')) || 'html'
      return text
    }
  }).catch(e => {
    type = 'js'
    message.addReaction('❗')
    console.log(e.stack)
    return e.toString()
  })

  const msg = new ProcessManager(message, res || '', parent, { lang: type })
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
}
