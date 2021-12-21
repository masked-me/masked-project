const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const sd = require('silly-datetime')

const tools = {
    multer() {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                let day = sd.format(new Date, 'YYYYMMDD')
                uploadPath = path.resolve(__dirname, '../public/assets/excel/')
                cb(null, uploadPath)
            },
            filename: (req, file, cb) => {
                cb(null, '示例接口说明书.doc')
            }
        })

        const upload = multer({ storage: storage })

        return upload;
    }
}


module.exports = tools;