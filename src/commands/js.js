const Eris = require('eris')
const { ProcessManager, inspect, isGenerator } = require('../utils')

module.exports = async function js (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client } = parent
  if (!message.data.args) return message.channel.createMessage('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let typeOf
  const result = await res
    .then(async output => {
      typeOf = typeof output

      async function prettify (target) {
          return target
      }

      if (isGenerator(output)) {
        for (const value of output) {
          prettify(value)

          if (typeof value === 'function') await message.channel.createMessage(value.toString())
          else if (typeof value === 'string') await message.channel.createMessage(value)
          else await message.channel.createMessage(inspect(value, { depth: 1, maxArrayLength: 200 }))
        }
      }

      prettify(output)

      if (typeof output === 'function') {
        typeOf = 'object'
        return output.toString()
      } else if (typeof output === 'string') {
        return output
      }
      message.addReaction('✅')
      return inspect(output, { depth: 1, maxArrayLength: 200 })
    })
    .catch(e => {
      typeOf = 'object'
      message.addReaction('❗')
      return e.toString()
    })

  const msg = new ProcessManager(message, result || '', parent, { lang: 'js', noCode: typeOf !== 'object' })
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
