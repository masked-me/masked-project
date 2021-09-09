import { ajax } from './02-ajax.js'

async function main() {
    try {
        const p1 = await ajax('/api/ports.json')
        console.log(p1, 2)
        const p2 = await ajax('/api/urls.json')
        console.log(p2, 3)
        return 'something'
    } catch (error) {
        console.log(error)
    }
}

main().then(res => {
    console.log(res, 'all completed')
})