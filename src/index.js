/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */
// @ts-check

const Ajv = require('ajv')
const addFormats = require('ajv-formats')

const defaultVersion = exports.defaultVersion = 'draft-ring-analyticstxt-00'

/**
 * A field in an analytics.txt file.
 * @typedef {object} Field
 * @property {string[]} values
 * @property {string[]} comments
 */

/**
 * A list describing the ordering of keys in an analytics.txt file.
 * @typedef {string[]} Ordering
 */

/**
 * The object representation of an analytics.txt file.
 * @typedef {{ [key: string]: Field | Ordering }} ObjectForm
 */

exports.validate = validate
/**
 * Validates the given content of an analytics.txt file against the given schema
 * and return an error in case validation failed.
* @param {string} content
* @param {object} options
* @param {string=} options.draftName
* @returns {Error}
 */
function validate (content, { draftName = defaultVersion } = {}) {
  const [parsed, parsingError] = parseAnalyticsTxt(content)
  if (parsingError) {
    return parsingError
  }
  const validationError = validateWithSchema(parsed, draftName)
  return validationError
}

exports.parse = parse
/**
 * Parses the given contents of an analytics.txt file and returns its object
 * representation.
* @param {string} content
* @param {object} options
* @param {string=} options.draftName
* @param {boolean=} options.lax
* @returns {[ObjectForm, Error]}
 */
function parse (content, { draftName = defaultVersion, lax = false } = {}) {
  const [parsed, parsingError] = parseAnalyticsTxt(content)
  if (parsingError) {
    return [null, parsingError]
  }
  const validationError = lax ? null : validateWithSchema(parsed, draftName)
  return [parsed, validationError]
}

exports.serialize = serialize
/**
 * Serializes the object representation of an analytics.txt file and returns
 * its string representation.
* @param {string} source
* @param {object} options
* @param {string=} options.draftName
* @param {boolean=} options.lax
* @returns {[string, Error]}
 */
function serialize (source, { draftName = defaultVersion, lax = false } = {}) {
  const validationError = lax ? null : validateWithSchema(source, draftName)
  if (validationError) {
    return [null, validationError]
  }
  return serializeAnalyticsTxt(source)
}

/**
 * Validates the given object against the given schema.
* @param {object} parsed
* @param {string} draftName
 */
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

/**
 * Serializes the given object representation into text form.
 * @param {object} source
 * @returns {[string, Error]}
 */
function serializeAnalyticsTxt (source) {
  const result = []
  for (const key of source._ordering || Object.keys(source)) {
    const { values, comments } = source[key]
    if (!Array.isArray(values) || values.some(s => typeof s !== 'string')) {
      return [null, new Error('Only string arrays can be used as values')]
    }
    if (Array.isArray(comments)) {
      for (const comment of comments) {
        result.push(`# ${comment}`)
      }
    }
    result.push(`${normalizeFieldName(key)}: ${values.join(', ')}`)
  }
  return [result.join('\n') + '\n', null]
}

/**
 * Parses the given text content into object form line by line.
* @param {string} content
* @returns {[ObjectForm, Error]}
 */
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
    normalized[field] = { values }
    if (currentComments.length) {
      normalized[field].comments = currentComments
    }
    currentComments = []
  }
  return [normalized, null]
}

/**
 * The result of parsing a line.
 * @typedef {object} LineResult
 * @property {Error} error
 * @property {string} field
 * @property {string[]} values
 * @property {string} comment
 * @property {boolean} isEmpty
 */

/**
 * Parse a single line from an analytics.txt file
 * @param {string} line
 * @returns {LineResult}
 */
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

/**
 * Returns the given string in title case
 * @param {string} name
 */
function normalizeFieldName (name) {
  return name
    .split('')
    .map((c, i) => i ? c : c.toUpperCase())
    .join('')
}

/**
 * Splits a stringified list of values into a list of trimmed items
 * @param {string} value
 */
function splitValue (value) {
  return value.split(',').map(s => s.trim())
}
