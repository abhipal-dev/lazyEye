import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

export default class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            isPaused: false
        };
        this.timer = null;

        this.carouselSlides = [
            {
                tag: 'Binocular Fusion',
                tagIcon: 'fa-eye',
                title: 'Snake Macular Fixation',
                desc: 'Guide the snake to hunt moving targets. Red and cyan filtering splits the snake and food between eyes, stimulating binocular cortical fusion and reducing amblyopic suppression.',
                mascot: '/images/snake-mascot.svg',
                route: '/game1snake',
                bg: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
                time: '20 mins',
                gameKey: 'Snake'
            },
            {
                tag: 'Visual Reflexes',
                tagIcon: 'fa-bolt',
                title: 'Menja 3D Geometric Slicing',
                desc: 'Slice dynamic 3D blocks in rapid succession as they fly toward you. Sharpens reaction velocity, stereoscopic depth judgment, and contrast sensitivity.',
                mascot: '/images/menja-mascot.svg',
                route: '/game12menja',
                bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)',
                time: '20 mins',
                gameKey: 'Menja'
            },
            {
                tag: 'Depth & Saccades',
                tagIcon: 'fa-plane-departure',
                title: 'Flappy Bird Dual-Eye Flight',
                desc: 'Navigate altitude obstacles requiring rapid saccadic eye movements. Color separation ensures both eyes must communicate in real time to judge clearances.',
                mascot: '/images/flappy-mascot.svg',
                route: '/game2flappybird',
                bg: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0284c7 100%)',
                time: '15 mins',
                gameKey: 'Flappy Bird'
            },
            {
                tag: 'Pattern Synthesis',
                tagIcon: 'fa-cubes',
                title: 'Tetris Fusion Alignment',
                desc: 'Rotate and place color-filtered falling tetrominoes. Playing board boundaries and falling shapes are split between eyes, demanding simultaneous cortical vision.',
                mascot: '/images/tetris-mascot.svg',
                route: '/game8tetris',
                bg: 'linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)',
                time: '20 mins',
                gameKey: 'Tetris'
            },
            {
                tag: 'Spatial Targeting',
                tagIcon: 'fa-bullseye',
                title: 'Bubble Shooter Precision Aim',
                desc: 'Aim and pop matching bubble clusters to stimulate foveal fixation, peripheral vision, and active engagement in the non-dominant eye.',
                mascot: '/images/bubbles-mascot.svg',
                route: '/game9bubbleshooter',
                bg: 'linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)',
                time: '15 mins',
                gameKey: 'Bubble Shooter'
            },
            {
                tag: 'Speed Tracking',
                tagIcon: 'fa-table-tennis-paddle-ball',
                title: 'Ping-Pong 3D Dynamic Rally',
                desc: 'Defend your table with rapid paddle tracking. High-velocity returns challenge binocular alignment and dynamic stereoscopic motion tracking.',
                mascot: '/images/pingpong-mascot.svg',
                route: '/game10pingpong',
                bg: 'linear-gradient(135deg, #115e59 0%, #0f766e 50%, #059669 100%)',
                time: '15 mins',
                gameKey: 'Ping Pong'
            }
        ];

        this.allGames = [
            {
                id: 'Snake',
                name: 'Snake Game',
                route: '/game1snake',
                badge: 'Binocular Focus',
                badgeClass: 'badge-emerald',
                art: '/images/snake-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.25) 100%)',
                desc: 'Guide the snake to hunt targets. Red-cyan color separation splits the snake and food between eyes, actively training binocular fusion and breaking suppression.',
                time: '20 mins'
            },
            {
                id: 'FlappyBird',
                name: 'Flappy Bird',
                route: '/game2flappybird',
                badge: 'Depth Perception',
                badgeClass: 'badge-sky',
                art: '/images/flappy-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.14) 0%, rgba(2, 132, 199, 0.25) 100%)',
                desc: 'Navigate flight obstacles with precise timing. Suppressed visual elements encourage both eyes to coordinate simultaneously to judge altitude.',
                time: '15 mins'
            },
            {
                id: 'Menja',
                name: 'Menja 3D',
                route: '/game12menja',
                badge: 'Spatial Reflex',
                badgeClass: 'badge-indigo',
                art: '/images/menja-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(79, 70, 229, 0.25) 100%)',
                desc: 'Dynamic 3D block slicing challenge that exercises rapid cortical processing, stereoscopic depth judgment, and contrast sensitivity.',
                time: '20 mins'
            },
            {
                id: 'Tetris',
                name: 'Tetris Fusion',
                route: '/game8tetris',
                badge: 'Pattern Synthesis',
                badgeClass: 'badge-purple',
                art: '/images/tetris-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, rgba(126, 34, 206, 0.25) 100%)',
                desc: 'Falling-block puzzle adapted for vision therapy. Color-filtered tetrominoes train spatial orientation, hand-eye coordination, and binocular alignment.',
                time: '20 mins'
            },
            {
                id: 'BubbleShooter',
                name: 'Bubble Shooter',
                route: '/game9bubbleshooter',
                badge: 'Foveal Targeting',
                badgeClass: 'badge-amber',
                art: '/images/bubbles-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.25) 100%)',
                desc: 'Aim and match color-separated bubbles to stimulate peripheral stereoscopic vision and promote active visual processing in the non-dominant eye.',
                time: '15 mins'
            },
            {
                id: 'PingPong',
                name: 'Ping-Pong 3D',
                route: '/game10pingpong',
                badge: 'Speed Tracking',
                badgeClass: 'badge-teal',
                art: '/images/pingpong-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.14) 0%, rgba(13, 148, 136, 0.25) 100%)',
                desc: 'Rapid dichoptic paddle response game that sharpens reaction velocity, spatial tracking, and dynamic binocular depth judgment.',
                time: '15 mins'
            },
            {
                id: 'StickyHolds',
                name: 'Sticky Holds',
                route: '/game11stickyholds',
                badge: 'Agility Fixation',
                badgeClass: 'badge-slate',
                art: '/images/stickyholds-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.14) 0%, rgba(51, 65, 85, 0.25) 100%)',
                desc: 'Rock climbing agility puzzle demanding sustained visual fixation, depth processing, and bilateral coordination to reach the top hold.',
                time: '15 mins'
            },
            {
                id: 'Maze',
                name: 'Maze Labyrinth',
                route: '/game5maze',
                badge: 'Spatial Search',
                badgeClass: 'badge-yellow',
                art: '/images/maze.png',
                bannerBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.14) 0%, rgba(202, 138, 4, 0.25) 100%)',
                desc: 'Solve intricate labyrinths with split visual cues, boosting visual search efficiency, spatial mapping, and neuro-visual pathway activation.',
                time: '15 mins'
            },
            {
                id: 'BallCatcher',
                name: 'Ball Catcher',
                route: '/game3ballcatcher',
                badge: 'Hand-Eye Sync',
                badgeClass: 'badge-rose',
                art: '/images/ballcatcher-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, rgba(225, 29, 72, 0.25) 100%)',
                desc: 'Track and catch falling targets across visual fields to improve saccadic eye movements and visual-motor integration.',
                time: '15 mins'
            },
            {
                id: 'BouncingBall',
                name: 'Bouncing Ball',
                route: '/game7test',
                badge: 'Trajectory Tracking',
                badgeClass: 'badge-blue',
                art: '/images/bouncingball-mascot.svg',
                bannerBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(29, 78, 216, 0.25) 100%)',
                desc: 'Anticipate dynamic rebounds and speed variations under dichoptic viewing to enhance depth perception and tracking agility.',
                time: '15 mins'
            }
        ];
    }

    componentDidMount() {
        this.markPlayedGame();
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

    // Launch game in fullscreen iframe
    changesrc = (framesrc) => {
        console.log('Starting game session:', framesrc);
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
                            <i className="fa-solid fa-gamepad text-primary"></i>
                            Therapy Games
                        </h3>
                        <p className="text-muted small mb-0">
                            Play prescribed games with your calibrated red/cyan glasses to eliminate visual suppression.
                        </p>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
                        data-bs-toggle="modal" 
                        data-bs-target="#colorSettingModal"
                    >
                        <i className="fa-solid fa-sliders"></i>
                        <span>Calibrate Glasses</span>
                    </button>
                </div>

                {/* Featured Workout Hero Banner (Human-crafted, No Overlapping Toggler) */}
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
                                onClick={() => this.changesrc(current.route)}
                            >
                                <i className="fa-solid fa-circle-play text-primary"></i>
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
                    <span className="badge bg-primary-subtle text-primary small rounded-pill px-3 py-1 fw-bold">
                        10 Clinical Engines
                    </span>
                </div>

                {/* Games Grid with Large Icons & Rich Aesthetic Cards */}
                <div className="row g-4">
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
                                            <i className="fa-regular fa-clock me-1 text-primary"></i>
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
                                        onClick={() => this.changesrc(game.route)}
                                    >
                                        <i className="fa-solid fa-play me-2"></i>
                                        Play Game
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
