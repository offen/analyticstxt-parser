/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const Ajv = require('ajv')
const addFormats = require('ajv-formats')

const defaultVersion = exports.defaultVersion = 'draft-offen-analyticstxt-latest'

exports.validate = validate
function validate (content, draftName = defaultVersion) {
  let validationError
  try {
    ([, validationError] = parseAndValidateWithSchema(content, draftName))
  } catch (parsingError) {
    return parsingError
  }
  return validationError
}

exports.parse = parse
function parse (content, { draftName = defaultVersion, lax = false } = {}) {
  let validationError
  let parsed
  try {
    ([parsed, validationError] = parseAndValidateWithSchema(content, draftName))
  } catch (parsingError) {
    return [null, parsingError]
  }
  return [parsed, lax ? null : validationError]
}

function parseAndValidateWithSchema (content, draftName) {
  let schema
  try {
    schema = require(`./../schema/${draftName}`)
  } catch (err) {
    throw new Error(`Schema for ${draftName} is unknown.`)
  }

  const parsed = parseAnalyticsTxt(content)

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
  return [parsed, validationError]
}

function parseAnalyticsTxt (lines) {
  const normalized = {}
  for (const [i, line] of lines.split(/\r?\n/).entries()) {
    let parsed
    try {
      parsed = parseLine(line)
    } catch (e) {
      const err = new Error(`Unexpected error parsing line ${i + 1}: ${e.message}`)
      throw err
    }
    const { error, isCommentOrEmpty, field, values } = parsed
    if (error) {
      const err = new Error(`Failed to parse line ${i + 1}: ${error.message}`)
      throw err
    }
    if (isCommentOrEmpty) {
      continue
    }
    if (field in normalized) {
      const err = new Error(
        `Field "${field}" redefined on line ${i + 1}. Field names can only occur once.`
      )
      throw err
    }
    normalized[field] = values
  }
  return normalized
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

  const [field, value] = line.trim().split(':')
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
