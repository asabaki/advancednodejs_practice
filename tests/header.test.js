const puppeteer = require('puppeteer');

const Page = require('./helper/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

test('We can launch Browser', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Click to OAuth Button SignIn', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
    // console.log(url);
});

test('When Signed In, Show Logout button', async () => {
    await page.login();
    // const text = await page.$eval('a[href="/auth/logout"', el => el.innerHTML);
    const text = await page.getContestsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});
