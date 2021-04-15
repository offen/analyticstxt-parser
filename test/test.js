const tape = require('tape')

const { validate } = require('./../src/index')

tape.test('valid: full definition', t => {
  const fixture = `
# analytics.txt file for www.analyticstxt.org
Author: Frederik Ring <hioffen@posteo.de>

Collects: url, referrer, device-type
Stores: first-party-cookies, local-storage
# Usage data is encrypted end-to-end
Uses: javascript
# Users can also delete their usage data only without opting out
Allows: opt-in, opt-out
# Data is retained for 6 months
Retains: P6M

# Optional fields
Honors: none
Tracks: sessions, users
Varies: none
Shares: per-user
Implements: gdpr
Deploys: offen
`
  const result = validate(fixture)
  t.equal(result, null)
  t.end()
})

tape.test('valid: empty', t => {
  const fixture = `
Author: Frederik Ring <hioffen@posteo.de>
Collects: none
`
  const result = validate(fixture)
  t.equal(result, null)
  t.end()
})

tape.test('invalid: parse error', t => {
  const fixture = `
{"json": "is cool"}
`
  const result = validate(fixture)
  t.notEqual(result, null)
  t.end()
})

tape.test('invalid: definition error', t => {
  const fixture = `
Author: Frederik Ring <hioffen@posteo.de>
Collects: url, referrer, device-type
Stores: first-party-cookies, local-storage
Uses: javascript
# none is not allowed as a value of many
Allows: opt-in, opt-out, none
Retains: P6M
Honors: none
Tracks: sessions, users
Varies: none
Shares: per-user
Implements: gdpr
Deploys: offen
`
  const result = validate(fixture)
  t.notEqual(result, null)
  t.end()
})
