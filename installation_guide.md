## Installation Instructions

### Step 1: Update and Install Packages

To update Quill and install eslint plugins, run the following commands:

npm update quill
npm install eslint-plugin-n --save-dev
npm install eslint-plugin-promise --save-dev

Ensure that the installed packages are listed in your package.json under the devDependencies section:

"devDependencies": {
"@mui/types": "^7.2.4",
"@types/react": "^18.2.14",
"eslint-plugin-n": "^17.6.0",
"eslint-plugin-promise": "^6.1.1"
}

### Step 2: Add Google OAuth Provider Client ID

In your env.md file, add the client ID with your Google API Client ID:
clientId="77667127780-sfmalfalf-asjbfkasla"

In your index.tsx:

    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID as string}>

Replace "77667127780-sfmalfalf-asjbfkasla" with your actual Client ID from the Google API.

### Step 3: Update API Base URL

In ApiUrls.tsx, change the export statement from using process.env.REACT_APP_API_BASE_URL to a hardcoded URL:

    export const SERVER = "http://localhost:8000/api/";

This sets the SERVER constant to "http://localhost:8000/api/", assuming your API is running locally on port 8000.

### Troubleshooting Tips

If you encounter any issues during installation or setup, try the following troubleshooting steps:

-Ensure that you have the latest version of Node.js and npm installed.
-Double-check your network connection to ensure that npm can download packages from the registry.
-If you encounter dependency conflicts, try running npm install with the --force flag to force installation.
-If you're having trouble with eslint plugins, verify that they are correctly configured in your ESLint configuration file (eslint.config.js).
