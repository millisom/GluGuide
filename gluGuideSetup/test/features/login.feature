Feature: Login functionality

  As a user
  I want to be able to log in to my account
  So that I can access my account details

  Background:
    Given the login page is open

  Scenario: Successful login
    When I enter a valid "hossayji" and "1234"
    And I click the "Login" button
    Then I should be redirected to the "account" page

  Scenario: Unsuccessful login with invalid credentials
    When I enter an invalid "username" and "password"
    And I click the "Login" button
    Then I should see an error message "Invalid username or password"

  Scenario: Unsuccessful login with server error
    When I enter a valid "triggerError" and "1234"
    And a server error occurs
    And I click the "Login" button
    Then I should see an error message "An error occurred. Please try again."

  Scenario: Redirect to sign up page
    When I click on the "Sign up here" link
    Then I should be redirected to the "signUp" page

    Scenario: Redirect to forgot password page
        When I click on the "Forgot password?" link
        Then I should be redirected to the "forgotPassword" page