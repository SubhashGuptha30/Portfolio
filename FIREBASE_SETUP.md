# 🔥 Firebase Hosting Setup

Since Cloud Run domain mapping isn't available in `asia-south1`, we will use **Firebase Hosting** as a bridge. It's free, fast, and works perfectly with Cloud Run.

## Step 1: Install Firebase CLI
Open your terminal (VS Code) and run:
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
Run this command and follow the browser prompt to log in with your Google account:
```bash
firebase login
```

## Step 3: Enable Firebase in Google Cloud
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Create a project"** (or "Add project").
3.  **Enter your project name**: Type `portfolio-website-479715` (it should appear in the dropdown as an existing Google Cloud project).
4.  Select it and click **Continue**.
5.  **Google Analytics**: You can disable this for now.
6.  Click **Add Firebase**.
7.  Wait for it to finish, then click **Continue**.

## Step 4: Deploy
Back in your VS Code terminal, run:
```bash
firebase deploy --only hosting
```

## Step 5: Connect Domain
1.  Once deployed, the terminal will show a "Hosting URL". Click it to verify it works.
2.  Go to your [Firebase Console](https://console.firebase.google.com/project/portfolio-website-479715/hosting/sites).
3.  Click **Hosting** in the sidebar.
4.  Click **Add Custom Domain**.
5.  Enter `subhashguptha.online`.
6.  Follow the instructions to update your DNS records in **Namecheap** (similar to what we tried before, but this time for Firebase).
