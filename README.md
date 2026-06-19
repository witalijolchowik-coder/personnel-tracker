# Personnel Tracker

React/Vite application for managing the Personnel Tracker recruitment workflow with Firebase Authentication and Firestore.

## GitHub Pages Deployment Without Local Node.js

The project is prepared so GitHub Actions can install dependencies, build the app, and publish `dist` to GitHub Pages. You do not need to run `npm install` or `npm run build` locally.

## Upload Project To GitHub

1. Create a new GitHub repository named `personnel-tracker`.
2. Upload/push this project to the repository.
3. Make sure the default branch is named `main`.
4. Commit the `.github/workflows/deploy.yml` file with the rest of the project.

## Add Repository Secrets

In GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Go to `Secrets and variables`.
4. Open `Actions`.
5. Click `New repository secret`.
6. Add each secret from the list below.

Required secrets:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Use the values from `.env.example` or from your Firebase project settings.

## Enable GitHub Pages

In GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Go to `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.
5. Save the settings if GitHub asks you to confirm.

## Trigger Deployment

1. Push changes to the `main` branch.
2. Open the repository `Actions` tab.
3. Click the `Deploy to GitHub Pages` workflow.
4. Wait until both jobs are green:
   - `build`
   - `deploy`

After a successful deploy, the live URL is shown:

- in the workflow summary,
- in `Settings` -> `Pages`.

For a repository named `personnel-tracker`, the URL usually looks like:

```text
https://YOUR_GITHUB_USERNAME.github.io/personnel-tracker/
```

## Vite Base Path

The project is currently configured for a GitHub project repository named `personnel-tracker`:

```js
base: '/personnel-tracker/'
```

If your repository name is different, update `base` in `vite.config.js`:

```js
base: '/your-repository-name/'
```

If you deploy to a user repository named `username.github.io`, use:

```js
base: '/'
```

## Local Development Optional

Local development still works if Node.js is available:

```bash
npm install
npm run dev
```

For production build:

```bash
npm run build
```

## Firebase

The app reads Firebase configuration from Vite environment variables only. Firebase values are passed to the GitHub Actions build from Repository Secrets.

The Firestore rules template is available in:

```text
firestore.rules
```
