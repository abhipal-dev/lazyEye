# 👁️ LazyEye — Digital Dichoptic Vision Therapy Platform

<p align="center">
  <img src="public/images/lazyeye-logo.svg" alt="LazyEye Logo" width="160">
  <br>
  <strong>A full-stack clinical rehabilitation platform for Amblyopia (Lazy Eye) treatment using interactive dichoptic games and anaglyph red-cyan filtering.</strong>
</p>

<p align="center">
  <a href="https://lazyeye.onrender.com" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-Render-blue?style=for-the-badge&logo=render" alt="Live Demo"></a>
  <a href="https://github.com/abhipal-dev/lazyEye/actions/workflows/ci.yml"><img src="https://github.com/abhipal-dev/lazyEye/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <img src="https://img.shields.io/badge/Laravel-8.75-red?style=for-the-badge&logo=laravel" alt="Laravel 8">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/PHP-8.1-777BB4?style=for-the-badge&logo=php" alt="PHP 8.1">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker">
</p>

---

## 🌐 Live Platform

The application is deployed and live at:  
👉 **[https://lazyeye.onrender.com](https://lazyeye.onrender.com)**

---

## 🏛️ System Architecture & Clinical Science

For in-depth technical specifications, clinical mechanics of dichoptic separation, role permission matrices, and data flow diagrams, refer to:  
👉 [**ARCHITECTURE.md**](ARCHITECTURE.md)

---

## 🎮 Prescribed Clinical Therapy Engines

The platform features **10 interactive dichoptic vision therapy engines** built with HTML5 Canvas and React:
- **Snake** (`/game1snake`): Non-dominant eye macular fixation and dual-channel fusion.
- **Flappy Bird** (`/game2flappybird`): High-frequency saccades and altitude depth judgment.
- **Sticky Holds** (`/game11stickyholds`): Stereoscopic distance estimation and visual-motor timing.
- **Menja** (`/game12menja`): Dynamic 3D block slicing challenge stimulating visual reaction speed.
- **Tetris** (`/game8tetris`): Dichoptic pattern alignment and cortical spatial synthesis.
- **Bubble Shooter** (`/game9bubbleshooter`): Foveal aiming and peripheral stereoscopic acuity.
- **Ping Pong** (`/game10pingpong`): Dynamic velocity tracking and reaction agility.
- **Maze** (`/game5maze`): Split-cue spatial search and neuro-visual pathway mapping.
- **Ball Catcher** (`/game3ballcatcher`): Hand-eye motor coordination and saccadic targeting.
- **Bouncing Ball** (`/game7test`): Dynamic trajectory prediction under dichoptic viewing.

---

## ⚡ Quick Start (Local Setup)

```bash
# 1. Clone repository
git clone https://github.com/abhipal-dev/lazyEye.git
cd lazyEye

# 2. Install PHP and JS dependencies
composer install
npm install

# 3. Compile frontend assets
npm run dev

# 4. Configure environment
cp .env.example .env
php artisan key:generate

# 5. Start development server
php artisan serve
```

Visit `http://localhost:8000` in your browser.

---

## 🔒 License
This project is proprietary and maintained by [abhipal-dev](https://github.com/abhipal-dev).
