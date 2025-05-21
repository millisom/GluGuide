# Use-Case Specification: Manage Admin | Version 1.1

## 1. Use-Case: Manage Admin
### 1.1 Brief Description  
This use case describes how a user can become an admin via a command in the terminal and perform administrative functions such as managing users and blogposts.

---

## 2. Flow of Events  

### 2.1 Basic Flow  
A user can run a **terminal command** to become an **admin**. Once an admin, they can:
- **View** a dashboard listing all users.
- **Edit** user details (name, email, password, admin status).
- **Delete** users.
- **Create** new users.
- **Edit or delete** blogposts, including modifying their title, tags, content, and image.

---

### 2.2 Becoming an Admin  
A user **executes a command in the terminal** to gain **admin privileges**.

```gherkin
Feature: Grant Admin Privileges
    As a system user
    I want to execute a command to become an admin
    So that I can manage users and blogposts
  
  Scenario: Successfully become an admin
    Given I have access to the system terminal
    When I run the "grant admin" command
    Then my account is granted admin privileges
    And I can access the admin dashboard
```

### 2.3 Manage Users
#### Create User
Admins can create new users by providing name, email, and password.

```gherkin
Feature: Create User
    As an admin
    I want to create a new user
    So that they can access the system
  
  Scenario: Successfully create a user
    Given I am on the admin dashboard
    When I click "Create User"
    And I enter name, email, and password
    And I click "Submit"
    Then the new user is successfully created
    And appears in the user list`
```

#### Edit User
Admins can update user details, including name, email, password, and admin status.

```gherkin
Feature: Edit User
    As an admin
    I want to edit user details
    So that I can update user information
  
  Scenario: Successfully edit a user
    Given I am on the admin dashboard
    And I see a user listed
    When I click "Edit"
    And I modify the name, email, or password
    And I click "Update"
    Then the changes are saved
    And the updated user data appears in the list
```
#### Delete User
Admins can delete users from the system.

```gherkin
Feature: Delete User
    As an admin
    I want to delete a user
    So that I can remove inactive or problematic accounts
  
  Scenario: Successfully delete a user
    Given I am on the admin dashboard
    And I see a user listed
    When I click "Delete"
    And I confirm deletion
    Then the user is removed from the system
```

### 2.4 Manage Blogposts
#### Edit Blogpost
Admins can update blogpost title, tags, content, and images.

```gherkin
Feature: Edit Blogpost
    As an admin
    I want to edit a blogpost
    So that I can update its content
  
  Scenario: Successfully edit a blogpost
    Given I am on the admin dashboard
    And I see a blogpost listed
    When I click "Edit"
    And I modify the title, tags, content, or image
    And I click "Update"
    Then the blogpost is successfully edited
    And the updated content is displayed
```

#### Delete Blogpost
Admins can delete blogposts from the system.

```gherkin
Feature: Delete Blogpost
    As an admin
    I want to delete a blogpost
    So that I can remove unwanted or outdated content
  
  Scenario: Successfully delete a blogpost
    Given I am on the admin dashboard
    And I see a blogpost listed
    When I click "Delete"
    And I confirm deletion
    Then the blogpost is removed from the system
```

### UC Diagram 

![Create Account Activity Diagram](Assets/UCManageAdmin.drawio.svg)

## 3. Special Requirements  

### 3.1 Admin Privileges  
In order to create, edit, or delete users or users blogposts, the user must first become an admin by executing the necessary command in the terminal. Only authenticated admins will have access to the admin dashboard.

---

## 4. Preconditions  

### 4.1 The user has to have admin rights  
To ensure proper security and control, the user must **run the terminal command** to gain **admin privileges** before managing users or blogposts.

---

## 5. Postconditions  

### 5.1 Become Admin  
After executing the admin command, the user will gain **access to the admin dashboard** with management permissions.

### 5.2 Create User  
After creating a new user, the system will add the **user account** to the database and display it in the admin user list.

### 5.3 Edit User  
After updating a user's details (name, email, password, admin status), the revised information will be reflected in the **user management table**.

### 5.4 Delete User  
Once a user is deleted, their **account will be permanently removed** and no longer visible in the system.

### 5.5 Edit Blogpost  
After saving an updated blogpost (title, tags, content, image), the new **content will be displayed**.

### 5.6 Delete Blogpost  
Once deleted, the **blogpost will be permanently removed** from the system.
