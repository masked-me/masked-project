const fs = require('fs');


async function isDir(path, data) {
    return new Promise((resolve, reject) => {
        path = path + '/' + data
        fs.stat(path, async (err, stats) => {
            if (err) {
                console.log('err', err)
                reject(err)
            }
            if (stats.isDirectory()) {
                await main(path)
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}
let resArray = []
async function main(path = './wwwroot') {
    return new Promise((resolve, reject) => {
        fs.readdir(path, async (err, files) => {
            if (err) {
                console.log('err', err)
                reject(err)
            }

            for (let i = 0; i < files.length; i++) {
                if (await isDir(path, files[i])) {
                    resArray.push(files[i])
                }
            }
            resolve(resArray)
        })
    })
}

main().then(res => console.log('40', res))