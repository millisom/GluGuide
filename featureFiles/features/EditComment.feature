Feature: Edit Comment
    As a logged in user
    I want to edit a self writtencomment
    So that I can update a comment
  
  Scenario: Edit a comment
    Given I am on a blogpost page
    And I see a self written comment
    When I click the "edit" button
    And I see the text from the comment in a textfield
    And I start editing the input
    And I click on 'submit' button
    Then the comment was successfully edited
    And I am redirected to the blogpost page
    And the textfield is empty
    And I see my updated comment

  Scenario: Cancel Edit a comment
    Given I am on a blogpost page
    And I see a self written comment
    When I click the "edit" button
    And I start typing in a text field
    And I click on 'cancel' button
    Then I am redirected to the blogpost page
    And the text field is empty
    And I see the comment with no changes