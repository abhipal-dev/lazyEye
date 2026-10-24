import React from 'react';
import { getGameIcon, getGameConfig } from '../gameConfig';

/**
 * GameSessionHUD
 * Clinical in-game heads-up display overlay for dichoptic therapy.
 * Tracks live elapsed seconds, daily prescribed remaining time, pause/resume state,
 * and records exact therapy duration upon completion or premature exit.
 */
export default class GameSessionHUD extends React.Component {
    constructor(props) {
        super(props);

        const prescribedMinutes = Number(props.prescribedMinutes || 20);
        const alreadyPlayedSeconds = Number(props.alreadyPlayedSecondsToday || 0);
        const totalPrescribedSeconds = prescribedMinutes * 60;
        const initialRemaining = Math.max(0, totalPrescribedSeconds - alreadyPlayedSeconds);

        this.state = {
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
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        this.startTimer();
        window.addEventListener('message', this.handleIframeMessage);
        
        // Request fullscreen on container if available
        const elem = this.containerRef.current;
        if (elem) {
            if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        }
    }

    componentWillUnmount() {
        this.stopTimer();
        window.removeEventListener('message', this.handleIframeMessage);
    }

    startTimer = () => {
        this.stopTimer();
        this.timer = setInterval(() => {
            if (!this.state.isPaused) {
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

    finishSession = (customScore = null) => {
        this.stopTimer();

        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        const scoreToSave = customScore !== null ? customScore : this.state.currentScore;
        const durationToSave = Math.max(1, this.state.elapsedSeconds);

        if (this.props.onSessionCompleted) {
            this.props.onSessionCompleted({
                gameName: this.props.game?.title || this.props.game?.id || 'Therapy Game',
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
        const { elapsedSeconds, remainingSeconds, totalPrescribedSeconds, alreadyPlayedSeconds, isPaused, isGoalMet, currentScore, showExitConfirm } = this.state;

        const gameConfig = getGameConfig(game?.id || game?.title) || game || {};
        const icon = getGameIcon(game?.id || game?.title);
        const title = gameConfig.title || game?.title || 'Therapy Session';
        const clinicalType = gameConfig.clinicalType || 'Dichoptic Therapy';

        // Calculate total day progress percentage
        const totalDayCompletedSeconds = alreadyPlayedSeconds + elapsedSeconds;
        const progressPercent = Math.min(100, Math.round((totalDayCompletedSeconds / totalPrescribedSeconds) * 100));

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

                        {/* Pause / Resume Button */}
                        <button 
                            type="button" 
                            className={`btn btn-sm ${isPaused ? 'btn-success' : 'btn-outline-light'} px-3 d-flex align-items-center gap-1 fw-semibold`}
                            onClick={this.togglePause}
                            title={isPaused ? "Resume Session" : "Pause Session"}
                        >
                            <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                            <span className="d-none d-sm-inline">{isPaused ? 'Resume' : 'Pause'}</span>
                        </button>

                        {/* Finish & Save Session Button */}
                        <button 
                            type="button" 
                            className="btn btn-sm btn-danger px-3 d-flex align-items-center gap-1 fw-semibold shadow-sm"
                            onClick={this.handleRequestExit}
                            title="End session and record training duration"
                        >
                            <i className="fa-solid fa-flag-checkered"></i>
                            <span>Finish &amp; Save</span>
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
                    src={game?.route || '/game1snake'} 
                    allow="fullscreen" 
                    className="session-hud-iframe"
                    title={title}
                />

                {/* Premature Exit / Finish Confirmation Modal */}
                {showExitConfirm && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100000 }}>
                        <div className="card border shadow-lg p-4 text-center" style={{ maxWidth: 440, backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 16 }}>
                            <div className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                                <i className="fa-solid fa-stopwatch fa-xl"></i>
                            </div>
                            <h5 className="fw-bold mb-1">Save Active Therapy Progress?</h5>
                            <p className="text-secondary small mb-3">
                                You trained for <strong>{this.formatTime(elapsedSeconds)}</strong> with a current score of <strong>{currentScore} pts</strong>.
                                Your duration will be credited to today's prescription.
                            </p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light px-3 py-2 fw-semibold"
                                    onClick={this.cancelExit}
                                >
                                    Keep Playing
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
                                    onClick={() => this.finishSession()}
                                >
                                    <i className="fa-solid fa-check me-1"></i> Save &amp; Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

