import React from 'react';
import { getGameConfig } from '../gameConfig';

/**
 * GameSessionHUD
 * Direct, lightweight game viewer with session duration tracking.
 * Launches directly into gameplay without intrusive AI modals or countdown screens.
 */
export default class GameSessionHUD extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            elapsedSeconds: 0,
            currentScore: 0,
            isRotated: false,
            showPauseModal: false
        };

        this.timer = null;
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        this.startTimer();
        window.addEventListener('message', this.handleIframeMessage);

        // Default to upright orientation (only rotate if user explicitly taps Rotate in Menu)
        this.setState({ isRotated: false });
    }

    componentWillUnmount() {
        this.stopTimer();
        window.removeEventListener('message', this.handleIframeMessage);
    }

    togglePauseModal = () => {
        this.setState(prev => {
            const willPause = !prev.showPauseModal;
            if (willPause) {
                // Freeze the therapy timer while paused
                this.stopTimer();
            } else {
                // Resume the therapy timer when continuing
                this.startTimer();
            }

            // Post pause / resume event to the child game iframe
            setTimeout(() => {
                const iframe = document.getElementById('session-game-iframe');
                if (iframe && iframe.contentWindow) {
                    try {
                        iframe.contentWindow.postMessage({ 
                            msg: willPause ? 'Game Paused' : 'Game Resumed', 
                            paused: willPause 
                        }, '*');
                    } catch (e) {}
                }
            }, 50);

            return { showPauseModal: willPause };
        });
    };

    toggleRotate = () => {
        this.setState(prev => ({ isRotated: !prev.isRotated }), () => {
            setTimeout(() => {
                const iframe = document.getElementById('session-game-iframe');
                if (iframe && iframe.contentWindow) {
                    try {
                        iframe.contentWindow.dispatchEvent(new Event('resize'));
                    } catch (e) {}
                }
            }, 150);
        });
    };

    startTimer = () => {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.setState(prev => ({
                elapsedSeconds: prev.elapsedSeconds + 1
            }));
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

        // Listen for live score updates from game engine
        if (event.data.score !== undefined && !isNaN(event.data.score)) {
            const newScore = Number(event.data.score);
            this.setState(prev => ({
                currentScore: Math.max(prev.currentScore, newScore)
            }));
        }

        // Listen for Game Over: stop the timer immediately!
        if (event.data.msg === 'Game Over' || event.data.gameOver) {
            this.stopTimer();
            if (event.data.score !== undefined && !isNaN(event.data.score)) {
                this.setState({ currentScore: Number(event.data.score) });
            }
        }

        // Listen for Play Again / Game Restart: resume timer
        if (event.data.msg === 'Game Resumed' || event.data.resume) {
            this.startTimer();
        }

        // Listen for internal game-over or session finished
        if (event.data.msg === 'Game Ended') {
            const finalScore = Number(event.data.score !== undefined ? event.data.score : this.state.currentScore || 0);
            this.handleExit(finalScore);
        }
    };

    handleExit = (customScore = null) => {
        this.stopTimer();

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        let liveScore = Number(this.state.currentScore || 0);
        try {
            const iframe = document.getElementById('session-game-iframe');
            if (iframe && iframe.contentWindow) {
                const cw = iframe.contentWindow;
                if (typeof cw.currentSession?.getScore === 'function') {
                    liveScore = Math.max(liveScore, Number(cw.currentSession.getScore()) || 0);
                }
                if (cw.score !== undefined && !isNaN(cw.score)) {
                    liveScore = Math.max(liveScore, Number(cw.score) || 0);
                }
                if (cw.points !== undefined && !isNaN(cw.points)) {
                    liveScore = Math.max(liveScore, Number(cw.points) || 0);
                }
                const doc = iframe.contentDocument || cw.document;
                if (doc) {
                    const scoreEl = doc.getElementById('scoreVal') || doc.getElementById('score') || doc.getElementById('scoreDisplay') || doc.querySelector('.score-val');
                    if (scoreEl) {
                        const parsed = parseInt(scoreEl.innerText || scoreEl.textContent, 10);
                        if (!isNaN(parsed)) {
                            liveScore = Math.max(liveScore, parsed);
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Could not inspect iframe live score:', e);
        }

        const scoreToSave = customScore !== null && !isNaN(customScore) ? Math.max(Number(customScore), liveScore) : liveScore;
        const durationToSave = Math.max(1, this.state.elapsedSeconds);
        const { game } = this.props;
        const gameConfig = getGameConfig(game?.id || game?.title || game?.name) || game || {};
        const title = gameConfig.title || game?.title || game?.name || 'Therapy Game';

        if (this.props.onSessionCompleted) {
            this.props.onSessionCompleted({
                gameName: title,
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
        const { elapsedSeconds, currentScore } = this.state;

        const gameConfig = getGameConfig(game?.id || game?.title || game?.name) || game || {};
        const title = gameConfig.title || game?.title || game?.name || 'Game';
        const rawRoute = gameConfig.route || game?.route || '/game1snake';
        const prescribedSpeed = this.props.gameSpeed || gameConfig.speed || game?.speed || 'level-3';
        const gameRoute = rawRoute + (rawRoute.includes('?') ? '&' : '?') + 'speed=' + prescribedSpeed;

        return (
            <div 
                ref={this.containerRef}
                className="session-game-wrapper"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000000',
                    zIndex: 999999,
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
                {/* Minimalist Top Control Bar */}
                <header 
                    className="session-game-topbar"
                    style={{
                        height: '48px',
                        minHeight: '48px',
                        backgroundColor: '#0f172a',
                        borderBottom: '1px solid #1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        color: '#ffffff',
                        userSelect: 'none',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Left: Single-line Title and Score Chip (Never wraps) */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        minWidth: 0, 
                        flexShrink: 1, 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>
                        <span style={{ 
                            color: '#ffffff', 
                            fontWeight: 700, 
                            fontSize: '0.85rem', 
                            letterSpacing: '0.3px',
                            whiteSpace: 'nowrap'
                        }}>
                            {title}
                        </span>
                        {currentScore > 0 && (
                            <span style={{
                                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                borderRadius: '6px',
                                padding: '1px 6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}>
                                Score: {currentScore}
                            </span>
                        )}
                    </div>

                    {/* Center: Live Timer Pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '20px',
                        padding: '3px 12px',
                        color: '#38bdf8',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                    }}>
                        <i className="fa-regular fa-clock" style={{ fontSize: '0.8rem', color: '#f59e0b' }}></i>
                        <span>{this.formatTime(elapsedSeconds)}</span>
                    </div>

                    {/* Right: Single-Line Stop Game Button (Never wraps) */}
                    <button 
                        type="button" 
                        onClick={this.togglePauseModal}
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
                            transition: 'background-color 0.15s ease'
                        }}
                        title="Pause Game & View Options"
                    >
                        <i className="fa-solid fa-pause"></i>
                        <span>Stop Game</span>
                    </button>
                </header>

                {/* Game Canvas Container with Instant Rotation Support */}
                <div 
                    style={{
                        flex: 1,
                        width: '100%',
                        height: 'calc(100vh - 48px)',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#000000'
                    }}
                >
                    <iframe 
                        id="session-game-iframe" 
                        src={gameRoute} 
                        allow="fullscreen" 
                        title={title}
                        style={this.state.isRotated ? {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 'calc(100vh - 48px)',
                            height: '100vw',
                            transform: 'translate(-50%, -50%) rotate(90deg)',
                            transformOrigin: 'center center',
                            border: 'none',
                            backgroundColor: '#000000',
                            display: 'block'
                        } : {
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: '#000000',
                            display: 'block'
                        }}
                    />
                </div>

                {/* Elegant Mid-Screen Pause & Options Modal */}
                {this.state.showPauseModal && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.78)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            zIndex: 9999999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px'
                        }}
                    >
                        <div 
                            style={{
                                width: '100%',
                                maxWidth: '340px',
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
                                color: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#38bdf8' }}>
                                <i className="fa-solid fa-circle-pause" style={{ fontSize: '1.4rem' }}></i>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.5px' }}>GAME PAUSED</h3>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '10px',
                                fontSize: '0.85rem',
                                fontFamily: 'monospace'
                            }}>
                                <div>Time: <b style={{ color: '#f59e0b' }}>{this.formatTime(elapsedSeconds)}</b></div>
                                <div>Score: <b style={{ color: '#38bdf8' }}>{currentScore}</b></div>
                            </div>

                            {/* Option 1: Resume Game */}
                            <button
                                type="button"
                                onClick={this.togglePauseModal}
                                style={{
                                    backgroundColor: '#059669',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '11px 16px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                                }}
                            >
                                <i className="fa-solid fa-play"></i>
                                <span>Resume Game</span>
                            </button>

                            {/* Option 2: 1-Click Orientation Rotation */}
                            <button
                                type="button"
                                onClick={this.toggleRotate}
                                style={{
                                    backgroundColor: '#1e293b',
                                    color: '#38bdf8',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    padding: '11px 16px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <i className="fa-solid fa-arrows-rotate"></i>
                                <span>{this.state.isRotated ? 'Switch to Vertical View' : 'Switch to Widescreen (Rotate 90°)'}</span>
                            </button>

                            {/* Option 3: Exit & Save Session */}
                            <button
                                type="button"
                                onClick={() => this.handleExit()}
                                style={{
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '11px 16px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                                }}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span>Save & Exit Session</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
