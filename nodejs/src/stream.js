const fs = require('fs')

const readStream = fs.createReadStream('../api/xxx.png')
const writeSteam = fs.createWriteStream('./xxx.png')

readStream.pipe(writeSteam)