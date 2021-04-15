const Ajv = require('ajv')
const addFormats = require('ajv-formats')

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
      const err = new Error(`Unexpected error parsing line ${i + 1}: ${e.message}`)
      return wrapParseError(err)
    }
    const { error, isCommentOrEmpty, field, values } = parsed
    if (error) {
      const err = new Error(`Failed to parse line ${i + 1}: ${error.message}`)
      return wrapParseError(err)
    }
    if (isCommentOrEmpty) {
      continue
    }
    if (field in normalized) {
      const err = new Error(
        `Field "${field}" redefined on line ${i + 1}. Field names can only occur once.`
      )
      return wrapParseError(err)
    }
    normalized[field] = values
  }

  const ajv = new Ajv()
  addFormats(ajv)
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

function wrapParseError (err) {
  return [err]
}
