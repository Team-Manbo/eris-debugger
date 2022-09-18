module.exports = function regexpEscape (string) {
  const str = String(string)
  const cpList = Array.from(str[Symbol.iterator]())
  const cuList = []
  for (const c of cpList) {
    if ('^$\\.*+?()[]{}|'.indexOf(c) !== -1) {
      cuList.push('\\')
    }
    cuList.push(c)
  }
  return cuList.join('')
}
