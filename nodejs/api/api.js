function formatApi(api) {
    return 'www.http.com' + api
}

console.log('require.main === module api', require.main === module)


module.exports = {
    formatApi
}
