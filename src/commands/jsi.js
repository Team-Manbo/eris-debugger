const Eris = require('eris')
const { ProcessManager, count, inspect, table, type } = require('../utils')

module.exports = async function jsi (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client } = parent
  if (!message.data.args) return message.channel.createMessage('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let msg
  await res.then(output => {
    const typeofTheRes = type(output)
    const overview = inspect(output, { depth: -1 })
    const constructorName = output && output.constructor ? Object.getPrototypeOf(output.constructor).name : null
    const arrCount = count(output)
    msg = new ProcessManager(message, `=== ${overview.slice(0, 100)}${overview.length > 100 ? '...' : ''} ===\n\n${table({ Type: `${typeof output}(${typeofTheRes})`, Name: constructorName || null, Length: typeof output === 'string' && output.length, Size: output instanceof Eris.Collection ? output.size : null, 'Content Types': arrCount ? arrCount.map(el => `${el.name} (${el.ratio}％)`).join(', ') : null })}`, parent, { lang: 'prolog' })
  }).catch(e => {
    msg = new ProcessManager(message, e.stack, parent, { lang: 'js' })
  })

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
