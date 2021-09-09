window.addEventListener('unhandledrejection', event => {
    const { reason, promise } = event
    console.log(reason, promise)
    event.preventDefault()
}, false)

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason, promise)
    // reason => Promise 失败原因，一般是一个错误对象
    // promise => 出现异常的 Promise 对象
})

