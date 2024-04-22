const { test, expect } = require('@jest/globals')
const { 
    normalizeURL,
    getURLsFromHTML } = require('./crawl.js')

test('removes \'http://\' from urls', () => {
    expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path')
})

test('removes \'https://\' from urls', () => {
    expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path')
})

test('removes trailing forward slash from urls', () => {
    expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
})

test('removes www. from urls, when it immediately follows \'http://\'', () => {
    expect(normalizeURL('http://www.blog.boot.dev')).toBe('blog.boot.dev')
})

test('removes www. from urls, when it immediately follows \'https://\'', () => {
    expect(normalizeURL('https://www.blog.boot.dev')).toBe('blog.boot.dev')
})

test('removes www. from urls when at the very start', () => {
    expect(normalizeURL('http://www.boot.dev')).toBe('boot.dev')
})

test('does not strip www when part of a domain name', () => {
    expect(normalizeURL('http://bootwww.dev')).toBe('bootwww.dev')
})

test('does not strip www. when it is a subdomain', () => {
    expect(normalizeURL('http://boot.www.dev')).toBe('boot.www.dev')
})

test('does not strip http when it is part of a domain name', () => {
    expect(normalizeURL('http://boothttp.dev')).toBe('boothttp.dev')
})

test('does not strip https when it is part of a domain name', () => {
    expect(normalizeURL('http://boothttps.dev')).toBe('boothttps.dev')
})

test('finds all <a> tags', () => {
    testData = ['This is some fake code with <a href="https://boot.dev">Learn Backend Development</a> links in it. There are two <a href="https://boot2.dev">Learn Backend Development</a> links.',
    'boot1.dev',
    [new URL('https://boot.dev'), new URL('https://boot2.dev')]]
    expect(getURLsFromHTML(testData[0], testData[1])).toEqual(testData[2])
})

test('correctly converts relative links', () => {
    testData = ['This is some fake code with <a href="/page1">Learn Backend Development</a> links in it. There are two <a href="/page2">Learn Backend Development</a> links.',
    'http://boot.dev',
    [new URL('http://boot.dev/page1'), new URL('http://boot.dev/page2')]]
    expect(getURLsFromHTML(testData[0], testData[1])).toEqual(testData[2])
})

test('correctly converts relative links when base link ends with /', () => {
    testData = ['This is some fake code with <a href="/page1">Learn Backend Development</a> links in it. There are two <a href="/page2">Learn Backend Development</a> links.',
    'http://boot.dev/',
    [new URL('http://boot.dev/page1'), new URL('http://boot.dev/page2')]]
    expect(getURLsFromHTML(testData[0], testData[1])).toEqual(testData[2])
})