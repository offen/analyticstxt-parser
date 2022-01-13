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
collection of usage data.
`)
  return result.toString()
}

function renderCollects (Collects) {
  const result = new Block('Collects')
  result.push('On a visit, the site collects the following data about your visit:')
  result.push('- x')
  result.push('- y')
  result.push('- z')
  return result.toString()
}

function renderStores (Stores) {
  const result = new Block('Stores')
  result.push('Some text explaining Stores')
  return result.toString()
}

function renderUses (Uses) {
  const result = new Block('Uses')
  result.push('Some text explaining Uses')
  return result.toString()
}

function renderAllows (Allows) {
  const result = new Block('Allows')
  result.push('Some text explaining Allows')
  return result.toString()
}

function renderRetains () {
  const result = new Block('Retains')
  result.push('Some text explaining Retains')
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
    result.push.apply(result, [].slice.call(arguments))
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
