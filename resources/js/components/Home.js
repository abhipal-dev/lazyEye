import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Home extends React.Component {
    render() {
        const games = [
            { 
                name: 'Dichoptic Snake', 
                icon: '/images/snake-mascot.svg', 
                tag: 'Tracking & Agility', 
                desc: 'Guide the snake to collect targets split across red and cyan channels, training hand-eye coordination.' 
            },
            { 
                name: 'Block Fusion (Tetris)', 
                icon: '/images/tetris-mascot.svg', 
                tag: 'Spatial Fusion', 
                desc: 'Falling blocks appear to one eye while landed blocks appear to the other, forcing both eyes to work together.' 
            },
            { 
                name: 'Altitude Flight (Flappy Bird)', 
                icon: '/images/flappy-mascot.svg', 
                tag: 'Visual Timing', 
                desc: 'Navigate through obstacle gates that require simultaneous dual-eye recognition to avoid collisions.' 
            },
            { 
                name: '3D Table Tennis (Ping Pong)', 
                icon: '/images/pingpong-mascot.svg', 
                tag: 'Depth & Speed', 
                desc: 'Fast-paced rally game that exercises visual tracking, reaction speed, and depth perception.' 
            },
            { 
                name: 'Bubble Target Aim', 
                icon: '/images/bubbles-mascot.svg', 
                tag: 'Foveal Focus', 
                desc: 'Aim at high-contrast bubbles to train central fixation in the amblyopic eye with precision.' 
            },
            { 
                name: 'Climber Holds', 
                icon: '/images/stickyholds-mascot.svg', 
                tag: 'Hand-Eye Precision', 
                desc: 'Reach for targets on a climbing wall to exercise peripheral awareness and spatial coordination.' 
            }
        ];

        return (
            <>
                <Navbar />

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-12 col-lg-7 order-1 order-lg-0">
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-primary-subtle text-primary fw-semibold small mb-3">
                                    <i className="fa-solid fa-glasses"></i>
                                    <span>Fun Home Vision Therapy</span>
                                </div>
                                <h1 className="hero-title">
                                    Helping Every Child See the World <span className="accent-text">Clearly &amp; Brightly</span>
                                </h1>
                                <p className="hero-desc">
                                    A smart, friendly way to treat <strong>Lazy Eye (Amblyopia)</strong> at home. Wear simple Red/Cyan 3D glasses and play engaging video games for 15–20 minutes a day to train your weaker eye and help both eyes work together as a team.
                                </p>
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    <a href="/Register_view" className="btn-modern-primary py-3 px-4">
                                        <i className="fa-solid fa-play"></i> Start Therapy Free
                                    </a>
                                    <a href="/Login_view" className="btn-modern-outline py-3 px-4">
                                        <i className="fa-solid fa-right-to-bracket"></i> Patient &amp; Doctor Login
                                    </a>
                                    <a href="#how-it-works" className="btn-modern-outline py-3 px-4">
                                        <i className="fa-solid fa-circle-info"></i> How It Works
                                    </a>
                                </div>
                                <div className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-circle-check text-success"></i>
                                        <span>No Boring Eye Patches</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-circle-check text-success"></i>
                                        <span>Standard Red/Cyan Glasses</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-sub small">
                                        <i className="fa-solid fa-circle-check text-success"></i>
                                        <span>Fun for Kids &amp; Adults</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-5 order-0 order-lg-1 text-center">
                                <div className="p-3 rounded-4 shadow-sm position-relative overflow-hidden" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <img 
                                        src="/images/hero-vision-therapy.svg" 
                                        alt="Child playing vision therapy games with 3D glasses" 
                                        className="img-fluid rounded-3"
                                        style={{ maxHeight: '360px', width: '100%', objectFit: 'contain' }}
                                    />
                                    <div className="mt-3 p-3 rounded-3 text-start" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="fw-bold text-main small">
                                                <i className="fa-solid fa-heart-pulse text-danger me-1"></i> Dual-Eye Brain Training
                                            </span>
                                            <span className="badge bg-success-subtle text-success small">15–20 min / day</span>
                                        </div>
                                        <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
                                            Both eyes must work simultaneously to score points, gently waking up the lazy eye while playing games.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlights Bar */}
                <section className="py-4">
                    <div className="container">
                        <div className="row g-3">
                            <div className="col-6 col-lg-3">
                                <div className="p-3 rounded-3 h-100 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 44, height: 44 }}>
                                        <i className="fa-solid fa-gamepad fa-lg"></i>
                                    </div>
                                    <h4 className="fw-bold mb-1 text-main">10+ Fun Games</h4>
                                    <p className="text-muted small mb-0">Tetris, Snake, Flappy Bird &amp; more</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="p-3 rounded-3 h-100 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 44, height: 44 }}>
                                        <i className="fa-solid fa-stopwatch fa-lg"></i>
                                    </div>
                                    <h4 className="fw-bold mb-1 text-main">15–20 Mins</h4>
                                    <p className="text-muted small mb-0">Daily recommended play time</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="p-3 rounded-3 h-100 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="rounded-circle bg-info-subtle text-info d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 44, height: 44 }}>
                                        <i className="fa-solid fa-glasses fa-lg"></i>
                                    </div>
                                    <h4 className="fw-bold mb-1 text-main">Red/Cyan Lenses</h4>
                                    <p className="text-muted small mb-0">Standard inexpensive 3D glasses</p>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="p-3 rounded-3 h-100 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <div className="rounded-circle bg-warning-subtle text-warning d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 44, height: 44 }}>
                                        <i className="fa-solid fa-chart-line fa-lg"></i>
                                    </div>
                                    <h4 className="fw-bold mb-1 text-main">Doctor Tracking</h4>
                                    <p className="text-muted small mb-0">Optometrist review portal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section: What is Amblyopia? */}
                <section id="intro" className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Understanding Amblyopia</span>
                            <h2 className="fw-bold text-main">What is Lazy Eye &amp; How Does It Work?</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '640px' }}>
                                A clear, friendly explanation for parents, patients, and families looking for modern vision solutions.
                            </p>
                        </div>

                        <div className="row g-4 align-items-stretch">
                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 d-flex flex-column p-4">
                                    <div className="rounded-3 bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: 52, height: 52 }}>
                                        <i className="fa-solid fa-eye-low-vision fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">1. What is Lazy Eye?</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        Lazy eye (amblyopia) is a common condition where the brain and one eye are not communicating properly. Because one eye produces a slightly weaker picture, the brain begins to favor the stronger eye and ignore input from the weaker one. Over time, visual sharpness in that eye fades.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 d-flex flex-column p-4">
                                    <div className="rounded-3 bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: 52, height: 52 }}>
                                        <i className="fa-solid fa-circle-xmark fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">2. The Problem with Eye Patches</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        Traditional patching covers the good eye with an adhesive patch for hours. Children hate wearing it at school, causing frustration and tears. More importantly, when the patch is removed, the two eyes still have not learned to work together, resulting in frequent vision relapse.
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 d-flex flex-column p-4">
                                    <div className="rounded-3 bg-success-subtle text-success d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: 52, height: 52 }}>
                                        <i className="fa-solid fa-puzzle-piece fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-main">3. The Fun Game Solution</h5>
                                    <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                        Instead of hiding the strong eye, our games show separate, complementary elements to each eye through Red/Cyan glasses. For example, one eye sees the player while the other sees the score targets. Both eyes MUST work together to play, retraining the brain naturally while having fun!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Instructions Section: How To Play */}
                <section id="how-it-works" className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Step-by-Step Instructions</span>
                            <h2 className="fw-bold text-main">How to Play &amp; Strengthen Your Vision</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '600px' }}>
                                Getting started takes less than two minutes. Follow these simple steps for your daily home therapy.
                            </p>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontSize: '1.1rem' }}>
                                            1
                                        </div>
                                        <h5 className="fw-bold mb-0 text-main">Wear Red/Cyan Glasses</h5>
                                    </div>
                                    <p className="text-sub small mb-3" style={{ lineHeight: '1.7' }}>
                                        Put on standard anaglyph glasses (Red lens on the left eye, Blue/Cyan lens on the right eye). These lenses separate the game images so each eye receives its own visual challenge.
                                    </p>
                                    <div className="p-2 rounded-3 bg-body-tertiary small text-muted">
                                        <i className="fa-solid fa-glasses text-primary me-1"></i> Standard glasses available online or from your optometrist.
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontSize: '1.1rem' }}>
                                            2
                                        </div>
                                        <h5 className="fw-bold mb-0 text-main">Adjust Color Contrast</h5>
                                    </div>
                                    <p className="text-sub small mb-3" style={{ lineHeight: '1.7' }}>
                                        Inside each game, easily adjust the color brightness sliders. Set the weaker eye to high contrast and the stronger eye to slightly lower contrast. This gives the lazy eye an extra boost.
                                    </p>
                                    <div className="p-2 rounded-3 bg-body-tertiary small text-muted">
                                        <i className="fa-solid fa-sliders text-primary me-1"></i> Customized in seconds right on your screen.
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="modern-card h-100 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontSize: '1.1rem' }}>
                                            3
                                        </div>
                                        <h5 className="fw-bold mb-0 text-main">Play 15–20 Mins Daily</h5>
                                    </div>
                                    <p className="text-sub small mb-3" style={{ lineHeight: '1.7' }}>
                                        Enjoy playing Snake, Tetris, or Flappy Bird for 15 to 20 minutes a day. Your game time is recorded automatically so you and your doctor can track consistency and vision improvements.
                                    </p>
                                    <div className="p-2 rounded-3 bg-body-tertiary small text-muted">
                                        <i className="fa-solid fa-trophy text-warning me-1"></i> Fun, engaging gameplay kids look forward to every day.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Games Showcase Section */}
                <section id="games" className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Our Video Games</span>
                            <h2 className="fw-bold text-main">10 Engaging Games Designed for Vision Recovery</h2>
                            <p className="text-sub mx-auto" style={{ maxWidth: '640px' }}>
                                Every game is carefully adapted with dichoptic color separation to exercise spatial perception, speed, and eye coordination.
                            </p>
                        </div>

                        <div className="row g-4">
                            {games.map((game, idx) => (
                                <div key={idx} className="col-12 col-md-6 col-lg-4">
                                    <div className="modern-card h-100 d-flex flex-column justify-content-between p-4">
                                        <div>
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div className="p-2 rounded-3 bg-light shadow-sm d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                                    <img src={game.icon} alt={game.name} style={{ width: 34, height: 34, objectFit: 'contain' }} />
                                                </div>
                                                <span className="badge bg-primary-subtle text-primary small px-2 py-1 rounded-pill">
                                                    {game.tag}
                                                </span>
                                            </div>
                                            <h5 className="fw-bold mb-2 text-main">{game.name}</h5>
                                            <p className="text-sub small mb-3" style={{ lineHeight: '1.6' }}>{game.desc}</p>
                                        </div>
                                        <a href="/Login_view" className="btn-modern-outline w-100 justify-content-center small fw-semibold">
                                            Play in Therapy <i className="fa-solid fa-arrow-right ms-1"></i>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-5">
                            <a href="/Register_view" className="btn-modern-primary py-3 px-5 fw-bold">
                                <i className="fa-solid fa-rocket me-2"></i> Create Account to Play All Games
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Common Questions</span>
                            <h2 className="fw-bold text-main">Frequently Asked Questions</h2>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-12 col-lg-8">
                                <div className="d-flex flex-column gap-3">
                                    <div className="modern-card p-4">
                                        <h5 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-primary me-2"></i> Who can benefit from LazyEye?
                                        </h5>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            LazyEye is designed for children (ages 4 and up) and adults diagnosed with amblyopia or binocular vision suppression. Many adults who believed their lazy eye could never be improved find that active dichoptic therapy helps stimulate visual pathways.
                                        </p>
                                    </div>

                                    <div className="modern-card p-4">
                                        <h5 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-primary me-2"></i> What kind of glasses do I need?
                                        </h5>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            You only need standard Red/Cyan (anaglyph) glasses. They are inexpensive (often available online for just a few dollars) and can be worn over regular prescription glasses if needed.
                                        </p>
                                    </div>

                                    <div className="modern-card p-4">
                                        <h5 className="fw-bold text-main mb-2">
                                            <i className="fa-solid fa-circle-question text-primary me-2"></i> Can eye doctors monitor my progress?
                                        </h5>
                                        <p className="text-sub small mb-0" style={{ lineHeight: '1.7' }}>
                                            Yes! LazyEye includes a dedicated Doctor &amp; Clinic Portal. Optometrists and specialists can view session compliance, adherence records, and log clinical review notes for each patient.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-5" style={{ background: 'var(--bg-surface-secondary)' }}>
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-6">
                                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-2">Get In Touch</span>
                                <h2 className="fw-bold text-main mb-3">Have Questions About Vision Therapy?</h2>
                                <p className="text-sub mb-4" style={{ lineHeight: '1.7' }}>
                                    Whether you are a parent asking about your child’s therapy or an eye care clinic interested in using LazyEye for your patients, we are here to help.
                                </p>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, minWidth: 44 }}>
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Helpline</small>
                                            <a href="tel:+919890376644" className="fw-bold text-main">+91 9890376644</a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 modern-card p-3">
                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, minWidth: 44 }}>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Email Support</small>
                                            <a href="mailto:lazyeyegames24*7@gmail.com" className="fw-bold text-main">lazyeyegames24*7@gmail.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="modern-card p-4 shadow-sm">
                                    <h4 className="fw-bold mb-3 text-main">Send Us a Message</h4>
                                    <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been received. Our team will contact you shortly.'); }}>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Your Name</label>
                                            <input type="text" className="form-control" placeholder="e.g. Rahul Sharma" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Email or Phone Number</label>
                                            <input type="text" className="form-control" placeholder="e.g. rahul@example.com or 9876543210" required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-sub small fw-semibold">Message / Inquiry</label>
                                            <textarea className="form-control" rows="3" placeholder="Tell us about the patient's age or any questions you have..." required></textarea>
                                        </div>
                                        <button type="submit" className="btn-modern-primary w-100 py-3 justify-content-center fw-bold">
                                            <i className="fa-solid fa-paper-plane me-2"></i> Submit Inquiry
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
