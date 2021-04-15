const Ajv = require('ajv')

const schema = require('./../schema/draft-offen-analyticstxt-latest')

exports.validate = validate
function validate (content) {
  const lines = content.split(/\r?\n/)

  const normalized = {}
  for (const [i, line] of lines.entries()) {
    const parsed = parseLine(line)
    if (parsed.error) {
      return new Error(`Failed to parse line ${i + 1}: ${parsed.error.message}`)
    }
    if (parsed.isCommentOrEmpty) {
      continue
    }
    if (parsed.field in normalized) {
      return new Error(
        `Field "${parsed.field}" redefined on line ${i + 1}. Field names can only occur once.`
      )
    }
    normalized[parsed.field] = parsed.values
  }

  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  const valid = validate(normalized)
  if (!valid) {
    return validate.errors
  }
  return null
}

function parseLine (line) {
  const result = {
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

  const [field, value] = line.trim().toLowerCase().split(':')
  if (!field || !value) {
    const error = new Error('No field name or value found.')
    return {
      ...result,
      error
    }
  }

  const values = value
    .split(',')
    .map(s => s.trim())

  return {
    ...result,
    field,
    values
  }
}
