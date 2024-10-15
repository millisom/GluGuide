const {Given, When, Then} = require('@cucumber/cucumber');
assert = require('assert');

Given('I am on the homepage of the website', function () {
    console.log('I am on the homepage of the website');
});
When('I click the {string} button', function (string) {
    console.log('I click the ' + string + ' button');
});
Then('I am redirected to the {string} page', function (string) {
    console.log('I am redirected to the ' + string + ' page');
});

Given('I am on the {string} page', function (string) {
    console.log('I am on the ' + string + ' page');
});
When('I enter {string} in the Usernamefield', function (string) {
    console.log('I enter ' + string + ' in the Usernamefield');
});

When('I enter {string} in the Emailfield', function (string) {
    console.log('I enter ' + string + ' in the Emailfield');
});

When('I enter {string} in the Passwordfield', function (string) {
    console.log('I enter ' + string + ' in the Passwordfield');
});
When('I press the {string} button', function (string) {
    console.log('I press the ' + string + ' button');
});
Then('I receive a {string} message', function (string) {
    console.log('I receive a ' + string + ' message');
});
When('I enter wrong {string} in the Usernamefield', function (string) {
    console.log('I enter wrong ' + string + ' in the Usernamefield');
});
When('I enter invalid {string} in the Emailfield', function (string) {
    console.log('I enter invalid ' + string + ' in the Emailfield');
});
Then('I remain on the {string} page', function (string) {
    console.log('I remain on the ' + string + ' page');
});
Then('I receive an {string} message', function (string) {
    console.log('I receive an ' + string + ' message');
});










