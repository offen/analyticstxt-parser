/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const Ajv = require('ajv')
const addFormats = require('ajv-formats')

const defaultVersion = exports.defaultVersion = 'draft-ring-analyticstxt-00'

exports.validate = validate
function validate (content, { draftName = defaultVersion } = {}) {
  const [parsed, parsingError] = parseAnalyticsTxt(content)
  if (parsingError) {
    return parsingError
  }
  const validationError = validateWithSchema(parsed, draftName)
  return validationError
}

exports.parse = parse
function parse (content, { draftName = defaultVersion, lax = false } = {}) {
  const [parsed, parsingError] = parseAnalyticsTxt(content)
  if (parsingError) {
    return [null, parsingError]
  }
  const validationError = lax ? null : validateWithSchema(parsed, draftName)
  return [parsed, validationError]
}

exports.serialize = serialize
function serialize (source, { draftName = defaultVersion, lax = false } = {}) {
  const validationError = lax ? null : validateWithSchema(source, draftName)
  if (validationError) {
    return [null, validationError]
  }
  return serializeAnalyticsTxt(source)
}

function validateWithSchema (parsed, draftName) {
  let schema
  try {
    schema = require(`./../schema/${draftName}`)
  } catch (err) {
    throw new Error(`Schema for ${draftName} is unknown.`)
  }

  const ajv = new Ajv()
  addFormats(ajv)
  const validate = ajv.compile(schema)

  const valid = validate(parsed)
  let validationError = null
  if (!valid) {
    const [err] = validate.errors
    const message = [err.instancePath, err.message].filter(Boolean).join(' ')
    validationError = new Error(
      `Validation failed with: ${message}.`
    )
  }
  return validationError
}

function serializeAnalyticsTxt (source) {
  let ordered = []
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key) || key === '_ordering') {
      continue
    }
    ordered.push([key, source[key]])
  }
  ordered = ordered.sort(function (a, b) {
    return source._ordering.indexOf(a.key) <= source._ordering.indexOf(b.key)
      ? 1
      : -1
  })

  const result = []
  for (const [key, { values, comments }] of ordered) {
    if (!Array.isArray(values) || values.some(s => typeof s !== 'string')) {
      return [null, new Error('Only string arrays can be used as values')]
    }
    for (const comment of comments) {
      result.push(`# ${comment}`)
    }
    result.push(`${normalizeFieldName(key)}: ${values.join(', ')}`)
  }
  return [result.join('\n') + '\n', null]
}

function parseAnalyticsTxt (content) {
  const normalized = {
    _ordering: []
  }

  let currentComments = []
  for (const [i, line] of content.split(/\r?\n/).entries()) {
    let parsed
    try {
      parsed = parseLine(line)
    } catch (e) {
      const err = new Error(
        `Unexpected error parsing line ${i + 1}: ${e.message}`
      )
      return [null, err]
    }
    const { error, isEmpty, comment, field, values } = parsed
    if (error) {
      const err = new Error(`Failed to parse line ${i + 1}: ${error.message}`)
      return [null, err]
    }
    if (isEmpty) {
      continue
    }
    if (comment) {
      currentComments.push(comment)
      continue
    }

    if (field in normalized) {
      const err = new Error(
        `Field "${field}" redefined on line ${i + 1}. Field names can only occur once.`
      )
      return [null, err]
    }
    normalized._ordering.push(field)
    normalized[field] = { values, comments: currentComments }
    currentComments = []
  }
  return [normalized, null]
}

function parseLine (line) {
  line = line.trim()

  const result = {
    error: null,
    field: null,
    values: null,
    comment: null,
    isEmpty: false
  }

  if (!line) {
    return {
      ...result,
      isEmpty: true
    }
  }

  if (/^#/.test(line)) {
    return {
      ...result,
      comment: line.replace(/^#\s+/, '')
    }
  }

  const [field, value] = line.split(':')
  if (!field || !value) {
    const error = new Error('No field name or value found.')
    return {
      ...result,
      error
    }
  }

  return {
    ...result,
    field: normalizeFieldName(field),
    values: splitValue(value)
  }
}

function normalizeFieldName (name) {
  return name
    .split('')
    .map((c, i) => i ? c : c.toUpperCase())
    .join('')
}

function splitValue (value) {
  return value.split(',').map(s => s.trim())
}
