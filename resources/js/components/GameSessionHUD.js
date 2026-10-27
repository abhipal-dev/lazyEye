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
            currentScore: 0
        };

        this.timer = null;
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        this.startTimer();
        window.addEventListener('message', this.handleIframeMessage);
    }

    componentWillUnmount() {
        this.stopTimer();
        window.removeEventListener('message', this.handleIframeMessage);
    }

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
                    {/* Left: Clean Game Title (Text Only) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                            color: '#ffffff', 
                            fontWeight: 700, 
                            fontSize: '0.95rem', 
                            letterSpacing: '0.5px' 
                        }}>
                            {title}
                        </span>
                        {currentScore > 0 && (
                            <span style={{
                                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                borderRadius: '6px',
                                padding: '1px 8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                fontFamily: 'monospace'
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

                    {/* Right: Exit and Save Button */}
                    <button 
                        type="button" 
                        onClick={() => this.handleExit()}
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        title="Exit and Save Therapy Session"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Exit & Save</span>
                    </button>
                </header>

                {/* Direct Full-Screen Game Canvas Frame */}
                <iframe 
                    id="session-game-iframe" 
                    src={gameRoute} 
                    allow="fullscreen" 
                    title={title}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: 'calc(100vh - 48px)',
                        border: 'none',
                        backgroundColor: '#000000',
                        display: 'block'
                    }}
                />
            </div>
        );
    }
}
