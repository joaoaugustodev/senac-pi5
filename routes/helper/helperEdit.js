module.exports = function helperEdit (dataOne, dataTwo, info = {}) {
  if (dataOne) {
    info = Object.assign(info, dataOne)
  }

  if (dataTwo) {
    Object.keys(dataTwo).forEach(key => {
      info[key] = dataTwo[key][0].filename
    })
  }

  return info
}
