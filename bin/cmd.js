#!/usr/bin/env node

/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const fs = require('fs')
const readline = require('readline')
const path = require('path')
const https = require('https')

const pkg = require('../package')
const { mustValidate, mustParse, mustSerialize, mustExplain, defaultVersion } = require('..')

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    draft: 'd',
    lax: 'l',
    force: 'f'
  },
  default: {
    lax: false,
    force: false,
    draft: defaultVersion
  }
})

const [subcommand = 'help'] = argv._

;(async () => {
  switch (subcommand) {
    case 'help':
      return fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8')

    case 'validate': {
      const [, file] = argv._
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `validate`. ' +
          'Use `-` to read from stdin'
        )
      }

      if (!readFromStdin && !fs.existsSync(file)) {
        throw new Error(
          `File ${file} does not exist.`
        )
      }

      const fd = readFromStdin ? process.stdin : file
      const content = await ingest(fd)

      mustValidate(content, { draftName: argv.draft })

      const fileName = readFromStdin ? 'Pipe from stdin' : file
      return `${fileName} is a valid analytics.txt file as per ${argv.draft}.`
    }

    case 'serialize': {
      const lax = argv.lax
      const force = argv.force

      const [, file, outfile] = argv._
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `serialize`. ' +
          'Use `-` to read from stdin.'
        )
      }

      if (!readFromStdin && !fs.existsSync(file)) {
        throw new Error(
          `File ${file} does not exist.`
        )
      }

      const fd = readFromStdin ? process.stdin : file
      const content = await ingest(fd)
      const parsed = JSON.parse(content)

      const result = mustSerialize(parsed, { draftName: argv.draft, lax })
      if (outfile) {
        if (fs.existsSync(outfile) && !force) {
          throw new Error(
            `${outfile} already exists. Pass --force to overwrite it.`
          )
        }
        fs.writeFileSync(outfile, result, 'utf-8')
        return `Content successfully written to ${outfile}.`
      }
      return result
    }

    case 'parse': {
      const lax = argv.lax
      const [, file] = argv._
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `parse`. ' +
          'Use `-` to read from stdin.'
        )
      }

      if (!readFromStdin && !fs.existsSync(file)) {
        throw new Error(
          `File ${file} does not exist.`
        )
      }

      const fd = readFromStdin ? process.stdin : file
      const content = await ingest(fd)

      const result = mustParse(content, { draftName: argv.draft, lax })
      return JSON.stringify(result, null, 2)
    }

    case 'explain': {
      const lax = argv.lax
      const [, file] = argv._
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `explain`. ' +
          'Use `-` to read from stdin.'
        )
      }

      if (!readFromStdin && !fs.existsSync(file)) {
        throw new Error(
          `File ${file} does not exist.`
        )
      }

      const fd = readFromStdin ? process.stdin : file
      const content = await ingest(fd)

      const result = mustExplain(content, { draftName: argv.draft, lax })
      return JSON.stringify(result, null, 2)
    }

    case 'drafts': {
      const result = [
        `Draft versions of analytics.txt known to ${pkg.name}@${pkg.version}:`,
        ''
      ]
      const files = fs.readdirSync(path.resolve(__dirname, '../schema'))
      for (const file of files) {
        if (!/\.json$/.test(file)) {
          continue
        }
        const draftName = file.replace(/\.json$/, '')
        const isDefault = draftName === defaultVersion
        result.push(
          `  - ${draftName}  ${isDefault ? '[default]' : ''}`
        )
      }

      return result.join('\n')
    }

    case 'draft': {
      if (!/draft-ring-analyticstxt-0[0-3]/.test(argv.draft)) {
        throw new Error(
          'Received malformed or unknown draft name, cannot continue. ' +
          'Check `drafts` for a list of available documents.'
        )
      }

      const url = `https://www.ietf.org/archive/id/${argv.draft}.txt`
      const content = await new Promise(function (resolve, reject) {
        https.get(url, function (res) {
          if (res.statusCode !== 200) {
            reject(new Error(`Server responded with status ${res.statusCode}`))
            return
          }
          let buf = ''
          res.on('data', chunk => { buf += chunk })
          res.on('end', () => resolve(buf))
        })
      })
      return content
    }

    case 'version':
      return pkg.version

    default:
      throw new Error(`${subcommand} is not a valid subcommand.`)
  }
})()
  .then(result => {
    console.log(result)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function ingest (input) {
  const fileStream = typeof input === 'string'
    ? fs.createReadStream(input)
    : input

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  const buf = []
  for await (const line of rl) {
    buf.push(line)
  }
  return buf.join('\n')
}
