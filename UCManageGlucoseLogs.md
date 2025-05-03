
```gherkin
Feature: Create Glucose Log
    As a logged-in user
    I want to log my glucose level
    So that I can track my health effectively
  
  Scenario: Successfully create a glucose log
    Given I am on the glucose logging page
    When I enter a date
    And I enter a time
    And I enter a glucose level
    And I click the 'Submit' button
    Then my glucose entry is successfully created
    And I see the new entry in my logs list

  Scenario: Cancel glucose log creation
    Given I am on the glucose logging page
    When I start entering a date
    And I enter a time
    And I enter a glucose level
    And I click the 'Cancel' button
    Then I am redirected to the logging page
    And no glucose entry is created

Feature: Edit Glucose Log
    As a logged-in user
    I want to edit an existing glucose log
    So that I can correct or refine my entry
  
  Scenario: Successfully edit a glucose log
    Given I am on the glucose logs page
    And I see an existing glucose entry
    When I click the "Edit" button
    And I modify the date, time, or glucose level
    And I click 'Submit' button
    Then the log entry is successfully updated
    And I see the updated entry in my logs list

  Scenario: Cancel glucose log edit
    Given I am on the glucose logs page
    And I click the "Edit" button
    And I start modifying the date, time, or glucose level
    And I click the 'Cancel' button
    Then the log remains unchanged


    Feature: List Glucose Logs
    As a logged-in user
    I want to see a list of all my glucose logs
    So that I can review my history and health trends
  
  Scenario: View all glucose logs
    Given I am on the logs dashboard
    When I scroll to the glucose logs list
    Then I see all my previous glucose entries


    Feature: Delete Glucose Log
    As a logged-in user
    I want to delete a glucose log entry
  
  Scenario: Successfully delete a glucose log
    Given I am on the glucose logs page
    And I see an existing glucose entry
    When I click the "Delete" button
    And a confirmation message appears
    And I click 'Yes'
    Then the glucose entry is successfully removed

  Scenario: Cancel deletion of a glucose log
    Given I am on the glucose logs page
    And I click the "Delete" button
    And a confirmation message appears
    And I click 'No'
    Then the log entry remains unchanged
