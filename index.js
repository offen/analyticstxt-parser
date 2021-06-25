/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const { validate, parse, serialize } = require('./src')
const schemas = require('./schema')

module.exports = {
  validate: validate,
  mustValidate: throwingOnError(validate),
  parse: parse,
  mustParse: throwingOnError(parse),
  serialize: serialize,
  mustSerialize: throwingOnError(serialize),
  defaultVersion: schemas.defaultVersion,
  schema: schemas[schemas.defaultVersion]
}

/**
 * Wraps an error returning function (either a single value or a result/error
 * tuple) and returns a function of the same signature that will throw on error
 * instead.
 * @param {function} baseFn
 * @returns {function}
 */
function throwingOnError (baseFn) {
  return function () {
    const result = baseFn.apply(null, arguments)
    if (Array.isArray(result)) {
      if (result[1]) {
        throw result[1]
      }
      return result[0]
    }
    if (result) {
      throw result
    }
  }
}
