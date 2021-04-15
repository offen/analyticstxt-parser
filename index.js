const { validate } = require('./src')
const schema = require('./schema/draft-offen-analyticstxt-latest')

exports.validate = validate
exports.schema = schema
