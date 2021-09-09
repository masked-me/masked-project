export const ajax = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'json'
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusTexts))
            }
        }
        xhr.send()
    })
}
//url：根目录的相对路径
ajax('src/day-02/users.json').then(res => {
    return ajax(res.users[0].url)
}).catch(err => {
    console.log(err)
    return '2'
}).then(res => {
    // console.log('res', res)
})


