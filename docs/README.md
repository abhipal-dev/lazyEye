# LazyEye Documentation Directory

Welcome to the LazyEye Vision Therapy technical documentation.

## Available Documentation Files

1. [**Architecture, Project Structure & User Levels**](PROJECT_STRUCTURE_AND_USER_LEVELS.md)
   - Comprehensive file-by-file breakdown (`app/`, `resources/`, `routes/`, `database/`, `public/`).
   - Detailed user role definitions (`root`, `admin`, `doctor`, `user`, `Unpaid User`).
   - Role permission matrix and access privileges.
   - Database schema relationships (ER diagram).
   - Clinical lifecycle & patient journey sequence flow.

2. [**Build, Release & Render Deployment Guide**](BUILD_AND_DEPLOYMENT_GUIDE.md)
   - Local prerequisites (Node.js, PHP, Composer, Git).
   - Asset compilation pipeline (`npm run dev`, `npm run prod`, `npm run watch`).
   - Git release workflow (`git status`, `git add`, `git commit`, `git push`).
   - Render deployment settings (Docker container, Apache DocumentRoot, Environment variables).
   - HTTPS and reverse-proxy mixed-content resolution.
   - Troubleshooting common build & permission errors.

3. [**Cloud Database & Deployment Guide**](DATABASE_AND_DEPLOYMENT_GUIDE.md)
   - Clever Cloud MySQL database credentials (`bl2b9yn0gbfcs07f01ic-mysql.services.clever-cloud.com`).
   - Copy-paste ready Render environment variables block.
   - Built-in schema auto-migrator & demo seeder (`ensureDatabaseReady()`).
   - Step-by-step production release workflow.
   - Essential service links (Live App, Render, Clever Cloud, GitHub).

4. [**GitHub Account & Repository Guide**](GITHUB_ACCOUNT_GUIDE.md)
   - Account overview (`abhipal-dev`) and committer email (`abhipal85350@gmail.com`).
   - Personal Access Token (PAT) generation and Windows credentials manager.
   - Git daily push workflow and automated Render webhooks.


