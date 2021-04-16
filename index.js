/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const { validate, defaultVersion, parse } = require('./src')

exports.validate = validate
exports.parse = parse
exports.defaultVersion = defaultVersion
exports.schema = require(`./schema/${defaultVersion}`)
