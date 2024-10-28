Feature: Create Account
  As a new user
  I want to create an account
  So that I can access the web application

  Scenario: Open account creation page
    Given I am on the homepage of the website
    When I click the "Register" button
    Then I am redirected to the "Create Account" page

  Scenario: Enter valid data and create an account
    Given I am on the "Create Account" page
    When I enter "username" in the Usernamefield
    And I enter "email" in the Emailfield
    And I enter "password" in the Passwordfield
    And I press the "Create Account" button
    Then I receive a "Success" message
    And I am redirected to the "My Account" page

  Scenario: Enter invalid data and receive error message
    Given I am on the "Create Account" page
    When I enter wrong "username" in the Usernamefield
    And I enter invalid "email" in the Emailfield
    And I enter "short" in the Passwordfield
    And I press the "Create Account" button
    Then I remain on the "Create Account" page
    And I receive an "Error" message