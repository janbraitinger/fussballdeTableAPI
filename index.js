const fs = require('fs');
const path = require('path');
const util = require('util');
const log_file = path.join(__dirname, 'console.log');


const log_stdout = process.stdout;
const log_file_stream = fs.createWriteStream(log_file, { flags: 'a' });


console.log = function () {
  log_file_stream.write(util.format.apply(null, arguments) + '\n');
  log_stdout.write(util.format.apply(null, arguments) + '\n');
};

console.error = console.log; 


const express = require('express');
const cors = require('cors');
const logTimestamp = require('log-timestamp');

function getTimestamp() {
  const date = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return `[${date}]`;
}

logTimestamp(() => getTimestamp());
const route = require('./routes/standardRoutes');
const app = express();


const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use('/', route)
app.set('trust proxy', true);


app.listen(PORT, () => {
    console.log('Server started on port 3001');
});