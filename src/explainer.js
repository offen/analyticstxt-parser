module.exports = function (data) {
  const {
    Author,
    Collects,
    Stores,
    Uses,
    Allows,
    Retains
  } = data

  const result = new Result()
  result.push(renderIntro(Author))
  result.push(renderCollects(Collects))
  result.push(renderStores(Stores))
  result.push(renderUses(Uses))
  result.push(renderAllows(Allows))
  result.push(renderRetains(Retains))
  return result.toString()
}

function renderIntro (Author) {
  const result = new Block()
  result.paragraph(`
The following is a short summary about an analytics.txt file authored
by ${Author.values[0]}, focusing on the user-facing consequences of the
collection of usage data. Website operators collect usage data to measure
user engagement with their sites and services, identify possible issues and
improve user experience. The degree to which this affects users' privacy can
vary drastically.
`)
  return result.toString()
}

function renderCollects (Collects) {
  const result = new Block('Collects')
  const { values } = Collects
  if (!values.length || values[0] === 'none') {
    result.push('No usage data is being collected when visiting this site.')
    return result.toString()
  }

  result.push('On a visit, the site collects the following data about your visit:')
  const items = {
    url: 'The URL of the page you are visiting. In almost all cases, this will also include a timestamp.',
    'ip-address': 'The IP address you are currently using. This might be shared with other users that are on the same network as you.',
    'geo-location': 'Your geographic location. Depending on the technology used for collecting this information, the resolution might be as low as on country level or very detailed.',
    'user-agent': 'The User Agent string which discloses information about the browser and the operating system you are using.',
    fingerprint: 'A fingerprint is a combination of multiple charactersistics of the device you are using. This can be used to uniquely identify the device without having to use client-side storage like cookies.',
    'device-type': 'The type of your device, i.e. whether it is a mobile device, a tablet or a desktop device. The used buckets will be specific to the tool used.',
    referrer: 'In case you are visiting the site by referral from another site, the source of the referral is being collected.',
    'visit-duration': 'The time spent on the website.',
    'custom-events': 'Custom events are recorded on certain actions, e.g. when you subscribe to a newsletter or similar.',
    'session-recording': 'Your session on this site is recorded in its entirety. This includes scrolling, mouse movement and any other interaction with the site.'
  }
  for (const value of values) {
    result.push(`- ${items[value]}`)
  }
  return result.toString()
}

function renderStores (Stores) {
  const result = new Block('Stores')
  const { values } = Stores
  if (!values.length || values[0] === 'none') {
    return null
  }
  result.push('On a visit, the site stores the following on your device in order to collect usage data:')
  const items = {
    'first-party-cookies': 'The site is using first party cookies. This can be used to reidentify you on subsequent visits to this site. Cookies usually expire at some point in time or are refreshed on a susbsequent visit. Your browser allows you to delete cookies at any time.',
    'third-party-cookies': 'The site is using third party cookies. This can be used to reidentify you on other websites and connect your usage patterns. Third party cookies are blocked by default in many modern browsers.',
    'local-storage': 'Local Storage is used. This can be used to reidentify you on susbsequent visits to this site, or to temporarily store other data.',
    cache: 'The default caching behavior of your browser is used to uniquely identify your device. This can be used to reidentify you across multiple websites.'
  }
  for (const value of values) {
    result.push(`- ${items[value]}`)
  }

  return result.toString()
}

function renderUses (Uses) {
  const result = new Block('Uses')
  const { values } = Uses
  if (!values.length || values[0] === 'none') {
    return null
  }
  result.push('The following technologies are used to collect data about your visit:')
  const items = {
    javascript: 'The site is using a client side script running on your device to collect data. This allows for collecting a broad range of information about your device and usage patterns.',
    pixel: 'The site is using a so-called "tracking pixel" to collect data. This delivers a limited set of data but is very robust and difficult to block.',
    'server-side': 'The site is using server-side technology (e.g. server logs) to collect usage data. The set of data is limited, however this technology cannot be blocked by clients in any way.',
    other: 'The site is using other means of collecting usage data. You can check the comments of the analytics.txt file for further information.'

  }
  for (const value of values) {
    result.push(`- ${items[value]}`)
  }
  return result.toString()
}

function renderAllows (Allows) {
  const result = new Block('Allows')

  const { values } = Allows
  if (!values.length) {
    return null
  }

  if (values[0] === 'none') {
    result.push('The site does not allow you to opt-in or opt-out of data collection. It will try to collect data no matter your preferences.')
    return result.toString()
  }

  result.push('The site allows for the following actions regarding your consent decision:')
  const items = {
    'opt-in': 'The site does not collect usage data before you actively give consent.',
    'opt-out': 'The site allows you to opt out of data collection at any time.'
  }
  for (const value of values) {
    result.push(`- ${items[value]}`)
  }
  return result.toString()
}

function renderRetains (Retains) {
  const result = new Block('Retains')
  const { values: [retention] } = Retains
  if (!retention) {
    return null
  }

  if (retention === 'perpetual') {
    result.push('The site is retaining usage data with no set limit.')
    return result.toString()
  }

  const [days] = retention.match(/^\d+/)

  result.push(`The site is retaining the collected usage data for ${days} days and deleted afterwards.`)
  return result.toString()
}

function Block (title) {
  const result = new Result()
  this.push = result.push.bind(result)
  this.paragraph = result.paragraph.bind(result)

  this.toString = function () {
    const withHeadline = new Result()
    if (title) {
      withHeadline.push(`## ${title}`)
      withHeadline.push('\n')
    }
    withHeadline.push(result.toString())
    return withHeadline.toString() + '\n'
  }
}

function Result () {
  const result = []
  this.push = function () {
    result.push.apply(result, [].slice.call(arguments).filter(Boolean))
  }

  this.paragraph = function (str) {
    this.push(str.split('\n').join(' '))
  }

  this.toString = function () {
    return result
      .map(r => r.trimStart())
      .join('\n')
  }
}
