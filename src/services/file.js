const fs = require('fs');
const path = require('path');
const  fileName = 'logs.txt'
let filePath = path.join(__dirname, '..', 'utils', fileName);


async function addLogs(data) {
    let message = '';
    if (data.operation == 'User Created') {
        message = `${data.to} ${data.message} ${data.from} on ${data.timestamp} \n`
    } else if (data.operation == 'User Deleted') {
        message = `${data.to} ${data.message} ${data.from} on ${data.timestamp} \n`
    } else if (data.operation == 'Feed Deleted') {
        message = `${data.to} ${data.message} ${data.from} on ${data.timestamp} \n`
    }

    fs.appendFile(filePath, message, (err) => {
        if (err) { console.log('error while writing data to the file ') }
        console.log('The file has been saved!');
    });
}

module.exports = { addLogs }