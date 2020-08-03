const nearley = require('nearley')
const grammar = require('./mypl.js')
const fs = require('mz/fs')
const path = require('path')


async function main() {

  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
  const filename = process.argv[2]
  const outputFilename = path.basename(filename, '.mypl') + ".ast"
  const code = (await fs.readFile(filename)).toString()
  
  try {
    parser.feed(code)
    const ast = parser.results[0]
    await fs.writeFile(outputFilename, JSON.stringify(ast, null, 2))
    console.log('parser succeded')
    console.log('wrote ', outputFilename)
  } catch (error) {
    console.log('parser failed : ', error.message)
  }

}

main()