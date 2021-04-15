const Ajv = require('ajv')

const defaultVersion = exports.defaultVersion = 'draft-offen-analyticstxt-latest'

exports.validate = validate
function validate (content, draftName = defaultVersion) {
  let schema
  try {
    schema = require(`./../schema/${draftName}`)
  } catch (err) {
    throw new Error(`Schema for ${draftName} is unknown.`)
  }

  const lines = content.split(/\r?\n/)

  const normalized = {}
  for (const [i, line] of lines.entries()) {
    let parsed
    try {
      parsed = parseLine(line)
    } catch (e) {
      return new Error(`Unexpected error parsing line ${i + 1}: ${e.message}`)
    }
    const { error, isCommentOrEmpty, field, values } = parsed
    if (error) {
      return new Error(`Failed to parse line ${i + 1}: ${error.message}`)
    }
    if (isCommentOrEmpty) {
      continue
    }
    if (field in normalized) {
      return new Error(
        `Field "${field}" redefined on line ${i + 1}. Field names can only occur once.`
      )
    }
    normalized[field] = values
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

  let [field, value] = line.trim().split(':')
  if (!field || !value) {
    const error = new Error('No field name or value found.')
    return {
      ...result,
      error
    }
  }

  field = field.toLowerCase()
    .split('')
    .map((c, i) => i ? c : c.toUpperCase())
    .join('')

  const values = value
    .split(',')
    .map(s => s.trim())

  return {
    ...result,
    field,
    values
  }
}
