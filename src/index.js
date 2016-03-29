var editorconfig = require('editorconfig')
var yaml = require('js-yaml')
var path = require('path')
var fs = require('fs')

var quiet

var echo = function (message) {
  if (!quiet) console.log(message)
}

var sync = function (from, to) {
  var result = {}
  to = to || {}

  for (var key in from) {
    result[key] = typeof from[key] === 'object'
      ? sync(from[key], to[key] || {})
      : to[key] || from[key]
  }

  return result
}

function transync (options, callback) {
  var from = options.from
  var to = options.to
  quiet = options.quiet

  if (!from) throw new Error('No source file specified. Aborting.')
  if (!to) throw new Error('No destination file specified. Aborting.')

  try {
    var fromFile = fs.readFileSync(from, 'utf8')
    var codingStyle = editorconfig.parseSync(from)
  } catch (err) {
    throw new Error(`Could not find ‘${from}’ file. Aborting.`)
  }

  try {
    var toFile = fs.readFileSync(to, 'utf8')
  } catch (err) {
    fs.openSync(to, 'w')
    toFile = ''
    echo(`Could not find ‘${to}’ file. Created it.`)
  }

  try {
    var fromDictionary = yaml.safeLoad(fromFile, { json: true })
  } catch (err) {
    throw new Error('Could not parse ‘${from}’ file. Aborting.')
  }

  try {
    var toDictionary = yaml.safeLoad(toFile, { json: true })
  } catch (err) {
    throw new Error('Could not parse ‘${to}’ file. Aborting.')
  }

  var JSONindentation = codingStyle.indent_style === 'tab' ? '\t' : codingStyle.indent_size
  var newDictionary = sync(fromDictionary, toDictionary)
  var newContent = (path.extname(to) === '.json')
    ? JSON.stringify(newDictionary, null, JSONindentation)
    : yaml.safeDump(newDictionary, { indent: codingStyle.indent_size })

  if (codingStyle.insert_final_newline) {
    newContent += '\n'
  }

  fs.writeFileSync(to, newContent, 'utf8', function () {
    echo(`Version ‘${to}’ correctly synchronized with base version ‘${from}’.`)

    if (typeof callback === 'function') {
      callback()
    }
  })
}

module.exports = transync
