const Ajv = require('ajv')

const schema = require('./schema')

exports.validate = validate
function validate (content) {
  const lines = parse(content.split(/\r?\n/))

  const errors = lines
    .filter(l => l.error)
    .map(l => l.line)
  if (errors.length) {
    return new Error(
      `Could not parse following line(s): ${errors.join(', ')}`
    )
  }

  const normalized = lines
    .filter(l => !l.isCommentOrEmpty)
    .reduce((acc, line) => {
      acc[line.field] = line.values
      return acc
    }, {})

  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  const valid = validate(normalized)
  if (!valid) {
    return validate.errors
  }
  return null
}

function parse (input) {
  return input
    .map(line => line.trim())
    .map((line, index) => {
      const result = {
        line: index + 1,
        error: null,
        field: null,
        values: null,
        isCommentOrEmpty: false
      }

      if (line.indexOf('#') === 0 || line === '') {
        return {
          ...result,
          isCommentOrEmpty: true
        }
      }

      const [field, value] = line.split(':')
      if (!field || !value) {
        const error = new Error(
          `Cannot parse line ${index + 1}, no field name or value found.`
        )
        return {
          ...result,
          error
        }
      }

      const values = value
        .split(',')
        .filter(Boolean)
        .map(s => s.trim().toLowerCase())

      return {
        ...result,
        field: field.toLowerCase(),
        values
      }
    })
}
