Feature: Signup functionality

  Scenario: Successful Signup
    Given the signup page is open
    When I enter valid signup details "testuser" "test@example.com" "password123" "password123" and accept terms
    And I click the "Sign Up" button
    Then I should be redirected to the homepage

  Scenario: Existing User
    Given the signup page is open
    When I try to register with an existing email "existing name" "existinguser@example.com" "password123" "password123" and accept terms
    And I click the "Sign Up" button
    Then I should see the existing user message "User already exists"

  Scenario: Passwords do not match
    Given the signup page is open
    When I enter signup details "testuser" "test@example.com" "password123" "differentPassword" and accept terms
    And I click the "Sign Up" button
    Then I should see an alert with the message "Passwords do not match"

  Scenario: Terms and conditions not accepted
    Given the signup page is open
    When I enter signup details "testuser" "test@example.com" "password123" "password123" without accepting terms
    And I click the "Sign Up" button
    Then I should see an alert with the message "Accept the terms and conditions to proceed"
