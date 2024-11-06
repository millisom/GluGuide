const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const nock = require('nock');

setDefaultTimeout(60000);  

let driver;

Before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
});

After(async function () {
    if (driver) {
        await driver.quit();
    }
});

Given('the signup page is open', async function () {
    await driver.get('http://localhost:5173/signUp');
});

When('I enter valid signup details {string} {string} {string} {string} and accept terms', async function (username, email, password, confirmPassword) {
    nock('http://localhost:8080')
        .post('/signUp')
        .reply(200, "notexist");
        console.log("Mocked 'notexist' response for new user registration");

    await driver.wait(until.elementLocated(By.name('username')), 20000).sendKeys(username);
    await driver.wait(until.elementLocated(By.name('email')), 20000).sendKeys(email);
    await driver.wait(until.elementLocated(By.name('password')), 20000).sendKeys(password);
    await driver.wait(until.elementLocated(By.name('confirmPassword')), 20000).sendKeys(confirmPassword);
    await driver.findElement(By.name('termsAccepted')).click();
});

When('I try to register with an existing email {string} {string} {string} {string} and accept terms', async function (username, email, password, confirmPassword) {
    // Mock the API response to simulate an existing user (exists)
    nock('http://localhost:8080')
        .post('/signUp')
        .reply(200, "exists");

    await driver.wait(until.elementLocated(By.name('username')), 20000).sendKeys(username);
    await driver.wait(until.elementLocated(By.name('email')), 20000).sendKeys(email);
    await driver.wait(until.elementLocated(By.name('password')), 20000).sendKeys(password);
    await driver.wait(until.elementLocated(By.name('confirmPassword')), 20000).sendKeys(confirmPassword);
    await driver.findElement(By.name('termsAccepted')).click();
});

When('I enter signup details {string} {string} {string} {string} and accept terms', async function (username, email, password, confirmPassword) {
    await driver.wait(until.elementLocated(By.name('username')), 20000).sendKeys(username);
    await driver.wait(until.elementLocated(By.name('email')), 20000).sendKeys(email);
    await driver.wait(until.elementLocated(By.name('password')), 20000).sendKeys(password);
    await driver.wait(until.elementLocated(By.name('confirmPassword')), 20000).sendKeys(confirmPassword);
    await driver.findElement(By.name('termsAccepted')).click();
});


When('I enter signup details {string} {string} {string} {string} without accepting terms', async function (username, email, password, confirmPassword) {
    await driver.wait(until.elementLocated(By.name('username')), 20000).sendKeys(username);
    await driver.wait(until.elementLocated(By.name('email')), 20000).sendKeys(email);
    await driver.wait(until.elementLocated(By.name('password')), 20000).sendKeys(password);
    await driver.wait(until.elementLocated(By.name('confirmPassword')), 20000).sendKeys(confirmPassword);

});


When('I click the "Sign Up" button', async function () {
    const signUpButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Sign Up')]")), 20000);
    await signUpButton.click();
    
    // Wait briefly for any redirects to complete
    await driver.sleep(2000);
});

Then('I should be redirected to the homepage', async function () {
    // Wait until the URL contains the homepage path
    await driver.wait(until.urlIs('http://localhost:5173/'), 30000);  // Checks for exact match with the homepage URL
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, 'http://localhost:5173/');
});

Then('I should see the existing user message {string}', async function (expectedMessage) {
    const errorMessage = await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 30000);
    const isDisplayed = await errorMessage.isDisplayed();
    if (!isDisplayed) {
        throw new Error("Error message is not displayed");
    }
    const actualMessage = await errorMessage.getText();
    assert.strictEqual(actualMessage, expectedMessage);
});

Then('I should see an alert with the message {string}', async function (expectedAlertMessage) {
    const alert = await driver.switchTo().alert();
    const actualAlertMessage = await alert.getText();
    assert.strictEqual(actualAlertMessage, expectedAlertMessage);
    await alert.accept();  // Close the alert
});


