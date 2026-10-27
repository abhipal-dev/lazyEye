import React from 'react';
import { GAMES_CONFIG } from '../gameConfig';

export default class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            isPaused: false
        };
        this.timer = null;

        // Derived directly from the single source of truth: GAMES_CONFIG
        this.carouselSlides = GAMES_CONFIG.map(g => ({
            tag: g.tag,
            tagIcon: g.tagIcon,
            title: g.title,
            desc: g.desc,
            mascot: g.icon,
            art: g.icon,
            route: g.route,
            time: g.time,
            gameKey: g.id
        }));

        this.allGames = GAMES_CONFIG.map(g => ({
            id: g.id.replace(/\s+/g, ''),
            name: g.title,
            route: g.route,
            badge: g.tag,
            badgeClass: g.badgeClass,
            art: g.icon,
            desc: g.desc,
            time: g.time,
            gameKey: g.id
        }));
    }

    componentDidMount() {
        this.startCarouselTimer();
    }

    componentWillUnmount() {
        this.stopCarouselTimer();
    }

    startCarouselTimer = () => {
        this.stopCarouselTimer();
        this.timer = setInterval(() => {
            if (!this.state.isPaused) {
                this.nextSlide();
            }
        }, 7000);
    }

    stopCarouselTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    nextSlide = () => {
        this.setState(prevState => ({
            currentSlide: (prevState.currentSlide + 1) % this.carouselSlides.length
        }));
    }

    prevSlide = () => {
        this.setState(prevState => ({
            currentSlide: (prevState.currentSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length
        }));
    }

    goToSlide = (idx) => {
        this.setState({ currentSlide: idx });
    }

    // Launch game in direct session
    changesrc = (framesrc, gameObj) => {
        if (this.props.onStartSession) {
            this.props.onStartSession(gameObj || { route: framesrc });
            return;
        }
        const elem = document.getElementById('iframe');
        if (elem) {
            elem.src = framesrc;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    }

    getGameTodayStats = (gameName) => {
        if (!gameName) return { duration_seconds: 0, total_score: 0, best_score: 0, sessions_count: 0 };
        const cleanTarget = String(gameName).toLowerCase().trim().replace(/[-_]/g, ' ');

        if (this.props.todayGameStats && typeof this.props.todayGameStats === 'object') {
            if (this.props.todayGameStats[gameName]) {
                return this.props.todayGameStats[gameName];
            }
            for (const key of Object.keys(this.props.todayGameStats)) {
                const cleanKey = String(key).toLowerCase().trim().replace(/[-_]/g, ' ');
                if (cleanKey === cleanTarget || cleanKey.includes(cleanTarget) || cleanTarget.includes(cleanKey)) {
                    return this.props.todayGameStats[key];
                }
            }
        }
        return { duration_seconds: 0, total_score: 0, best_score: 0, sessions_count: 0 };
    };

    formatSpeedLabel = (speed) => {
        if (!speed) return 'Normal (1.0x)';
        const s = String(speed).toLowerCase();
        if (s === 'progressive' || s === 'incremental') return 'Dynamic / Progressive';
        if (s === 'level-1' || s === 'slow') return 'Level 1 (0.5x Rehab)';
        if (s === 'level-2') return 'Level 2 (0.75x Slow)';
        if (s === 'level-3' || s === 'medium') return 'Level 3 (1.0x Normal)';
        if (s === 'level-4' || s === 'fast') return 'Level 4 (1.25x Fast)';
        if (s === 'level-5') return 'Level 5 (1.5x Agility)';
        return speed;
    };

    render() {
        const current = this.carouselSlides[this.state.currentSlide];
        const prescribedMinutes = Number(this.props.prescribedMinutes || 20);
        const prescribedSeconds = prescribedMinutes * 60;
        const currentSpeed = this.props.gameSpeed || 'level-3';

        // Current hero game stats
        const heroStats = this.getGameTodayStats(current.title);
        const heroPlayedSeconds = Number(heroStats.duration_seconds || 0);
        const heroPlayedMinutes = Math.floor(heroPlayedSeconds / 60);
        const heroRemainingSeconds = Math.max(0, prescribedSeconds - heroPlayedSeconds);
        const heroRemainingMinutes = Math.ceil(heroRemainingSeconds / 60);
        const heroIsGoalMet = heroPlayedSeconds >= prescribedSeconds;
        const heroDisplayScore = Number(heroStats.total_score !== undefined ? heroStats.total_score : (heroStats.best_score || 0));

        return (
            <div className="py-2">
                {/* Header Title Bar */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                        <h3 className="fw-bold mb-1 text-main d-flex align-items-center gap-2">
                            <i className="fa-solid fa-gamepad text-primary"></i>
                            Therapy Games
                        </h3>
                        <p className="text-muted small mb-0">
                            Play prescribed games with your calibrated red/cyan glasses. Training progress accumulates automatically throughout the day.
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span 
                            className="badge border d-flex align-items-center gap-1 font-mono px-3 py-2"
                            style={{ 
                                backgroundColor: 'var(--bg-surface-secondary)', 
                                borderColor: 'var(--border-color)', 
                                color: 'var(--text-main)',
                                fontSize: '0.8rem' 
                            }}
                            title="Prescribed Therapy Velocity"
                        >
                            <i className="fa-solid fa-gauge-high text-primary"></i>
                            <span>Speed: {this.formatSpeedLabel(currentSpeed)}</span>
                        </span>
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-sm px-3 d-flex align-items-center gap-2"
                            data-bs-toggle="modal" 
                            data-bs-target="#colorSettingModal"
                        >
                            <i className="fa-solid fa-sliders"></i>
                            <span>Calibrate Glasses</span>
                        </button>
                        {this.props.onResetToday && (
                            <button 
                                type="button" 
                                className="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-2"
                                onClick={this.props.onResetToday}
                                title="Reset today's test duration to 0m for fresh session testing"
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>Reset Today</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Featured Workout Hero Banner (Clean Dark Glassmorphic Card with Real Game Art) */}
                <div 
                    className="therapy-hero-card"
                    style={{ 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                        border: '1px solid #334155',
                        borderRadius: 16
                    }}
                    onMouseEnter={() => this.setState({ isPaused: true })}
                    onMouseLeave={() => this.setState({ isPaused: false })}
                >
                    {/* Top Bar inside banner */}
                    <div className="therapy-hero-header">
                        <span className="therapy-hero-badge">
                            <i className={`fa-solid ${current.tagIcon} me-1`}></i>
                            {current.tag}
                        </span>

                        <div className="therapy-hero-controls">
                            <span className="therapy-hero-counter">
                                {this.state.currentSlide + 1} / {this.carouselSlides.length}
                            </span>
                            <button 
                                type="button" 
                                className="therapy-nav-btn" 
                                onClick={this.prevSlide}
                                aria-label="Previous Exercise"
                                title="Previous Exercise"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button 
                                type="button" 
                                className="therapy-nav-btn" 
                                onClick={this.nextSlide}
                                aria-label="Next Exercise"
                                title="Next Exercise"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* Main Slide Content with Game Preview Artwork */}
                    <div className="therapy-hero-body d-flex flex-column-reverse flex-md-row align-items-center justify-content-between" style={{ gap: '20px' }}>
                        <div className="therapy-hero-text" style={{ flex: 1 }}>
                            <h2 className="therapy-hero-title text-white">{current.title}</h2>
                            <p className="therapy-hero-desc text-slate-300">{current.desc}</p>
                            
                            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                {heroPlayedSeconds === 0 ? (
                                    <span className="therapy-chip">
                                        <i className="fa-regular fa-clock text-warning me-1"></i> Target: {prescribedMinutes} mins
                                    </span>
                                ) : heroIsGoalMet ? (
                                    <span className="therapy-chip text-success border-success">
                                        <i className="fa-solid fa-circle-check text-success me-1"></i> Goal Completed ({prescribedMinutes}m)
                                    </span>
                                ) : (
                                    <span className="therapy-chip text-warning border-warning">
                                        <i className="fa-solid fa-hourglass-half text-warning me-1"></i> {heroPlayedMinutes === 0 ? `${heroPlayedSeconds}s` : `${heroPlayedMinutes}m`} done &middot; {heroRemainingMinutes > 0 ? `${heroRemainingMinutes}m left` : `${heroRemainingSeconds}s left`}
                                    </span>
                                )}

                                {heroDisplayScore > 0 && (
                                    <span className="therapy-chip text-warning border-warning">
                                        <i className="fa-solid fa-trophy text-warning me-1"></i> Today Score: {heroDisplayScore} pts
                                    </span>
                                )}

                                <span className="therapy-chip">
                                    <i className="fa-solid fa-glasses text-info me-1"></i> Red/Cyan Filter
                                </span>
                            </div>

                            <button 
                                type="button"
                                className="btn btn-primary px-4 py-2 fw-bold shadow-lg d-inline-flex align-items-center gap-2"
                                style={{ borderRadius: 10 }}
                                onClick={() => this.changesrc(current.route, current)}
                            >
                                <i className="fa-solid fa-play"></i>
                                <span>
                                    {heroPlayedSeconds === 0 
                                        ? 'Start Therapy' 
                                        : heroIsGoalMet 
                                            ? 'Practice Mode (Goal Met 🎉)' 
                                            : `Continue Session (${heroRemainingMinutes > 0 ? `${heroRemainingMinutes}m left` : `${heroRemainingSeconds}s left`})`}
                                </span>
                            </button>
                        </div>

                        {/* Real Game Preview Image on Right */}
                        <div className="therapy-hero-art d-flex align-items-center justify-content-center p-2 p-md-3" style={{ flexShrink: 0 }}>
                            <img 
                                src={current.art || current.mascot} 
                                alt={current.title} 
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                                style={{ 
                                    maxHeight: '160px', 
                                    maxWidth: '180px', 
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.45))'
                                }} 
                            />
                        </div>
                    </div>

                    {/* Bottom Slide Indicators */}
                    <div className="therapy-hero-dots">
                        {this.carouselSlides.map((slide, index) => (
                            <button
                                key={index} 
                                type="button" 
                                className={`therapy-dot ${index === this.state.currentSlide ? 'active' : ''}`}
                                onClick={() => this.goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Section Subheading */}
                <div className="d-flex align-items-center justify-content-between mb-3 mt-4">
                    <div>
                        <h5 className="fw-bold text-main mb-0">All Prescribed Therapy Games</h5>
                        <p className="text-muted small mb-0">Play anytime in full sessions or multiple short bursts—your daily time is tracked continuously.</p>
                    </div>
                    <span className="badge bg-primary-subtle text-primary small px-3 py-1 fw-semibold font-mono">
                        {prescribedMinutes}m Daily Goal
                    </span>
                </div>

                {/* Games Grid with Clean Architectural Cards & Real Game Thumbnails */}
                <div className="row g-3">
                    {this.allGames.map((game) => {
                        const stats = this.getGameTodayStats(game.name);
                        const playedSeconds = Number(stats.duration_seconds || 0);
                        const playedMinutes = Math.floor(playedSeconds / 60);
                        const remainingSeconds = Math.max(0, prescribedSeconds - playedSeconds);
                        const remainingMinutes = Math.ceil(remainingSeconds / 60);
                        const isGoalMet = playedSeconds >= prescribedSeconds;
                        const progressPercent = Math.min(100, Math.round((playedSeconds / prescribedSeconds) * 100));
                        const displayScore = Number(stats.total_score !== undefined ? stats.total_score : (stats.best_score || 0));
                        const durationText = isGoalMet 
                            ? `${prescribedMinutes} / ${prescribedMinutes}m (100%)` 
                            : (playedMinutes === 0 && playedSeconds > 0 
                                ? `${playedSeconds}s / ${prescribedMinutes}m (${progressPercent}%)` 
                                : `${playedMinutes} / ${prescribedMinutes}m (${progressPercent}%)`);

                        return (
                            <div key={game.id} className="col-12 col-md-6 col-xl-4">
                                <div 
                                    className="therapy-game-card h-100"
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: isGoalMet ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    {/* Game Preview Thumbnail Cover Banner */}
                                    <div 
                                        className="game-cover-banner" 
                                        style={{ 
                                            height: '140px',
                                            backgroundColor: 'var(--bg-surface-secondary)',
                                            borderBottom: '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            padding: '12px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img 
                                            src={game.art} 
                                            alt={game.name} 
                                            className="game-cover-icon"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                            style={{
                                                maxHeight: '100px',
                                                maxWidth: '130px',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
                                                transition: 'transform 0.2s ease'
                                            }}
                                        />
                                        <span className={`badge ${game.badgeClass}`} style={{ position: 'absolute', top: 10, left: 10 }}>
                                            {game.badge}
                                        </span>
                                        <span 
                                            className="badge font-mono" 
                                            style={{ 
                                                position: 'absolute', 
                                                top: 10, 
                                                right: 10, 
                                                backgroundColor: isGoalMet ? '#059669' : playedSeconds > 0 ? '#d97706' : 'rgba(15, 23, 42, 0.7)', 
                                                color: '#fff', 
                                                fontSize: '0.72rem' 
                                            }}
                                        >
                                            {playedSeconds === 0 ? `Target: ${prescribedMinutes}m` : isGoalMet ? 'Goal Met 🎉' : remainingMinutes > 0 ? `${remainingMinutes}m left` : `${remainingSeconds}s left`}
                                        </span>
                                    </div>

                                    {/* Card Body Details */}
                                    <div className="p-3 d-flex flex-column flex-grow-1" style={{ color: 'var(--text-main)' }}>
                                        <h5 className="fw-bold mb-1 text-main">{game.name}</h5>
                                        <p className="small text-muted mb-3" style={{ lineHeight: 1.45, minHeight: 42 }}>
                                            {game.desc}
                                        </p>

                                        {/* Progress Bar (Cumulative Daily Duration & Cumulative Score) */}
                                        {playedSeconds > 0 && (
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center small font-mono mb-1">
                                                    <span className={isGoalMet ? 'text-success fw-semibold' : 'text-info fw-semibold'}>
                                                        {durationText}
                                                    </span>
                                                    {displayScore > 0 && (
                                                        <span className="text-warning fw-semibold">
                                                            <i className="fa-solid fa-trophy me-1"></i> {displayScore} pts
                                                        </span>
                                                    )}
                                                </div>
                                                <div 
                                                    style={{ 
                                                        height: 5, 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                                                        borderRadius: 9999, 
                                                        overflow: 'hidden' 
                                                    }}
                                                >
                                                    <div 
                                                        style={{ 
                                                            width: `${progressPercent}%`, 
                                                            height: '100%', 
                                                            backgroundColor: isGoalMet ? '#10b981' : '#38bdf8',
                                                            transition: 'width 0.3s ease'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Bottom Action Section (Always active and clickable!) */}
                                        <div className="mt-auto pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                            <button 
                                                type="button"
                                                className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold ${
                                                    isGoalMet 
                                                        ? 'btn-outline-success' 
                                                        : playedSeconds > 0 
                                                            ? 'btn-primary' 
                                                            : 'btn-outline-primary'
                                                }`}
                                                style={{ borderRadius: 8 }}
                                                onClick={() => this.changesrc(game.route, game)}
                                            >
                                                <i className={`fa-solid ${isGoalMet ? 'fa-gamepad' : 'fa-play'}`}></i>
                                                <span>
                                                    {playedSeconds === 0 
                                                        ? 'Start Therapy' 
                                                        : isGoalMet 
                                                            ? 'Practice Mode (Goal Met 🎉)' 
                                                            : `Continue (${remainingMinutes > 0 ? `${remainingMinutes}m left` : `${remainingSeconds}s left`})`}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
