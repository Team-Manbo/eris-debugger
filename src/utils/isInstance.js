const Eris = require('eris')

/**
 * @param {any} target
 * @param {any} theClass
 */
module.exports = function (target, theClass) {
  if ((Array.isArray(target) || target instanceof Eris.Collection) && target.map(f => f instanceof theClass).includes(false)) return false
  else return target instanceof theClass
}
