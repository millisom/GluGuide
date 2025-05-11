# GluGuide React Frontend

This is the frontend application for GluGuide, built with React and Vite.

## Setup and Running

### Installation

You can install dependencies in two ways:

1. **From the root directory** (recommended):
   ```bash
   # From /gluGuideSetup folder
   npm install
   ```

2. **From the client directory**:
   ```bash
   # From /gluGuideSetup/client folder
   npm install
   ```

### Running the Application

1. **Start with server** (from root directory):
   ```bash
   # From /gluGuideSetup folder
   npm start
   ```
   This will start both the client and server together.

2. **Start client only**:
   ```bash
   # From /gluGuideSetup folder
   npm run client
   ```
   Or from the client directory:
   ```bash
   # From /gluGuideSetup/client folder
   npm run dev
   ```

The app will be running at http://localhost:5173.

## Development Notes

The client uses Vite with HMR and ESLint for a smooth development experience.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
