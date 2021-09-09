let once = (fn) => {
    let done = false
    return function () {
        if (!done) {
            done = true
            return fn.apply(fn, arguments)
        }
    }
}

let pay = once((money) => {
    console.log(`支付：${money} RMB`);
})

//只会支付一次
pay(5);
pay(5);