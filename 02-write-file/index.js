const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { stdin: input, stdout: output } = process;

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readLine = createInterface(input, output);

readLine.question('Hi! Enter some text, please!\n', answer => stream.write(`${answer}\n`));
readLine
    .on('line', text => text.trim() === 'exit' ? readLine.close() : stream.write(`${text}\n`))
    .on('close', () => console.log('See you later!\n'));