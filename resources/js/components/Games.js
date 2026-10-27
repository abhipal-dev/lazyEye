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
        if (this.props.todayGameStats && this.props.todayGameStats[gameName]) {
            return this.props.todayGameStats[gameName];
        }
        // Fallback parser from this.props.data
        if (this.props.data && typeof moment !== 'undefined') {
            try {
                const records = typeof this.props.data === 'string' ? JSON.parse(this.props.data) : this.props.data;
                const todayStr = moment().format('DD/MM/YYYY');
                let totalDuration = 0;
                let bestScore = 0;
                let played = false;

                Object.keys(records).forEach(ts => {
                    if (moment(Number(ts)).format('DD/MM/YYYY') === todayStr) {
                        const dayGames = records[ts];
                        if (dayGames && dayGames[gameName] !== undefined) {
                            played = true;
                            const score = Number(dayGames[gameName]) || 0;
                            bestScore = Math.max(bestScore, score);
                            totalDuration += 300;
                        }
                    }
                });

                if (played) {
                    return { duration_seconds: totalDuration, best_score: bestScore };
                }
            } catch (e) {}
        }
        return { duration_seconds: 0, best_score: 0 };
    };

    render() {
        const current = this.carouselSlides[this.state.currentSlide];
        const prescribedMinutes = Number(this.props.prescribedMinutes || 20);
        const prescribedSeconds = prescribedMinutes * 60;

        // Current hero game stats
        const heroStats = this.getGameTodayStats(current.title);
        const heroPlayedSeconds = Number(heroStats.duration_seconds || 0);
        const heroPlayedMinutes = Math.floor(heroPlayedSeconds / 60);
        const heroRemainingMinutes = Math.max(0, Math.ceil((prescribedSeconds - heroPlayedSeconds) / 60));
        const heroIsGoalMet = heroPlayedSeconds >= prescribedSeconds;

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
                    <button 
                        type="button" 
                        className="btn btn-secondary btn-sm px-3 d-flex align-items-center gap-2"
                        data-bs-toggle="modal" 
                        data-bs-target="#colorSettingModal"
                    >
                        <i className="fa-solid fa-sliders"></i>
                        <span>Calibrate Glasses</span>
                    </button>
                </div>

                {/* Featured Workout Hero Banner (Clean Dark Glassmorphic Card) */}
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

                    {/* Main Slide Content */}
                    <div className="therapy-hero-body">
                        <div className="therapy-hero-text">
                            <h2 className="therapy-hero-title text-white">{current.title}</h2>
                            <p className="therapy-hero-desc text-slate-300">{current.desc}</p>
                            
                            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                {heroPlayedSeconds === 0 ? (
                                    <span className="therapy-chip">
                                        <i className="fa-regular fa-clock text-warning me-1"></i> Target: {prescribedMinutes} mins
                                    </span>
                                ) : heroIsGoalMet ? (
                                    <span className="therapy-chip text-success border-success">
                                        <i className="fa-solid fa-circle-check text-success me-1"></i> Goal Completed ({heroPlayedMinutes}m)
                                    </span>
                                ) : (
                                    <span className="therapy-chip text-warning border-warning">
                                        <i className="fa-solid fa-hourglass-half text-warning me-1"></i> {heroPlayedMinutes}m done &middot; {heroRemainingMinutes}m left
                                    </span>
                                )}

                                {heroStats.best_score > 0 && (
                                    <span className="therapy-chip text-info">
                                        <i className="fa-solid fa-trophy text-warning me-1"></i> Best: {heroStats.best_score} pts
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
                                            ? 'Practice Mode (Goal Met)' 
                                            : `Continue Session (${heroRemainingMinutes}m left)`}
                                </span>
                            </button>
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

                {/* Games Grid with Clean Architectural Cards */}
                <div className="row g-3">
                    {this.allGames.map((game) => {
                        const stats = this.getGameTodayStats(game.name);
                        const playedSeconds = Number(stats.duration_seconds || 0);
                        const playedMinutes = Math.floor(playedSeconds / 60);
                        const remainingMinutes = Math.max(0, Math.ceil((prescribedSeconds - playedSeconds) / 60));
                        const isGoalMet = playedSeconds >= prescribedSeconds;
                        const progressPercent = Math.min(100, Math.round((playedSeconds / prescribedSeconds) * 100));

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
                                    {/* Top Card Header */}
                                    <div 
                                        className="p-3 border-bottom d-flex align-items-center justify-content-between"
                                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface-secondary)' }}
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge ${game.badgeClass}`}>
                                                {game.badge}
                                            </span>
                                        </div>
                                        <div>
                                            {playedSeconds === 0 ? (
                                                <span className="badge bg-secondary-subtle text-secondary small font-mono">
                                                    Target: {prescribedMinutes}m
                                                </span>
                                            ) : isGoalMet ? (
                                                <span className="badge bg-success-subtle text-success small font-mono fw-bold">
                                                    <i className="fa-solid fa-circle-check me-1"></i> Goal Met
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning-subtle text-warning small font-mono fw-bold">
                                                    <i className="fa-solid fa-hourglass-half me-1"></i> {remainingMinutes}m left
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body Details */}
                                    <div className="p-3 d-flex flex-column flex-grow-1" style={{ color: 'var(--text-main)' }}>
                                        <h5 className="fw-bold mb-1 text-main">{game.name}</h5>
                                        <p className="small text-muted mb-3" style={{ lineHeight: 1.45, minHeight: 42 }}>
                                            {game.desc}
                                        </p>

                                        {/* Progress Bar (when in progress or completed) */}
                                        {playedSeconds > 0 && (
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center small font-mono mb-1">
                                                    <span className={isGoalMet ? 'text-success fw-semibold' : 'text-info fw-semibold'}>
                                                        {playedMinutes} / {prescribedMinutes}m ({progressPercent}%)
                                                    </span>
                                                    {stats.best_score > 0 && (
                                                        <span className="text-warning fw-semibold">
                                                            <i className="fa-solid fa-trophy me-1"></i> {stats.best_score} pts
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
                                                            : `Continue (${remainingMinutes}m left)`}
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
