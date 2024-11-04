# Set Up

This project is a Vite-based React frontend with an Express.js backend with MVC pattern.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (which includes npm)
## App
### Starting Client & Server Side
#### 1. Navigate to the client folder

```bash
cd client
```
#### or  to the server folder
```bash
cd server
```

#### 2. Install Dependencies
To install the necessary dependencies on both client and server side, run:
```bash
npm install
```
#### 3. Start the Servers
To start the backend and the client server, run:
```bash
npm start
```
in the client folder.

The server will be running on http://localhost:8080 by default.
And the client will be running on http://localhost:5173 by default.

## Github
#### 1. Clone the repository

To get a copy of the project, run the following command:

```bash
git clone https://github.com/millisom/GluGuide.git
```

#### 2.  Update to the Main Branch

Before making any changes, always ensure you are working on the latest version of the main branch:

```bash
git checkout main
git pull origin main
```

#### 3. Create a New Branch
To start working on a new feature or issue, create a new branch:

```bash
git checkout -b your-feature-branch
```
Replace your-feature-branch with a meaningful name for your new branch (e.g., feature/add-login-page).

#### 4. Push Changes to GitHub
After committing your changes locally, push your branch to GitHub:

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin your-feature-branch
```
#### 5. Pull Requests
Once your work is complete, create a pull request to merge your changes into the main branch:
```bash
git checkout main
git pull origin main 
git merge your-feature-branch
```
Push the changes to the main branch:
```bash
git push origin main
```
