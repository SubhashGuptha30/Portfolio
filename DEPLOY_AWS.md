# 🚀 Deploying to AWS App Runner

This guide provides a detailed, click-by-click walkthrough to deploy your portfolio using **AWS App Runner**. App Runner is the easiest way to run a containerized Node.js app on AWS.

## Prerequisites
1.  An **AWS Account** (Sign up at [aws.amazon.com](https://aws.amazon.com/)).
2.  Your code pushed to **GitHub** (which we just did!).

---

## Step 1: Open AWS App Runner
1.  Log in to your [AWS Management Console](https://console.aws.amazon.com/).
2.  In the top search bar, type **"App Runner"**.
3.  Click on **App Runner** from the search results.
4.  Click the orange **Create an App Runner service** button.

## Step 2: Configure Source
1.  **Repository type**: Select **Source code repository**.
2.  **Provider**: Select **GitHub**.
3.  **Connection**:
    *   Click **Add new** (if you haven't connected GitHub before).
    *   A popup will appear. Follow the prompts to authorize AWS to access your GitHub account.
    *   Once authorized, select your GitHub connection name from the dropdown.
4.  **Repository**:
    *   Click the dropdown and search for `SubhashGuptha30/Portfolio`.
    *   Select it.
5.  **Branch**: Select `master` (or `main`).
6.  **Deployment settings**:
    *   Select **Automatic** (this means every time you push to GitHub, AWS will auto-deploy the changes).
7.  Click **Next**.

## Step 3: Configure Build
1.  **Configuration file**: Select **Configure all settings here**.
2.  **Runtime**: Select **Node.js 18**.
3.  **Build command**: Copy and paste this exactly:
    ```bash
    npm install && npm run build
    ```
4.  **Start command**: Copy and paste this exactly:
    ```bash
    npm start
    ```
5.  **Port**: Type `3000`.
6.  Click **Next**.

## Step 4: Configure Service
1.  **Service name**: Enter `portfolio-website`.
2.  **Virtual CPU & Memory**:
    *   CPU: `1 vCPU`
    *   Memory: `2 GB` (Recommended for Next.js builds).
3.  **Environment variables**:
    *   Scroll down to the **Environment variables** section.
    *   Click **Add environment variable**.
    *   Add the following (copy values from your `.env.local` file):
        *   Key: `NEXT_PUBLIC_SANITY_PROJECT_ID` | Value: `your_project_id`
        *   Key: `NEXT_PUBLIC_SANITY_DATASET`    | Value: `production`
        *   Key: `NEXT_PUBLIC_SANITY_API_VERSION` | Value: `2024-01-01`
        *   Key: `HOSTNAME`                       | Value: `0.0.0.0`
        *   Key: `PORT`                           | Value: `3000`
4.  **Auto-scaling**: Leave as default.
5.  **Health check**: Leave as default.
6.  **Security**: Leave as default.
7.  Click **Next**.

## Step 5: Review & Create
1.  Review all the details on the summary page.
2.  Scroll to the bottom and click **Create & deploy**.

---

## Step 6: Connect Custom Domain (subhashguptha.online)
1.  In your App Runner service dashboard, click the **Custom domains** tab.
2.  Click **Link domain**.
3.  Enter `subhashguptha.online`.
4.  Click **Link domain**.
5.  **DNS Configuration (Namecheap)**:
    *   AWS will show you **Certificate validation records** (CNAME) and **DNS target** (CNAME).
    *   Open **Namecheap Dashboard** -> **Domain List** -> `subhashguptha.online` -> **Manage**.
    *   Go to **Advanced DNS**.
    *   **Record 1 (Validation)**:
        *   Type: `CNAME Record`
        *   Host: (Copy the "Name" from AWS, usually starts with `_`)
        *   Value: (Copy the "Value" from AWS)
    *   **Record 2 (Traffic)**:
        *   Type: `CNAME Record`
        *   Host: `@` (or `www` if you prefer)
        *   Value: (Copy the "DNS target" from AWS)
6.  Wait for validation (can take 30 mins to 24 hours). Once active, your site will be live at `https://subhashguptha.online`.

---

## 🎉 What Happens Next?
1.  You will be taken to the Service Dashboard.
2.  The status will say **"Operation in progress"** (this takes about 5-10 minutes).
3.  You can click the **Logs** tab to watch the build process in real-time.
4.  Once finished, the status will turn **Green ("Running")**.
5.  Look for the **Default domain** link at the top of the page (e.g., `https://xyz.awsapprunner.com`).
6.  Click it to see your live website!

## 💡 Updating Your Site
Since we selected "Automatic deployment", whenever you make changes and run `git push origin master`, AWS will automatically detect the change, rebuild, and update your live site.

