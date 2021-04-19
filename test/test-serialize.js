/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const tape = require('tape')

const { serialize } = require('./../src/index')

tape.test('valid: full definition', t => {
  const fixture = {
    Author: [
      'Frederik Ring <hioffen@posteo.de>'
    ],
    Collects: [
      'url',
      'referrer',
      'device-type'
    ],
    Stores: [
      'first-party-cookies',
      'local-storage'
    ],
    Uses: [
      'javascript'
    ],
    Allows: [
      'opt-in',
      'opt-out'
    ],
    Retains: [
      'P6M'
    ],
    Honors: [
      'none'
    ],
    Tracks: [
      'sessions',
      'users'
    ],
    Varies: [
      'none'
    ],
    Shares: [
      'per-user'
    ],
    Implements: [
      'gdpr'
    ],
    Deploys: [
      'offen'
    ]
  }

  const [result, error] = serialize(fixture)
  t.equal(error, null)
  t.equal(result, `Author: Frederik Ring <hioffen@posteo.de>
Collects: url, referrer, device-type
Stores: first-party-cookies, local-storage
Uses: javascript
Allows: opt-in, opt-out
Retains: P6M
Honors: none
Tracks: sessions, users
Varies: none
Shares: per-user
Implements: gdpr
Deploys: offen
`)
  t.end()
})
