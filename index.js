const { validate, defaultVersion } = require('./src')
const schema = require('./schema/draft-offen-analyticstxt-latest')

exports.validate = validate
exports.defaultVersion = defaultVersion
exports.schema = schema
