const fs = require('fs');
const path = require('path')
// const mkdirp = require('mkdirp')
let gen = '../wwwroot'
let map = fs.readdirSync(path.resolve(__dirname, gen))

console.log('map', map)

// let res = map.filter(item => {
//     return fs.statSync(path.resolve(__dirname, gen + item)).isDirectory()
// })

let res = []

let deepDir = (dir)=>{
    let list = fs.readdirSync(path.resolve(__dirname, dir))
    list.forEach(item=>{
        if(fs.statSync(path.resolve(__dirname, dir +'/'+ item)).isDirectory()){
            res.push(item)
            deepDir(dir +'/'+ item)
        }
    })
}

deepDir(gen)
// mkdirp('./wwwroot/a/b/c/d').then(res=>console.log('res',res))

console.log('res', res)