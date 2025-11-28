
# 🚀 Deploying to Google Cloud Run

This guide provides a detailed, click-by-click walkthrough to deploy your portfolio using **Google Cloud Run**. Cloud Run is a fully managed platform that automatically scales your containerized app.

## Prerequisites
1.  A **Google Cloud Account** (Sign up at [cloud.google.com](https://cloud.google.com/)).
2.  Your code pushed to **GitHub**.

---

## Step 1: Open Google Cloud Console
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Select a Project**:
    *   Click the dropdown in the top-left header (next to the Google Cloud logo).
    *   Click **New Project** (top right of the popup).
    *   Project Name: `portfolio-website`.
    *   Click **Create**.
    *   Wait a moment, then select the new project from the notification bell or the dropdown.

## Step 2: Enable Cloud Run
1.  In the top search bar, type **"Cloud Run"**.
2.  Click on **Cloud Run** from the results.
3.  If prompted, click **Enable API**.

## Step 3: Create Service
1.  Click the **Create Service** button (top of the page).
2.  **Deploy one revision from an existing container image**:
    *   Actually, we want to connect GitHub directly.
    *   Look for the option **"Continuously deploy new revisions from a source repository"**.
    *   Click **SET UP WITH CLOUD BUILD**.

## Step 4: Connect GitHub (Cloud Build)
1.  **Repository Provider**: Select **GitHub**.
2.  **Repository**:
    *   Click **Manage connected repositories** (if needed) to authorize Google Cloud to access your GitHub.
    *   Select `SubhashGuptha30/Portfolio`.
    *   Check the box to agree to terms.
    *   Click **Next**.
3.  **Build Configuration**:
    *   Select **Dockerfile**.
    *   **Source location**: `/Dockerfile` (should be default).
4.  Click **Save**.

## Step 5: Configure Service Settings
1.  **Service name**: `portfolio` (default is fine).
2.  **Region**: Select a region close to you (e.g., `us-central1` or `asia-south1`).
3.  **Authentication**:
    *   **IMPORTANT**: Select **Allow unauthenticated invocations**.
    *   This makes your website public so anyone can visit it.
4.  **CPU allocation and pricing**:
    *   Select **CPU is only allocated during request processing**.

## Step 6: Environment Variables & Resources
1.  Click the arrow to expand **Container, Networking, Security**.
2.  Click the **Variables & Secrets** tab.
3.  Click **Add Variable**.
4.  Add your Sanity variables (from `.env.local`):
    *   Name: `NEXT_PUBLIC_SANITY_PROJECT_ID` | Value: `your_project_id`
    *   Name: `NEXT_PUBLIC_SANITY_DATASET`    | Value: `production`
    *   Name: `NEXT_PUBLIC_SANITY_API_VERSION` | Value: `2024-01-01`
    *   Name: `HOSTNAME`                       | Value: `0.0.0.0`
    *   Name: `PORT`                           | Value: `3000`
5.  **Container tab** (Optional but recommended):
    *   Scroll up to the **Container** tab.
    *   **Memory**: Set to `1 GiB` or `2 GiB`.
    *   **CPU**: `1` is usually enough.

## Step 7: Create
1.  Click the **Create** button at the bottom.

---

## Step 8: Connect Custom Domain (subhashguptha.online)
1.  In the Cloud Run dashboard, click **Manage Custom Domains** (top bar).
2.  Click **Add Mapping**.
3.  **Select service**: `portfolio`.
4.  **Select domain**:
    *   Select **Verify a new domain**.
    *   Enter `subhashguptha.online`.
    *   Click **Verify**. This will open Google Webmaster Central.
    *   **Namecheap Verification**:
        *   Choose **DNS TXT record** method.
        *   Copy the TXT record provided by Google.
        *   Go to **Namecheap** -> **Advanced DNS**.
        *   Add New Record -> Type: `TXT Record` -> Host: `@` -> Value: (Paste Google's code).
        *   Wait 5 mins, then click **Verify** in Google.
5.  Once verified, go back to Cloud Run and finish mapping.
6.  **Update DNS (Namecheap)**:
    *   Google will provide you with **A records** and **AAAA records**.
    *   In Namecheap **Advanced DNS**:
        *   Delete existing A/CNAME records for `@`.
        *   Add the **A records** provided by Google (usually 4 of them).
        *   Add the **AAAA records** (usually 4 of them).
7.  Wait for propagation (15 mins to 1 hour).

---

## 🎉 What Happens Next?
1.  You will see a dashboard showing the deployment progress.
2.  Cloud Build will start building your Docker image from GitHub (this takes 3-5 minutes).
3.  Once the build is done, Cloud Run will deploy it.
4.  When you see a **Green Checkmark**, look for the **URL** at the top (e.g., `https://portfolio-xyz-uc.a.run.app`).
5.  Click it to view your site!

## 💡 Updating Your Site
Because we set up "Continuous Deployment", whenever you push changes to GitHub (`git push`), Google Cloud Build will automatically trigger, rebuild your Docker image, and update the live site on Cloud Run.
