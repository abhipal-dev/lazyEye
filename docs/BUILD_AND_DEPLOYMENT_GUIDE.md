# LazyEye — Build, Release & Render Deployment Guide

This guide provides end-to-end instructions for building assets locally, releasing code via Git, and configuring production deployments on **Render**.

---

## 1. Local Prerequisites

Before building or deploying, ensure the following tools are installed on your machine:
- **Node.js**: v16.x or v18.x LTS (with `npm`)
- **PHP**: PHP 8.1+ with extensions: `pdo_sqlite`, `pdo_mysql`, `mbstring`, `gd`, `bcmath`
- **Composer**: Dependency manager for PHP
- **Git**: Configured with your GitHub credentials
- **Docker** *(Optional for local container testing)*: Docker Desktop

---

## 2. Local Asset Compilation (Laravel Mix & React)

LazyEye utilizes **Laravel Mix** (Webpack wrapper) to compile React 18 JSX components and CSS styles into production-ready browser assets.

### Installing Dependencies
```bash
# 1. Install PHP dependencies
composer install

# 2. Install Node.js frontend dependencies
npm install
```

### Compiling Assets

| Command | Purpose | Output |
| :--- | :--- | :--- |
| `npm run dev` | Compiles React components and CSS for local development (fast build, unminified). | Generates `public/js/app.js` and `public/css/app.css` |
| `npm run watch` | Watches for code changes in `resources/js/` and automatically recompiles on save. | Continuous build |
| `npm run prod` | Compiles, minifies, tree-shakes, and optimizes frontend assets for **production release**. | Optimized `public/js/app.js` |

> [!TIP]
> Always run `npm run prod` (or `npm run dev`) before committing frontend changes so the latest compiled `public/js/app.js` is bundled for deployment!

### Running Locally
To test the backend locally without Docker:
```bash
php artisan serve
```
Then visit: `http://localhost:8000`

---

## 3. Git Release & Version Control Workflow

LazyEye is version-controlled on GitHub at:  
👉 **`https://github.com/abhipal-dev/lazyEye.git`** (Default branch: `main`)

### Standard Release Steps

Follow these steps every time you make changes to the codebase:

```bash
# Step 1: Check your modified files
git status

# Step 2: Build frontend assets if you edited any React components
npm run prod

# Step 3: Stage all modified files
git add .

# Step 4: Create a descriptive commit
git commit -m "Feature: update clinical review modal and compile assets"

# Step 5: Push changes to GitHub (triggers Render automatic deploy)
git push origin main
```

---

## 4. Render Deployment Configuration

LazyEye runs as a Docker Web Service on **Render**. Render continuously monitors your `main` branch on GitHub and automatically builds and deploys new commits.

### Step 1: Create Web Service on Render
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\to$ **Web Service**.
3. Select **Build and deploy from a Git repository**.
4. Connect your GitHub repository: `abhipal-dev/lazyEye`.

---

### Step 2: Web Service Base Settings

Configure the following fields in the Render dashboard:

| Setting | Value / Recommendation | Notes |
| :--- | :--- | :--- |
| **Name** | `lazyeye` | Determines your URL: `https://lazyeye.onrender.com` |
| **Region** | Oregon (US West) or Singapore / Frankfurt | Select nearest to your clinic |
| **Branch** | `main` | Production branch |
| **Root Directory** | *(Leave blank)* | Uses root of the repository |
| **Runtime** | **Docker** | Render uses your `Dockerfile` |
| **Instance Type** | Free (or Starter for persistent disks) | Free tier spins down after 15m idle |

---

### Step 3: Environment Variables on Render

In your Render Web Service settings, navigate to the **Environment** tab and add the following key-value pairs:

```ini
APP_NAME=LazyEye
APP_ENV=production
APP_KEY=base64:m9t5Q4qU2kE3w7yZ8x1P6vO5rT4sL3kG9hJ2fD1aC0=
APP_DEBUG=false
APP_URL=https://lazyeye.onrender.com
LOG_CHANNEL=stderr
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
SESSION_DRIVER=cookie
```

> [!IMPORTANT]
> - **`APP_KEY`**: You can copy your local `APP_KEY` from your local `.env` file or generate a fresh key using `php artisan key:generate --show`.
> - **`APP_URL`**: Must match your exact Render domain (e.g. `https://lazyeye.onrender.com`) so asset URLs and redirects resolve over HTTPS.
> - **`DB_CONNECTION`**: Set to `sqlite` so Laravel connects to the pre-populated database bundled in the Docker container.

---

## 5. Docker Container Architecture on Render

LazyEye utilizes an optimized, single-stage Apache PHP 8.1 container defined in [`Dockerfile`](file:///d:/Abhishek_Projects/lazyEye/Dockerfile).

```dockerfile
FROM php:8.1-apache

# 1. Install system libraries and PHP extensions (SQLite, MySQL, GD, BCMath, Mbstring)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# 3. Direct Apache DocumentRoot to Laravel's public/ folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# 4. Copy project code and install Composer dependencies
COPY . /var/www/html
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# 5. Set proper permissions for storage, cache, and SQLite database
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 777 /var/www/html/database

RUN php artisan storage:link || true

EXPOSE 80
CMD ["apache2-foreground"]
```

---

## 6. HTTPS & Mixed-Content Safeguards

Render uses a TLS-terminating reverse proxy: browser requests arrive via `https://`, but Render forwards traffic to the internal container over `http://` on port 80.

To prevent browser mixed-content blocks (`Blocked insecure script http://...`), three safeguards are permanently configured in the codebase:

1. **Proxy Trust** ([`app/Http/Middleware/TrustProxies.php`](file:///d:/Abhishek_Projects/lazyEye/app/Http/Middleware/TrustProxies.php)):
   ```php
   protected $proxies = '*';
   ```
   Tells Laravel to respect `X-Forwarded-Proto: https` from Render's load balancer.

2. **Force HTTPS URL Scheme** ([`app/Http/Providers/AppServiceProvider.php`](file:///d:/Abhishek_Projects/lazyEye/app/Providers/AppServiceProvider.php)):
   ```php
   if (config('app.env') === 'production' || env('APP_ENV') === 'production' || str_contains(request()->header('Host'), 'render.com')) {
       \Illuminate\Support\Facades\URL::forceScheme('https');
   }
   ```
   Ensures all helper functions like `asset()`, `url()`, and `route()` generate `https://` URLs.

3. **Content Security Policy Upgrade Header** (in Blade views):
   ```html
   <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
   ```
   Instructs modern browsers to automatically upgrade any remaining HTTP asset requests to HTTPS before firing network requests.

---

## 7. Database Persistence & Future Scaling

### Current Setup: Pre-populated SQLite Database
- The database is stored at [`database/database.sqlite`](file:///d:/Abhishek_Projects/lazyEye/database/database.sqlite).
- It contains all existing patients, games, and consultation histories.
- It is copied directly into the Docker image during deployment.

### Handling Data Persistence:
- **Render Free Tier**: Containers have an ephemeral filesystem; changes made while running are kept in memory/container layer, but re-deploying resets the container to the image state.
- **Production Recommendation**:
  1. **Option A (Persistent Disk)**: In Render Service Settings $\to$ **Disks**, add a Persistent Disk mounted at `/var/www/html/database` (size: 1 GB).
  2. **Option B (Managed MySQL / PostgreSQL Database)**:
     - Provision a free MySQL database (e.g. on Aiven, PlanetScale, or Render Postgres).
     - Update Render Environment variables:
       ```ini
       DB_CONNECTION=mysql
       DB_HOST=your-db-host.com
       DB_PORT=3306
       DB_DATABASE=lazyeye_db
       DB_USERNAME=your_username
       DB_PASSWORD=your_password
       ```

---

## 8. Troubleshooting Common Issues

### 1. Browser shows a blank page with Console error: "Mixed Content"
- **Cause**: Assets were requested over `http://` instead of `https://`.
- **Fix**: Verify Render environment variable `APP_URL=https://lazyeye.onrender.com` is set, and confirm `TrustProxies.php` has `$proxies = '*'`.

### 2. Docker build fails with "Package requirements (sqlite3) were not met"
- **Cause**: Missing system SQLite development headers during `docker-php-ext-install`.
- **Fix**: Ensure `libsqlite3-dev` is included in the `apt-get install` command in `Dockerfile` (already configured).

### 3. Error 500: "database/database.sqlite is not writable"
- **Cause**: Linux file permissions preventing Apache's `www-data` user from modifying the SQLite database file and its parent folder.
- **Fix**: Ensure `chmod -R 777 /var/www/html/database` exists in `Dockerfile` (already configured).

### 4. Changes to React components do not reflect on live site
- **Cause**: Code was pushed without recompiling `public/js/app.js`.
- **Fix**: Run `npm run prod` locally, then execute `git add public/js/app.js`, commit, and `git push origin main`.

