/**
 * Copyright 2022 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = function (data, format = formatMarkdown) {
  const {
    Author = { values: [] },
    Collects = { values: [] },
    Stores = { values: [] },
    Uses = { values: [] },
    Allows = { values: [] },
    Retains = { values: [] }
  } = data

  const result = []
  result.push(renderIntro(Author))
  result.push(renderCollects(Collects))
  result.push(renderStores(Stores))
  result.push(renderUses(Uses))
  result.push(renderAllows(Allows))
  result.push(renderRetains(Retains))
  return format(result.filter(Boolean))
}

function renderIntro (Author) {
  return {
    headline: null,
    body: [
      'Website operators collect usage data to measure user engagement with their sites and services, identify possible issues and improve user experience. The degree to which this affects users\' privacy can vary drastically.',
      `The following is a short summary about an analytics.txt file authored by ${Author.values[0]}, focusing on the user-facing consequences of the collection of usage data for a specific website or service.`
    ]
  }
}

function renderCollects (Collects) {
  const { values } = Collects
  if (!values.length || values[0] === 'none') {
    return {
      headline: 'Collects',
      body: ['No usage data is being collected when visiting this site.']
    }
  }

  const applicableItems = []
  const items = {
    url: 'The URL of the page you are visiting. In almost all cases, this will also include a timestamp.',
    'ip-address': 'The IP address you are currently using. It can be used for reidentification without storing any data on your system. This address might be shared with other users that are on the same network as you.',
    'geo-location': 'Your geographic location. Depending on the technology used for collecting this information, the resolution might be as low as on country level or very detailed (e.g. the city).',
    'user-agent': 'The User-Agent string, which discloses information about the browser and the operating system you are using.',
    fingerprint: 'A "fingerprint" is a combination of multiple charactersistics of the device you are using. By recreating this fingerprint on each visit, it can be used to uniquely identify the device without having to use client-side storage like cookies.',
    'device-type': 'The type of your device, i.e. whether it is a mobile device, a tablet or a desktop device. The exact classification of devices will be specific to the tool used.',
    referrer: 'In case you are visiting the site by referral from another site, the source of the referral is being collected.',
    'visit-duration': 'The time spent on the website.',
    'custom-events': 'Custom events are recorded on certain, site specific user actions, e.g. when you subscribe to a newsletter or similar.',
    'session-recording': 'Your session on the site is recorded in its entirety. This includes scrolling, mouse movement and any other interaction with the site.'
  }
  for (const value of values) {
    applicableItems.push(items[value])
  }
  return {
    headline: 'Collects',
    body: [
      'On a visit, the site collects the following data:',
      applicableItems
    ]
  }
}

function renderStores (Stores) {
  const { values } = Stores
  if (!values.length || values[0] === 'none') {
    return null
  }

  const applicableItems = []
  const items = {
    'first-party-cookies': 'The site is using first party cookies. This can be used to reidentify you on subsequent visits. Cookies usually either expire at some point in time or are refreshed on a susbsequent visit. Your browser allows you to block or delete cookies at any time.',
    'third-party-cookies': 'The site is using third party cookies. This can be used to reidentify you on other websites and connect your usage patterns. Third party cookies are blocked by default in many modern browsers.',
    'local-storage': 'Local Storage is used. This can be used to reidentify you on susbsequent visits to this site, or to temporarily or permanently store other data.',
    cache: 'The default caching behavior of your browser is used to uniquely identify your device. This can be used to reidentify you across multiple websites.'
  }
  for (const value of values) {
    applicableItems.push(items[value])
  }

  return {
    headline: 'Stores',
    body: [
      'On a visit, the site stores the following on your device in order to collect usage data:',
      applicableItems
    ]
  }
}

function renderUses (Uses) {
  const { values } = Uses
  if (!values.length || values[0] === 'none') {
    return null
  }

  const applicableItems = []
  const items = {
    javascript: 'The site is using a client side script running on your device to collect data. Theoretically, this allows for collecting a broad range of information about your device and usage patterns. The "Collects" section contains further information about what exactly is being collected.',
    pixel: 'The site is using a so-called "tracking pixel" to collect data. This delivers a limited set of data but is very robust and more difficult to block.',
    'server-side': 'The site is using server-side technology (e.g. server logs) to collect usage data. The set of data is limited, however this technology cannot be blocked by clients in any way.',
    other: 'The site is using other means of collecting usage data. You can check the comments of the analytics.txt file for further information.'

  }
  for (const value of values) {
    applicableItems.push(items[value])
  }
  return {
    headline: 'Uses',
    body: [
      'The following technologies are used to collect data about your visit:',
      applicableItems
    ]
  }
}

function renderAllows (Allows) {
  const { values } = Allows
  if (!values.length) {
    return null
  }

  if (values[0] === 'none') {
    return {
      headline: 'Allows',
      body: [
        'The site does not allow you to opt-in or opt-out of data collection. It will try to collect data no matter your preferences.'
      ]
    }
  }

  const applicableItems = []
  const items = {
    'opt-in': 'The site allows you to opt in to the collection of usage data. No usage data is collected before you have actively given consent.',
    'opt-out': 'The site allows you to opt out of data collection at any time.'
  }
  for (const value of values) {
    applicableItems.push(items[value])
  }
  return {
    headline: 'Allows',
    body: [
      'The site allows for the following actions regarding your consent decision:',
      applicableItems
    ]
  }
}

function renderRetains (Retains) {
  const { values: [retention] } = Retains
  if (!retention) {
    return null
  }

  if (retention === 'perpetual') {
    return {
      headline: 'Retains',
      body: [
        'The site is retaining usage data with no set limit.'
      ]
    }
  }

  const [days] = retention.match(/^\d+/)

  return {
    headline: 'Retains',
    body: [
      `The site is retaining the collected usage data for ${days} days and deleted afterwards.`
    ]
  }
}

function formatMarkdown (data) {
  const result = []
  for (const block of data) {
    if (block.headline) {
      result.push(`## ${block.headline}`)
      result.push('')
    }
    for (const element of block.body) {
      if (Array.isArray(element)) {
        for (const li of element) {
          result.push(`- ${li}`)
        }
      } else {
        result.push(element)
      }
    }
    result.push('')
  }
  return result.join('\n')
}
