# 🛡️ Alternative Deployment: GitHub Actions + Amazon ECR

If the direct App Runner build keeps failing, the **industry-standard solution** is to build the Docker image *outside* of App Runner (using GitHub Actions) and just tell App Runner to run the finished image.

This method is **100% reliable** because we control the build environment completely.

## Prerequisites
1.  AWS Account.
2.  GitHub Repository.

---

## Step 1: Create an Amazon ECR Repository
1.  Go to **AWS Console** -> Search for **"ECR"** (Elastic Container Registry).
2.  Click **Get Started** or **Create repository**.
3.  **Visibility settings**: `Private`.
4.  **Repository name**: `portfolio`.
5.  Click **Create repository**.

## Step 2: Create an IAM User for GitHub
We need to give GitHub permission to push images to your ECR.

1.  Go to **AWS Console** -> Search for **"IAM"**.
2.  Click **Users** -> **Create user**.
3.  **User name**: `github-actions-deployer`.
4.  Click **Next**.
5.  **Permissions options**: Select **Attach policies directly**.
6.  Search for and select: `AmazonEC2ContainerRegistryFullAccess`.
7.  Click **Next** -> **Create user**.
8.  Click on the newly created user (`github-actions-deployer`).
9.  Go to **Security credentials** tab.
10. Scroll to **Access keys** -> **Create access key**.
11. Select **Command Line Interface (CLI)** -> Check the box -> Next -> Create access key.
12. **COPY** the `Access key` and `Secret access key`. (Don't lose them!).

## Step 3: Configure GitHub Secrets
1.  Go to your **GitHub Repository**.
2.  Click **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **New repository secret**.
4.  Add the following secrets:
    *   `AWS_ACCESS_KEY_ID`: (Paste the Access Key from Step 2)
    *   `AWS_SECRET_ACCESS_KEY`: (Paste the Secret Key from Step 2)
    *   `NEXT_PUBLIC_SANITY_PROJECT_ID`: (Your Sanity Project ID, e.g., `41nqleq3`)

## Step 4: Trigger the Build
1.  Push this code to GitHub.
2.  Go to the **Actions** tab in your GitHub repo.
3.  You should see a workflow named **"Deploy to Amazon ECR"** running.
4.  Wait for it to turn **Green**.

## Step 5: Deploy to App Runner (Final Step)
Once the image is in ECR (Step 4 is green):

1.  Go to **AWS App Runner**.
2.  **Create Service**.
3.  **Source**: Select **Container registry**.
4.  **Provider**: Select **Amazon ECR**.
5.  **Image URI**: Click **Browse** and select your `portfolio` image (tag: `latest`).
6.  **Deployment settings**:
    *   Select **Automatic** (Create new service role if asked).
7.  **Configuration**:
    *   Port: `3000`.
    *   Environment variables: Add your Sanity variables here one last time (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.).
8.  **Create & Deploy**.

**Why this works:**
Instead of asking App Runner to "guess" how to build your app, we are handing it a pre-packaged, ready-to-run box (the Docker image). It cannot fail to build because it's already built!
