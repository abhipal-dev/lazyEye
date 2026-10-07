import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Login extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <div className="auth-wrapper py-5">
                    <div className="container">
                        <div className="row align-items-center justify-content-center g-5">
                            <div className="col-12 col-lg-6 text-center d-none d-lg-block">
                                <div className="p-4 rounded-4" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <img 
                                        src="/images/auth-therapy-illustration.svg" 
                                        className="img-fluid mb-4" 
                                        alt="Dichoptic Vision Therapy" 
                                        style={{ maxHeight: '320px', width: '100%', objectFit: 'contain' }}
                                    />
                                    <div className="text-start px-3">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge bg-primary px-3 py-2 rounded-pill">Dichoptic System</span>
                                            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">12 Clinical Games</span>
                                        </div>
                                        <h4 className="fw-bold mb-2 text-main">Evidence-Based Amblyopia Treatment</h4>
                                        <p className="text-sub small mb-0">
                                            Dichoptic contrast balancing trains your brain to break suppression and fuse stereoscopic images seamlessly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-8 col-lg-5">
                                <div className="auth-card mx-auto shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary-subtle mb-3" style={{ width: '64px', height: '64px' }}>
                                            <i className="fa-solid fa-shield-halved text-primary fa-xl"></i>
                                        </div>
                                        <h2 className="fw-bold">Patient & Admin Login</h2>
                                        <p className="subtitle">Enter your credentials to access your therapy dashboard</p>
                                    </div>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="modern-input-group">
                                            <i className="fa-solid fa-user"></i>
                                            <input 
                                                type="text" 
                                                id="username" 
                                                className="modern-input" 
                                                placeholder="Username (e.g. abhicoder or vidhi)" 
                                                required 
                                                autoComplete="username"
                                            />
                                        </div>
                                        <div className="modern-input-group position-relative">
                                            <i className="fa-solid fa-lock"></i>
                                            <input 
                                                type="password" 
                                                id="password" 
                                                className="modern-input" 
                                                placeholder="Password (e.g. 9870 or 2001)" 
                                                required 
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            className="btn-modern-primary w-100 py-3 justify-content-center loginButton mt-2 fw-bold"
                                        >
                                            <i className="fa-solid fa-right-to-bracket me-2"></i> Log In to Dashboard
                                        </button>
                                    </form>
                                    <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                        <p className="text-sub small mb-0">
                                            New patient starting therapy?{' '}
                                            <a href="/Register_view" className="text-primary fw-bold ms-1">
                                                Register here
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}
