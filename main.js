

async function main() {
    const crawl = await import("./crawl.js")
    const { argv } = require('node:process')
    if (argv.length != 3) {
        throw Error("Unexpected no. of args")
    }
    baseURL = argv[2]
    console.log(`Starting crawler at ${baseURL}...`)
    await crawl.crawlPage(baseURL)

}

main()