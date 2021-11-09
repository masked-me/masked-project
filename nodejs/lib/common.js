const path = require('path')
const mimeType = require('./mime.json')


exports.getMimeType = function (filePath) {
    let ext = path.extname(filePath).split('.').pop().toLowerCase();
    if (!ext) {
        return mimeType['.txt']
    }

    return mimeType['.' + ext] || mimeType['.txt']
}
