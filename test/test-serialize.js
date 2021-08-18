/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const tape = require('tape')

const { serialize } = require('./../src/index')

tape.test('valid: full definition', t => {
  const fixture = {
    _ordering: [
      'Author',
      'Collects',
      'Stores',
      'Uses',
      'Allows',
      'Retains',
      'Honors',
      'Tracks',
      'Varies',
      'Shares',
      'Implements',
      'Deploys'
    ],
    Author: {
      values: [
        'Frederik Ring <hioffen@posteo.de>'
      ],
      comments: [
        'analytics.txt file for www.analyticstxt.org'
      ]
    },
    Collects: {
      values: [
        'url',
        'referrer',
        'device-type'
      ]
    },
    Stores: {
      values: [
        'first-party-cookies',
        'local-storage'
      ]
    },
    Uses: {
      values: [
        'javascript'
      ],
      comments: [
        'Usage data is encrypted end-to-end'
      ]
    },
    Allows: {
      values: [
        'opt-in',
        'opt-out'
      ],
      comments: [
        'Users can also delete their usage data only without opting out'
      ]
    },
    Retains: {
      values: [
        '100 days'
      ],
      comments: [
        'Data is retained for 6 months'
      ]
    },
    Honors: {
      values: [
        'none'
      ],
      comments: [
        'Optional fields'
      ]
    },
    Tracks: {
      values: [
        'sessions',
        'users'
      ]
    },
    Varies: {
      values: [
        'none'
      ]
    },
    Shares: {
      values: [
        'per-user'
      ]
    },
    Implements: {
      values: [
        'gdpr'
      ]
    },
    Deploys: {
      values: [
        'offen'
      ]
    }
  }
  const [result, error] = serialize(fixture)
  t.equal(error, null)
  t.equal(result, `# analytics.txt file for www.analyticstxt.org
Author: Frederik Ring <hioffen@posteo.de>
Collects: url, referrer, device-type
Stores: first-party-cookies, local-storage
# Usage data is encrypted end-to-end
Uses: javascript
# Users can also delete their usage data only without opting out
Allows: opt-in, opt-out
# Data is retained for 6 months
Retains: 100 days
# Optional fields
Honors: none
Tracks: sessions, users
Varies: none
Shares: per-user
Implements: gdpr
Deploys: offen
`)
  t.end()
})
