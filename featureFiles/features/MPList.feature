Feature: Use Case Manage Post - List Post
As a USER
I want to list all my post.

Background:
Given I am logged in 
And I am on the homepage of the website 

@listpost-Feature
Scenario: List Post
    When I click on the button "List Post"
    Then I am redirected to the "List Post" page

Scenario: Open Post from List
Given I am on the "List Post" page
When I see a list of all my written posts
And I click on a post
Then I will be redirected to the "Display Post" page


     