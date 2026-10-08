# LazyEye - Cloud Database & Deployment Guide

This guide documents the **Clever Cloud MySQL** database configuration, **Render Web Service** deployment steps, environment variables, and essential service links for the **LazyEye** vision therapy platform.

---

## 1. Clever Cloud MySQL Database Credentials

Your permanent cloud MySQL database is hosted on **Clever Cloud (Free Dev Tier)**.

| Parameter | Value | Laravel Environment Variable |
| :--- | :--- | :--- |
| **Database Engine** | MySQL 8.x | `DB_CONNECTION=mysql` |
| **Host** | `bl2b9yn0gbfcs07f01ic-mysql.services.clever-cloud.com` | `DB_HOST` |
| **Port** | `3306` | `DB_PORT` |
| **Database Name** | `bl2b9yn0gbfcs07f01ic` | `DB_DATABASE` |
| **User** | `ugltthhrgmilvln7` | `DB_USERNAME` |
| **Password** | `niXVKgSEr6Tk3Splr8OJ` | `DB_PASSWORD` |
| **Connection URI** | `mysql://ugltthhrgmilvln7:niXVKgSEr6Tk3Splr8OJ@bl2b9yn0gbfcs07f01ic-mysql.services.clever-cloud.com:3306/bl2b9yn0gbfcs07f01ic` | — |
| **MySQL CLI Command** | `mysql -h bl2b9yn0gbfcs07f01ic-mysql.services.clever-cloud.com -P 3306 -u ugltthhrgmilvln7 -p bl2b9yn0gbfcs07f01ic` | — |

> [!TIP]
> **One-Click Export**: In your [Clever Cloud Console](https://console.clever-cloud.com/), you can also click the blue **"Export Environment Variables"** button in the top-right corner of your MySQL add-on dashboard to copy all credentials formatted as environment variables.

---

## 2. Render Environment Variables (Copy & Paste)

To connect your live application on Render to your Clever Cloud MySQL database, copy and paste the following block into Render:

### Instructions:
1. Log into your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click on your Web Service: **`lazyeye`**.
3. In the left navigation sidebar, select **Environment**.
4. Add or update the following key-value pairs:

```ini
APP_NAME=LazyEye
APP_ENV=production
APP_KEY=base64:jYOrxjekOb0B1hmZbwZnKmKuy2L4rqLXtkOx8Wu0aVk=
APP_DEBUG=false
APP_URL=https://lazyeye.onrender.com
LOG_CHANNEL=stderr

DB_CONNECTION=mysql
DB_HOST=bl2b9yn0gbfcs07f01ic-mysql.services.clever-cloud.com
DB_PORT=3306
DB_DATABASE=bl2b9yn0gbfcs07f01ic
DB_USERNAME=ugltthhrgmilvln7
DB_PASSWORD=niXVKgSEr6Tk3Splr8OJ

SESSION_DRIVER=cookie
SESSION_LIFETIME=10080
```

5. Click the blue **Save Changes** button at the bottom of the page.
6. Render will automatically trigger a redeployment with your new database connection.

---

## 3. Automated Database Setup (Zero Manual SQL Import)

You **do not need to manually import any `.sql` file** into Clever Cloud. The codebase features a built-in self-healing schema manager (`UserController::ensureDatabaseReady()`):

```mermaid
flowchart TD
    A["App Starts / First Request"] --> B{"Tables Exist in Clever Cloud?"}
    B -->|No| C["Create: users, registers, game_records, doctor_consultations"]
    C --> D["Auto-seed Clinical Demo Data<br>(Admins, Doctors, Patients, Sessions)"]
    B -->|Yes| E["Verify Column Integrity & Doctor Foreign Keys"]
    E --> F["Serve Dashboard with Persistent Cloud Records"]
    D --> F
```

### Self-Healing Features:
1. **Auto-Table Creation**:
   * `users`: Stores patient, doctor, and admin profiles, eye calibrations, and allotted session times.
   * `registers`: Stores self-registered accounts awaiting admin/doctor approval.
   * `game_records`: Normalized high-performance table storing therapy game sessions, scores, durations, and UTC timestamps.
   * `doctor_consultations`: Clinical evaluations, prescribed vision therapy regimens, and doctor consultation notes.
2. **Instant Demo Seeder Button**:
   * On the Admin/Doctor Dashboard, click the **`[⚡ Seed Demo Data]`** button anytime to instantly populate 4 patients, 2 doctors, 2 admins, 42 game sessions, and 3 consultations.
   * Or directly visit: `https://lazyeye.onrender.com/seedDemoData`

---

## 4. Complete Step-by-Step Deployment Workflow

### Step 1: Commit and Push Code from Local Machine
Whenever you make updates locally, run:
```bash
# 1. Verify status
git status

# 2. Compile React assets (if JS/CSS was modified)
npm run prod

# 3. Stage changes
git add .

# 4. Commit
git commit -m "Configure persistent cloud database and deploy updates"

# 5. Push to GitHub main branch
git push origin main
```

---

### Step 2: Render Automatic Build & Deployment
Once pushed to `main`:
1. Render receives GitHub's webhook and starts building the Docker container according to [`Dockerfile`](file:///d:/Abhishek_Projects/lazyEye/Dockerfile).
2. The Apache web server starts and points to `/var/www/html/public`.
3. Laravel connects directly to Clever Cloud MySQL on port `3306`.
4. The deployment becomes live at: **[https://lazyeye.onrender.com](https://lazyeye.onrender.com)**.

---

### Step 3: Verify Live Deployment
1. Open **[https://lazyeye.onrender.com](https://lazyeye.onrender.com)** in your browser.
2. Log into the Admin panel using:
   * **Username**: `admin`
   * **Password**: `9870`
3. Verify that the Dashboard displays active patients, doctors, and game records.
4. Play any game or complete a Tumbling 'E' Visual Acuity test from a patient account.
5. Exit fullscreen or click **`[ Finish Therapy & Save ]`** $\to$ observe the record permanently saved to Clever Cloud MySQL.

---

## 5. Essential Service Links

| Service | Purpose | URL |
| :--- | :--- | :--- |
| **Live Web App** | Production Application URL | [https://lazyeye.onrender.com](https://lazyeye.onrender.com) |
| **Render Dashboard** | Manage Web Service, Logs & Environment | [https://dashboard.render.com](https://dashboard.render.com) |
| **Clever Cloud Console** | Cloud MySQL Database Console & Metrics | [https://console.clever-cloud.com](https://console.clever-cloud.com) |
| **GitHub Repository** | Source Code & Version Control | [https://github.com/abhipal-dev/lazyEye](https://github.com/abhipal-dev/lazyEye) |
| **Seed Demo Data Route** | Manual Database Re-Seeding Trigger | [https://lazyeye.onrender.com/seedDemoData](https://lazyeye.onrender.com/seedDemoData) |

---

## 6. Troubleshooting & Diagnostics

### Q: Why does Render take 30-50 seconds to open the website on first click?
* **A**: Render's Free tier puts inactive containers to sleep after 15 minutes of idle time. The first request wakes the container up (a "cold start"). Subsequent requests are fast. With our `SESSION_DRIVER=cookie` upgrade, your login session will remain active across cold starts.

### Q: How do I check if Render is connected to Clever Cloud properly?
* In the Render Dashboard, open your service $\to$ click the **Logs** tab. If the database credentials are valid, Apache starts cleanly with `apache2-foreground` and logs HTTP `200` requests. If credentials are wrong, Laravel will log a `PDOException` in red text.

### Q: How do I back up my database?
* In the [Clever Cloud Console](https://console.clever-cloud.com/), open your MySQL add-on $\to$ click **Backups** tab to download automated daily snapshots of your database at any time.

