const nearley = require('nearley')
const grammar = require('./mypl.js')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

try {
  parser.feed('as:=12.89')
  console.log('parser succeded : ', parser.results)
} catch (error) {
  console.log('parser failed : ', error.message)
}