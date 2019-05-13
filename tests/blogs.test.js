const Page = require('./helper/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});


describe('When Logged In', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('Can see Blog Create Form', async () => {
        const label = await page.getContestsOf('form label');
        expect(label).toEqual('Blog Title')
        // const text = await page.getContestsOf('i.material-icons', (el) => el.innerHTML);
        // console.log(text);
    });

    describe('And Using valid inputs', async () => {

        beforeEach(async () => {
            await page.type('.title input', 'My Test Title');
            await page.type('.content input', 'Test Content');
            await page.click('form button');
        });

        test('Submitting takes user to review screen', async () => {
            const text = await page.getContestsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContestsOf('.card-title');
            const content = await page.getContestsOf('p');
            expect(title).toEqual('My Test Title');
            expect(content).toEqual('Test Content');
        })
    });

    describe('And Using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('the form shows an error message', async () => {
            const titleError = await page.getContestsOf('.title .red-text');
            const contentError = await page.getContestsOf('.content .red-text');
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    })
});

describe('User is not logged in', async () => {

    const actions = [
        {
            method: 'get',
            path: 'api/blogs'
        },
        {
            method: 'post',
            path: 'api/blogs',
            body: {
                title: 'Title Test',
                content: 'Content Test'
            }
        }
    ];
    test('All blog related action are prohibited', async () => {
        const results = await page.execRequest(actions);
        for (let result of results) {
            expect(result).toEqual({ error: 'You must log in!'});
        }
    })
});


