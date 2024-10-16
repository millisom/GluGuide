Feature: Create Post
As a user
I want to create a post
So that I can share information with others

Scenario: Open post creation page
Given I am on the homepage of the website
When I click the "Create Post" button
Then I am redirected to the "Create Post" page

Scenario: Enter valid data and create a post
    Given I am on the "Create Post" page
    When I enter "Post Title" in the Titlefield
    And I enter "This is the content of the post." in the Contentfield
    And I press the "Publish" button
    Then I receive a "Post successfully published" message
    And I am redirected to the "Complete Post" page

  Scenario: Enter invalid data and receive error message
    Given I am on the "Create Post" page
    When I enter an empty "Post Title" in the Titlefield
    And I enter "This is some content" in the Contentfield
    And I press the "Publish" button
    Then I remain on the "Create Post" page
    And I receive an "Error" message