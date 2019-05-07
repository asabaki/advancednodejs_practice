
const Page = require('./helper/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
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
       }) ;
       test('Submitting then saving adds blog to index page', async () => {

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
