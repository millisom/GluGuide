# GluGuide

## Software Requirement Specification

### Table of Contents

1. [Introduction](#1-introduction)
    1. [Purpose](#11-purpose)
    2. [Scope](#12-scope)
    3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    4. [References](#14-references)
    5. [Overview](#15-overview)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
    1. [Functionality](#31-functionality)
        - [Functional Requirement One](#311-functional-requirement-one)
    2. [Usability](#32-usability)
        - [Usability Requirement One](#321-usability-requirement-one)
    3. [Reliability](#33-reliability)
        - [Reliability Requirement One](#331-reliability-requirement-one)
    4. [Performance](#34-performance)
        - [Performance Requirement One](#341-performance-requirement-one)
    5. [Supportability](#35-supportability)
        - [Supportability Requirement One](#351-supportability-requirement-one)
    6. [Design Constraints](#36-design-constraints)
        - [Design Constraint One](#361-design-constraint-one)
    7. [Online User Documentation and Help System Requirements](#37-online-user-documentation-and-help-system-requirements)
    8. [Purchased Components](#38-purchased-components)
    9. [Interfaces](#39-interfaces)
        - [User Interfaces](#391-user-interfaces)
        - [Hardware Interfaces](#392-hardware-interfaces)
        - [Software Interfaces](#393-software-interfaces)
        - [Communications Interfaces](#394-communications-interfaces)
    10. [Licensing Requirements](#310-licensing-requirements)
    11. [Legal, Copyright, and Other Notices](#311-legal-copyright-and-other-notices)
    12. [Applicable Standards](#312-applicable-standards)
4. [Supporting Information](#4-supporting-information)

---

# 1. Introduction

## 1.1 Purpose
This Software Requirement Specification (SRS) fully describes the specifications for the application "GluGuide". It provides an overview of the project and its goals, along with detailed descriptions of the intended features and the boundary conditions for the development process.


## 1.2 Scope
The project is going to be realized as an web application.

Planned Subsystems are:
- Account System:
The login is an essential part of the application. Users can create accounts so the data can be connected to each user. Users can also delete their account and upon doing so, all user data is permanently removed. The following subsystems are only accessible to registered users.
- Blog
A user can see, write and comment on blogpost. This community feature allows users to share experience and connect with others.
- Track glucose level:
A user can log glucose levels manually into the application.
- Track a meal:
A user can log meals manually into the application. 
- Generate a graph
Users can generate a graph with their tracking data.
- Get notification:
Users can set reminders in the form of notifications to track meals and glucose levels. For each Reminder the user will get a notification.
- Storing data:
User data for accounts has to be stored. Also all the tracked meals and glucose levels must be stored as datasets linked to the account. The data store is the basis for the account system. 



## 1.3 Definitions, Acronyms, and Abbreviations
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UC          | Use Case                               |
| n/a         | not applicable                         |
| tbd         | to be determined                       |
| UCD         | overall Use Case Diagram               |
| FAQ         | Frequently asked Questions             |
| GDE         | Gestational Diabetes                   |

## 1.4 References

| Title                                                            |    Date    | Publishing organization |
|------------------------------------------------------------------|:----------:|-------------------------|
| [GluGuide Blog](https://gdewomenhealth.wordpress.com/) | 27.09.2024 | GluGuide Team       |
| [GitHub](https://github.com/millisom/GluGuide)         | 27.09.2024 | GluGuide Team       |



## 1.5 Overview
The following chapter provides an overview of this project, including the vision and the Overall Use Case Diagram. The third chapter, Requirements Specification, offers further details on the specific requirements related to functionality, usability, and design parameters. Lastly, there is a chapter that provides additional supporting information.


# 2. Overall Description
The web application GluGuide is a platform designed to assist users with gestational diabetes. The web app offers information and interactive features to help users manage their condition. The core functions of the web app include a community forum, a blood sugar tracker and meal tracker. The primary users are pregnant individuals, caregivers, partners, and healthcare providers. Given the sensitive nature of health data, the web app must adhere to strict data privacy laws to protect user information. It is assumed that users have access to a stable internet connection. The platform's effectiveness relies on users tracking their health data. By addressing these points, GluGuide aims to be a comprehensive, user-friendly, and secure platform that empowers pregnant individuals to manage their condition effectively.

The following picture shows the overall use case diagram of our software.

![UCD](docs/UCD2.drawio.svg) <br>

# 3. Specific Requirements


## 3.1 Functionality
This section will explain the different use cases illustrated in the Use Case Diagram and their functionality.
By November, we plan to implement:

- 3.1.1 Creating account
- 3.1.2 Logging in / out
- 3.1.3 Edit account
- 3.1.4 Deleting account
- 3.1.5 manage blogpost
- 3.1.6 manage comment

By June, we plan to implement:

- 3.1.7 Track sugar
- 3.1.8 Track macros
- 3.1.9 Track meals
- 3.2.0 Generate graph
- 3.2.1 generate alert







### 3.1.1 Creating an account
To ensure user identification, the web application requires an account system that links data to each user. The account creation process involves users submitting necessary details such as their username, email, and password. This process is essential for securing user data and personalizing the experience within the application. The detailed steps for creating an account are described in the Create Account Use Case.

For more details, refer to the [Create Account Use Case](UCCreateAccount.md).

### 3.1.2 Logging in / out
The webapp will provide the possiblity manually log in and out to use the functions.

### 3.1.3 Edit account
The user is able to edit the username and password. 

For more details, refer to the [Edit Account Use Case](UCEditAccount.md).

### 3.1.4 Delete account
It is possible to delete the account. All data linked to it will be deleted too.

### 3.1.5 Manage blogpost
To get in touch with others, ask questions, or simply share experiences, the user can write a blog post in the community feature. This function includes list posts, write, edit and delete post.

For more details, refer to the [Manage Blogpost Use Case](UCManagePost.md).

### 3.1.6 Manage comment
The comment function allows users to engage in discussions. Users are able to reply to posts or other comments. They can also list all their comments and edit and delete them here.

For more details, refer to the [Manage Comment Use Case](UCManageComment.md).

### 3.1.7 Track sugar
The user is able to manually track their sugar.

### 3.1.8 Track macros
The user is able to manually track their macros.

### 3.1.9 Track meals
The user is able to manually track their meals.

### 3.2.0 Generate graph
The application can generate graphs from the collected data. 

### 3.2.1 Alerts
The user can set alerts to remind them to track their data.



## 3.2 Usability

### 3.2.1 Security
The Webapp must ensure secure data handling to compliance with healthcare data protection laws. Otherwise the user won't feel comfortable to share information. 


## 3.3 Reliability

### 3.3.1 Server availability
Our Server should ensure a 95% up-time. Since our priority is to develop an application free of bugs rather than hosting it ourselves, the application's availability is determined by the hosting provider we choose. With their redundancy and security protocols in place, most providers can achieve an uptime of over 99% in their data centers.


### 3.3.2 Accuracy
We cannot guarantee the accuracy of the information in the blog posts, comments, or tracking data, as this content will be submitted by users

### 3.3.3 Blug classes
We classify bugs in two categories

- Critical bug: arises when the database unintentionally loses data, exposes sensitive user information such as passwords, or prevents users from accessing the application entirely
- Non critical bug: occurs when the application remains functional, but users experience glitches that slightly affect their overall experience

## 3.4 Performance


### 3.4.1 Real Time Updates
The webapp must support real-time updates for blood sugar tracking and meal tracking.

### 3.4.2 Response time
Since almost the entire user interface will load initially, even pages that are not currently visible will appear in less than 100 milliseconds when accessed.


## 3.5 Supportability

Our frontend, backend, and individual functionalities will be distinctly separated, and we will adhere to naming conventions commonly found in the technologies we use. Additionally, we strive to maintain clean code.

### 3.5.1 Language Support
We will use the following languages, which will be well supported in the future:
- JavaScript
- HTML


## 3.6 Design Constraints

### 3.6.1 MVC Architecture
Our WebApp should implement the MVC pattern.

## 3.7 Online User Documentation and Help System Requirements
We aim to create an intuitive and user-friendly interface that allows users to navigate the webapp comfortably without difficulty. We will also provided a FAQ document to help with common questions.

## 3.8 Purchased Components
(n/a)

## 3.9 Interfaces

### 3.9.1 User Interfaces
(tbd)
- add mockups later 

### 3.9.2 Hardware Interfaces
(tbd)

### 3.9.3 Software Interfaces
(tbd)

### 3.9.4 Communications Interfaces
(tbd)

## 3.10 Licensing Requirements
(tbd)

## 3.11 Legal, Copyright, and Other Notices
(tbd)

## 3.12 Applicable Standards
(tbd)

---

# 4. Supporting Information
If you would like to know the current state of this project please visit the GluGuide-[Blog](https://gdewomenhealth.wordpress.com/).
