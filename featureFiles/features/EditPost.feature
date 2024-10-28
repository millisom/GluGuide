Feature: Edit Post
  As a user
  I want to edit my post
  So that I can update the information I previously shared

  Scenario: Open post edit page
    Given I am on the "Post Details" page
    When I click the "Edit Post" button
    Then I am redirected to the "Edit Post" page

  Scenario: Enter valid changes and update the post
    Given I am on the "Edit Post" page
    When I enter "Updated Title" in the Titlefield
    And I enter "Updated content of the post." in the Contentfield
    And I press the "Update" button
    Then I receive a "Post successfully updated" message
    And I am redirected to the "Complete Post" page

  Scenario: Enter invalid changes and receive error message
    Given I am on the "Edit Post" page
    When I enter an empty "Title" in the Titlefield
    And I enter "Updated content" in the Contentfield
    And I press the "Update" button
    Then I remain on the "Edit Post" page
    And I receive an "Error" message