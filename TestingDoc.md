# GluGuide Testing Tools

This document outlines the testing tools selected for the GluGuide project, along with the reasoning behind each choice.

---

## Testing Tools Overview

| Area          | Tool(s) Used                     | Why We Chose It                                                                 |
|---------------|----------------------------------|----------------------------------------------------------------------------------|
| **Frontend**  | Jest + React Testing Library     | For fast, reliable unit/component tests that reflect user interactions          |
| **Backend**   | Jest                             | Simple, powerful, and widely used for testing JavaScript/Node.js applications   |
| **End-to-End**| Cucumber + Selenium              | Behavior-driven testing with human-readable scenarios + robust browser control  |
| **API**       | Postman                          | Easy API testing and automation with support for environments and test scripts  |

---

##  Why These Tools?

### 1. **Frontend – Jest & React Testing Library**
- **Jest** is the default choice for React apps, offering fast execution, built-in assertions, and mock support.
- **React Testing Library** promotes testing from the user’s perspective, focusing on real-world usage instead of internal implementation.

**Use Case:** Component testing, form validation, user input interaction.

---

### 2. **Backend – Jest**
- Maintains consistency with frontend (same test runner).
- Supports mocks, spies, and async testing.
- Integrates well with Node.js and Express applications.

**Use Case:** Testing routes, services, database logic, and middleware.

---

### 3. **End-to-End (E2E) – Cucumber & Selenium**
- **Cucumber** allows us to write tests in Gherkin syntax, making test cases readable and understandable for non-dev team members.
- **Selenium** automates real browser interaction, ensuring features work as expected from the user's perspective.

**Use Case:** Simulating full user journeys like login, navigation, and form submissions.

---

### 4. **API Testing – Postman**
- Simple UI for building and testing RESTful APIs.
- Collections can be exported and automated (e.g., using Newman in CI/CD).
- Useful for manual testing during development and automated regression checks later.

**Use Case:** Testing REST endpoints, checking response codes, payloads, and error handling.

---

##  Summary

We selected a combination of developer-friendly and powerful testing tools that support a **full testing pyramid**:  
- **Unit Tests** → Jest  
- **Component/UI Tests** → React Testing Library  
- **E2E Tests** → Cucumber + Selenium  
- **API Tests** → Postman  

This setup ensures **code reliability**, **test coverage**, and a better **developer experience** across the GluGuide project.

