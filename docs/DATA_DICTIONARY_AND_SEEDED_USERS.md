# LazyEye — Data Dictionary, Seeded Accounts & Clinical Datasets

This document is the authoritative data reference for the **LazyEye** vision therapy platform. It contains the cloud database configuration, table schemas, default clinical accounts, and seeded patient therapy datasets.

---

## 1. Cloud Database Infrastructure Data

The production application connects to a cloud-hosted MySQL 8 instance on **Clever Cloud (Paris, Europe)**, with automatic self-healing fallback to local **SQLite**:

| Parameter | Value | Laravel Environment Variable |
| :--- | :--- | :--- |
| **Engine** | MySQL 8.x | `DB_CONNECTION=mysql` |
| **Region** | Paris, France (Europe - adjacent to Render Frankfurt) | — |
| **Host** | `bpzssackelkqaw4zq5x3-mysql.services.clever-cloud.com` | `DB_HOST` |
| **Port** | `3306` | `DB_PORT` |
| **Database Name** | `bpzssackelkqaw4zq5x3` | `DB_DATABASE` |
| **Username** | `bpzssackelkqaw4zq5x3` | `DB_USERNAME` |
| **Password** | *(Stored in Clever Cloud / Render Environment)* | `DB_PASSWORD` |
| **Local SQLite Fallback** | `database/database.sqlite` | `DB_CONNECTION=sqlite` |

---

## 2. Complete Database Schema (Data Dictionary)

### Table 1: `users`
Stores all registered accounts: clinic administrators, optometrists/doctors, active patients, and eye calibrations.

| Column Name | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | No | Auto-increment | Primary Key. |
| `fullname` | `VARCHAR(64)` | Yes | `NULL` | Full human-readable name of user. |
| `username` | `VARCHAR(64)` | Yes | `NULL` | Unique system username used for authentication. |
| `email` | `VARCHAR(64)` | Yes | `NULL` | Unique email address. |
| `password` | `VARCHAR(64)` | Yes | `NULL` | Account password. |
| `gender` | `VARCHAR(16)` | Yes | `NULL` | `Male` or `Female`. |
| `accounttype` | `VARCHAR(16)` | Yes | `'user'` | Role tier: `root`, `admin`, `doctor`, `user`, or `Unpaid User`. |
| `user_playing_time`| `VARCHAR(255)`| No | `'20'` | Prescribed daily therapy duration in minutes. |
| `user_game_records`| `LONGTEXT` | Yes | `NULL` | Legacy JSON record string (maintained for backward compatibility). |
| `left_eye_color` | `VARCHAR(255)`| No | `'red'` | Anaglyph left-lens filter color (e.g. `red`, `blue`). |
| `right_eye_color`| `VARCHAR(255)`| No | `'blue'` | Anaglyph right-lens filter color (e.g. `blue`, `cyan`, `green`). |
| `left_eye_contrast_color` | `VARCHAR(255)` | No | `'#ff0000'` | Left-eye hex contrast chromatic value. |
| `right_eye_contrast_color` | `VARCHAR(255)` | No | `'#0000ff'` | Right-eye hex contrast chromatic value. |
| `left_eye_contrastvalue` | `VARCHAR(255)` | No | `'255'` | Left-eye contrast intensity slider (`0`–`255`). |
| `right_eye_contrastvalue` | `VARCHAR(255)` | No | `'255'` | Right-eye contrast intensity slider (`0`–`255`). |
| `image_address` | `VARCHAR(255)`| Yes | `NULL` | Profile avatar filename located in `/storage/images/`. |
| `doctor_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Foreign key referencing supervising doctor's `users.id`. |
| `created_at` | `TIMESTAMP` | Yes | `NULL` | Account creation timestamp (UTC). |
| `updated_at` | `TIMESTAMP` | Yes | `NULL` | Last modification timestamp (UTC). |

---

### Table 2: `registers`
Staging table holding self-registered applicants before administrator/doctor approval.

| Column Name | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `reg_id` | `BIGINT UNSIGNED` | No | Auto-increment | Primary Key. |
| `fullname` | `VARCHAR(64)` | Yes | `NULL` | Applicant full name. |
| `username` | `VARCHAR(64)` | Yes | `NULL` | Desired username. |
| `email` | `VARCHAR(255)`| Yes | `NULL` | Applicant email address. |
| `password` | `VARCHAR(64)` | Yes | `NULL` | Applicant password. |
| `gender` | `VARCHAR(255)`| Yes | `NULL` | `Male` or `Female`. |
| `accounttype` | `VARCHAR(16)` | Yes | `NULL` | Requested account role. |
| `created_at` | `TIMESTAMP` | Yes | `NULL` | Application submission timestamp. |
| `updated_at` | `TIMESTAMP` | Yes | `NULL` | Last update timestamp. |

---

### Table 3: `game_records`
Normalized, indexed log of all dichoptic therapy game sessions and visual acuity tests.

| Column Name | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | No | Auto-increment | Primary Key. |
| `user_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Foreign key referencing `users.id`. |
| `game_name` | `VARCHAR(64)` | No | — | Name of clinical game played (e.g. `Tetris`, `Snake`). |
| `score` | `INT` | No | `0` | Points or accuracy score achieved. |
| `duration_seconds`| `INT` | No | `1200` | Duration of session in seconds (default 20 mins = 1200s). |
| `played_at` | `TIMESTAMP` | Yes | `NULL` | Exact session completion timestamp in UTC. |
| `created_at` | `TIMESTAMP` | Yes | `NULL` | Record creation timestamp. |
| `updated_at` | `TIMESTAMP` | Yes | `NULL` | Record modification timestamp. |

---

### Table 4: `doctor_consultations`
Clinical evaluations, binocular assessments, and therapy regimen adjustments recorded by supervising optometrists.

| Column Name | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | No | Auto-increment | Primary Key. |
| `doctor_id` | `BIGINT UNSIGNED` | No | — | Foreign key referencing `users.id` of doctor. |
| `patient_id` | `BIGINT UNSIGNED` | No | — | Foreign key referencing `users.id` of patient. |
| `status` | `VARCHAR(32)` | No | `'Reviewed'` | Clinical status (`Prescribed`, `Under Review`, `Completed`). |
| `notes` | `TEXT` | Yes | `NULL` | Doctor evaluation notes and visual progress remarks. |
| `compliance_assessment` | `VARCHAR(32)` | No | `'Good'` | Rating: `Excellent`, `Good`, `Moderate`, or `Low`. |
| `prescribed_minutes` | `INT` | No | `20` | Daily recommended therapy regimen target. |
| `created_at` | `TIMESTAMP` | Yes | `NULL` | Consultation timestamp in UTC. |
| `updated_at` | `TIMESTAMP` | Yes | `NULL` | Last update timestamp in UTC. |

---

## 3. Seeded Accounts & Master Credentials Roster

When the application boots for the first time (or when `/seedDemoData` is requested), the following default users are created:

### 🏥 Medical Staff & Administrators

| Role | Full Name | Username | Password | Email | Daily Goal | Initial Doctor ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`root`** | Master Root Administrator | `root` | `root123` | `root@lazyeye.org` | 20 min | — |
| **`admin`** | Clinical Administrator | `admin` | `admin123` | `admin@lazyeye.org` | 20 min | — |
| **`admin`** | Pranjal Agarwal | `pranjal` | `4567` | `pranjalagarwal@gmail.com` | 20 min | — |
| **`doctor`** | Dr. Sarah Mitchell, OD | `dr_sarah` | `doctor123` | `sarah.mitchell@lazyeye-clinic.org` | 20 min | — |
| **`doctor`** | Dr. James Vance, FAAO | `dr_vance` | `doctor123` | `james.vance@lazyeye-clinic.org` | 20 min | — |

---

### 👁️ Enrolled Vision Therapy Patients (`accounttype: 'user'`)

| Full Name | Username | Password | Email | Supervising Doctor | Left Lens | Right Lens | Goal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Abhishek Pal** | `abhi8535` | `9870` | `abhi8535@gmail.com` | Dr. Sarah Mitchell | Blue | Red | 25 min |
| **Riya Jaiwal** | `riyajaiwal` | `1234` | `riya@gmail.com` | Dr. Sarah Mitchell | Red | Green | 20 min |
| **Shivam Singh** | `singhsaab` | `9999` | `shivam@gmail.com` | Dr. James Vance | Red | Cyan | 15 min |
| **Avishi Agarwal** | `avishi` | `avishi` | `avishi@gmail.com` | Dr. James Vance | Red | Blue | 20 min |

---

### ⏳ Pending Registration Applicants (`registers` Table)

| Applicant Full Name | Username | Password | Email | Gender | Action in Admin Panel |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Arun Badhotiya** | `aruna` | `39654` | `arunbadhotiya@gmail.com` | Male | Click `[Approve]` |
| **Neha Bhardwaj** | `neha0211` | `0211` | `nehabhardwaj@gmail.com` | Female | Click `[Approve]` |
| **Kunal Pal** | `kunal_pal` | `1234` | `kunal@kr.up` | Male | Click `[Approve]` |

---

## 4. Pre-Populated Clinical Therapy Datasets

### 🎮 42 Normalized Therapy Sessions (`game_records`)
- **Games Included**: *Tetris, Snake, Flappy Bird, Menja 3D, Bubble Shooter, Sticky Holds, Ball Catcher, Ping Pong, Bouncing Ball*.
- **Patient Cohort**: Spread across Abhishek Pal, Riya Jaiwal, Shivam Singh, and Avishi Agarwal.
- **Score Distribution**: Clinically scaled scores ranging from **15 to 120 points**.
- **Therapy Durations**: 10 to 25 minutes (600s – 1500s) per session.
- **Timestamp Span**: Rolling 7 calendar days in UTC to populate the weekly activity charts and patient heatmaps.

### 📋 Longitudinal Doctor Consultations (`doctor_consultations`)

1. **Abhishek Pal (Patient #1)** — Evaluated by **Dr. Sarah Mitchell, OD**:
   - **Status**: `Prescribed`
   - **Notes**: *"Patient shows 35% suppression reduction. Continue Snake and Tetris fusion therapy."*
   - **Compliance**: `Excellent`
   - **Prescription**: 25 min/day.

2. **Riya Jaiwal (Patient #2)** — Evaluated by **Dr. Sarah Mitchell, OD**:
   - **Status**: `Under Review`
   - **Notes**: *"Stereoscopic depth perception improving. Maintain daily 20 min session."*
   - **Compliance**: `Good`
   - **Prescription**: 20 min/day.

3. **Shivam Singh (Patient #3)** — Evaluated by **Dr. James Vance, FAAO**:
   - **Status**: `Under Review`
   - **Notes**: *"Contrast sensitivity adjusted. Right eye contrast set to 220."*
   - **Compliance**: `Moderate`
   - **Prescription**: 15 min/day.

---

## 5. How to Re-Seed or Reset Clinical Data

If you ever wish to re-seed demo data:
1. **Via Browser / API**: Visit **[https://lazyeye.onrender.com/seedDemoData](https://lazyeye.onrender.com/seedDemoData)**.
2. **Via Admin Dashboard**: Log in as `admin` and click the blue **`[⚡ Seed Demo Data]`** button in the header.
3. The platform will automatically rebuild all missing tables, repopulate default staff, create the patient cohort, and generate 42 fresh therapy records.

---

## 6. Role-Based Scoping & Permission Matrix

| Capability / Resource | Doctor (`doctor`) | Clinic Admin (`admin`) | Superadmin (`root`) | Patient (`user`) |
| :--- | :---: | :---: | :---: | :---: |
| **Landing View** | Doctor Clinical Workspace | Clinic Administrative Hub | Platform Superadmin Control | Dichoptic Gaming Portal |
| **View Patients** | Assigned Patients Only | All Clinic Patients | All Platform Patients | Own Profile Only |
| **View Doctors** | Self Only | All Clinic Doctors | All Platform Doctors | Assigned Doctor Only |
| **View Admins** | ❌ Forbidden (Hidden) | ❌ Forbidden (Hidden) | ✅ Full Access | ❌ Forbidden |
| **Create/Invite Staff**| Assigned Patients Only | Patients & Doctors | Admins, Doctors & Patients | ❌ Forbidden |
| **Assign Doctors** | ❌ Restricted | ✅ Full Access | ✅ Full Access | ❌ Forbidden |
| **Delete / Edit Staff**| Self profile only | Doctors & Patients | All Accounts | Own profile |
| **Clinical Consultation Logs** | Conducted by Self | Clinic-wide | Platform-wide | Own evaluations |
| **Patient Therapy Heatmap** | ✅ 84-Day Activity Modal | ✅ 84-Day Activity Modal | ✅ 84-Day Activity Modal | Weekly Progress View |


