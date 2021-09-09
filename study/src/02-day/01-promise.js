const promise = new Promise((resolve, reject) => {
    resolve(1001);
    // reject(new Error('promise rejected'));
})

promise.then((value) => {
    console.log('resolve', value)
}, (error) => {
    console.log('reject', error)
})