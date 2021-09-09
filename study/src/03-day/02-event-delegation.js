/*
    <ul>
        <li>ES6 新特性</li>
        <li>前端工程化</li>
        <li>Vue源码分析</li>
    </ul>
*/

document.querySelectorAll('li').forEach(e => {
    e.onclick = function () {
        console.log('111')
    }
})

document.querySelector('ul').onclick = (ev) => {
    let ev = ev || window.event
    let target = ev.target || ev.srcElement
    if (target.nodeName.toLowerCase === 'li') {
        console.log(222)
    }
}