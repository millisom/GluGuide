Feature: Delete Post
As a logged in user
I want to delete my own post.

Background:
Given I am logged in
And I am on "List Post" page

Scenario: Delete post
Given I click on the "Delete Post" button
And I confirm my action
Then the post will be deleted
And I receive a "Success" message

Scenario: Delete post unsuccessfully
Given I click on the "Delete Post" button
And I don't confirm my action
Then the post will not be deleted