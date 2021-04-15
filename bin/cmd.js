#!/usr/bin/env node

const fs = require('fs')

const { validate } = require('..')

const subcommand = process.argv[2]
const file = process.argv[3]

const draftName = 'draft-offen-analyticstxt-latest'

;(async () => {
  switch (subcommand) {
    case 'validate': {
      const content = fs.readFileSync(file !== '-' ? file : process.stdin.fd, 'utf-8')
      const err = validate(content)
      if (!err) {
        const fileName = file !== '-' ? file : 'Pipe from stdin'
        return `${fileName} is a valid analytics.txt file as per ${draftName}.`
      }
      throw err
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
