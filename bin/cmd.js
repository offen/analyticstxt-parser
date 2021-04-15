#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

const pkg = require('../package')
const { validate, defaultVersion } = require('..')

const subcommand = argv._[0] || 'help'

;(async () => {
  switch (subcommand) {
    case 'help': {
      return fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8')
    }

    case 'validate': {
      const draftName = argv.d || 'draft-offen-analyticstxt-latest'
      const file = argv._[1]
      const readFromStdin = file === '-'
      if (!file) {
        throw new Error(
          'Passing a file is required when using `validate`'
        )
      }
      const content = fs.readFileSync(
        readFromStdin ? process.stdin.fd : file, 'utf-8'
      )
      const err = validate(content, draftName)
      if (!err) {
        const fileName = readFromStdin ? 'Pipe from stdin' : file
        return `${fileName} is a valid analytics.txt file as per ${draftName}.`
      }
      throw err
    }

    case 'drafts': {
      const result = [
        `Versions of analytics.txt known to this tool at version ${pkg.version}:`,
        ''
      ]
      const files = await fs.promises.readdir(path.resolve(__dirname, '../schema'))
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
    console.error('Failed running command.')
    console.error(err)
  })
