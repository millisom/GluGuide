Feature: List Comment
    As a logged in user
    I want to list all posts where I wrote a comment
    So that I can keep an overview of my discussions
  
  Scenario: List comment
    Given I am on the landing page
    When I click the "Profile" button
    And I click on "View comments"
    And I scroll through the list of posts
    And I click on a post
    Then the post will be displayes
    And I see my comment
