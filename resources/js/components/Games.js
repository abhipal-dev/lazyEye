import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
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
            bg: g.bg,
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
            bannerBg: g.bannerBg,
            desc: g.desc,
            time: g.time,
            gameKey: g.id
        }));
    }

    componentDidMount() {
        this.markPlayedGame();
        this.startCarouselTimer();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.markPlayedGame();
        }
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
        }, 6000);
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

    markPlayedGame() {
        if (this.props.data) {
            try {
                var game_records_object = JSON.parse(this.props.data);
                const formatted_date_records_object = {};
                $.each(game_records_object, function (key, value) {
                    let formatted = moment(+key).format("DD/MM/YYYY");
                    if (formatted_date_records_object.hasOwnProperty(formatted)) {
                        Object.assign(formatted_date_records_object[formatted], value);
                    } else {
                        formatted_date_records_object[formatted] = value;
                    }
                });

                let today = new Date();
                let todayFormatted = moment(today).format("DD/MM/YYYY");

                if (formatted_date_records_object.hasOwnProperty(todayFormatted)) {
                    const gameClasses = {
                        'Snake': 'Snake',
                        'Flappy Bird': 'FlappyBird',
                        'Sticky Holds': 'StickyHolds',
                        'Menja': 'Menja',
                        'Tetris': 'Tetris',
                        'Bubble Shooter': 'BubbleShooter',
                        'Ping Pong': 'PingPong',
                        'Maze': 'Maze',
                        'Ball Catcher': 'BallCatcher',
                        'Bouncing Ball': 'BouncingBall'
                    };
                    $.each(formatted_date_records_object[todayFormatted], function (key, value) {
                        if (gameClasses[key]) {
                            $('div.' + gameClasses[key]).addClass('is-played');
                            $('div.' + gameClasses[key] + ' button.game-play-btn')
                                .prop('disabled', true)
                                .html('<i class="fa-solid fa-circle-check me-1"></i> Completed Today');
                        }
                    });
                }
            } catch (err) {
                console.error("Error parsing game records", err);
            }
        }
    }

    // Launch game in fullscreen session with clinical HUD
    changesrc = (framesrc, gameObj) => {
        if (this.props.onStartSession) {
            this.props.onStartSession(gameObj || { route: framesrc });
            return;
        }
        var elem = document.getElementById('iframe');
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

    render() {
        const current = this.carouselSlides[this.state.currentSlide];

        return (
            <div className="py-2">
                {/* Header Title Bar */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                        <h3 className="fw-bold mb-1 text-main d-flex align-items-center gap-2">
                            <i className="fa-solid fa-gamepad text-main"></i>
                            Therapy Games
                        </h3>
                        <p className="text-muted small mb-0">
                            Play prescribed games with your calibrated red/cyan glasses to eliminate visual suppression.
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

                {/* Featured Workout Hero Banner with Dynamic Game Background */}
                <div 
                    className="therapy-hero-card"
                    style={{ background: current.bg }}
                    onMouseEnter={() => this.setState({ isPaused: true })}
                    onMouseLeave={() => this.setState({ isPaused: false })}
                >
                    {/* Top Bar inside banner: category tag and clean controls */}
                    <div className="therapy-hero-header">
                        <span className="therapy-hero-badge">
                            <i className={`fa-solid ${current.tagIcon} me-1`}></i>
                            {current.tag}
                        </span>

                        {/* Unobtrusive navigation controls placed cleanly in the corner */}
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

                    {/* Main Slide Content: Text on left, Mascot on right */}
                    <div className="therapy-hero-body">
                        <div className="therapy-hero-text">
                            <h2 className="therapy-hero-title">{current.title}</h2>
                            <p className="therapy-hero-desc">{current.desc}</p>
                            
                            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                <span className="therapy-chip">
                                    <i className="fa-regular fa-clock text-warning me-1"></i> {current.time}
                                </span>
                                <span className="therapy-chip">
                                    <i className="fa-solid fa-glasses text-info me-1"></i> Red/Cyan Filter
                                </span>
                            </div>

                            <button 
                                type="button"
                                className="therapy-hero-btn"
                                onClick={() => this.changesrc(current.route, current)}
                            >
                                <i className="fa-solid fa-circle-play text-primary me-1"></i>
                                <span>Start Session</span>
                            </button>
                        </div>

                        {/* Large Mascot Art */}
                        <div className="therapy-hero-art">
                            <img src={current.mascot} alt={current.title} />
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
                        <p className="text-muted small mb-0">Select any engine to begin your daily dichoptic vision exercise.</p>
                    </div>
                    <span className="badge bg-primary-subtle text-main small px-3 py-1 fw-semibold font-mono">
                        10 Clinical Engines
                    </span>
                </div>

                {/* Games Grid with Clean Architectural Cards */}
                <div className="row g-3">
                    {this.allGames.map((game) => (
                        <div key={game.id} className="col-12 col-md-6 col-xl-4">
                            <div className={`therapy-game-card h-100 ${game.id}`}>
                                {/* Themed Visual Artwork Banner */}
                                <div 
                                    className="game-cover-banner"
                                    style={{ background: game.bannerBg }}
                                >
                                    <img 
                                        src={game.art} 
                                        alt={game.name} 
                                        className="game-cover-icon"
                                    />
                                    <span className={`game-card-tag ${game.badgeClass}`}>
                                        {game.badge}
                                    </span>
                                </div>

                                {/* Card Body Details */}
                                <div className="game-card-info">
                                    <h5 className="game-title">{game.name}</h5>
                                    <p className="game-description">
                                        {game.desc}
                                    </p>

                                    <div className="game-card-meta">
                                        <span>
                                            <i className="fa-regular fa-clock me-1 text-muted"></i>
                                            Target: {game.time}
                                        </span>
                                        <span className="text-primary fw-semibold">
                                            <i className="fa-solid fa-glasses me-1"></i>
                                            Red/Cyan
                                        </span>
                                    </div>

                                    <button 
                                        type="button"
                                        className="game-play-btn openGame" 
                                        onClick={() => this.changesrc(game.route, game)}
                                    >
                                        <i className="fa-solid fa-play me-2"></i>
                                        Launch Exercise
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
