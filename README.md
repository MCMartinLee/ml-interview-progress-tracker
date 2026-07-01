# ML Interview Sprint Tracker

Firebase-backed static web app for tracking a 25-day ML interview sprint, job applications, interview history, progress analytics, and exports.

## Features

- Firebase Authentication with Google sign-in
- Commented examples for GitHub and email/password auth in `js/auth.js`
- Cloud Firestore sync across devices
- Firestore offline persistence and cached PWA assets
- First-login localStorage migration prompt
- Debounced one-second autosave for progress edits
- Dashboard metrics, weekly chart, daily heatmap, and category analytics
- Job-search Kanban with drag-and-drop cards
- Interview history dashboard
- JSON, CSV, and Markdown export plus JSON import
- Light/dark mode and responsive layouts
- Sunday backup documents with last-10 retention

## Firebase Setup

1. Create a Firebase project at <https://console.firebase.google.com/>.
2. Add a Web App in Project settings.
3. Copy the web app config values into `firebase-config.js`.
4. Enable Authentication > Sign-in method > Google.
5. Optional providers:
   - Enable GitHub and then uncomment the GitHub example in `js/auth.js`.
   - Enable Email/Password and uncomment the email examples in `js/auth.js`.
6. Enable Firestore Database in production mode.
7. Publish rules from `firebase/rules.firestore`.

`firebase-config.js` uses plain JS constants because this app has no build step. `.env.example` shows equivalent `VITE_` names if you later add Vite.

## Firestore Structure

```text
users/{uid}/profile/main
users/{uid}/progress/day-plan
users/{uid}/applications/{applicationId}
users/{uid}/notes/{noteId}
users/{uid}/settings/preferences
users/{uid}/statistics/summary
users/{uid}/interviews/{interviewId}
users/{uid}/backups/{yyyy-mm-dd}
```

Progress documents include checkbox state, notes, open days, and `updatedAt`. Application documents include company, role, source, status, applied date, next step, salary, location, notes, and `updatedAt`.

## Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Local Development

Use a local server because the app uses ES modules and a service worker.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Firebase Hosting

Install the Firebase CLI and deploy:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy
```

The root `firebase.json` points hosting to this static directory and Firestore rules to `firebase/rules.firestore`.

## GitHub Pages

The app remains a static site and can still be deployed with GitHub Pages. In Firebase Console Authentication settings, add the GitHub Pages domain to Authorized domains:

```text
YOUR-USERNAME.github.io
```

Then enable Pages from repository settings or keep the existing GitHub Actions workflow.

## Firestore Indexes

No composite indexes are required. The app uses document reads, collection reads, and a single-field `createdAt` backup query supported by Firestore's default single-field indexes.

## Folder Structure

```text
.
|-- assets/
|   `-- icon.svg
|-- components/
|-- css/
|   `-- styles.css
|-- firebase/
|   `-- rules.firestore
|-- js/
|   |-- app.js
|   |-- auth.js
|   |-- data.js
|   |-- firebase.js
|   |-- firestore.js
|   `-- notifications.js
|-- .env.example
|-- firebase-config.js
|-- firebase.json
|-- index.html
|-- manifest.json
|-- service-worker.js
`-- README.md
```

## Notes

Firebase web config is public project metadata, not a private server secret. Real access control is enforced by Authentication and Firestore Security Rules.

