const { Given, When, Then, After, Before, BeforeStep } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const nock = require('nock');
const fs = require('fs');

let driver;

const TIMEOUT = 20000; // Set a default timeout value

Before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
});

BeforeStep(async function () {
    await driver.sleep(1000); // Adding a 1-second delay between steps for stability
});

Given('the login page is open', async function () {
    await driver.get('http://localhost:5173/login');
});

When('I enter a valid {string} and {string}', async function (username, password) {
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), TIMEOUT);
    const passwordField = await driver.wait(until.elementLocated(By.name('password')), TIMEOUT);

    await usernameField.sendKeys(username);
    await passwordField.sendKeys(password);
});

When('I enter an invalid {string} and {string}', async function (username, password) {
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), TIMEOUT);
    const passwordField = await driver.wait(until.elementLocated(By.name('password')), TIMEOUT);

    await usernameField.sendKeys(username);
    await passwordField.sendKeys(password);
});

When('I click the "Login" button', async function () {
    const loginButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Login')]")), TIMEOUT);
    await loginButton.click();
    await driver.sleep(3000); // Increase delay to allow error message to render
});
Then('I should see an error message {string}', async function (expectedMessage) {
    try {
        // Wait explicitly until the error message is located and visible
        const errorMessage = await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')));
        await driver.wait(until.elementIsVisible(errorMessage));
        const actualMessage = await errorMessage.getText();
        assert.strictEqual(actualMessage.trim(), expectedMessage.trim(), 'Error message does not match');
    } catch (error) {
        // Take a screenshot and save the page source for further diagnostics
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync('error_message_debug.png', screenshot, 'base64');
        const pageSource = await driver.getPageSource();
        fs.writeFileSync('page_source_debug.html', pageSource);
        throw error; // Re-throw to ensure test failure is recorded
    }
});

Then('I should be redirected to the "account" page', async function () {
    await driver.wait(until.urlContains('/account'), TIMEOUT);
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
    const signUpLink = await driver.wait(until.elementLocated(By.partialLinkText('Sign up here')), TIMEOUT);
    await signUpLink.click();
});

Then('I should be redirected to the "signUp" page', async function () {
    await driver.wait(until.urlContains('/signUp'), TIMEOUT);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/signUp'), 'User is not on the sign-up page');
});

When('I click on the "Forgot password?" link', async function () {
    const forgotPasswordLink = await driver.wait(until.elementLocated(By.partialLinkText('Forgot Password?')), TIMEOUT);
    await forgotPasswordLink.click();
});

Then('I should be redirected to the "forgotPassword" page', async function () {
    await driver.wait(until.urlContains('/forgotPassword'), TIMEOUT);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/forgotPassword'), 'User is not on the forgot password page');
});

After(async function () {
    nock.cleanAll();
    if (driver) {
        await driver.quit();
    }
});
