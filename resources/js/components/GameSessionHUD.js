import React from 'react';
import { getGameIcon, getGameConfig } from '../gameConfig';

/**
 * GameSessionHUD
 * Clinical in-game heads-up display overlay for dichoptic therapy.
 * Includes:
 * - Pre-Game Briefing Modal with constrained mascot icon badge and clinical glasses reminder
 * - Speed Settings Engine (Slow / Medium / Fast / Incremental Adaptive)
 * - 3-2-1 Preparation Countdown
 * - Real-time therapy countdown timer and duration logging
 */
export default class GameSessionHUD extends React.Component {
    constructor(props) {
        super(props);

        const prescribedMinutes = Number(props.prescribedMinutes || 20);
        const alreadyPlayedSeconds = Number(props.alreadyPlayedSecondsToday || 0);
        const totalPrescribedSeconds = prescribedMinutes * 60;
        const initialRemaining = Math.max(0, totalPrescribedSeconds - alreadyPlayedSeconds);

        const savedSpeed = (typeof localStorage !== 'undefined') ? (localStorage.getItem('lazyeye_game_speed') || 'medium') : 'medium';

        this.state = {
            sessionStage: 'briefing', // 'briefing' | 'countdown' | 'active'
            countdown: 3,
            speedMode: savedSpeed, // 'slow' | 'medium' | 'fast' | 'incremental'
            elapsedSeconds: 0,
            remainingSeconds: initialRemaining,
            totalPrescribedSeconds: totalPrescribedSeconds,
            alreadyPlayedSeconds: alreadyPlayedSeconds,
            isPaused: false,
            isGoalMet: initialRemaining === 0,
            currentScore: 0,
            showExitConfirm: false
        };

        this.timer = null;
        this.countdownTimer = null;
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('message', this.handleIframeMessage);
    }

    componentWillUnmount() {
        this.stopTimer();
        this.stopCountdownTimer();
        window.removeEventListener('message', this.handleIframeMessage);
    }

    handleSelectSpeed = (mode) => {
        this.setState({ speedMode: mode });
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('lazyeye_game_speed', mode);
        }
    };

    handleStartCountdown = () => {
        this.setState({ sessionStage: 'countdown', countdown: 3 });

        // Request fullscreen on container if available
        const elem = this.containerRef.current;
        if (elem) {
            if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        }

        this.countdownTimer = setInterval(() => {
            this.setState(prev => {
                if (prev.countdown <= 1) {
                    this.stopCountdownTimer();
                    this.startActiveSession();
                    return { sessionStage: 'active', countdown: 0 };
                }
                return { countdown: prev.countdown - 1 };
            });
        }, 900);
    };

    stopCountdownTimer = () => {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    };

    startActiveSession = () => {
        this.startTimer();
        // Send speedMode to iframe
        const iframe = document.getElementById('session-game-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ 
                msg: 'START_GAME',
                speedMode: this.state.speedMode 
            }, '*');
        }
    };

    startTimer = () => {
        this.stopTimer();
        this.timer = setInterval(() => {
            if (!this.state.isPaused && this.state.sessionStage === 'active') {
                this.setState(prev => {
                    const nextElapsed = prev.elapsedSeconds + 1;
                    const nextRemaining = Math.max(0, prev.remainingSeconds - 1);
                    const goalNowMet = nextRemaining === 0;

                    return {
                        elapsedSeconds: nextElapsed,
                        remainingSeconds: nextRemaining,
                        isGoalMet: goalNowMet
                    };
                });
            }
        }, 1000);
    };

    stopTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    };

    handleIframeMessage = (event) => {
        if (!event.data) return;
        
        // Listen for real-time score updates from game engine
        if (event.data.score !== undefined && !isNaN(event.data.score)) {
            this.setState({ currentScore: Number(event.data.score) });
        }

        // Listen for internal game-over or session report
        if (event.data.msg === 'Game Ended') {
            const finalScore = Number(event.data.score || this.state.currentScore || 0);
            this.finishSession(finalScore);
        }
    };

    togglePause = () => {
        this.setState(prev => {
            const nextPaused = !prev.isPaused;
            // Notify iframe game engine to pause / resume physics
            const iframe = document.getElementById('session-game-iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ msg: nextPaused ? 'Pause' : 'Resume' }, '*');
            }
            return { isPaused: nextPaused };
        });
    };

    handleRequestExit = () => {
        this.setState({ isPaused: true, showExitConfirm: true });
    };

    cancelExit = () => {
        this.setState({ isPaused: false, showExitConfirm: false });
    };

    handleCancelBriefing = () => {
        if (this.props.onSessionCompleted) {
            this.props.onSessionCompleted(null);
        }
    };

    finishSession = (customScore = null) => {
        this.stopTimer();
        this.stopCountdownTimer();

        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        const scoreToSave = customScore !== null ? customScore : this.state.currentScore;
        const durationToSave = Math.max(1, this.state.elapsedSeconds);

        if (this.props.onSessionCompleted) {
            this.props.onSessionCompleted({
                gameName: this.props.game?.title || this.props.game?.name || this.props.game?.id || 'Therapy Game',
                score: scoreToSave,
                durationSeconds: durationToSave,
                elapsedFormatted: this.formatTime(durationToSave)
            });
        }
    };

    formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    render() {
        const { game } = this.props;
        const { 
            sessionStage, 
            countdown, 
            speedMode, 
            elapsedSeconds, 
            remainingSeconds, 
            totalPrescribedSeconds, 
            alreadyPlayedSeconds, 
            isPaused, 
            isGoalMet, 
            currentScore, 
            showExitConfirm 
        } = this.state;

        const gameConfig = getGameConfig(game?.id || game?.title || game?.name) || game || {};
        const icon = getGameIcon(game?.id || game?.title || game?.name);
        const title = gameConfig.title || game?.title || game?.name || 'Therapy Session';
        const clinicalType = gameConfig.clinicalType || 'Binocular Suppression Therapy';
        const rawRoute = gameConfig.route || game?.route || '/game1snake';
        
        // Append speed parameter to route
        const gameRoute = rawRoute + (rawRoute.includes('?') ? '&' : '?') + 'speed=' + speedMode;

        // Calculate total day progress percentage
        const totalDayCompletedSeconds = alreadyPlayedSeconds + elapsedSeconds;
        const progressPercent = Math.min(100, Math.round((totalDayCompletedSeconds / totalPrescribedSeconds) * 100));

        const SPEED_LABELS = {
            slow: { label: 'Slow (Rehab)', icon: 'fa-gauge-simple', desc: 'Extended dwell time for pediatric & severe amblyopia' },
            medium: { label: 'Medium', icon: 'fa-gauge', desc: 'Standard clinical balance for active tracking' },
            fast: { label: 'Fast (Agility)', icon: 'fa-gauge-high', desc: 'Rapid pursuit & reaction velocity challenge' },
            incremental: { label: 'Adaptive', icon: 'fa-arrow-trend-up', desc: 'Speed accelerates automatically as score rises' }
        };

        return (
            <div 
                ref={this.containerRef} 
                className="session-hud-overlay"
                id="active-session-container"
            >
                {/* Top Glassmorphic Clinical HUD Bar */}
                <header className="session-hud-bar">
                    {/* Left: Mascot & Game Title */}
                    <div className="session-hud-brand">
                        <img src={icon} alt="" className="session-hud-icon" />
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h6 className="mb-0 text-white fw-bold">{title}</h6>
                                <span className="badge bg-danger text-white border border-danger-subtle font-mono" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                    Red/Cyan Dichoptic
                                </span>
                                {sessionStage === 'active' && (
                                    <span className="badge bg-secondary font-mono d-none d-md-inline" style={{ fontSize: '0.68rem' }}>
                                        <i className={`fa-solid ${SPEED_LABELS[speedMode]?.icon || 'fa-gauge'} me-1`}></i>
                                        {SPEED_LABELS[speedMode]?.label || 'Standard'}
                                    </span>
                                )}
                            </div>
                            <small className="text-secondary d-none d-sm-inline" style={{ fontSize: '0.74rem' }}>
                                {clinicalType}
                            </small>
                        </div>
                    </div>

                    {/* Center: Remaining Prescribed Time & Progress */}
                    <div className="session-hud-center">
                        <div className="d-flex align-items-center gap-2">
                            <span className="session-timer-pill">
                                <i className="fa-regular fa-clock text-warning"></i>
                                {this.formatTime(remainingSeconds)}
                            </span>
                            <span className={`badge ${isGoalMet ? 'bg-success text-white' : 'bg-primary-subtle text-info'} font-mono small d-none d-md-inline`}>
                                {isGoalMet ? 'Daily Goal Met! 🎉' : 'Remaining Today'}
                            </span>
                        </div>
                        {/* Daily Progress Bar */}
                        <div className="session-hud-progress" title={`Daily prescription: ${progressPercent}% completed`}>
                            <div 
                                className="session-hud-progress-bar" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Right: Controls & Actions */}
                    <div className="d-flex align-items-center gap-2">
                        {/* Live Score Counter */}
                        <div className="d-none d-lg-flex align-items-center gap-1 px-3 py-1 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25 font-mono text-warning small">
                            <span>Score:</span>
                            <strong className="fs-6 text-white">{currentScore}</strong>
                        </div>

                        {/* Pause / Resume Button (Active Stage Only) */}
                        {sessionStage === 'active' && (
                            <button 
                                type="button" 
                                className={`btn btn-sm ${isPaused ? 'btn-success' : 'btn-outline-light'} px-3 d-flex align-items-center gap-1 fw-semibold`}
                                onClick={this.togglePause}
                                title={isPaused ? "Resume Session" : "Pause Session"}
                            >
                                <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                                <span className="d-none d-sm-inline">{isPaused ? 'Resume' : 'Pause'}</span>
                            </button>
                        )}

                        {/* Finish & Save Session Button */}
                        <button 
                            type="button" 
                            className="btn btn-sm btn-danger px-3 d-flex align-items-center gap-1 fw-semibold shadow-sm"
                            onClick={sessionStage === 'active' ? this.handleRequestExit : this.handleCancelBriefing}
                            title="Exit session"
                        >
                            <i className="fa-solid fa-xmark me-1"></i>
                            <span>{sessionStage === 'active' ? 'Finish & Save' : 'Exit'}</span>
                        </button>
                    </div>
                </header>

                {/* Pause Notification Banner */}
                {isPaused && !showExitConfirm && (
                    <div className="bg-warning text-dark text-center py-1 small fw-semibold font-mono border-bottom border-warning">
                        <i className="fa-solid fa-circle-pause me-1"></i> Session Paused &middot; Click "Resume" to continue your dichoptic visual workout
                    </div>
                )}

                {/* Main Game Iframe Frame */}
                <iframe 
                    id="session-game-iframe" 
                    src={gameRoute} 
                    allow="fullscreen" 
                    className="session-hud-iframe"
                    title={title}
                />

                {/* 1. Pre-Game Launch & Briefing Modal */}
                {sessionStage === 'briefing' && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(2, 6, 23, 0.92)', zIndex: 100000, backdropFilter: 'blur(8px)' }}>
                        <div className="card border shadow-2xl px-4 pt-3 pb-3 text-center" style={{ maxWidth: 480, width: '100%', maxHeight: '92vh', overflowY: 'auto', backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 16 }}>
                            {/* Constrained Mascot Artwork Badge */}
                            <div className="mb-2">
                                <div className="d-inline-flex p-2 rounded-circle shadow-lg" style={{ width: 76, height: 76, backgroundColor: '#1e293b', border: '2px solid rgba(56, 189, 248, 0.4)' }}>
                                    <img src={icon} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            </div>

                            <h5 className="fw-bold mb-1 text-white">{title}</h5>
                            <p className="text-secondary small mb-2">{clinicalType}</p>

                            {/* 3D Glasses Check Banner */}
                            <div className="d-flex align-items-center justify-content-center gap-3 py-1.5 px-3 rounded border mb-2" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: '#334155' }}>
                                <div className="d-flex align-items-center gap-2 small font-mono">
                                    <span className="badge rounded-circle p-1" style={{ backgroundColor: '#ef4444', width: 14, height: 14 }}> </span>
                                    <span>Left Eye: <strong>RED</strong></span>
                                </div>
                                <span className="text-secondary">|</span>
                                <div className="d-flex align-items-center gap-2 small font-mono">
                                    <span className="badge rounded-circle p-1" style={{ backgroundColor: '#06b6d4', width: 14, height: 14 }}> </span>
                                    <span>Right Eye: <strong>CYAN</strong></span>
                                </div>
                            </div>

                            {/* Speed & Difficulty Mode Selection */}
                            <div className="mb-2 text-start">
                                <label className="form-label small fw-semibold text-secondary d-flex justify-content-between align-items-center mb-1">
                                    <span>Therapy Speed &amp; Tracking Velocity</span>
                                    <span className="text-primary font-mono">{SPEED_LABELS[speedMode]?.label}</span>
                                </label>
                                <div className="row g-2">
                                    {Object.entries(SPEED_LABELS).map(([key, item]) => (
                                        <div key={key} className="col-6">
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm w-100 py-1.5 px-2 text-start border d-flex align-items-center gap-2 ${speedMode === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                style={{ borderRadius: 10, fontSize: '0.8rem' }}
                                                onClick={() => this.handleSelectSpeed(key)}
                                            >
                                                <i className={`fa-solid ${item.icon} fs-6`}></i>
                                                <div className="overflow-hidden">
                                                    <div className="fw-bold text-truncate">{item.label}</div>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <small className="text-secondary d-block mt-1 mb-0 font-mono" style={{ fontSize: '0.72rem' }}>
                                    <i className="fa-solid fa-circle-info text-info me-1"></i> {SPEED_LABELS[speedMode]?.desc}
                                </small>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mt-2 pt-2 border-top border-secondary border-opacity-25">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light py-2 px-3 fw-semibold flex-fill d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: 10, fontSize: '0.88rem' }}
                                    onClick={this.handleCancelBriefing}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                    <span>Cancel</span>
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success py-2 px-3 fw-bold flex-fill shadow-lg d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: 10, fontSize: '0.88rem' }}
                                    onClick={this.handleStartCountdown}
                                >
                                    <i className="fa-solid fa-play"></i>
                                    <span>Start Session</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. 3-2-1 Countdown Overlay */}
                {sessionStage === 'countdown' && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', zIndex: 100000 }}>
                        <div className="text-secondary text-uppercase fw-semibold tracking-wider font-mono mb-2" style={{ letterSpacing: '0.2em' }}>
                            Put on your glasses
                        </div>
                        <div className="display-1 fw-bold text-white mb-2" style={{ fontSize: '8rem', textShadow: '0 0 30px rgba(56, 189, 248, 0.8)' }}>
                            {countdown > 0 ? countdown : 'GO!'}
                        </div>
                        <div className="text-info font-mono small">
                            Focusing visual cortex on targets...
                        </div>
                    </div>
                )}

                {/* 3. Premature Exit / Finish Confirmation Modal */}
                {showExitConfirm && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100000 }}>
                        <div className="card border shadow-lg px-4 pt-3 pb-3 text-center" style={{ maxWidth: 420, backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 16 }}>
                            <div className="rounded-circle bg-primary-subtle text-primary mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                <i className="fa-solid fa-stopwatch fa-lg"></i>
                            </div>
                            <h5 className="fw-bold mb-1">Save Active Therapy Progress?</h5>
                            <p className="text-secondary small mb-3">
                                You trained for <strong>{this.formatTime(elapsedSeconds)}</strong> with a current score of <strong>{currentScore} pts</strong>.
                                Your duration will be credited to today's prescription.
                            </p>
                            <div className="d-flex gap-2 justify-content-center mt-1">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light py-2 px-3 fw-semibold flex-fill"
                                    style={{ borderRadius: 10 }}
                                    onClick={this.cancelExit}
                                >
                                    Keep Playing
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success py-2 px-3 fw-semibold shadow-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                                    style={{ borderRadius: 10 }}
                                    onClick={() => this.finishSession()}
                                >
                                    <i className="fa-solid fa-check me-1"></i>
                                    <span>Save &amp; Exit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
