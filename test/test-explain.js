/**
 * Copyright 2022 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const tape = require('tape')

const { explain } = require('./../src/index')

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
Retains: 365 days

# Optional fields
Honors: none
Tracks: sessions, users
Varies: none
Shares: per-user
Implements: gdpr
Deploys: offen
`
  const [result, error] = explain(fixture)
  t.equal(error, null)
  t.ok(result)
  t.end()
})

tape.test('invalid: parse error', t => {
  const fixture = `
{
  "json": "is cool"
}
`
  const [result, error] = explain(fixture)
  t.notEqual(error, null)
  t.equal(result, null)
  t.end()
})
