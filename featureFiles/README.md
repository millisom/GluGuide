# Project Setup Instructions

Follow the steps below to set up the project and install the necessary dependencies for working with feature files and running tests

### 1. Open your terminal.
- Launch your terminal and navigate to the featurefiles/features directory using the following command:
```bash
cd featurefiles/features
```
### 2. Install the necessary dependencies.
- Install all required dependencies listed in the package.json file, including Cucumber.io and Selenium, by running the following command:
```bash
npm install
```
### 3. Set Up Autocompletion for Feature Files and Steps

To improve your workflow, install two extensions that enable autocompletion for both your .feature files and step definitions in JavaScript.

#### 1. Cucumber (Gherkin) Full Support Extension
This extension provides comprehensive autocompletion and syntax highlighting for `.feature` files.

- It helps you write Gherkin syntax quickly and provides suggestions for keywords like `Given`, `When`, `Then`, `And`, etc.
- It also validates your scenarios as you type.

Install the **Cucumber (Gherkin) Full Support** extension via your editor's marketplace.

![Screenshot](/docs/cucumberFullSupport.png)

#### 2. Step Definitions Autocompletion Extension
This extension allows autocompletion of step definitions in your JavaScript files (e.g., `.js`).

- It works by mapping steps written in your `.feature` files to the corresponding JavaScript code, providing you with suggestions as you define your step logic in `steps.js`.

Install the **Step Definitions Autocompletion** extension for autocompletion of step definitions.

![Screenshot](/docs/cucumberExten.png)

- Once installed, autocompletion will assist in writing and editing .feature files. It will suggest steps and actions as you type, improving your workflow:

Example of how autocompletion looks: ![Screenshot](/docs/autocompletion.png)

### 4. Create Your Feature File

Create a new file in the `featurefiles/features` directory with a `.feature` extension:

```bash
touch my_test.feature
```
- Add your Gherkin scenarios and steps inside this file.
### 5. Run Your Tests
Once done with the feature file, run the tests. with:
```bash
npm test
```
- which will run the tests and show the results in the terminal. it should look like this:
![Screenshot](/docs/partiallyPassedTests.png)
- 
### 6. Import Cucumber and Add Step Definitions
Once the tests run, you can copy and paste the step definitions from the test result output and include them in your step definitions file:
#### 1. Create a new file in the featurefiles/features/step_definitions directory with a .js extension:
```bash
touch filename_steps.js
```
#### 2. Import Cucumber and Copy the step definitions from the test output and paste them into this file. 
#### 3. Run the tests again with `npm test` to see the results.
- If all tests pass, you have successfully set up the project and written passing tests for your feature file. Passed tests should look like this:
![Screenshot](/docs/passedTest.png)
 