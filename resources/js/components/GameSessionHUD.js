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

        const isTouch = typeof window !== 'undefined' && (
            'ontouchstart' in window || 
            (navigator && navigator.maxTouchPoints > 0) || 
            (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
        );

        this.state = {
            elapsedSeconds: 0,
            currentScore: 0,
            isRotated: false,
            showPauseModal: false,
            showTouchControls: isTouch,
            leftContrast: 65,
            rightContrast: 85,
            soundHapticsEnabled: true
        };

        this.timer = null;
        this.touchStartX = null;
        this.touchStartY = null;
        this.containerRef = React.createRef();
        this.audioCtx = null;
    }

    triggerVirtualKey = (keyCode, key) => {
        if (this.state.soundHapticsEnabled) {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(25);
            }
            this.playVirtualKeySound();
        }

        const iframe = document.getElementById('session-game-iframe');
        if (iframe && iframe.contentWindow) {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const evDown = new KeyboardEvent('keydown', {
                    key: key,
                    code: key,
                    which: keyCode,
                    keyCode: keyCode,
                    bubbles: true,
                    cancelable: true
                });
                doc.dispatchEvent(evDown);
                iframe.contentWindow.dispatchEvent(evDown);

                setTimeout(() => {
                    const evUp = new KeyboardEvent('keyup', {
                        key: key,
                        code: key,
                        which: keyCode,
                        keyCode: keyCode,
                        bubbles: true,
                        cancelable: true
                    });
                    doc.dispatchEvent(evUp);
                    iframe.contentWindow.dispatchEvent(evUp);
                }, 60);
            } catch (e) {}

            try {
                iframe.contentWindow.postMessage({ type: 'KEYDOWN', key: key, keyCode: keyCode }, '*');
            } catch (e) {}
        }
    };

    playVirtualKeySound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.audioCtx) this.audioCtx = new AudioContext();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.05);
        } catch (e) {}
    };

    handleTouchStart = (e) => {
        if (e.touches && e.touches.length > 0) {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }
    };

    handleTouchEnd = (e) => {
        if (e.changedTouches && e.changedTouches.length > 0 && this.touchStartX !== null) {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = e.changedTouches[0].clientY - this.touchStartY;
            if (Math.abs(dx) > 28 || Math.abs(dy) > 28) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) this.triggerVirtualKey(39, 'ArrowRight');
                    else this.triggerVirtualKey(37, 'ArrowLeft');
                } else {
                    if (dy > 0) this.triggerVirtualKey(40, 'ArrowDown');
                    else this.triggerVirtualKey(38, 'ArrowUp');
                }
            }
            this.touchStartX = null;
            this.touchStartY = null;
        }
    };

    adjustContrast = (eye, delta) => {
        this.setState(prev => {
            let left = prev.leftContrast;
            let right = prev.rightContrast;
            if (eye === 'left') {
                left = Math.max(10, Math.min(100, left + delta));
            } else {
                right = Math.max(10, Math.min(100, right + delta));
            }
            return { leftContrast: left, rightContrast: right };
        }, () => {
            this.postCalibrationToIframe();
        });
    };

    componentDidMount() {
        this.startTimer();
        window.addEventListener('message', this.handleIframeMessage);

        // Default to upright orientation (only rotate if user explicitly taps Rotate in Menu)
        this.setState({ isRotated: false });
        setTimeout(() => this.postCalibrationToIframe(), 300);
    }

    componentWillUnmount() {
        this.stopTimer();
        window.removeEventListener('message', this.handleIframeMessage);
    }

    postCalibrationToIframe = () => {
        const iframe = document.getElementById('session-game-iframe');
        if (!iframe || !iframe.contentWindow) return;

        let cal = this.props.userCalibration;
        if (!cal) {
            try {
                const stored = localStorage.getItem('lazyeye_lens_calibration');
                if (stored) cal = JSON.parse(stored);
            } catch (e) {}
        }
        if (!cal) cal = {};

        const leftColor = cal.leftHex || cal.leftColor || '#ef4444';
        const rightColor = cal.rightHex || cal.rightColor || '#06b6d4';
        const leftName = cal.leftEyeColor || cal.leftColorName || 'red';
        const rightName = cal.rightEyeColor || cal.rightColorName || 'cyan';

        try {
            iframe.contentWindow.postMessage({
                leftColor,
                rightColor,
                leftColorName: leftName,
                rightColorName: rightName,
                leftContrast: cal.leftContrast || 255,
                rightContrast: cal.rightContrast || 255
            }, '*');
        } catch (e) {}
    };

    handleIframeLoad = () => {
        this.postCalibrationToIframe();
    };

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

        // Synchronize chromatic calibration when child game begins
        if (event.data === 'Game Started' || event.data?.msg === 'Game Started') {
            this.postCalibrationToIframe();
        }

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

                    {/* Right: Touch Controls Toggle & Stop Game Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                            type="button" 
                            onClick={() => this.setState(prev => ({ showTouchControls: !prev.showTouchControls }))}
                            style={{
                                backgroundColor: this.state.showTouchControls ? 'rgba(37, 99, 235, 0.35)' : '#1e293b',
                                color: this.state.showTouchControls ? '#60a5fa' : '#94a3b8',
                                border: this.state.showTouchControls ? '1px solid #3b82f6' : '1px solid #334155',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease'
                            }}
                            title="Toggle On-Screen Touch Gamepad"
                        >
                            <i className="fa-solid fa-gamepad"></i>
                            <span className="d-none d-sm-inline">{this.state.showTouchControls ? 'Pad: ON' : 'Pad'}</span>
                        </button>

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
                    </div>
                </header>

                {/* Game Canvas Container with Gesture Swipe & Touch Support */}
                <div 
                    onTouchStart={this.handleTouchStart}
                    onTouchEnd={this.handleTouchEnd}
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
                        onLoad={this.handleIframeLoad}
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

                    {/* On-Screen Virtual Touch Controller Overlay for Mobile Devices */}
                    {this.state.showTouchControls && (
                        <div 
                            className="session-virtual-controls"
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '16px',
                                right: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                pointerEvents: 'none',
                                zIndex: 99999
                            }}
                        >
                            {/* Directional D-Pad (Left Corner) */}
                            <div 
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 46px)',
                                    gridTemplateRows: 'repeat(3, 46px)',
                                    gap: '6px',
                                    pointerEvents: 'auto',
                                    userSelect: 'none',
                                    touchAction: 'none'
                                }}
                            >
                                <div />
                                <button 
                                    type="button" 
                                    onPointerDown={(e) => { e.preventDefault(); this.triggerVirtualKey(38, 'ArrowUp'); }} 
                                    style={virtualBtnStyle}
                                    aria-label="Up"
                                >
                                    <i className="fa-solid fa-chevron-up"></i>
                                </button>
                                <div />

                                <button 
                                    type="button" 
                                    onPointerDown={(e) => { e.preventDefault(); this.triggerVirtualKey(37, 'ArrowLeft'); }} 
                                    style={virtualBtnStyle}
                                    aria-label="Left"
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '10px' }} />
                                <button 
                                    type="button" 
                                    onPointerDown={(e) => { e.preventDefault(); this.triggerVirtualKey(39, 'ArrowRight'); }} 
                                    style={virtualBtnStyle}
                                    aria-label="Right"
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>

                                <div />
                                <button 
                                    type="button" 
                                    onPointerDown={(e) => { e.preventDefault(); this.triggerVirtualKey(40, 'ArrowDown'); }} 
                                    style={virtualBtnStyle}
                                    aria-label="Down"
                                >
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                                <div />
                            </div>

                            {/* Action Button (Right Corner) */}
                            <div 
                                style={{
                                    pointerEvents: 'auto',
                                    userSelect: 'none',
                                    touchAction: 'none'
                                }}
                            >
                                <button 
                                    type="button" 
                                    onPointerDown={(e) => { e.preventDefault(); this.triggerVirtualKey(32, 'Space'); }} 
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(37, 99, 235, 0.65)',
                                        border: '2px solid rgba(147, 197, 253, 0.7)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.45)',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                        cursor: 'pointer',
                                        touchAction: 'none'
                                    }}
                                    aria-label="Action"
                                >
                                    <i className="fa-solid fa-circle-dot" style={{ fontSize: '1.1rem' }}></i>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '2px' }}>ACTION</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mid-Screen Pause & Clinical Tuning Modal */}
                {this.state.showPauseModal && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.82)',
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
                                maxWidth: '360px',
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '16px',
                                padding: '22px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
                                color: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#38bdf8' }}>
                                <i className="fa-solid fa-circle-pause" style={{ fontSize: '1.3rem' }}></i>
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

                            {/* In-Game Live Contrast Adjuster */}
                            <div style={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '12px',
                                textAlign: 'left'
                            }}>
                                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Live Dichoptic Contrast</span>
                                    <span style={{ color: '#10b981', fontSize: '0.7rem' }}>Real-time</span>
                                </div>

                                {/* Red Lens */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                                        <i className="fa-solid fa-eye me-1"></i> Left (Red):
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => this.adjustContrast('left', -5)}
                                            style={miniAdjBtnStyle}
                                        >
                                            -
                                        </button>
                                        <span style={{ minWidth: '36px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {this.state.leftContrast}%
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => this.adjustContrast('left', 5)}
                                            style={miniAdjBtnStyle}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Cyan Lens */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600 }}>
                                        <i className="fa-solid fa-eye me-1"></i> Right (Cyan):
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => this.adjustContrast('right', -5)}
                                            style={miniAdjBtnStyle}
                                        >
                                            -
                                        </button>
                                        <span style={{ minWidth: '36px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {this.state.rightContrast}%
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => this.adjustContrast('right', 5)}
                                            style={miniAdjBtnStyle}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
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
                                    padding: '10px 16px',
                                    fontSize: '0.82rem',
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

const virtualBtnStyle = {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    touchAction: 'none'
};

const miniAdjBtnStyle = {
    backgroundColor: '#334155',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
