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
                tag: 'Snake',
                title: "It's time to play with blocks!",
                desc: 'Hunt moving targets, stimulate non-dominant macular fixation, and break amblyopic suppression through dual-channel contrast filtering.',
                mascot: '/images/snake-mascot.svg',
                route: '/game1snake',
                bg: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                gameKey: 'Snake'
            },
            {
                tag: 'Menza',
                title: "It's time to play with blocks!",
                desc: 'Slice dynamic 3D blocks to exercise contrast sensitivity, visual reflexes, and stereoscopic depth judgment with dichoptic red-cyan separation.',
                mascot: '/images/menja-mascot.svg',
                route: '/game12menja',
                bg: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                gameKey: 'Menja'
            },
            {
                tag: 'Flappy Bird',
                title: 'Fly through obstacles with dual-eye focus!',
                desc: 'Navigate through narrow gates requiring high-frequency binocular fusion and saccadic reaction. Both eyes must work together to judge altitude.',
                mascot: '/images/flappy-mascot.svg',
                route: '/game2flappybird',
                bg: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                gameKey: 'Flappy Bird'
            },
            {
                tag: 'Tetris Fusion',
                title: 'Stack & align dichoptic falling tetrominoes!',
                desc: 'Color-filtered blocks separate active tetrominoes and pit boundaries between eyes, forcing simultaneous cortical processing to score lines.',
                mascot: '/images/tetris-mascot.svg',
                route: '/game8tetris',
                bg: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                gameKey: 'Tetris'
            },
            {
                tag: 'Bubble Shooter',
                title: 'Target, aim and burst color bubbles!',
                desc: 'Precision foveal aiming exercises peripheral stereoscopic acuity and active visual processing in the amblyopic eye.',
                mascot: '/images/bubbles-mascot.svg',
                route: '/game9bubbleshooter',
                bg: 'linear-gradient(135deg, #d97706 0%, #e11d48 100%)',
                gameKey: 'Bubble Shooter'
            },
            {
                tag: 'Ping Pong 3D',
                title: 'Defend your court with rapid paddle tracking!',
                desc: 'High-velocity rally tracking forces binocular fusion and dynamic motion stereopsis as the ball travels across depth planes.',
                mascot: '/images/pingpong-mascot.svg',
                route: '/game10pingpong',
                bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                gameKey: 'Ping Pong'
            }
        ];

        this.allGames = [
            {
                id: 'Snake',
                name: 'Snake Game',
                route: '/game1snake',
                badge: 'Binocular Focus',
                badgeClass: 'bg-success-subtle text-success',
                art: '/images/snake-mascot.svg',
                desc: 'Guide the snake to collect targets while dichoptically splitting snake and food between eyes to force binocular fusion and reduce amblyopic suppression.',
                time: '20 mins'
            },
            {
                id: 'FlappyBird',
                name: 'Flappy Bird',
                route: '/game2flappybird',
                badge: 'Depth Perception',
                badgeClass: 'bg-primary-subtle text-primary',
                art: '/images/flappy-mascot.svg',
                desc: 'Navigate obstacles requiring precise timing and dual-eye coordination. Suppressed visual elements encourage both eyes to work simultaneously.',
                time: '15 mins'
            },
            {
                id: 'Menja',
                name: 'Menja 3D',
                route: '/game12menja',
                badge: 'Spatial Reflex',
                badgeClass: 'bg-info-subtle text-info',
                art: '/images/menja-mascot.svg',
                desc: 'Dynamic 3D block slicing challenge that stimulates visual reflexes, contrast sensitivity, and motor coordination with dichoptic red-cyan separation.',
                time: '20 mins'
            },
            {
                id: 'Tetris',
                name: 'Tetris Fusion',
                route: '/game8tetris',
                badge: 'Pattern Synthesis',
                badgeClass: 'bg-purple-subtle text-purple',
                art: '/images/tetris-mascot.svg',
                desc: 'Classic falling-block puzzle adapted for vision therapy. Color-filtered tetrominoes train spatial orientation, hand-eye coordination, and binocular alignment.',
                time: '20 mins'
            },
            {
                id: 'BubbleShooter',
                name: 'Bubble Shooter',
                route: '/game9bubbleshooter',
                badge: 'Color Fusion',
                badgeClass: 'bg-danger-subtle text-danger',
                art: '/images/bubbles-mascot.svg',
                desc: 'Aim and match color-separated bubbles to stimulate peripheral stereoscopic vision and promote active visual processing in the non-dominant eye.',
                time: '15 mins'
            },
            {
                id: 'PingPong',
                name: 'Ping-Pong 3D',
                route: '/game10pingpong',
                badge: 'Speed Tracking',
                badgeClass: 'bg-warning-subtle text-warning',
                art: '/images/pingpong-mascot.svg',
                desc: 'Rapid dichoptic paddle response game that sharpens reaction velocity, spatial tracking, and dynamic binocular depth judgment.',
                time: '15 mins'
            },
            {
                id: 'StickyHolds',
                name: 'Sticky Holds',
                route: '/game11stickyholds',
                badge: 'Agility Fixation',
                badgeClass: 'bg-secondary-subtle text-secondary',
                art: '/images/Sticky-Holds.png',
                desc: 'Rock climbing agility puzzle demanding visual fixation, depth processing, and sustained binocular engagement to reach new heights.',
                time: '15 mins'
            },
            {
                id: 'Maze',
                name: 'Maze Labyrinth',
                route: '/game5maze',
                badge: 'Contrast Maze',
                badgeClass: 'bg-dark-subtle text-dark',
                art: '/images/Maze.png',
                desc: 'Solve intricate labyrinths with split visual cues, boosting visual search efficiency and neuro-visual pathway activation.',
                time: '15 mins'
            },
            {
                id: 'BallCatcher',
                name: 'Ball Catcher',
                route: '/game3ballcatcher',
                badge: 'Hand-Eye Sync',
                badgeClass: 'bg-info-subtle text-info',
                art: '/images/ballcatcher.jpeg',
                desc: 'Track and catch falling targets across visual fields to improve saccadic eye movements and visual-motor integration.',
                time: '15 mins'
            },
            {
                id: 'BouncingBall',
                name: 'Bouncing Ball',
                route: '/game7test',
                badge: 'Dynamic Tracking',
                badgeClass: 'bg-primary-subtle text-primary',
                art: '/images/bouncing-ball.png',
                desc: 'Anticipate dynamic trajectories and rebounds under dichoptic viewing to enhance depth perception and tracking agility.',
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
        }, 5000);
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

    // Change src of iframes
    changesrc = (framesrc) => {
        console.log('Button Clicked: ' + framesrc);
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
                        <h3 className="fw-bold mb-1 text-main"><i className="fa-solid fa-gamepad text-primary me-2"></i>Therapy Games</h3>
                        <p className="text-muted small mb-0">Play assigned games wearing your dichoptic red/cyan glasses to eliminate suppression</p>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm"
                        data-bs-toggle="modal" 
                        data-bs-target="#colorSettingModal"
                    >
                        <i className="fa-solid fa-sliders me-1"></i> Calibrate Colors
                    </button>
                </div>

                {/* Featured Games Carousel (Image 2 & 3 Style) */}
                <div 
                    className="therapy-carousel-wrap"
                    onMouseEnter={() => this.setState({ isPaused: true })}
                    onMouseLeave={() => this.setState({ isPaused: false })}
                >
                    <div 
                        className="therapy-carousel-slide" 
                        style={{ background: current.bg }}
                    >
                        <div className="therapy-carousel-content">
                            <span className="therapy-carousel-tag">{current.tag}</span>
                            <h2 className="therapy-carousel-title">{current.title}</h2>
                            <p className="therapy-carousel-desc">{current.desc}</p>
                            <button 
                                className="therapy-carousel-btn"
                                onClick={() => this.changesrc(current.route)}
                            >
                                <i className="fa-solid fa-circle-play text-primary"></i> Play Now
                            </button>
                        </div>
                        <div className="therapy-carousel-art d-none d-sm-flex">
                            <img src={current.mascot} alt={current.tag} />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                        className="carousel-nav-btn carousel-nav-prev"
                        onClick={this.prevSlide}
                        aria-label="Previous Slide"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button 
                        className="carousel-nav-btn carousel-nav-next"
                        onClick={this.nextSlide}
                        aria-label="Next Slide"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    {/* Indicators */}
                    <div className="carousel-dots">
                        {this.carouselSlides.map((slide, index) => (
                            <div 
                                key={index} 
                                className={`carousel-dot ${index === this.state.currentSlide ? 'active' : ''}`}
                                onClick={() => this.goToSlide(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Section Subheading */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold text-main mb-0">All Prescribed Therapy Games</h5>
                    <span className="badge bg-secondary-subtle text-secondary small rounded-pill px-3 py-1">
                        10 Clinical Engines
                    </span>
                </div>

                {/* Games Grid with Rich Descriptions (Image 3 Style) */}
                <div className="row g-4">
                    {this.allGames.map((game) => (
                        <div key={game.id} className="col-12 col-md-6 col-xl-4">
                            <div className={`game-card-v3 h-100 ${game.id}`}>
                                <div>
                                    <div className="game-card-art-box">
                                        <img src={game.art} alt={game.name} />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                        <h5 className="game-title mb-0">{game.name}</h5>
                                        <span className={`badge ${game.badgeClass} game-badge mb-0`}>
                                            {game.badge}
                                        </span>
                                    </div>
                                    <p className="game-description">
                                        {game.desc}
                                    </p>
                                </div>

                                <div className="mt-auto pt-2">
                                    <div className="d-flex align-items-center justify-content-between small text-muted mb-2 px-1">
                                        <span><i className="fa-regular fa-clock me-1 text-primary"></i> Target: {game.time}</span>
                                        <span className="text-primary fw-semibold"><i className="fa-solid fa-glasses me-1"></i> Red/Cyan</span>
                                    </div>
                                    <button 
                                        className="game-play-btn openGame" 
                                        onClick={() => this.changesrc(game.route)}
                                    >
                                        <i className="fa-solid fa-play me-1"></i> Play Game
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
