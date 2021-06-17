/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const tape = require('tape')

const { parse } = require('./../src/index')

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
  const [result, error] = parse(fixture)
  t.equal(error, null)
  t.deepEqual(result, {
    _ordering: [
      'Author', 'Collects', 'Stores', 'Uses', 'Allows', 'Retains', 'Honors',
      'Tracks', 'Varies', 'Shares', 'Implements', 'Deploys'
    ],
    Author: {
      comments: ['analytics.txt file for www.analyticstxt.org'],
      values: ['Frederik Ring <hioffen@posteo.de>']
    },
    Collects: {
      values: ['url', 'referrer', 'device-type']
    },
    Stores: {
      values: ['first-party-cookies', 'local-storage']
    },
    Uses: {
      comments: ['Usage data is encrypted end-to-end'],
      values: ['javascript']
    },
    Allows: {
      comments: ['Users can also delete their usage data only without opting out'],
      values: ['opt-in', 'opt-out']
    },
    Retains: {
      comments: ['Data is retained for 6 months'],
      values: ['P6M']
    },
    Honors: {
      comments: ['Optional fields'],
      values: ['none']
    },
    Tracks: {
      values: ['sessions', 'users']
    },
    Varies: {
      values: ['none']
    },
    Shares: {
      values: ['per-user']
    },
    Implements: {
      values: ['gdpr']
    },
    Deploys: {
      values: ['offen']
    }
  })
  t.end()
})

tape.test('invalid: parse error', t => {
  const fixture = `
{
  "json": "is cool"
}
`
  const [result, error] = parse(fixture)
  t.notEqual(error, null)
  t.equal(result, null)
  t.end()
})

tape.test('invalid: schema error', t => {
  const fixture = `
Author: Frederik Ring <hioffen@posteo.de>
Collects: ducklings
`
  const [result, error] = parse(fixture)
  t.notEqual(error, null)
  t.notEqual(result, null)
  t.end()
})

tape.test('valid: schema error with lax option', t => {
  const fixture = `
Author: Frederik Ring <hioffen@posteo.de>
Collects: ducklings
`
  const [result, error] = parse(fixture, { lax: true })
  t.equal(error, null)
  t.deepEqual(result, {
    _ordering: ['Author', 'Collects'],
    Author: {
      values: ['Frederik Ring <hioffen@posteo.de>']
    },
    Collects: {
      values: ['ducklings']
    }
  })
  t.end()
})
