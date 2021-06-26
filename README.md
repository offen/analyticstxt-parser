# analyticstxt-parser

JSON schema based Node.js library and CLI tool to parse and validate [analytics.txt][] files.

[analytics.txt]: https://www.analyticstxt.org

---

## Installation

The package is published to npm:

```
npm i @offen/analyticstxt-parser -S
```

and provides a library and an `analyticstxt` CLI tool.

## Usage

### CLI Usage

For information on how to use the CLI, refer to the `help` subcommand:

```
analyticstxt help
```

### Usage as a library

The following functions are exported by this module.

#### `validate(content, { draftName? })`

Validate the given content of an analytics.txt file. Returns `null` in case validation passes or an error in case it fails. If no `draftName` is given, the default will be used (which is the latest published I-D).

```js
const fs = require('fs')

const { validate } = require('@offen/analyticstxt-parser')

const content = fs.readFileSync('./analytics.txt', 'utf-8')
const error = validate(content)
if (error) {
  // given file is not valid
}
```

This function is also available as the throwing version `mustValidate`.

#### `parse(content, { lax = false, draftName? })`

Parse the given content of an analytics.txt file into its JavaScript Object representation. Returns an Array `[result, error]` where either can be `null`. If `lax: true` is given, the result will not be validated against the latest schema (or the given `draftName`).

```js
const fs = require('fs')

const { parse } = require('@offen/analyticstxt-parser')

const content = fs.readFileSync('./analytics.txt', 'utf-8')
const [result, error] = parse(content)
if (error) {
  // handle error
}
// process result
```

This function is also available as the throwing version `mustParse`.

#### `serialize(source, { lax = false, draftName? })`

Serialize the given JavaScript Object representation into an analytics.txt file. Returns an Array `[result, error]` where either can be `null`. If `lax: true` is given, the source will not be validated against the latest schema (or the given `draftName`).

```js
const fs = require('fs')

const { serialize } = require('@offen/analyticstxt-parser')

const source = generateSourceSomehow()
const [result, error] = serialize(source)
if (error) {
  // handle error
}
fs.writeFileSync('./analytics.txt', result, 'utf-8')
```

This function is also available as the throwing version `mustSerialize`.

---

In addition to the three base methods, the JSON schema used for validating is exported as `schema`, its current draft name as `defaultVersion`.
