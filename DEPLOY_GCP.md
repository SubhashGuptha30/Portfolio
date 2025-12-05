# 🚀 Deploying to Google Cloud Run (with Firebase Hosting)

This guide provides a detailed, click-by-click walkthrough to deploy your portfolio using **Google Cloud Run** and **Firebase Hosting**.

**Why this setup?**
1.  **Cloud Run**: Runs your Next.js app. It scales to zero (costs $0 when no one visits).
2.  **Firebase Hosting**: Acts as a "bridge" to connect your custom domain (`subhashguptha.online`) because Cloud Run domain mapping is limited in the `asia-south1` region. It also provides a global CDN.

---

## Prerequisites
1.  A **Google Cloud Account** (Sign up at [cloud.google.com](https://cloud.google.com/)).
2.  Your code pushed to **GitHub**.
3.  **Node.js** installed on your computer.

---

## Part 1: Deploy to Cloud Run

### Step 1: Open Google Cloud Console
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Select a Project**:
    *   Click the dropdown in the top-left header.
    *   Click **New Project**.
    *   Project Name: `portfolio-website`.
    *   Click **Create**.

### Step 2: Create Service
1.  Search for **"Cloud Run"** and open it.
2.  Click **Create Service**.
3.  Click **SET UP WITH CLOUD BUILD** (under "Deploy one revision from an existing container image").

### Step 3: Connect GitHub
1.  **Repository Provider**: Select **GitHub**.
2.  **Repository**: Select `SubhashGuptha30/Portfolio`.
3.  **Build Configuration**: Select **Dockerfile**.
4.  Click **Save**.

### Step 4: Configure Service
1.  **Service name**: `portfolio`.
2.  **Region**: `asia-south1` (Mumbai).
3.  **Authentication**: Select **Allow unauthenticated invocations** (Public).
4.  **CPU allocation**: Select **CPU is only allocated during request processing** (Scale to Zero).

### Step 5: Environment Variables
1.  Expand **Container, Networking, Security**.
2.  Go to **Variables & Secrets** tab.
3.  Add your Sanity variables:
    *   `NEXT_PUBLIC_SANITY_PROJECT_ID`: `your_project_id`
    *   `NEXT_PUBLIC_SANITY_DATASET`: `production`
    *   `NEXT_PUBLIC_SANITY_API_VERSION`: `2024-01-01`
    *   `HOSTNAME`: `0.0.0.0`
    *   `PORT`: `3000`
4.  Click **Create**.

*Wait for the deployment to finish. You will get a URL like `https://portfolio-xyz.asia-south1.run.app`.*

---

## Part 2: Connect Custom Domain (Firebase Hosting)

Since `asia-south1` doesn't support direct domain mapping yet, we use Firebase.

### Step 1: Install Firebase CLI
Open your VS Code terminal and run:
```bash
npm install -g firebase-tools
```

### Step 2: Login
```bash
firebase login
```

### Step 3: Enable Firebase
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Create a project**.
3.  Select your existing Google Cloud project (`portfolio-website-...`) from the dropdown.
4.  Click **Continue** -> **Add Firebase**.

### Step 4: Configure & Deploy
We have already created the config files (`firebase.json` and `.firebaserc`) for you. Just run:
```bash
firebase deploy --only hosting
```
This will give you a Firebase URL (e.g., `https://portfolio-website-479715.web.app`).

### Step 5: Map Domain
1.  Go to [Firebase Hosting Console](https://console.firebase.google.com/project/portfolio-website-479715/hosting/sites).
2.  Click **Add Custom Domain**.
3.  Enter `subhashguptha.online`.
4.  **DNS Setup (Namecheap)**:
    *   Select **Quick Setup**.
    *   Go to Namecheap -> **Advanced DNS**.
    *   Add the **TXT Record** provided by Firebase.
    *   Add the **A Record** provided by Firebase.
5.  Click **Verify** in Firebase.

---

## Part 3: Critical Final Step (CORS)

If you skip this, your site will load but show no content.

1.  Go to [manage.sanity.io](https://manage.sanity.io).
2.  Select your project.
3.  Go to **API** > **CORS Origins**.
4.  Click **Add CORS Origin**.
5.  Add your new domain: `https://subhashguptha.online`.
6.  Check **Allow credentials**.
7.  Click **Save**.

---

## 💡 Updating Your Site
*   **Code Changes**: Just `git push` to GitHub. Cloud Run will automatically rebuild and deploy.
*   **Firebase Config**: You rarely need to touch this unless you change the domain.

## 🔧 Troubleshooting
*   **Stuck on Loader?** Check the browser console (F12). If you see "CORS error", you forgot **Part 3**.
*   **Domain not working?** DNS changes can take up to 1 hour. Wait a bit.
