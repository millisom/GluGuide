const {Given, When, Then} = require('@cucumber/cucumber');
assert = require('assert');

When('I enter {string} in the Titlefield', function (title) {
    console.log(`I enter "${title}" in the Titlefield`);
});

When('I enter {string} in the Contentfield', function (content) {
    console.log(`I enter "${content}" in the Contentfield`);
});

When('I enter an empty {string} in the Titlefield', function (field) {
    console.log(`I enter an empty value in the ${field}`);
});

