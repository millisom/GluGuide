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
The login is an essential part of the application. Users can create accounts so the data can be connected to each user.
- Track glucose level:
A registered user can log glucose levels manually into the application.
- Track a meal:
A registered user can log meals manually into the application. 
- Get notification:
Users can set reminders in the form of notifications to track meals and glucose levels. For each Reminder the user will get a notification.
- Learn about gestational diabetes:
The Application has a feature where the user can learn more about gestational diabetes.
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
The web application GluGuide is a platform designed to assist users with gestational diabetes. The web app offers information and interactive features to help users manage their condition. The core functions of the web app include educational resources, a meal planning tool, a blood sugar tracker, and exercise guides. The primary users are pregnant individuals, caregivers, partners, and healthcare providers. Given the sensitive nature of health data, the web app must adhere to strict data privacy laws to protect user information. It is assumed that users have access to a stable internet connection. The platform's effectiveness relies on users tracking their health data. By addressing these points, GluGuide aims to be a comprehensive, user-friendly, and secure platform that empowers pregnant individuals to manage their condition effectively.

The following picture shows the overall use case diagram of our software.
(Add here use case diagram)

# 3. Specific Requirements


## 3.1 Functionality
This section will explain the different use cases illustrated in the Use Case Diagram and their functionality.
By November, we plan to implement:

-3.1.1 Creating an account
-3.1.2 Logging in
-3.1.3 Logging out
-3.1.4 Tracking glucose levels
-3.1.5 Tracking a meal

By June, we plan to implement:

-3.1.6 Deleting tracked information
-3.1.7 Learning about GDE
-3.1.8 Receiving notifications



### 3.1.1 Creating an account
To ensure user identification, the webapp requires an account system that links all trackes data to each user.

### 3.1.2 Logging in
The webapp will provide the possiblity to register and log in to use the functions.

### 3.1.3 Logging out
In case the user are no longer in need for the service or any other reason, it is possible to manually log out.

### 3.1.4 Track glucose level
Use Case Diagram here

### 3.1.5 Track a meal
Use Case Diagram here

### 3.1.6 Delete the tracked information
Use Case Diagram here

### 3.1.7 Learn about GDE
Use Case Diagram here

### 3.1.8 Get Notifications
Use Case Diagram here


## 3.2 Usability

### 3.2.1 Security
The Webapp must ensure secure data handling to compliance with healthcare data protection laws. Otherwise the user won't feel comfortable to share information. 


## 3.3 Reliability

### 3.3.1 Server availability
Our Server should ensure a 95% up-time.


## 3.4 Performance


### 3.4.1 Real Time Updates
The webapp must support real-time updates for blood sugar tracking and meal tracking.


## 3.5 Supportability

### 3.5.1 Language Support
We will use the following languages, which will be well supported in the future:
-JavaScript
-HTML


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
mockups 

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
If you would like to know the current state of this project please visit your [Blog](https://gdewomenhealth.wordpress.com/).
