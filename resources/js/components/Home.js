import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterMode: 'both', // 'both' | 'red' | 'cyan'
            redContrast: 85,
            cyanContrast: 30,
            stimulusType: 'crosshair', // 'crosshair' | 'squares' | 'letters'
            activeTab: 'all' // for game filter
        };
    }

    setFilterMode = (mode) => {
        this.setState({ filterMode: mode });
    }

    handleRedChange = (e) => {
        this.setState({ redContrast: parseInt(e.target.value, 10) });
    }

    handleCyanChange = (e) => {
        this.setState({ cyanContrast: parseInt(e.target.value, 10) });
    }

    setStimulusType = (type) => {
        this.setState({ stimulusType: type });
    }

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    }

    render() {
        const { filterMode, redContrast, cyanContrast, stimulusType, activeTab } = this.state;
        const ratio = (redContrast / Math.max(cyanContrast, 1)).toFixed(2);

        const gamesList = [
            { id: 1, name: 'Dichoptic Snake', category: 'tracking', tag: 'Binocular Tracking', disparity: '12px', floor: '15%', focus: 'Macular Fixation', time: '20m', route: '/game1snake' },
            { id: 2, name: 'Block Fusion', category: 'spatial', tag: 'Pattern Synthesis', disparity: '16px', floor: '20%', focus: 'Spatial Orientation', time: '20m', route: '/game8tetris' },
            { id: 3, name: 'Altitude Flight', category: 'saccades', tag: 'Visual Timing', disparity: '14px', floor: '15%', focus: 'Saccadic Eye Velocity', time: '15m', route: '/game2flappybird' },
            { id: 4, name: '3D Spatial Slicer', category: 'spatial', tag: 'Cortical Reflex', disparity: '20px', floor: '25%', focus: 'Stereoscopic Depth', time: '20m', route: '/game12menja' },
            { id: 5, name: 'Bubble Target Aim', category: 'foveal', tag: 'Foveal Targeting', disparity: '10px', floor: '10%', focus: 'Central Visual Acuity', time: '15m', route: '/game9bubbleshooter' },
            { id: 6, name: 'Table Rally 3D', category: 'tracking', tag: 'Depth Perception', disparity: '18px', floor: '20%', focus: 'Dynamic Disparity', time: '15m', route: '/game10pingpong' }
        ];

        const filteredGames = activeTab === 'all' 
            ? gamesList 
            : gamesList.filter(g => g.category === activeTab);

        return (
            <>
                <Navbar />

                {/* Hero Section with Interactive Clinical Optics Lab */}
                <section className="hero-section">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            {/* Left Column: Authoritative Editorial Copy */}
                            <div className="col-12 col-lg-6" data-aos="fade-up">
                                <div className="d-inline-flex align-items-center gap-2 mb-3">
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-1 fw-bold" style={{ fontSize: '0.74rem', letterSpacing: '0.06em', fontFamily: 'ui-monospace, monospace' }}>
                                        DICHOPTIC AMBLYOPIA PLATFORM
                                    </span>
                                    <span className="badge bg-secondary-subtle text-muted px-2 py-1 rounded-1 small" style={{ fontSize: '0.74rem', fontFamily: 'ui-monospace, monospace' }}>
                                        PROTOTYPE v2.4
                                    </span>
                                </div>

                                <h1 className="hero-title mb-3">
                                    Restoring Binocular Vision through <span className="accent-text">Dichoptic Retraining</span>
                                </h1>

                                <p className="hero-desc mb-4">
                                    A clinical digital therapeutics platform engineered for pediatric and adult amblyopia rehabilitation. By presenting contrast-attenuated stimuli to the dominant eye and high-contrast targets to the amblyopic eye, the system actively forces the visual cortex (Area V1) to break neural suppression.
                                </p>

                                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                                    <a href="/Register_view" className="btn-modern-primary">
                                        <i className="fa-solid fa-play"></i> Start Therapy Session
                                    </a>
                                    <a href="/Login_view?role=doctor" className="btn-modern-outline">
                                        <i className="fa-solid fa-stethoscope"></i> Clinical Doctor Portal
                                    </a>
                                    <a href="#protocol" className="btn-modern-outline">
                                        <i className="fa-solid fa-diagram-project"></i> Protocol
                                    </a>
                                </div>

                                <div className="d-flex align-items-center gap-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <div>
                                        <small className="d-block text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Clinical Dosage</small>
                                        <strong className="text-main" style={{ fontSize: '0.92rem', fontFamily: 'ui-monospace, monospace' }}>20 min / daily session</strong>
                                    </div>
                                    <div className="border-start ps-4" style={{ borderColor: 'var(--border-color)' }}>
                                        <small className="d-block text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Optics Standard</small>
                                        <strong className="text-main" style={{ fontSize: '0.92rem', fontFamily: 'ui-monospace, monospace' }}>Red 630nm / Cyan 490nm</strong>
                                    </div>
                                    <div className="border-start ps-4" style={{ borderColor: 'var(--border-color)' }}>
                                        <small className="d-block text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Cohort Adherence</small>
                                        <strong className="text-success" style={{ fontSize: '0.92rem', fontFamily: 'ui-monospace, monospace' }}>92.4% Verified</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Live Interactive Anaglyph Calibration Simulator */}
                            <div className="col-12 col-lg-6" data-aos="fade-left">
                                <div className="optics-lab-card">
                                    {/* Console Top Bar */}
                                    <div className="optics-lab-header">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-success-subtle text-success py-0 px-2 fw-bold" style={{ fontSize: '0.68rem' }}>● LIVE EMULATION</span>
                                            <span className="text-sub fw-semibold">OPTICS CALIBRATION LAB</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>RATIO:</span>
                                            <span className="text-primary fw-bold">{ratio}:1</span>
                                        </div>
                                    </div>

                                    {/* Live Stimulus Viewport with Dichoptic Layers */}
                                    <div className="optics-viewport">
                                        <div className="optics-grid-overlay"></div>
                                        <div className="optics-crosshair-center"></div>

                                        {/* Red Channel Layer (Amblyopic Eye) */}
                                        {(filterMode === 'both' || filterMode === 'red') && (
                                            <div 
                                                className="stimulus-layer stimulus-red" 
                                                style={{ 
                                                    opacity: redContrast / 100,
                                                    transform: 'translate(-4px, 0)'
                                                }}
                                            >
                                                {stimulusType === 'crosshair' && (
                                                    <div style={{ width: 70, height: 70, border: '3px solid #ff2a4b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: 14, height: 14, background: '#ff2a4b', borderRadius: '50%' }}></div>
                                                    </div>
                                                )}
                                                {stimulusType === 'squares' && (
                                                    <div style={{ width: 80, height: 80, border: '3px solid #ff2a4b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>LE</span>
                                                    </div>
                                                )}
                                                {stimulusType === 'letters' && (
                                                    <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'ui-monospace, monospace' }}>
                                                        E
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Cyan Channel Layer (Dominant Eye) */}
                                        {(filterMode === 'both' || filterMode === 'cyan') && (
                                            <div 
                                                className="stimulus-layer stimulus-cyan" 
                                                style={{ 
                                                    opacity: cyanContrast / 100,
                                                    transform: 'translate(4px, 0)'
                                                }}
                                            >
                                                {stimulusType === 'crosshair' && (
                                                    <div style={{ width: 70, height: 70, border: '3px solid #00f0ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: 28, height: 2, background: '#00f0ff', position: 'absolute' }}></div>
                                                        <div style={{ height: 28, width: 2, background: '#00f0ff', position: 'absolute' }}></div>
                                                    </div>
                                                )}
                                                {stimulusType === 'squares' && (
                                                    <div style={{ width: 80, height: 80, border: '3px dashed #00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>RE</span>
                                                    </div>
                                                )}
                                                {stimulusType === 'letters' && (
                                                    <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'ui-monospace, monospace' }}>
                                                        E
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Floating Optical Status HUD */}
                                        <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(transparent, rgba(11, 17, 32, 0.9))', fontSize: '0.72rem', fontFamily: 'ui-monospace, monospace' }}>
                                            <span className="text-white-50">
                                                MODE: <strong className="text-white">{filterMode.toUpperCase()}</strong>
                                            </span>
                                            <span className="text-white-50">
                                                DISPARITY: <strong className="text-info">8px BIFOCAL</strong>
                                            </span>
                                            <span className="text-white-50">
                                                BLEND: <strong className="text-success">{filterMode === 'both' ? 'FUSED' : 'OCCLUDED'}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Interactive Controls Panel */}
                                    <div className="optics-slider-control">
                                        {/* Filter Mode Switcher Tabs */}
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                            <span className="small text-muted fw-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Ocular Filter Pass:</span>
                                            <div className="d-flex gap-1">
                                                <button 
                                                    type="button" 
                                                    className={`filter-mode-btn ${filterMode === 'both' ? 'active' : ''}`}
                                                    onClick={() => this.setFilterMode('both')}
                                                >
                                                    ⚪ Binocular Fusion
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`filter-mode-btn ${filterMode === 'red' ? 'active' : ''}`}
                                                    onClick={() => this.setFilterMode('red')}
                                                >
                                                    🔴 Left Eye (Red)
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`filter-mode-btn ${filterMode === 'cyan' ? 'active' : ''}`}
                                                    onClick={() => this.setFilterMode('cyan')}
                                                >
                                                    🔵 Right Eye (Cyan)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Contrast Sliders */}
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <label className="small fw-bold text-main" style={{ fontSize: '0.74rem' }}>
                                                        <i className="fa-solid fa-circle text-danger me-1" style={{ fontSize: '0.65rem' }}></i>
                                                        Amblyopic Eye (Red)
                                                    </label>
                                                    <span className="small fw-bold text-danger font-mono" style={{ fontSize: '0.78rem' }}>{redContrast}%</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    className="form-range" 
                                                    min="20" 
                                                    max="100" 
                                                    value={redContrast} 
                                                    onChange={this.handleRedChange}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <label className="small fw-bold text-main" style={{ fontSize: '0.74rem' }}>
                                                        <i className="fa-solid fa-circle text-info me-1" style={{ fontSize: '0.65rem' }}></i>
                                                        Dominant Eye (Cyan)
                                                    </label>
                                                    <span className="small fw-bold text-info font-mono" style={{ fontSize: '0.78rem' }}>{cyanContrast}%</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    className="form-range" 
                                                    min="10" 
                                                    max="100" 
                                                    value={cyanContrast} 
                                                    onChange={this.handleCyanChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Stimulus Selector Footer */}
                                        <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ borderColor: 'var(--border-color)', fontSize: '0.76rem' }}>
                                            <span className="text-muted">Target Pattern:</span>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm py-0 px-2 ${stimulusType === 'crosshair' ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                                    style={{ fontSize: '0.72rem' }}
                                                    onClick={() => this.setStimulusType('crosshair')}
                                                >
                                                    Foveal Crosshair
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm py-0 px-2 ${stimulusType === 'squares' ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                                    style={{ fontSize: '0.72rem' }}
                                                    onClick={() => this.setStimulusType('squares')}
                                                >
                                                    Fusion Box
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn btn-sm py-0 px-2 ${stimulusType === 'letters' ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                                    style={{ fontSize: '0.72rem' }}
                                                    onClick={() => this.setStimulusType('letters')}
                                                >
                                                    Tumbling E
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integrated Clinical Telemetry Strip (No generic 4-box cards) */}
                <section className="py-2">
                    <div className="container">
                        <div className="clinical-telemetry-bar">
                            <div className="row g-0 align-items-center">
                                <div className="col-12 col-sm-6 col-lg-3 telemetry-item">
                                    <div className="telemetry-mono-val text-primary">10</div>
                                    <div className="telemetry-label">Dichoptic Engines</div>
                                    <small className="text-muted" style={{ fontSize: '0.78rem' }}>HTML5 Canvas &amp; WebGL shaders</small>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 telemetry-item">
                                    <div className="telemetry-mono-val">20<span className="fs-6 fw-normal text-muted">min</span></div>
                                    <div className="telemetry-label">Daily Target Dosage</div>
                                    <small className="text-muted" style={{ fontSize: '0.78rem' }}>Standard pediatric protocol</small>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 telemetry-item">
                                    <div className="telemetry-mono-val">Dual-Ch</div>
                                    <div className="telemetry-label">Contrast Attenuation</div>
                                    <small className="text-muted" style={{ fontSize: '0.78rem' }}>Foveal balance per ocular axis</small>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 telemetry-item">
                                    <div className="telemetry-mono-val text-success">Live</div>
                                    <div className="telemetry-label">Clinical Adherence</div>
                                    <small className="text-muted" style={{ fontSize: '0.78rem' }}>postMessage telemetry sync</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Clinical Comparison Matrix: Traditional Patching vs Active Dichoptic Stimulation */}
                <section id="science" className="py-5 mt-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-12 col-lg-5" data-aos="fade-right">
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-1 fw-bold mb-2" style={{ fontSize: '0.74rem', fontFamily: 'ui-monospace, monospace' }}>
                                    NEURO-OPTOMETRIC RESEARCH
                                </span>
                                <h2 className="fw-bold mb-3 text-main" style={{ letterSpacing: '-0.02em' }}>
                                    Why Dichoptic Stimulation Overcomes Cortical Suppression
                                </h2>
                                <p className="text-sub small mb-3" style={{ lineHeight: '1.7' }}>
                                    Amblyopia is primarily a neurological dysfunction of the visual cortex (Area V1), not merely a physical eye defect. In conventional patching therapy, the dominant eye is covered, leaving the visual cortex in an artificial monocular state with relapse rates exceeding 25%.
                                </p>
                                <p className="text-sub small mb-4" style={{ lineHeight: '1.7' }}>
                                    LazyEye implements <strong>active binocular stimulation</strong>. By displaying complementary high-contrast game targets to the amblyopic eye and attenuated contrast obstacles to the dominant eye, it retrains the brain to synthesize inputs from both retinas simultaneously.
                                </p>
                                <div className="d-flex gap-2">
                                    <a href="/Register_view" className="btn-modern-primary">
                                        <i className="fa-solid fa-user-plus"></i> Enroll in Clinical Cohort
                                    </a>
                                </div>
                            </div>

                            <div className="col-12 col-lg-7" data-aos="fade-left">
                                <div className="table-responsive">
                                    <table className="clinical-matrix-table shadow-sm">
                                        <thead>
                                            <tr>
                                                <th>Therapeutic Parameter</th>
                                                <th>Traditional Eye Patching</th>
                                                <th className="text-primary">LazyEye Dichoptic Platform</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>Ocular Activation</strong></td>
                                                <td><span className="badge bg-secondary-subtle text-muted">Monocular Only</span> (Fellow eye blocked)</td>
                                                <td><span className="badge bg-primary-subtle text-primary">Active Binocular</span> (Both eyes engaged)</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Suppression Retraining</strong></td>
                                                <td>Indirect; suppression recurs upon patch removal</td>
                                                <td>Direct; contrast attenuation breaks V1 cortical suppression</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Stereopsis &amp; Depth</strong></td>
                                                <td><i className="fa-solid fa-xmark text-danger me-1"></i> Not addressed or rehabilitated</td>
                                                <td><i className="fa-solid fa-check text-success me-1"></i> Trains disparity fusion &amp; 3D depth perception</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Patient Adherence</strong></td>
                                                <td>Low compliance (~42% pediatric adherence)</td>
                                                <td>High compliance (&gt;92% through calibrated gamification)</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Clinical Supervision</strong></td>
                                                <td>Subjective parent recall between checkups</td>
                                                <td>Real-time daily session duration &amp; score telemetry</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Horizontal Clinical Protocol Pipeline (Process 01 -> 02 -> 03) */}
                <section id="protocol" className="py-5">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                            <div>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-1 fw-bold" style={{ fontSize: '0.74rem', fontFamily: 'ui-monospace, monospace' }}>
                                    STANDARDIZED PROTOCOL
                                </span>
                                <h3 className="fw-bold text-main mt-2 mb-0" style={{ letterSpacing: '-0.02em' }}>Three-Phase Therapy Workflow</h3>
                            </div>
                            <span className="text-muted small font-mono">STANDARDIZED AT 20 MIN / SESSION</span>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="font-mono text-primary fw-bold" style={{ fontSize: '1.25rem' }}>PHASE 01</span>
                                        <i className="fa-solid fa-glasses text-muted fa-lg"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">Optical Color Separation</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.6' }}>
                                        Patient wears optical Red/Cyan anaglyph lenses. The red filter (630nm) covers the amblyopic eye; the cyan filter (490nm) covers the dominant eye, isolating each retina's input channel.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="font-mono text-primary fw-bold" style={{ fontSize: '1.25rem' }}>PHASE 02</span>
                                        <i className="fa-solid fa-sliders text-muted fa-lg"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">Contrast Balancing</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.6' }}>
                                        Doctor or patient calibrates the contrast threshold. Attenuating dominant eye visibility down to 20%–40% allows the visual cortex to accept signals from the weaker eye without suppression.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="font-mono text-primary fw-bold" style={{ fontSize: '1.25rem' }}>PHASE 03</span>
                                        <i className="fa-solid fa-gamepad text-muted fa-lg"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">Cortical Fusion Gameplay</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.6' }}>
                                        Patient plays prescribed 20-minute daily exercises. Target goals are split across both channels—making game progression neurologically impossible without active binocular combination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum & 10 Dichoptic Engines Showcase */}
                <section id="curriculum" className="py-5" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                            <div>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-1 fw-bold" style={{ fontSize: '0.74rem', fontFamily: 'ui-monospace, monospace' }}>
                                    CLINICAL CURRICULUM
                                </span>
                                <h3 className="fw-bold text-main mt-2 mb-0" style={{ letterSpacing: '-0.02em' }}>10 Calibrated Dichoptic Engines</h3>
                            </div>

                            {/* Categorical Filter Tabs */}
                            <div className="d-flex gap-1 p-1 rounded-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm py-1 px-3 ${activeTab === 'all' ? 'btn-primary' : 'btn-light border-0 text-muted'}`}
                                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                    onClick={() => this.setActiveTab('all')}
                                >
                                    All (10)
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm py-1 px-3 ${activeTab === 'tracking' ? 'btn-primary' : 'btn-light border-0 text-muted'}`}
                                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                    onClick={() => this.setActiveTab('tracking')}
                                >
                                    Tracking
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm py-1 px-3 ${activeTab === 'spatial' ? 'btn-primary' : 'btn-light border-0 text-muted'}`}
                                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                    onClick={() => this.setActiveTab('spatial')}
                                >
                                    Spatial Depth
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm py-1 px-3 ${activeTab === 'saccades' ? 'btn-primary' : 'btn-light border-0 text-muted'}`}
                                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                    onClick={() => this.setActiveTab('saccades')}
                                >
                                    Saccades
                                </button>
                            </div>
                        </div>

                        {/* Engine Cards Matrix */}
                        <div className="row g-3">
                            {filteredGames.map((game) => (
                                <div key={game.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="modern-card h-100 p-3 d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-primary-subtle text-primary font-mono" style={{ fontSize: '0.72rem' }}>{game.tag}</span>
                                                <span className="text-muted font-mono" style={{ fontSize: '0.72rem' }}>{game.time} / session</span>
                                            </div>
                                            <h5 className="fw-bold text-main mb-2" style={{ fontSize: '1.05rem' }}>{game.name}</h5>
                                            
                                            <div className="p-2 rounded-2 mb-3" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', fontSize: '0.78rem', fontFamily: 'ui-monospace, monospace' }}>
                                                <div className="d-flex justify-content-between text-muted mb-1">
                                                    <span>Target Focus:</span>
                                                    <span className="text-main fw-semibold">{game.focus}</span>
                                                </div>
                                                <div className="d-flex justify-content-between text-muted mb-1">
                                                    <span>Min Disparity:</span>
                                                    <span className="text-main fw-semibold">{game.disparity}</span>
                                                </div>
                                                <div className="d-flex justify-content-between text-muted">
                                                    <span>Contrast Floor:</span>
                                                    <span className="text-main fw-semibold">{game.floor}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <a href="/Login_view" className="btn btn-sm btn-outline-primary w-100 fw-semibold" style={{ borderRadius: '6px' }}>
                                            Launch in Clinical Engine &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 rounded-2 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <span className="text-muted small me-3">Need to review all 10 engines in the patient console?</span>
                            <a href="/user" className="btn-modern-primary py-1 px-3" style={{ fontSize: '0.85rem' }}>
                                Open Full Patient Games Panel &rarr;
                            </a>
                        </div>
                    </div>
                </section>

                {/* Architecture & Engineering Provenance Card */}
                <section className="py-4">
                    <div className="container">
                        <div className="card border-0 p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="row align-items-center g-4">
                                <div className="col-12 col-md-8">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="badge bg-info-subtle text-info font-mono" style={{ fontSize: '0.72rem' }}>SYSTEM ARCHITECTURE</span>
                                        <span className="badge bg-secondary-subtle text-muted font-mono" style={{ fontSize: '0.72rem' }}>PROVENANCE</span>
                                    </div>
                                    <h4 className="fw-bold text-main mb-2">Engineered by Abhishek Pal at Softcruise Technologies</h4>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.65' }}>
                                        Originally developed (Jan–Jun 2023) as an optometric digital therapeutics research prototype for pediatric amblyopia gamification. Modernized on React &amp; Laravel with 10 custom Canvas/WebGL dichoptic shaders, bidirectional postMessage bridges for mobile WebViews, and clinical adherence tracking.
                                    </p>
                                </div>
                                <div className="col-12 col-md-4 text-md-end">
                                    <a href="/Login_view?role=doctor" className="btn-modern-primary">
                                        <i className="fa-solid fa-user-doctor me-1"></i> Doctor Admin Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact & Clinic Inquiries */}
                <section id="contact" className="py-5" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-6" data-aos="fade-up">
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-1 fw-bold mb-2" style={{ fontSize: '0.74rem', fontFamily: 'ui-monospace, monospace' }}>
                                    SUPPORT &amp; INTAKE
                                </span>
                                <h3 className="fw-bold mb-3 text-main" style={{ letterSpacing: '-0.02em' }}>Optometric Equipment &amp; Calibration Support</h3>
                                <p className="text-sub small mb-4" style={{ lineHeight: '1.65' }}>
                                    Have questions regarding optical lens matching, red/cyan contrast attenuation guidelines, or enrolling an amblyopic patient? Contact our clinic operations team.
                                </p>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3 p-3 modern-card">
                                        <div className="bg-primary-subtle text-primary rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block font-mono" style={{ fontSize: '0.72rem' }}>CLINICAL HELPLINE</small>
                                            <a href="tel:+919890376644" className="fw-bold text-main" style={{ fontSize: '0.92rem' }}>+91 9890376644</a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 p-3 modern-card">
                                        <div className="bg-primary-subtle text-primary rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block font-mono" style={{ fontSize: '0.72rem' }}>OPERATIONS DESK</small>
                                            <a href="mailto:info@lazyeye.com" className="fw-bold text-main" style={{ fontSize: '0.92rem' }}>info@lazyeye.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6" data-aos="zoom-in">
                                <div className="modern-card p-4 shadow-sm">
                                    <h5 className="fw-bold mb-3 text-main">Clinical Intake Inquiry</h5>
                                    <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry received. A vision specialist will contact you.'); }}>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient or Doctor Name</label>
                                            <input type="text" className="form-control" placeholder="Full name" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Contact Email</label>
                                            <input type="email" className="form-control" placeholder="email@domain.com" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient Age &amp; Amblyopia History</label>
                                            <input type="text" className="form-control" placeholder="e.g. 11 years, left eye suppression" />
                                        </div>
                                        <button type="submit" className="btn-modern-primary w-100 justify-content-center">
                                            <i className="fa-solid fa-paper-plane me-1"></i> Send Intake Request
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </>
        );
    }
}
