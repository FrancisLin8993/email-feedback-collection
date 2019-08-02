const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://127.0.0.1:3000');
});

afterEach(async () => {
  await page.close();
});

test('Show the string in the left header', async () => {
  const text = await page.getContentsOf('a.left.brand-logo');
  expect(text).toEqual('Emailfc');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/api/logout"]');
  expect(text).toEqual('Logout');
});
