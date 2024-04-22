const {JSDOM} = require('jsdom')

const normalizeURL = function (urlString) {

    const myURL = new URL(urlString)
    let normalURL = myURL.host + myURL.pathname
    if (normalURL.at(-1) == "/"){
        normalURL = normalURL.slice(0, -1)
    }
    if (normalURL.slice(0,4) == "www."){
        normalURL = normalURL.slice(4)
    }
    return normalURL
}

const getURLsFromHTML = function (htmlBody, baseURL) {
    const page = new JSDOM(htmlBody)
    const links = []
    const elements = page.window.document.querySelectorAll("a")

    if (baseURL.slice(-1) == "/") {
        baseURL = baseURL.slice(0, -1)
    }

    for (let item of elements) {
        if (item.href.slice(0, 1) == "/") {
            links.push(new URL(baseURL + item.href))
        } else {
            links.push(new URL(item.href))
        }
    }

    return links

}

const crawlPage = async function (currentURL) {
    const currentPage = await (await fetch(currentURL))
    if (currentPage.status >= 400) {
        console.log("ERROR: Website is not accessible at this time")
        return
    } else if (!currentPage.headers.get('content-type').includes("text/html")) {
        console.log(currentPage)
        console.log("ERROR: content-type is not text/html. content-type: " + currentPage.headers.get('content-type'))
        return
    }
    currentPageDOM = await JSDOM.fromURL(currentURL)

    console.log(await currentPage.text())
}



module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}