const fs = require('mz/fs')
const path = require('path')


async function main() {
  const filename = process.argv[2]
  const outputFilename = path.basename(filename, '.ast') + ".js"
  const contents = (await fs.readFile(filename)).toString()
  const ast = JSON.parse(contents)
  const jsCode = generateJs(ast, [])
  await fs.writeFile(outputFilename, jsCode)
  console.log('wrote ', outputFilename)
}

function generateJs(statements, declaredVariables) {
  const lines = []
  for (const statement of statements) {
    if (statement.type == 'var_assignment') {
      const value = generateJsForExpression(statement.value, declaredVariables)
      if (declaredVariables.indexOf(statement.varname) === -1) {
        lines.push(`let ${statement.varname} = ${value}`)
        declaredVariables.push(statement.varname)
      } else {
        lines.push(`${statement.varname} = ${value}`)
      }
    } else if (statement.type == 'print_statement') {
      const expression = generateJsForExpression(statement.expression, declaredVariables)
      lines.push(`console.log(${expression})`)
    } else if (statement.type == 'while_loop') {
      const condition = generateJsForExpression(statement.condition, declaredVariables)
      const body = generateJs(statement.body, declaredVariables)
        .split('\n')
        .map(line => ' ' + line)
        .join('\n')
      lines.push(`while (${condition}) {\n${body}\n}`)
    }
  }

  return lines.join('\n')
}

function generateJsForExpression(expression, declaredVariables) {
  if (typeof expression === 'object'){
    if (expression.type === 'binary_expression') {
      const left = generateJsForExpression(expression.left, declaredVariables)
      const right = generateJsForExpression(expression.right, declaredVariables)
      const operator = expression.operator
      return `${left} ${operator} ${right}`
    } 
  } else {
    return expression
  }
}

main()