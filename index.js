/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const { validate, parse, serialize } = require('./src')
const schemas = require('./schema')

module.exports = {
  validate: validate,
  parse: parse,
  serialize: serialize,
  defaultVersion: schemas.defaultVersion,
  schema: schemas[schemas.defaultVersion]
}
