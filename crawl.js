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
    const currentPage = await fetch(currentURL)
    if (currentPage.status >= 400) {
        console.log("ERROR: Website is not accessible at this time")
        return
    } else if (!currentPage.headers.get('content-type').includes("text/html")) {
        console.log("ERROR: content-type is not text/html. content-type: " + currentPage.headers.get('content-type'))
        return
    }

    console.log(await currentPage.text())
}

const crawlPageR = async function(currentURL, baseURL, pages) {
    console.log("checking that this URL is part of the base url: " + currentURL)
    const currentURLNormal = normalizeURL(currentURL)
    if (normalizeURL(baseURL) != currentURLNormal.split("/")[0]) {
        console.log("It's not.")
        return pages
    }
    if (Object.hasOwn(pages, normalizeURL(currentURL))) {
        console.log("It is, but we already checked it!")
        pages[currentURLNormal]++
        return pages
    }
    
    pages[currentURLNormal] = 1
    const currentPage = await fetch(currentURL)

    if (currentPage.status >= 400) {
        console.log("ERROR: Website is not accessible at this time")
        return
    } else if (!currentPage.headers.get('content-type').includes("text/html")) {
        console.log("ERROR: content-type is not text/html. content-type: " + currentPage.headers.get('content-type'))
        return
    }

    console.log("Crawling page: " + currentURL + "...")
    const pageLinks = getURLsFromHTML(await currentPage.text(), baseURL)
    for (const link of pageLinks) {
        await crawlPageR(link, baseURL, pages)
    }
    return pages
}

const printReport = function (pageObj) {
    console.log("REPORT:")
    const pagesUnsorted = Object.entries(pageObj)
    const pagesSorted = pagesUnsorted.sort((a, b) => b[1]-a[1])
    for (let item of pagesSorted) {
        console.log(`There are ${item[1]} internal links to ${item[0]}`)
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPageR,
    printReport
}