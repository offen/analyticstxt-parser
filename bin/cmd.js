#!/usr/bin/env node

/**
 * Copyright 2021 - Offen Authors <hioffen@posteo.de>
 * SPDX-License-Identifier: MPL-2.0
 */

const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

const pkg = require('../package')
const { validate, defaultVersion } = require('..')

const [subcommand = 'help'] = argv._

;(async () => {
  switch (subcommand) {
    case 'help':
      return fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8')

    case 'validate': {
      const draftName = argv.d || argv.draft || defaultVersion
      const [, file] = argv._
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `validate`'
        )
      }

      if (!readFromStdin && !fs.existsSync(file)) {
        throw new Error(
          `File ${file} does not exist.`
        )
      }

      const fd = readFromStdin ? process.stdin.fd : file
      const content = fs.readFileSync(fd, 'utf-8')

      const validationError = validate(content, draftName)
      if (validationError) {
        throw validationError
      }

      const fileName = readFromStdin ? 'Pipe from stdin' : file
      return `${fileName} is a valid analytics.txt file as per ${draftName}.`
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
