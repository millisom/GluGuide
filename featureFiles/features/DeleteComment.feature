Feature: Delete Comment
    As a logged in user
    I want to delete a self writtencomment
  
  Scenario: Delete a comment
    Given I am on a blogpost page
    And I see a self written comment
    When I click the "delete" button
    And a message shows "Do you really want to delete this comment?"
    And I click on 'yes' button
    Then the comment was successfully deleted
    And I am redirected to the blogpost page
    And I get a confirmation message
    And the comment is gone

  Scenario: Cancel Delete a comment
    Given I am on a blogpost page
    And I see a self written comment
    When I click the "delete" button
    And a message shows "Do you really want to delete this comment?"
    And I click on 'no' button
    Then the pop up window closes
    And I see the comment with no changes
