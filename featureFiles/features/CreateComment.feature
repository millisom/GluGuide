Feature: Create Comment
    As a logged in user
    I want to create a comment
    So that I can take part in a discussion
  
  Scenario: Create a comment
    Given I am on a blogpost page
    When I click the "comment" button
    And I start typing in a text field
    And I click on 'submit' button
    Then the comment was successfully created
    And I am redirected to the blogpost page
    And the textfield is empty
    And I see my comment

  Scenario: Cancel Create a comment
    Given I am on a blogpost page
    When I click the "comment" button
    And I start typing in a text field
    And I click on 'cancel' button
    Then I am redirected to the blogpost page
    And the text field is empty