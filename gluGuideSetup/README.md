# Set Up

This project is a Vite-based React frontend with an Express.js backend with MVC pattern.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (which includes npm)
## App
### Client Side (React Frontend)
#### 1. Navigate to the client folder

```bash
cd client
```
#### 2. Install Dependencies
To install the necessary dependencies for the React frontend, run:
```bash
npm install
```
#### 3. Run the Frontend
To run the React frontend, execute:
```bash
npm run dev
```
This will start the Vite development server. The application will be accessible at http://localhost:5173 by default.

### Server Side (Express Backend)
#### 1. Navigate to the Server Directory

```bash
cd server
```
#### 2. Install Dependencies
To install the necessary dependencies for the Express backend, run:
```bash
npm install
```
#### 3. Start the Backend
To start the backend server, run:
```bash
npm start
```
The server will be running on http://localhost:8080 by default.

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

## Create a branch using Git CLI

Before creating a new branch, pull the changes from upstream. Your master needs to be up to date.

```bash
$ git pull]
```
Create the branch on your local machine and switch in this branch:
```bash
$ git checkout -b [name_of_your_new_branch]
```
Push the branch on GitHub:
```bash
$ git push origin [name_of_your_new_branch]
```


