import { ajax } from './02-ajax.js'

function* main() {
    const ports = yield ajax('/api/ports.json');
    console.log(ports)
    const urls = yield ajax('/api/urls.json')
    console.log(urls)
}

function co(generator) {
    const g = generator()
    const result = g.next()
    function handleRsult(result) {
        if (result.done) return
        result.value.then(data => {
            handleRsult(g.next(data))
        })
    }
    handleRsult(result)
}
co(main)