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
                title: 'Dichoptic Snake',
                desc: 'Guide the snake to hunt moving targets. Red and cyan filtering splits the snake and food between eyes, stimulating binocular cortical fusion and reducing amblyopic suppression.',
                mascot: '/images/snake-mascot.svg',
                route: '/game1snake',
                time: '20 mins',
                gameKey: 'Snake'
            },
            {
                tag: 'Visual Timing',
                tagIcon: 'fa-plane-departure',
                title: 'Altitude Flight',
                desc: 'Navigate altitude obstacles requiring rapid saccadic eye movements. Color separation ensures both eyes coordinate in real time to judge clearances.',
                mascot: '/images/flappy-mascot.svg',
                route: '/game2flappybird',
                time: '15 mins',
                gameKey: 'Flappy Bird'
            },
            {
                tag: 'Visual Reflexes',
                tagIcon: 'fa-bolt',
                title: '3D Spatial Slicer',
                desc: 'Slice dynamic 3D blocks in rapid succession as they fly toward you. Sharpens reaction velocity, stereoscopic depth judgment, and contrast sensitivity.',
                mascot: '/images/menja-mascot.svg',
                route: '/game12menja',
                time: '20 mins',
                gameKey: 'Menja'
            },
            {
                tag: 'Pattern Synthesis',
                tagIcon: 'fa-cubes',
                title: 'Block Fusion',
                desc: 'Rotate and place color-filtered falling tetrominoes. Board boundaries and falling shapes are split between eyes, demanding simultaneous cortical vision.',
                mascot: '/images/tetris-mascot.svg',
                route: '/game8tetris',
                time: '20 mins',
                gameKey: 'Tetris'
            },
            {
                tag: 'Spatial Targeting',
                tagIcon: 'fa-bullseye',
                title: 'Bubble Target Aim',
                desc: 'Aim and pop matching bubble clusters to stimulate foveal fixation, peripheral vision, and active engagement in the amblyopic eye.',
                mascot: '/images/bubbles-mascot.svg',
                route: '/game9bubbleshooter',
                time: '15 mins',
                gameKey: 'Bubble Shooter'
            },
            {
                tag: 'Speed Tracking',
                tagIcon: 'fa-table-tennis-paddle-ball',
                title: 'Table Rally 3D',
                desc: 'Defend your table with rapid paddle tracking. High-velocity returns challenge binocular alignment and dynamic stereoscopic motion tracking.',
                mascot: '/images/pingpong-mascot.svg',
                route: '/game10pingpong',
                time: '15 mins',
                gameKey: 'Ping Pong'
            },
            {
                tag: 'Agility Fixation',
                tagIcon: 'fa-mountain',
                title: 'Climber Holds',
                desc: 'Agility challenge demanding sustained visual fixation, depth processing, and bilateral coordination to navigate to the top hold.',
                mascot: '/images/stickyholds-mascot.svg',
                route: '/game11stickyholds',
                time: '15 mins',
                gameKey: 'Sticky Holds'
            },
            {
                tag: 'Spatial Search',
                tagIcon: 'fa-route',
                title: 'Labyrinth Search',
                desc: 'Solve intricate labyrinths with split visual cues, boosting visual search efficiency, spatial mapping, and neuro-visual pathway activation.',
                mascot: '/images/maze.png',
                route: '/game5maze',
                time: '15 mins',
                gameKey: 'Maze'
            },
            {
                tag: 'Hand-Eye Sync',
                tagIcon: 'fa-bullseye',
                title: 'Target Catcher',
                desc: 'Track and catch falling targets across visual fields to improve saccadic eye movements and visual-motor integration.',
                mascot: '/images/ballcatcher-mascot.svg',
                route: '/game3ballcatcher',
                time: '15 mins',
                gameKey: 'Ball Catcher'
            },
            {
                tag: 'Trajectory Tracking',
                tagIcon: 'fa-arrows-spin',
                title: 'Rebound Ball',
                desc: 'Anticipate dynamic rebounds and speed variations under dichoptic viewing to enhance depth perception and tracking agility.',
                mascot: '/images/bouncingball-mascot.svg',
                route: '/game7test',
                time: '15 mins',
                gameKey: 'Bouncing Ball'
            }
        ];

        this.allGames = [
            {
                id: 'Snake',
                name: 'Dichoptic Snake',
                route: '/game1snake',
                badge: 'Binocular Focus',
                badgeClass: 'badge-neutral',
                art: '/images/snake-mascot.svg',
                desc: 'Guide the snake to hunt targets. Red-cyan color separation splits the snake and food between eyes, actively training binocular fusion and breaking suppression.',
                time: '20 mins'
            },
            {
                id: 'FlappyBird',
                name: 'Altitude Flight',
                route: '/game2flappybird',
                badge: 'Depth Perception',
                badgeClass: 'badge-neutral',
                art: '/images/flappy-mascot.svg',
                desc: 'Navigate flight obstacles with precise timing. Suppressed visual elements encourage both eyes to coordinate simultaneously to judge altitude.',
                time: '15 mins'
            },
            {
                id: 'Menja',
                name: '3D Spatial Slicer',
                route: '/game12menja',
                badge: 'Spatial Reflex',
                badgeClass: 'badge-neutral',
                art: '/images/menja-mascot.svg',
                desc: 'Dynamic 3D block slicing challenge that exercises rapid cortical processing, stereoscopic depth judgment, and contrast sensitivity.',
                time: '20 mins'
            },
            {
                id: 'Tetris',
                name: 'Block Fusion',
                route: '/game8tetris',
                badge: 'Pattern Synthesis',
                badgeClass: 'badge-neutral',
                art: '/images/tetris-mascot.svg',
                desc: 'Falling-block puzzle adapted for vision therapy. Color-filtered tetrominoes train spatial orientation, hand-eye coordination, and binocular alignment.',
                time: '20 mins'
            },
            {
                id: 'BubbleShooter',
                name: 'Bubble Target Aim',
                route: '/game9bubbleshooter',
                badge: 'Foveal Targeting',
                badgeClass: 'badge-neutral',
                art: '/images/bubbles-mascot.svg',
                desc: 'Aim and match color-separated bubbles to stimulate peripheral stereoscopic vision and promote active visual processing in the amblyopic eye.',
                time: '15 mins'
            },
            {
                id: 'PingPong',
                name: 'Table Rally 3D',
                route: '/game10pingpong',
                badge: 'Speed Tracking',
                badgeClass: 'badge-neutral',
                art: '/images/pingpong-mascot.svg',
                desc: 'Rapid dichoptic paddle response game that sharpens reaction velocity, spatial tracking, and dynamic binocular depth judgment.',
                time: '15 mins'
            },
            {
                id: 'StickyHolds',
                name: 'Climber Holds',
                route: '/game11stickyholds',
                badge: 'Agility Fixation',
                badgeClass: 'badge-neutral',
                art: '/images/stickyholds-mascot.svg',
                desc: 'Rock climbing agility puzzle demanding sustained visual fixation, depth processing, and bilateral coordination to reach the top hold.',
                time: '15 mins'
            },
            {
                id: 'Maze',
                name: 'Labyrinth Search',
                route: '/game5maze',
                badge: 'Spatial Search',
                badgeClass: 'badge-neutral',
                art: '/images/maze.png',
                desc: 'Solve intricate labyrinths with split visual cues, boosting visual search efficiency, spatial mapping, and neuro-visual pathway activation.',
                time: '15 mins'
            },
            {
                id: 'BallCatcher',
                name: 'Target Catcher',
                route: '/game3ballcatcher',
                badge: 'Hand-Eye Sync',
                badgeClass: 'badge-neutral',
                art: '/images/ballcatcher-mascot.svg',
                desc: 'Track and catch falling targets across visual fields to improve saccadic eye movements and visual-motor integration.',
                time: '15 mins'
            },
            {
                id: 'BouncingBall',
                name: 'Rebound Ball',
                route: '/game7test',
                badge: 'Trajectory Tracking',
                badgeClass: 'badge-neutral',
                art: '/images/bouncingball-mascot.svg',
                desc: 'Anticipate dynamic rebounds and speed variations under dichoptic viewing to enhance depth perception and tracking agility.',
                time: '15 mins'
            }
        ];
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

                {/* Featured Workout Hero Banner (Monochrome Architectural Frame) */}
                <div 
                    className="therapy-hero-card"
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
                                    <i className="fa-regular fa-clock me-1"></i> {current.time}
                                </span>
                                <span className="therapy-chip">
                                    <i className="fa-solid fa-glasses me-1"></i> Red/Cyan Filter
                                </span>
                            </div>

                            <button 
                                type="button"
                                className="therapy-hero-btn"
                                onClick={() => this.changesrc(current.route)}
                            >
                                <i className="fa-solid fa-circle-play me-1"></i>
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
                                <div className="game-cover-banner">
                                    <img 
                                        src={game.art} 
                                        alt={game.name} 
                                        className="game-cover-icon"
                                    />
                                    <span className="game-card-tag">
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
                                        <span className="text-sub fw-semibold">
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
