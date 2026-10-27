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
            this.setState({ currentScore: Number(event.data.score) });
        }

        // Listen for internal game-over or session finished
        if (event.data.msg === 'Game Ended') {
            const finalScore = Number(event.data.score || this.state.currentScore || 0);
            this.handleExit(finalScore);
        }
    };

    handleExit = (customScore = null) => {
        this.stopTimer();

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        const scoreToSave = customScore !== null && !isNaN(customScore) ? customScore : this.state.currentScore;
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
        const gameRoute = gameConfig.route || game?.route || '/game1snake';

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

                    {/* Right: Exit Button */}
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
                        title="Exit Game"
                    >
                        <i className="fa-solid fa-xmark"></i>
                        <span>Exit</span>
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
