import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Register extends React.Component {
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
                                        alt="Sign up visual" 
                                        style={{ maxHeight: '320px', width: '100%', objectFit: 'contain' }}
                                    />
                                    <div className="text-start px-3">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge bg-primary px-3 py-2 rounded-pill">New Patient Onboarding</span>
                                            <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">Free Clinical Setup</span>
                                        </div>
                                        <h4 className="fw-bold mb-2 text-main">Begin Your Recovery Journey</h4>
                                        <p className="text-sub small mb-0">
                                            Create your patient account to unlock personalized vision calibration, 12 therapeutic games, and daily compliance reports.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-9 col-lg-6">
                                <div className="auth-card mx-auto shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary-subtle mb-3">
                                            <i className="fa-solid fa-user-plus text-primary fa-2x"></i>
                                        </div>
                                        <h2>Register for Therapy</h2>
                                        <p className="subtitle">Start your amblyopia vision recovery program</p>
                                    </div>

                                    <form id="register_form" name="register_form">
                                        <div className="modern-input-group">
                                            <i className="fa-solid fa-address-card"></i>
                                            <input 
                                                type="text" 
                                                name="fullname" 
                                                id="fullname" 
                                                minLength={3} 
                                                maxLength={30} 
                                                className="modern-input" 
                                                placeholder="Full Name" 
                                                required
                                            />
                                            <span id="fullname_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Please provide your Full Name!</span>
                                        </div>

                                        <div className="modern-input-group">
                                            <i className="fa-solid fa-user"></i>
                                            <input 
                                                type="text" 
                                                name="username" 
                                                id="username" 
                                                minLength={4} 
                                                maxLength={30} 
                                                className="modern-input" 
                                                placeholder="Username" 
                                                required
                                            />
                                            <span id="username_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Please choose a username!</span>
                                        </div>

                                        <div className="modern-input-group">
                                            <i className="fa-solid fa-envelope"></i>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                id="email" 
                                                className="modern-input" 
                                                placeholder="Email Address" 
                                                required
                                            />
                                            <span id="email_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Please enter a valid email!</span>
                                        </div>

                                        <div className="row g-2">
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <i className="fa-solid fa-lock"></i>
                                                    <input 
                                                        type="password" 
                                                        name="password" 
                                                        id="password" 
                                                        className="modern-input" 
                                                        placeholder="Password" 
                                                        required
                                                    />
                                                    <span id="password_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Enter a password!</span>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <i className="fa-solid fa-key"></i>
                                                    <input 
                                                        type="password" 
                                                        name="repeat_password" 
                                                        id="repeat_password" 
                                                        className="modern-input" 
                                                        placeholder="Repeat Password" 
                                                        required
                                                    />
                                                    <span id="repeat_password_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Repeat password!</span>
                                                    <span id="mismatch_password_error" className="text-danger small mt-1 d-block" style={{ display: 'none' }}>Passwords do not match!</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold text-muted d-block mb-2">Gender</label>
                                            <div className="d-flex gap-3">
                                                <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                    <input type="radio" name="gender" value="Male" defaultChecked className="form-check-input" />
                                                    <span>Male</span>
                                                </label>
                                                <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                    <input type="radio" name="gender" value="Female" className="form-check-input" />
                                                    <span>Female</span>
                                                </label>
                                                <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                    <input type="radio" name="gender" value="Other" className="form-check-input" />
                                                    <span>Other</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-check mb-4">
                                            <input className="form-check-input" type="checkbox" id="termsCheck" required defaultChecked />
                                            <label className="form-check-label small text-muted" htmlFor="termsCheck">
                                                I agree to the <a href="#!" className="text-primary">Terms of Service</a> & Privacy Policy
                                            </label>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn-modern-primary w-100 py-3 justify-content-center registerButton"
                                        >
                                            <i className="fa-solid fa-user-check me-2"></i> Register Account
                                        </button>
                                    </form>

                                    <div className="text-center mt-4 pt-2 border-top border-secondary-subtle">
                                        <p className="text-muted small mb-0">
                                            Already registered?{' '}
                                            <a href="/Login_view" className="text-primary fw-bold ms-1">
                                                Sign in here
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
