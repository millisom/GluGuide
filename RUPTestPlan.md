# GluGuide Test Plan

## Table of contents

- [1. Introduction](#1-introduction)
  * [1.1 Purpose](#11-purpose)
  * [1.2 Scope](#12-scope)
  * [1.3 Intended Audience](#13-intended-audience)
  * [1.4 Document Terminology and Acronyms](#14-document-terminology-and-acronyms)
  * [1.5  References](#15--references)
  * [1.6 Document Structure](#16-document-structure)
- [2. Evaluation Mission and Test Motivation](#2-evaluation-mission-and-test-motivation)
  * [2.1 Background](#21-background)
  * [2.2 Evaluation Mission](#22-evaluation-mission)
  * [2.3 Test Motivators](#23-test-motivators)
- [3. Target Test Items](#3-target-test-items)
- [4. Outline of Planned Tests](#4-outline-of-planned-tests)
  * [4.1 Outline of Test Inclusions](#41-outline-of-test-inclusions)
  * [4.2 Outline of Other Candidates for Potential Inclusion](#42-outline-of-other-candidates-for-potential-inclusion)
  * [4.3 Outline of Test Exclusions](#43-outline-of-test-exclusions)
- [5. Test Approach](#5-test-approach)
  * [5.1 Initial Test-Idea Catalogs and Other Reference Sources](#51-initial-test-idea-catalogs-and-other-reference-sources)
  * [5.2 Testing Techniques and Types](#52-testing-techniques-and-types)
    + [5.2.1 Data and Database Integrity Testing](#521-data-and-database-integrity-testing)
    + [5.2.2 Functional Testing](#522-functional-testing)
    + [5.2.3 Business Cycle Testing](#523-business-cycle-testing)
    + [5.2.4 User Interface Testing](#524-user-interface-testing)
    + [5.2.5 Performance Profiling](#525-performance-profiling)
    + [5.2.6 Load Testing](#526-load-testing)
    + [5.2.7 Stress Testing](#527-stress-testing)
    + [5.2.8 Volume Testing](#528-volume-testing)
    + [5.2.9 Security and Access Control Testing](#529-security-and-access-control-testing)
    + [5.2.10 Failover and Recovery Testing](#5210-failover-and-recovery-testing)
    + [5.2.11 Configuration Testing](#5211-configuration-testing)
    + [5.2.12 Installation Testing](#5212-installation-testing)
- [6. Entry and Exit Criteria](#6-entry-and-exit-criteria)
  * [6.1 Test Plan](#61-test-plan)
    + [6.1.1 Test Plan Entry Criteria](#611-test-plan-entry-criteria)
    + [6.1.2 Test Plan Exit Criteria](#612-test-plan-exit-criteria)
    + [6.1.3 Suspension and Resumption Criteria](#613-suspension-and-resumption-criteria)
  * [6.2 Test Cycles](#62-test-cycles)
      - [6.2.1 Test Cycle Entry Criteria](#621-test-cycle-entry-criteria)
      - [6.2.2 Test Cycle Exit Criteria](#622-test-cycle-exit-criteria)
      - [6.2.3 Test Cycle Abnormal Termination](#623-test-cycle-abnormal-termination)
- [7. Deliverables](#7-deliverables)
- [7.1 Test Evaluation Summaries](#71-test-evaluation-summaries)
- [7.2 Reporting on Test Coverage](#72-reporting-on-test-coverage)
- [7.3 Perceived Quality Reports](#73-perceived-quality-reports)
- [7.4 Incident Logs and Change Requests](#74-incident-logs-and-change-requests)
- [7.5 Smoke Test Suite and Supporting Test Scripts](#75-smoke-test-suite-and-supporting-test-scripts)
- [7.6      Additional Work Products](#76------additional-work-products)
  * [7.6.1     Detailed Test Results](#761-----detailed-test-results)
  * [7.6.2     Additional Automated Functional Test Scripts](#762-----additional-automated-functional-test-scripts)
  * [7.6.3     Test Guidelines](#763-----test-guidelines)
  * [7.6.4     Traceability Matrices](#764-----traceability-matrices)
- [8. Testing Workflow](#8-testing-workflow)
- [9. Environmental Needs](#9-environmental-needs)
  * [9.1 Base System Hardware](#91-base-system-hardware)
  * [9.2 Base Software Elements in the Test Environment](#92-base-software-elements-in-the-test-environment)
  * [9.3 Productivity and Support Tools](#93-productivity-and-support-tools)
  * [9.4 Test Environment Configurations](#94-test-environment-configurations)
- [10. Responsibilities, Staffing, and Training Needs](#10-responsibilities--staffing--and-training-needs)
  * [10.1 People and Roles](#101-people-and-roles)
  * [10.2 Staffing and Training Needs](#102-staffing-and-training-needs)
- [11. Iteration Milestones](#11-iteration-milestones)
- [12. Risks, Dependencies, Assumptions, and Constraints](#12-risks--dependencies--assumptions--and-constraints)
- [13. Management Process and Procedures](#13-management-process-and-procedures)

## 1. Introduction

### 1.1 Purpose

The purpose of this test plan is to define the testing strategy for the GluGuide project — a full-stack application using Node.js, Express, React, and PostgreSQL. It describes the objectives, scope, approach, and resources needed for the testing effort.

This test plan supports the following objectives:

- Define the scope of testing for frontend, backend, API, and end-to-end scenarios.
- Establish a process to verify the quality and reliability of application features.
- Outline tools and techniques used to test the application effectively.
- Identify risks and provide mitigation strategies.

### 1.2 Scope

This plan covers:

- Frontend testing: UI components, user interactions.
- Backend testing: Routes, middleware, services.
- API testing: REST endpoint validation.
- End-to-end testing: Full user journey workflows.

Out of scope:

- Load and performance testing.
- Mobile platform testing.

### 1.3 Intended Audience

This document is intended for:

- Developers
- Test engineers
- Project managers
- QA analysts
- Stakeholders interested in quality assurance

### 1.4 Terminology and Acronyms

| Abbr | Abbreviation                         |
|------|--------------------------------------|
| API  | Application Programming Interface    |
| CI   | Continuous Integration               |
| CD   | Continuous Delivery                  |
| E2E  | End-to-End                           |
| BDD  | Behavior-Driven Development          |
| DB   | Database                             |
| UI   | User Interface                       |

### 1.5 References

| Title                          | Date     | Author/Org          |
|--------------------------------|----------|---------------------|
| GitHub Repository              | Ongoing  | GluGuide Team       |
| Software Requirements Spec     | 2024     | GluGuide Team       |
| Architecture Document          | 2024     | GluGuide Team       |

### 1.6 Document Structure

This plan outlines the testing scope, techniques, tools, deliverables, and team responsibilities following the Rational Unified Process (RUP) structure.

---

## 2. Evaluation Mission and Test Motivation

### 2.1 Background

GluGuide aims to help users track and manage their glucose levels with insights and intuitive UI. Given the sensitive nature of user data and the importance of health tracking, a strong testing strategy is essential to ensure usability, reliability, and data correctness.

### 2.2 Evaluation Mission

- Validate feature completeness and correctness.
- Ensure UI meets usability expectations.
- Verify backend and database logic.
- Simulate real-world user scenarios and edge cases.
- Catch regressions through automation.

### 2.3 Test Motivators

- Data integrity for glucose tracking.
- Secure user authentication and authorization.
- Correctness of API behavior.
- UI responsiveness and accessibility.

---

## 3. Target Test Items

- Frontend (React): Pages, forms, components.
- Backend (Express): Routes, controllers, services.
- Database (PostgreSQL): Schema validation, queries.
- APIs: RESTful endpoints.
- Full workflows: E2E flows (login, dashboard interaction, tracking submission).

---

## 4. Outline of Planned Tests

### 4.1 Outline of Test Inclusions

**Frontend:**

- Unit testing with Jest.
- Component testing with React Testing Library.

**Backend:**

- Unit testing with Jest (controllers/services).
- Integration testing for routes.

**API:**

- Postman scripts for endpoint validation.

**E2E:**

- Cucumber + Selenium for behavior-driven testing.

### 4.2 Outline of Candidates for Potential Inclusion

- Accessibility testing using tools like axe-core.
- Manual exploratory testing.

### 4.3 Outline of Test Exclusions

- Load/performance testing.
- Mobile/responsive testing.

---

## 5. Test Approach

### 5.1 Initial Test-Idea Catalogs

- Acceptance criteria in Gherkin syntax.
- Common failure points (login, DB write operations).

### 5.2 Testing Techniques and Types

- Unit Testing – Jest
- Component/UI Testing – React Testing Library
- End-to-End Testing – Cucumber + Selenium
- API Testing – Postman + Newman

---

## 6. Entry and Exit Criteria

### 6.1 Test Plan

#### Entry Criteria

- Feature complete (development done).
- Code pushed to `dev` branch (to be implemented).

#### Exit Criteria

- All critical tests passed.
- Regression suite green.

### 6.2 Test Cycles

- Weekly regression cycle.
- Pre-release testing on `main`.

---

## 7. Deliverables

- Unit and integration test reports (Jest).
- E2E test logs (Cucumber).
- API test collections (Postman).
- Test coverage reports.
- Test summary documentation.

---

## 8. Testing Workflow

- Azure DevOps pipelines will:
  - Trigger on pull requests and merges to `dev` and `main`.
  - Run Jest tests (frontend and backend).
  - Run Postman collection using Newman.
  - Deploy to staging (on merge to `dev`).
  - Deploy to production (on merge to `main`).
- Manual approval gates for production deployment: In Azure DevOps, you can set up approval gates to prevent a release from going into production without someone (usually a developer, QA lead, or product owner) manually reviewing and approving it.
- Cucumber + Selenium E2E tests triggered via pipeline or local execution.

---

## 9. Environmental Needs

### 9.1 Base System Hardware

| Resource              | Quantity | Name and Type                         |
|-----------------------|----------|---------------------------------------|
| Frontend Hosting      | 1        | Azure Static Web Apps                 |
| Backend Hosting       | 1        | Azure App Service                     |
| CI/CD Runner          | 1        | Azure DevOps Pipelines Agent          |
| PostgreSQL Database   | 1        | Azure Database for PostgreSQL         |
| Test Environment      | 1        | Staging instance                      |

### 9.2 Base Software Elements in the Test Environment

| Software Element        | Type/Notes                                 |
|-------------------------|---------------------------------------------|
| Node.js                 | Backend runtime environment                 |
| PostgreSQL              | Primary relational database                 |
| React                   | Frontend framework                          |
| Azure CLI               | Deployment and environment scripting        |
| Azure DevOps Pipelines  | CI/CD automation                            |

### 9.3 Productivity and Support Tools

| Tool Category         | Tool               | Source         | Version |
|----------------------|--------------------|----------------|---------|
| CI/CD                | Azure DevOps       | Microsoft      | Latest  |
| Test Management      | Notion             | Internal       | Latest  |
| Monitoring/Logging   | Azure Monitor      | Microsoft      | Latest  |
| DBMS Tools           | pgAdmin            | Open Source (Aiven)   | Latest  |

### 9.4 Test Environment Configurations

| Config Name                 | Description                                         | Implemented in Physical Config |
|----------------------------|-----------------------------------------------------|--------------------------------|
| Azure Staging Config       | Staging deployments on App Service + Static Web App | No                            |
| Azure Production Config    | Production deployment mirror of staging             | No                           |
| Developer Test Environment | Local environment (Node.js, PostgreSQL, React)      | Yes                            |

---

## 10. Responsibilities, Staffing, and Training Needs

| Role         | Responsibility                                                 |
|--------------|----------------------------------------------------------------|
| QA Lead      | Oversees planning, CI test pipelines                           |
| Frontend Dev | Write Jest & UI tests                                          |
| Backend Dev  | Write Jest tests for logic and APIs                            |
| Test Eng     | Create and maintain E2E flows with Cucumber + Selenium         |

---

## 11. Iteration Milestones

- Maintain >85% test code coverage across all components.

---

## 12. Risks, Dependencies, Assumptions, and Constraints

| Risk                        | Mitigation                              |
|-----------------------------|------------------------------------------|
| CI fails on merge           | Block merges until pipeline is green     |
| API schema changes frequently | Sync updates in Postman and E2E tests   |
| Test flakiness in E2E tests | Improve selector usage and retry logic   |

---

## 13. Management Process

- Weekly test status reviews.
- Pull request validation reports.
- Centralized dashboard for test health and coverage.