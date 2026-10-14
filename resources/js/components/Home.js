import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Home extends React.Component {
    render() {
        return (
            <>
                <Navbar />

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-12 col-lg-7 order-1 order-lg-0" data-aos="fade-up">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-3">
                                    <i className="fa-solid fa-eye me-1"></i> Digital Therapeutics Research Prototype
                                </span>
                                <h1 className="hero-title">
                                    Restoring Binocular Vision with <span className="gradient-text">Dichoptic Therapy Games</span>
                                </h1>
                                <p className="hero-desc">
                                    A specialized amblyopia rehabilitation system. Play for 15 to 20 minutes a day wearing red/cyan glasses while calibrated games train both eyes to overcome visual cortex suppression.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <a href="/Register_view" className="btn-modern-primary py-3 px-4">
                                        <i className="fa-solid fa-play me-2"></i> Start Therapy
                                    </a>
                                    <a href="/Login_view" className="btn-modern-outline py-3 px-4">
                                        <i className="fa-solid fa-user me-2"></i> Patient Login
                                    </a>
                                    <a href="#INS" className="btn-modern-outline py-3 px-4">
                                        <i className="fa-solid fa-book-open me-2"></i> How It Works
                                    </a>
                                </div>
                            </div>
                            <div className="col-12 col-lg-5 order-0 order-lg-1 text-center" data-aos="zoom-in">
                                <div className="hero-photo-wrapper">
                                    <img 
                                        src="/images/LazyEyeGirl.jpg" 
                                        alt="Child undergoing vision therapy with 3D anaglyph glasses" 
                                        className="hero-photo-img"
                                    />
                                    <div className="hero-photo-badge hero-badge-top">
                                        <i className="fa-solid fa-code-branch text-primary me-1"></i> Research Prototype
                                    </div>
                                    <div className="hero-photo-badge hero-badge-bottom">
                                        <i className="fa-solid fa-glasses text-info me-1"></i> Red/Cyan Anaglyph
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Protocol & Platform Specifications (Honest Specs Strip) */}
                <section className="py-4">
                    <div className="container">
                        <div className="stats-container">
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="stat-number">10</div>
                                <div className="stat-label">Dichoptic Engines</div>
                                <small className="text-muted">Canvas &amp; WebGL gamification</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
                                <div className="stat-number">20m</div>
                                <div className="stat-label">Daily Standard Session</div>
                                <small className="text-muted">Optometrist recommended protocol</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
                                <div className="stat-number">Dual</div>
                                <div className="stat-label">Red/Cyan Sliders</div>
                                <small className="text-muted">Independent contrast balancing</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
                                <div className="stat-number">Live</div>
                                <div className="stat-label">Adherence Logs</div>
                                <small className="text-muted">Clinical dashboard telemetry</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Instructions Section */}
                <section id="INS" className="py-5">
                    <div className="container">
                        <div className="text-center mb-5" data-aos="fade-up">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Protocol</span>
                            <h2 className="fw-bold">How Dichoptic Therapy Works</h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Dichoptic stimulation presents complementary visual stimuli to each eye simultaneously to actively break cortical suppression.
                            </p>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="100">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-glasses fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">1. Put On Red/Cyan Glasses</h5>
                                    <p className="text-sub small mb-0">
                                        Wear standard Red/Cyan anaglyph glasses. The red filter covers the amblyopic eye, and the cyan filter covers the dominant eye.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="200">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-sliders fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">2. Calibrate Contrast</h5>
                                    <p className="text-sub small mb-0">
                                        Use our in-app calibration slider to match lens filters. You will adjust contrast so the weaker eye receives higher stimulus than the dominant eye.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="300">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-trophy fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">3. Play Daily &amp; Track</h5>
                                    <p className="text-sub small mb-0">
                                        Play your prescribed 15 to 20 minute session. Essential game elements are split between eyes, requiring binocular combination to score.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About & Science Section */}
                <section id="ABT" className="py-5" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-12 col-lg-6" data-aos="fade-right">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Neuro-Optometric Principles</span>
                                <h2 className="fw-bold mb-3 text-main">Active Dichoptic Stimulation &amp; Suppression Relief</h2>
                                <p className="text-sub">
                                    Traditional patching occludes the dominant eye passively, which often causes low adherence and does not directly train binocular cooperation. In contrast, <strong>dichoptic therapy</strong> presents complementary high-contrast targets to the amblyopic eye and lower-contrast obstacles to the fellow eye.
                                </p>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="p-2 rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-eye-low-vision fa-lg"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-main">Suppression Reduction</h6>
                                            <p className="small text-sub mb-0">Encourages cortical neurons in the visual cortex (V1) to process visual input simultaneously from both eyes.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="p-2 rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-cube fa-lg"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-main">Stereopsis &amp; Depth Awareness</h6>
                                            <p className="small text-sub mb-0">Trains spatial tracking, saccadic timing, and 3D depth perception through real-time feedback loops.</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="/Register_view" className="btn-modern-primary py-3 px-4">
                                    <i className="fa-solid fa-user-plus me-2"></i> Register for Therapy
                                </a>
                            </div>
                            <div className="col-12 col-lg-6 text-center" data-aos="fade-left">
                                <div className="p-4 rounded-4 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <img 
                                        src="/images/auth-therapy-illustration.svg" 
                                        alt="Dichoptic Stimulation Architecture" 
                                        className="img-fluid"
                                        style={{ maxHeight: '360px', width: '100%', objectFit: 'contain' }}
                                    />
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-3 text-sub small">
                                        <span className="d-flex align-items-center gap-1"><i className="fa-solid fa-circle text-danger"></i> Red Channel (Amblyopic Eye)</span>
                                        <span className="d-flex align-items-center gap-1"><i className="fa-solid fa-circle text-info"></i> Cyan Channel (Dominant Eye)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Games Showcase */}
                <section className="py-5">
                    <div className="container">
                        <div className="text-center mb-5" data-aos="fade-up">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Therapeutic Curriculum</span>
                            <h2 className="fw-bold">10 Dichoptic Therapy Engines</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '650px' }}>
                                Interactive gameplay designed to stimulate saccadic eye movements, visual tracking, and binocular coordination.
                            </p>
                        </div>
                        <div className="row g-4">
                            {[
                                { name: 'Dichoptic Snake', icon: '/images/snake-mascot.svg', tag: 'Hand-Eye Tracking', desc: 'Control the snake while target food and boundaries are split across red and cyan channels.' },
                                { name: 'Altitude Flight', icon: '/images/flappy-mascot.svg', tag: 'Visual Timing', desc: 'Navigate flight obstacles requiring simultaneous dual-eye recognition to judge gaps.' },
                                { name: '3D Spatial Slicer', icon: '/images/menja-mascot.svg', tag: 'Spatial Perception', desc: 'Precision slicing that exercises rapid cortical processing and stereoscopic tracking.' },
                                { name: 'Block Fusion', icon: '/images/tetris-mascot.svg', tag: 'Spatial Orientation', desc: 'Falling blocks requiring depth perception and color filter alignment to clear rows.' },
                                { name: 'Bubble Target Aim', icon: '/images/bubbles-mascot.svg', tag: 'Foveal Fixation', desc: 'Aim at high-contrast bubbles to train amblyopic central vision and fixation.' },
                                { name: 'Table Rally 3D', icon: '/images/pingpong-mascot.svg', tag: 'Binocular Tracking', desc: 'Dynamic paddle rally with speed adjustment matching patient visual acuity.' }
                            ].map((game, i) => (
                                <div key={i} className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={i * 80}>
                                    <div className="modern-card h-100 d-flex flex-column justify-content-between p-4">
                                        <div>
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div className="p-2 rounded-3 bg-light d-flex align-items-center justify-content-center shadow-sm" style={{ width: 52, height: 52 }}>
                                                    <img src={game.icon} alt={game.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                                                </div>
                                                <span className="badge bg-primary-subtle text-primary small px-2 py-1 rounded-pill">{game.tag}</span>
                                            </div>
                                            <h5 className="fw-bold mb-2 text-main">{game.name}</h5>
                                            <p className="text-sub small mb-3">{game.desc}</p>
                                        </div>
                                        <a href="/Login_view" className="btn btn-sm btn-outline-primary rounded-pill w-100 fw-semibold">
                                            Launch in Therapy <i className="fa-solid fa-arrow-right ms-1"></i>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-5">
                            <a href="/user" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
                                <i className="fa-solid fa-gamepad me-2"></i> View All 10 Games in Patient Panel &rarr;
                            </a>
                        </div>
                    </div>
                </section>

                {/* Provenance & Engineering Context Section */}
                <section className="py-4" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="row align-items-center g-4">
                                <div className="col-12 col-md-8">
                                    <span className="badge bg-info-subtle text-info px-3 py-1 rounded-pill fw-bold mb-2">Project Provenance</span>
                                    <h4 className="fw-bold text-main mb-2">Engineered by Abhishek Pal at Softcruise Technologies</h4>
                                    <p className="text-sub small mb-0">
                                        Originally developed (Jan–Jun 2023) as a digital therapeutics research prototype for amblyopia gamification. Modernized on React &amp; Laravel with 10 custom Canvas/WebGL engines, postMessage bridges for mobile WebViews, and clinical adherence tracking.
                                    </p>
                                </div>
                                <div className="col-12 col-md-4 text-md-end">
                                    <a href="/Login_view?role=doctor" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                                        <i className="fa-solid fa-user-doctor me-2"></i> Clinical Portal Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-5">
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-6" data-aos="fade-up">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Get In Touch</span>
                                <h2 className="fw-bold mb-3">Have Questions About Vision Therapy?</h2>
                                <p className="text-sub mb-4">
                                    Contact us for questions regarding equipment setup, red/cyan glasses calibration, or session guidelines.
                                </p>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="bg-primary-subtle text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Helpline</small>
                                            <a href="tel:+919890376644" className="fw-bold text-main">+91 9890376644</a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="bg-primary-subtle text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Inquiries</small>
                                            <a href="mailto:info@lazyeye.com" className="fw-bold text-main">info@lazyeye.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6" data-aos="zoom-in">
                                <div className="modern-card p-4 shadow-lg">
                                    <h4 className="fw-bold mb-3 text-main">Consultation Request</h4>
                                    <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your therapy inquiry has been received.'); }}>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient Name</label>
                                            <input type="text" className="form-control" placeholder="Full name of patient" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Contact Email or Phone</label>
                                            <input type="text" className="form-control" placeholder="Email address or phone number" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient Age &amp; Diagnosis</label>
                                            <input type="text" className="form-control" placeholder="e.g. 10 years old, Left eye Amblyopia" />
                                        </div>
                                        <button type="submit" className="btn-modern-primary w-100 py-3 justify-content-center fw-bold">
                                            <i className="fa-solid fa-paper-plane me-2"></i> Submit Therapy Inquiry
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
