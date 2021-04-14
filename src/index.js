const Ajv = require('ajv')

const schema = require('./schema')

exports.validate = validate
function validate (content) {
  let normalized
  try {
    normalized = splitAndNormalize(content)
  } catch (err) {
    return err
  }
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const valid = validate(normalized)
  if (!valid) {
    return validate.errors
  }
  return null
}

function splitAndNormalize (input) {
  return input
    .split(/\r?\n/)
    .map(function (line) { return line.trim() })
    .filter(function (line) { return line.indexOf('#') !== 0 && line !== '' })
    .map(function (line) { return line.split(':') })
    .reduce(function (acc, line) {
      if (line.length !== 2) {
        throw new Error(`Cannot parse line "${line.join(':')}".`)
      }
      acc[line[0].toLowerCase()] = line[1].split(',').map(s => s.trim().toLowerCase())
      return acc
    }, {})
}
