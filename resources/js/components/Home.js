import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewChannel: 'both', // 'both' | 'red' | 'cyan'
            leftContrast: 90,
            rightContrast: 45,
            activeGameTab: 'all' // 'all' | 'spatial' | 'tracking' | 'fixation'
        };
    }

    render() {
        const { previewChannel, leftContrast, rightContrast, activeGameTab } = this.state;

        const allGames = [
            { 
                id: 'tetris',
                name: 'Block Fusion (Tetris)', 
                category: 'spatial',
                icon: '/images/tetris-mascot.svg', 
                tag: 'Spatial Fusion', 
                desc: 'Falling blocks appear exclusively to the amblyopic eye while the base grid is presented to the fellow eye.',
                target: 'Binocular Stereopsis',
                input: 'Keyboard / Arrows'
            },
            { 
                id: 'snake',
                name: 'Dichoptic Snake', 
                category: 'tracking',
                icon: '/images/snake-mascot.svg', 
                tag: 'Pursuit Tracking', 
                desc: 'The snake body and food targets are split between red and cyan lenses, enforcing continuous interocular coordination.',
                target: 'Smooth Pursuit Tracking',
                input: 'Keyboard / Swipe'
            },
            { 
                id: 'flappy',
                name: 'Altitude Flight', 
                category: 'tracking',
                icon: '/images/flappy-mascot.svg', 
                tag: 'Visual Timing', 
                desc: 'Navigate altitude gates where clearance obstacles require simultaneous dual-eye recognition to avoid collision.',
                target: 'Saccadic Latency',
                input: 'Spacebar / Tap'
            },
            { 
                id: 'pingpong',
                name: 'Table Rally 3D', 
                category: 'tracking',
                icon: '/images/pingpong-mascot.svg', 
                tag: 'Depth Perception', 
                desc: 'Fast-paced ball trajectory tracking with dynamic disparity matching patient visual acuity thresholds.',
                target: 'Depth & Reaction',
                input: 'Mouse / Trackpad'
            },
            { 
                id: 'bubble',
                name: 'Bubble Target Aim', 
                category: 'fixation',
                icon: '/images/bubbles-mascot.svg', 
                tag: 'Foveal Fixation', 
                desc: 'High-frequency central targets isolate the amblyopic eye fovea to break deep cortical suppression.',
                target: 'Foveal Acuity',
                input: 'Mouse / Touch'
            },
            { 
                id: 'climber',
                name: 'Climber Holds', 
                category: 'spatial',
                icon: '/images/stickyholds-mascot.svg', 
                tag: 'Motor Coordination', 
                desc: 'Hand-eye coordination targets across climbing holds, exercising spatial judgment and motor response.',
                target: 'Hand-Eye Precision',
                input: 'Keyboard / Touch'
            }
        ];

        const filteredGames = activeGameTab === 'all' 
            ? allGames 
            : allGames.filter(g => g.category === activeGameTab);

        return (
            <>
                <Navbar />

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            {/* Left Column: Product Value Proposition */}
                            <div className="col-12 col-lg-6 order-1 order-lg-0">
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-2 border small mb-3 font-mono" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', fontSize: '0.78rem' }}>
                                    <i className="fa-solid fa-shield-halved"></i>
                                    <span>Digital Therapeutics &bull; Pediatric &amp; Adult Amblyopia</span>
                                </div>
                                <h1 className="hero-title">
                                    Evidence-based video games that <span className="accent-text">retrain the lazy eye</span>.
                                </h1>
                                <p className="hero-desc">
                                    LazyEye replaces traditional, uncomfortable eye patches with interactive dichoptic games. Wearing standard red/cyan glasses, patients retrain their visual cortex to overcome suppression — in 20 minutes a day from home.
                                </p>
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    <a href="/Register_view" className="btn btn-primary py-2 px-4">
                                        <i className="fa-solid fa-play"></i> Start Free Therapy
                                    </a>
                                    <a href="/Login_view?role=doctor" className="btn btn-secondary py-2 px-4">
                                        <i className="fa-solid fa-user-doctor"></i> Doctor &amp; Clinic Portal
                                    </a>
                                    <a href="#how-it-works" className="btn btn-secondary py-2 px-3">
                                        <i className="fa-solid fa-circle-question"></i> How It Works
                                    </a>
                                </div>
                                <div className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-check text-success"></i>
                                        <span>Zero Patching Frustration</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-check text-success"></i>
                                        <span>Standard Red/Cyan Glasses</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-check text-success"></i>
                                        <span>Audited Doctor Telemetry</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Authentic Clinical Patient Photography */}
                            <div className="col-12 col-lg-6 order-0 order-lg-1">
                                <div className="p-3 rounded-3 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <img 
                                        src="/images/LazyEyeGirl.jpg" 
                                        alt="Young girl undergoing dichoptic therapy with red/cyan 3D glasses" 
                                        className="img-fluid rounded-2" 
                                        style={{ width: '100%', maxHeight: '410px', objectFit: 'cover' }}
                                    />
                                    <div className="mt-3 p-3 rounded-2 text-start" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="fw-semibold text-main small">
                                                <i className="fa-solid fa-glasses me-2"></i>Dichoptic Vision Training
                                            </span>
                                            <span className="badge bg-success-subtle text-success small font-mono">15–20 min / day</span>
                                        </div>
                                        <p className="text-muted small mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
                                            Standard anaglyph glasses separate game stimuli between both eyes, actively retraining binocular cortical pathways through daily home video games.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics & Impact Strip */}
                <section className="py-3 border-top border-bottom" style={{ background: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="container">
                        <div className="row g-3 text-center">
                            <div className="col-6 col-md-3">
                                <div className="p-2">
                                    <div className="fw-bold text-main" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>10</div>
                                    <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>Dichoptic Game Engines</small>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-2">
                                    <div className="fw-bold text-main" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>20 min</div>
                                    <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>Daily Standard Dosage</small>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-2">
                                    <div className="fw-bold text-main" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>92.4%</div>
                                    <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>Patient Protocol Adherence</small>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-2">
                                    <div className="fw-bold text-main" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>Cloud</div>
                                    <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>Clinic Telemetry Sync</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Clinical Foundations: Patching vs. Dichoptic Stimulation */}
                <section id="science" className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge border font-mono small px-3 py-1 rounded-2 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>Clinical Foundations</span>
                            <h2 className="fw-bold text-main">Why Active Dichoptic Stimulation Outperforms Passive Patching</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '650px' }}>
                                Decades of clinical neuro-ophthalmology research prove that amblyopia is a binocular brain disorder, not merely an eye issue.
                            </p>
                        </div>

                        <div className="row g-4 align-items-stretch">
                            {/* Column A: Traditional Occlusion Patching */}
                            <div className="col-12 col-lg-6">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-2 font-mono">Conventional Approach</span>
                                        <h5 className="fw-bold mb-0 text-main">Monocular Occlusion (Patching)</h5>
                                    </div>
                                    <p className="text-sub small mb-4" style={{ lineHeight: '1.7' }}>
                                        For over two centuries, eye-patching has been the default recommendation. However, clinical studies report significant patient compliance barriers and high relapse rates:
                                    </p>
                                    <ul className="list-unstyled d-flex flex-column gap-3 small mb-0">
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-xmark text-danger mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">Causes Severe Pediatric Frustration</strong>
                                                <span className="text-muted">Children resist wearing an adhesive black patch for 2–6 hours daily, leading to emotional distress and poor treatment adherence.</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-xmark text-danger mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">Fails to Eliminate Cortical Suppression</strong>
                                                <span className="text-muted">Patching isolates the lazy eye passively. Because both eyes never work together, the brain immediately resumes suppressing the weaker eye once the patch is removed.</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-xmark text-danger mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">Zero Recovery of 3D Stereopsis</strong>
                                                <span className="text-muted">Monocular vision cannot train binocular disparity, leaving patients with permanent deficits in depth perception and hand-eye coordination.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Column B: LazyEye Dichoptic Therapeutics */}
                            <div className="col-12 col-lg-6">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="badge bg-success-subtle text-success px-2 py-1 rounded-2 font-mono">Modern Therapeutics</span>
                                        <h5 className="fw-bold mb-0 text-main">Active Dichoptic Coordination</h5>
                                    </div>
                                    <p className="text-sub small mb-4" style={{ lineHeight: '1.7' }}>
                                        LazyEye keeps both eyes open simultaneously. By manipulating contrast between red and cyan lenses, cortical neurons in visual area V1 are retrained to fuse images:
                                    </p>
                                    <ul className="list-unstyled d-flex flex-column gap-3 small mb-0">
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-check text-success mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">High Engagement &bull; 92%+ Adherence</strong>
                                                <span className="text-muted">Engaging video games replace passive occlusion. A 20-minute daily session fits smoothly into home routines without social stigma.</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-check text-success mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">Active Suppression Relief</strong>
                                                <span className="text-muted">The fellow eye's contrast is stepped down while the amblyopic eye receives high-contrast stimulation, forcing the brain to balance and fuse both visual streams.</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-start gap-2">
                                            <i className="fa-solid fa-check text-success mt-1"></i>
                                            <div>
                                                <strong className="text-main d-block">Rebuilds True Binocular Stereopsis</strong>
                                                <span className="text-muted">Both eyes collaborate in real time to track moving targets and score points, establishing permanent stereoscopic depth perception.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The 3-Step Protocol (How It Works) */}
                <section id="how-it-works" className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge border font-mono small px-3 py-1 rounded-2 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>Therapy Workflow</span>
                            <h2 className="fw-bold text-main">The 3-Step Treatment Protocol</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '600px' }}>
                                Simple, repeatable daily workflow designed for patient independence and verified clinical supervision.
                            </p>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-2 d-flex align-items-center justify-content-center font-mono fw-bold" style={{ width: 34, height: 34, backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontSize: '0.88rem' }}>
                                            01
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0 text-main">Optical Color Separation</h6>
                                            <span className="text-muted small">Standard Anaglyph Lenses</span>
                                        </div>
                                    </div>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        The patient wears standard Red/Cyan glasses (Red over left eye, Cyan over right eye). The physical optical filters ensure visual game elements are divided cleanly between the two eyes.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-2 d-flex align-items-center justify-content-center font-mono fw-bold" style={{ width: 34, height: 34, backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontSize: '0.88rem' }}>
                                            02
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0 text-main">Contrast Calibration</h6>
                                            <span className="text-muted small">Interocular Balancing</span>
                                        </div>
                                    </div>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        Using in-app contrast balance controls, the stronger eye's contrast is attenuated while the amblyopic eye receives maximum contrast, overcoming interocular suppression thresholds.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-2 d-flex align-items-center justify-content-center font-mono fw-bold" style={{ width: 34, height: 34, backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', fontSize: '0.88rem' }}>
                                            03
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0 text-main">20-Min Daily Session</h6>
                                            <span className="text-muted small">Cortical Neuroplasticity</span>
                                        </div>
                                    </div>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        The patient completes their prescribed 20-minute gaming session. Adherence metrics, training time, and performance logs are synchronized automatically to the doctor's review portal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10-Game Therapeutics Suite */}
                <section id="games" className="py-5">
                    <div className="container">
                        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
                            <div>
                                <span className="badge border font-mono small px-3 py-1 rounded-2 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>Therapeutics Catalog</span>
                                <h2 className="fw-bold text-main mb-1">Interactive Dichoptic Game Engines</h2>
                                <p className="text-sub small mb-0">Engineered to train specific neuro-optometric visual pathways.</p>
                            </div>

                            {/* Categorical Filter Tabs */}
                            <div className="d-flex gap-1 mt-3 mt-md-0 flex-wrap">
                                {[
                                    { id: 'all', label: 'All Engines' },
                                    { id: 'spatial', label: 'Spatial Fusion' },
                                    { id: 'tracking', label: 'Pursuit Tracking' },
                                    { id: 'fixation', label: 'Foveal Fixation' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        className={`btn btn-sm ${activeGameTab === tab.id ? 'btn-primary' : 'btn-secondary'} rounded-2 px-3 fw-semibold`}
                                        style={{ fontSize: '0.78rem' }}
                                        onClick={() => this.setState({ activeGameTab: tab.id })}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="row g-4">
                            {filteredGames.map((game) => (
                                <div key={game.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="modern-card h-100 d-flex flex-column justify-content-between p-4">
                                        <div>
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div className="p-2 rounded-2 border d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                                                    <img src={game.icon} alt={game.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                                </div>
                                                <span className="badge border font-mono small px-2 py-1 rounded-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                                                    {game.tag}
                                                </span>
                                            </div>
                                            <h5 className="fw-bold mb-2 text-main" style={{ fontSize: '1.05rem' }}>{game.name}</h5>
                                            <p className="text-sub small mb-3" style={{ lineHeight: '1.6', fontSize: '0.86rem' }}>{game.desc}</p>
                                        </div>

                                        <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                            <div className="d-flex justify-content-between small text-muted mb-3 font-mono" style={{ fontSize: '0.74rem' }}>
                                                <span>Focus: <strong className="text-main">{game.target}</strong></span>
                                                <span>{game.input}</span>
                                            </div>
                                            <a href="/Login_view" className="btn btn-secondary w-100 justify-content-center small fw-semibold py-2">
                                                Launch Module <i className="fa-solid fa-arrow-right ms-1"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Two-Sided Platform Architecture */}
                <section className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge border font-mono small px-3 py-1 rounded-2 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>Platform Ecosystem</span>
                            <h2 className="fw-bold text-main">Engineered for Patients &bull; Supervised by Optometrists</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '620px' }}>
                                A coordinated system bridging daily at-home game therapy with clinic-level adherence and progress tracking.
                            </p>
                        </div>

                        <div className="row g-4 align-items-stretch">
                            <div className="col-12 col-lg-6">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-2 p-3 d-flex align-items-center justify-content-center border" style={{ width: 44, height: 44, backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                                            <i className="fa-solid fa-gamepad fa-lg"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-main">Patient Home Portal</h5>
                                            <span className="text-muted small">Gamified Daily Therapy</span>
                                        </div>
                                    </div>
                                    <ul className="list-unstyled d-flex flex-column gap-2 small text-sub mb-4">
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Instant access to 10 calibrated dichoptic games.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Per-eye chromatic calibration slider with automatic saving.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Daily session countdown timer and streak tracking.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Visual acuity test modules to record self-assessments.</li>
                                    </ul>
                                    <a href="/Register_view" className="btn btn-primary py-2 px-3 small">
                                        Create Patient Account &rarr;
                                    </a>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-2 p-3 d-flex align-items-center justify-content-center border" style={{ width: 44, height: 44, backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                                            <i className="fa-solid fa-user-doctor fa-lg"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-main">Doctor &amp; Clinic Portal</h5>
                                            <span className="text-muted small">Optometrist Cohort Supervision</span>
                                        </div>
                                    </div>
                                    <ul className="list-unstyled d-flex flex-column gap-2 small text-sub mb-4">
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Monitor assigned patient cohorts and adherence percentages.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Weekly session volume charts and most-played module telemetry.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Log consultation records, diagnoses, and contrast prescriptions.</li>
                                        <li><i className="fa-solid fa-check text-success me-2"></i> Role-based access control for optometrists, staff, and clinic admins.</li>
                                    </ul>
                                    <a href="/Login_view?role=doctor" className="btn btn-secondary py-2 px-3 small">
                                        Access Doctor Console &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Frequently Asked Questions */}
                <section className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge border font-mono small px-3 py-1 rounded-2 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>FAQ</span>
                            <h2 className="fw-bold text-main">Clinical &amp; Technical Questions</h2>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-lg-8">
                                <div className="d-flex flex-column gap-3">
                                    <div className="modern-card p-4">
                                        <h6 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-main me-2"></i> What physical equipment is required?
                                        </h6>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            Only standard Red/Cyan anaglyph glasses and any modern desktop or laptop web browser (Chrome, Edge, Firefox, Safari). No specialized hardware is needed. Glasses can be worn directly over prescription spectacles.
                                        </p>
                                    </div>

                                    <div className="modern-card p-4">
                                        <h6 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-main me-2"></i> Can adults with amblyopia benefit from LazyEye?
                                        </h6>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            Yes. While traditional patching was historically believed to only work in early childhood, modern neuroplasticity studies demonstrate that dichoptic binocular training is effective for teenagers and adults by reactivating dormant cortical pathways in visual area V1.
                                        </p>
                                    </div>

                                    <div className="modern-card p-4">
                                        <h6 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-main me-2"></i> How often should sessions be conducted?
                                        </h6>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            The standard protocol recommends 20 minutes per day, 4 to 5 days per week. The system tracks session duration automatically to help maintain consistent adherence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conversion Call to Action Banner */}
                <section className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="modern-card p-5 text-center shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <h2 className="fw-bold text-main mb-2">Ready to Start Dichoptic Vision Therapy?</h2>
                            <p className="text-sub mx-auto mb-4" style={{ maxWidth: '580px' }}>
                                Enroll in the patient therapy program or sign in to the clinical management portal to begin supervised dichoptic recovery today.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                <a href="/Register_view" className="btn btn-primary py-2 px-4">
                                    <i className="fa-solid fa-user-plus"></i> Enroll as New Patient
                                </a>
                                <a href="/Login_view" className="btn btn-secondary py-2 px-4">
                                    <i className="fa-solid fa-right-to-bracket"></i> Patient &amp; Doctor Sign In
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </>
        );
    }
}
