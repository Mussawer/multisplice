var test = require('tape')
var Splicer = require('./')

test('splice multiple things using original indices', function (t) {
  var str = Splicer('a b c d e')
    .splice(2, 3, 'beep')
    .splice(6, 7, 'boop')

  t.equal(str.toString(), 'a beep c boop e')
  t.end()
})

test('slice part of a spliced string using original indices', function (t) {
  var str = Splicer('a b c d e')
    .splice(2, 3, 'beep')
    .splice(6, 7, 'boop')

  t.equal(str.slice(2, 5), 'beep c')
  t.end()
})

// Tests splice() with negative indices to ensure correct handling of end-relative positions
test('handle negative indices', function (t) {
  var str = Splicer('abcde')
    .splice(-2, -1, 'X')
  t.equal(str.toString(), 'abcXe')

  var str2 = Splicer('12345678')
    .splice(-5, -3, 'YY')
  t.equal(str2.toString(), '123YY678')
  t.end()
})

// Tests splice() with overlapping ranges to verify correct order of operations
test('handle overlapping splices', function (t) {
  var str = Splicer('abcde').splice(1, 3, 'X').toString()
  str = Splicer(str.toString()).splice(2, 4, 'Y')
  t.equal(str.toString(), 'aXY')

  var str2 = Splicer('123456').splice(1, 4, 'AA').toString()
  str2 = Splicer(str2.toString()).splice(0, 3, 'BB')
  t.equal(str2.toString(), 'BB56')
  t.end()
})

// Tests splice() with an empty replacement string to ensure proper character removal
test('replace with empty string', function (t) {
  var str = Splicer('abcde')
    .splice(1, 3, '')
  t.equal(str.toString(), 'ade')

  var str2 = Splicer('123456789')
    .splice(3, 7, '')
  t.equal(str2.toString(), '12389')
  t.end()
})

// Tests replace() for case-insensitive replacement of all occurrences of a substring
test('replace all occurrences of a substring', function (t) {
  var str = Splicer('The quick brown fox jumps over the lazy dog')
    .replace('the', 'a')
  t.equal(str.toString(), 'a quick brown fox jumps over a lazy dog')

  var str2 = Splicer('Apple apple APPLE aPpLe')
    .replace('apple', 'orange')
  t.equal(str2.toString(), 'orange orange orange orange')
  t.end()
})

// Tests capitalize() to ensure it correctly capitalizes the first letter of each word
test('capitalize first letter of each word', function (t) {
  var str = Splicer('the quick brown fox')
    .capitalize()
  t.equal(str.toString(), 'The Quick Brown Fox')

  var str2 = Splicer('hello world 123 goodbye')
    .capitalize()
  t.equal(str2.toString(), 'Hello World 123 Goodbye')
  t.end()
})

// Tests slice() with negative indices after a splice operation to verify correct indexing
test('slice with negative indices', function (t) {
  var str = Splicer('abcdefghij').splice(2, 4, 'XX').toString()
  t.equal(str.slice(-7, -2), 'Xefgh')
  t.end()
})

// Tests slice() with negative indices after a splice operation to verify correct indexing - 2
test('slice with negative indices', function (t) {
  var str = Splicer('abcde').splice(1, 3, 'YY').toString()
  t.equal(str.slice(-3, -1), 'Yd')
  t.end()
})

// Tests slice() with negative indices
test('slice with negative indices', function (t) {
  var str = Splicer('abcdefghij')
  t.equal(str.slice(-7, -2), 'defgh')

  var str2 = Splicer('0123456789')
  t.equal(str2.slice(-9, -3), '123456')
  t.end()
})
