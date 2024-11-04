const { Given, When, Then, After, Before } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const nock = require('nock');
const { setDefaultTimeout, BeforeStep } = require('@cucumber/cucumber');


BeforeStep(async function () {
    await driver.sleep(5000); // Delay 1 second between each step
});

let driver;

Before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
});

Given('the login page is open', async function () {
    await driver.get('http://localhost:5173/login');
});

When('I enter a valid {string} and {string}', async function (username, password) {
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), 20000);
    const passwordField = await driver.wait(until.elementLocated(By.name('password')), 20000);

    await usernameField.sendKeys(username);
    await passwordField.sendKeys(password);
});

When('I enter an invalid {string} and {string}', async function (username, password) {
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), 20000);
    const passwordField = await driver.wait(until.elementLocated(By.name('password')), 20000);

    await usernameField.sendKeys(username);
    await passwordField.sendKeys(password);
});

When('I click the "Login" button', async function () {
    const loginButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Login')]")), 20000);
    await loginButton.click();
    await driver.sleep(2000);
});

Then('I should see an error message {string}', async function (expectedMessage) {
    const errorMessage = await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 20000);
    const actualMessage = await errorMessage.getText();
    assert.strictEqual(actualMessage, expectedMessage, 'Error message does not match');
});


Then('I should be redirected to the "account" page', async function () {
    await driver.wait(until.urlContains('/account'), 20000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/account'), 'User is not on the account page');
});

When('a server error occurs', async function () {
    nock.cleanAll();
    nock('http://localhost:8080')
        .post('/login')
        .reply(500, { Message: "An error occurred. Please try again." });

    await new Promise(resolve => setTimeout(resolve, 2000));
});

When('I click on the "Sign up here" link', async function () {
    const signUpLink = await driver.wait(until.elementLocated(By.partialLinkText('Sign up here')), 20000);
    await signUpLink.click();
});

Then('I should be redirected to the "signUp" page', async function () {
    await driver.wait(until.urlContains('/signUp'), 20000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/signUp'), 'User is not on the sign-up page');
});

After(async function () {
    nock.cleanAll();
    if (driver) {
        await driver.quit();
    }
});
