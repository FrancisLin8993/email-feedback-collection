const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see survey creation form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Survey Title');
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const subjectError = await page.getContentsOf('.subject .red-text');
      const bodyError = await page.getContentsOf('.body .red-text');
      const recipientsError = await page.getContentsOf('.recipients .red-text');
      expect(titleError).toEqual('This field cannot be blank.');
      expect(subjectError).toEqual('This field cannot be blank.');
      expect(bodyError).toEqual('This field cannot be blank.');
      expect(recipientsError).toEqual('This field cannot be blank.');
    });
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'test title');
      await page.type('.subject input', 'test subject');
      await page.type('.body input', 'test body');
      await page.type('.recipients input', 'test@test.com');
      await page.click('form button');
    });

    test('Submitting takes user to review page', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Confirm your input');
    });

    //TODO: correct logic to be implemented
    test.skip('Submitting then saving new survey to the survey page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('test title');
      expect(content).toEqual('test body');
    });
  });
});

describe('User is not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/surveys'
    },
    {
      method: 'post',
      path: '/api/surveys',
      data: {
        title: 'test title',
        subject: 'test subject',
        body: 'test body',
        recipients: 'test@test.com',
        dateSent: Date.now()
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
