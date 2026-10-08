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
                                    <i className="fa-solid fa-eye me-1"></i> Medical Dichoptic Vision Therapy
                                </span>
                                <h1 className="hero-title">
                                    Restoring Binocular Vision with <span className="gradient-text">Smart Therapy Games</span>
                                </h1>
                                <p className="hero-desc">
                                    Empowering children and adults with Amblyopia (Lazy Eye). Our scientifically designed dichoptic visual exercises train both eyes to work in synchrony through engaging gameplay.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <a href="/Register_view" className="btn-modern-primary py-3 px-4">
                                        <i className="fa-solid fa-play me-2"></i> Start Therapy Free
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
                                        <i className="fa-solid fa-circle-check text-success me-1"></i> Clinically Tested
                                    </div>
                                    <div className="hero-photo-badge hero-badge-bottom">
                                        <i className="fa-solid fa-glasses text-primary me-1"></i> Red/Cyan Glasses
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-4">
                    <div className="container">
                        <div className="stats-container">
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="stat-number">100+</div>
                                <div className="stat-label">Active Patients</div>
                                <small className="text-muted">Recovering visual acuity</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
                                <div className="stat-number">12+</div>
                                <div className="stat-label">Therapy Games</div>
                                <small className="text-muted">Targeted suppression breaking</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
                                <div className="stat-number">94%</div>
                                <div className="stat-label">Compliance Rate</div>
                                <small className="text-muted">High engagement gamification</small>
                            </div>
                            <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Home Access</div>
                                <small className="text-muted">Daily progress tracking</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Instructions Section */}
                <section id="INS" className="py-5">
                    <div className="container">
                        <div className="text-center mb-5" data-aos="fade-up">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Instructions</span>
                            <h2 className="fw-bold">How Dichoptic Therapy Works</h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Dichoptic stimulation presents different visual stimuli to each eye simultaneously to eliminate brain suppression.
                            </p>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="100">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-glasses fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2">1. Put On Anaglyph Glasses</h5>
                                    <p className="text-muted small mb-0">
                                        Wear standard Red/Blue or Red/Cyan glasses. The red filter covers one eye and the blue/cyan covers the other eye.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="200">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-sliders fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2">2. Calibrate Contrast</h5>
                                    <p className="text-muted small mb-0">
                                        Use our in-app calibration slider to match lens filters. You will adjust contrast so the weaker eye receives higher stimulus.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="300">
                                <div className="modern-card h-100">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-subtle rounded-3 p-3 mb-3 text-primary" style={{ width: '56px', height: '56px' }}>
                                        <i className="fa-solid fa-trophy fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2">3. Play Daily & Track</h5>
                                    <p className="text-muted small mb-0">
                                        Play your prescribed 15-20 minute session. Elements are split between both eyes, forcing binocular fusion to score.
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
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Neuro-Optometric Science</span>
                                <h2 className="fw-bold mb-3">Why Dichoptic Therapy Works Better Than Patching</h2>
                                <p className="text-sub">
                                    Traditional eye-patching isolates the amblyopic eye passively, which often causes frustration and high relapse rates. In contrast, our <strong>dichoptic system</strong> presents complementary high-frequency targets to the lazy eye and low-contrast obstacles to the dominant eye simultaneously.
                                </p>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="p-2 rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-eye-low-vision fa-lg"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-main">Suppression Elimination</h6>
                                            <p className="small text-sub mb-0">Gradually retrains cortical neurons in visual cortex area V1 to process input from both eyes simultaneously.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="p-2 rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fa-solid fa-cube fa-lg"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-main">Stereopsis & Depth Perception</h6>
                                            <p className="small text-sub mb-0">Restores true 3D spatial awareness, coordination, and binocular fusion that patching cannot achieve.</p>
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
                                        <span className="d-flex align-items-center gap-1"><i className="fa-solid fa-circle text-danger"></i> Red Filter (Weaker Eye)</span>
                                        <span className="d-flex align-items-center gap-1"><i className="fa-solid fa-circle text-info"></i> Cyan Filter (Dominant Eye)</span>
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
                            <h2 className="fw-bold">12 Clinically Calibrated Games</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '650px' }}>
                                Interactive gameplay designed to stimulate saccadic eye movements, visual tracking, and binocular coordination.
                            </p>
                        </div>
                        <div className="row g-4">
                            {[
                                { name: 'Snake Rescue', icon: '/images/snake-mascot.svg', tag: 'Hand-Eye Tracking', desc: 'Control the snake while elements split across red and blue channels.' },
                                { name: 'Flappy Bird', icon: '/images/flappy-mascot.svg', tag: 'Visual Timing', desc: 'Fly through obstacles requiring simultaneous dual-eye recognition.' },
                                { name: 'Menja Slice', icon: '/images/menja-mascot.svg', tag: 'Spatial Perception', desc: 'Precision slicing that exercises rapid cortical processing.' },
                                { name: 'Tetris Fusion', icon: '/images/tetris-mascot.svg', tag: 'Spatial Orientation', desc: 'Falling blocks requiring depth perception and color filter alignment.' },
                                { name: 'Bubble Shooter', icon: '/images/bubbles-mascot.svg', tag: 'Foveal Fixation', desc: 'Aim at high-contrast bubbles to train amblyopic central vision.' },
                                { name: 'Ping Pong 3D', icon: '/images/pingpong-mascot.svg', tag: 'Binocular Tracking', desc: 'Classic paddle game with dynamic speed matching patient visual acuity.' }
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
                                            Play in Therapy <i className="fa-solid fa-arrow-right ms-1"></i>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-5" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-6" data-aos="fade-up">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Get In Touch</span>
                                <h2 className="fw-bold mb-3">Have Questions About Vision Therapy?</h2>
                                <p className="text-sub mb-4">
                                    Our clinical team and support staff are here to assist patients, parents, and eye care professionals with equipment setup and session guidelines.
                                </p>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="bg-primary-subtle text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Optometry Helpline</small>
                                            <a href="tel:+919890376644" className="fw-bold text-main">+91 9890376644</a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="bg-primary-subtle text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Clinical Inquiries</small>
                                            <a href="mailto:info@lazyeye.com" className="fw-bold text-main">info@lazyeye.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6" data-aos="zoom-in">
                                <div className="modern-card p-4 shadow-lg">
                                    <h4 className="fw-bold mb-3 text-main">Quick Consultation Request</h4>
                                    <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Our vision therapy specialist will contact you shortly.'); }}>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient Name</label>
                                            <input type="text" className="form-control" placeholder="Full name of patient" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Contact Email or Phone</label>
                                            <input type="text" className="form-control" placeholder="Email address or phone number" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Patient Age & Diagnosis</label>
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
