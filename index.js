var assert = require('assert')

module.exports = function multisplice (str) {
  assert.strictEqual(typeof str, 'string', 'multisplice: str must be a string')
  var splices = []
  var self = { splice: splice, slice: slice, toString: toString, replace: replace, capitalize: capitalize }
  return self

  function splice (start, end, value) {
    assert.strictEqual(typeof start, 'number', 'multisplice.splice: start must be a number')
    assert.strictEqual(typeof end, 'number', 'multisplice.splice: end must be a number')
    assert.strictEqual(typeof value, 'string', 'multisplice.splice: replacement value must be a string')

    // Handle negative indices
    if (start < 0) start = Math.max(str.length + start, 0)
    if (end < 0) end = Math.max(str.length + end, 0)

    assert(start >= 0, 'multisplice.splice: start must be at least 0')
    assert(end >= start, 'multisplice.splice: end must be equal to or greater than start')
    splices.push({ start: start, end: end, value: value })
    return self
  }

  function slice (start, end) {
    assert.strictEqual(typeof start, 'number', 'multisplice.slice: start must be a number')
    if (end != null) assert.strictEqual(typeof end, 'number', 'multisplice.slice: end must be a number')

    // Handle negative indices for slice
    if (start < 0) start = Math.max(str.length + start, 0)
    if (end != null && end < 0) end = Math.max(str.length + end, 0)

    splices.sort(byStart)
    var result = ''
    var last = start
    for (var i = 0; i < splices.length; i++) {
      var sp = splices[i]
      // Check if there's a gap between the last processed position and the current splice start
      if (sp.start > last) {
        // Add the original string segment between last and the current splice start
        result += str.slice(last, Math.min(sp.start, end != null ? end : str.length))
      }
      // Check if the current splice overlaps with the desired slice range
      if (sp.start < (end != null ? end : str.length) && sp.end > start) {
        // Add the splice value to the result
        result += sp.value
      }
      // Update the last processed position
      last = Math.max(last, sp.end)
      // Break the loop if we've reached or exceeded the end of the desired slice
      if (end != null && last >= end) break
    }
    // Add any remaining original string after the last splice
    if (end == null || last < end) {
      // Append the final segment of the original string
      result += str.slice(last, end)
    }
    // Return the final spliced and sliced string
    return result
  }

  function toString () {
    return slice(0)
  }

  // Replaces all occurrences of searchValue with replaceValue, ignoring case
  function replace (searchValue, replaceValue) {
    assert.strictEqual(typeof searchValue, 'string', 'multisplice.replace: searchValue must be a string')
    assert.strictEqual(typeof replaceValue, 'string', 'multisplice.replace: replaceValue must be a string')

    const lowerStr = str.toLowerCase()
    const lowerSearchValue = searchValue.toLowerCase()
    let index = lowerStr.indexOf(lowerSearchValue)
    while (index !== -1) {
      splice(index, index + searchValue.length, replaceValue)
      index = lowerStr.indexOf(lowerSearchValue, index + 1)
    }
    return self
  }

  // Capitalize the first letter of each word in the string
  function capitalize () {
    const words = str.split(' ')
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (word.length > 0) {
        const index = str.indexOf(word, i === 0 ? 0 : str.indexOf(words[i - 1]) + words[i - 1].length + 1)
        splice(index, index + 1, word[0].toUpperCase())
      }
    }
    return self
  }
}

function byStart (a, b) {
  return a.start - b.start
}
