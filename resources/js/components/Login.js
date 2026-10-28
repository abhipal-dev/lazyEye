import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import $ from 'jquery';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            portalType: 'patient', // 'patient' or 'doctor'
            username: '',
            password: '',
            isSubmitting: false,
            errorMessage: '',
            lockoutSeconds: 0,
            showForgotModal: false,
            forgotIdentifier: '',
            newPassword: '',
            confirmPassword: '',
            isResetting: false,
            forgotError: '',
            forgotSuccess: ''
        };
    }

    componentDidMount() {
        // Read role from URL query param if present
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (role === 'doctor' || role === 'admin') {
            this.setState({ portalType: 'doctor' });
        }
    }

    componentWillUnmount() {
        if (this.lockoutInterval) {
            clearInterval(this.lockoutInterval);
        }
    }

    startLockoutTimer = (seconds) => {
        if (this.lockoutInterval) {
            clearInterval(this.lockoutInterval);
        }
        this.setState({
            lockoutSeconds: seconds,
            errorMessage: `Too many attempts. Locked for security. Try again in ${seconds}s.`
        });

        this.lockoutInterval = setInterval(() => {
            this.setState((prev) => {
                if (prev.lockoutSeconds <= 1) {
                    clearInterval(this.lockoutInterval);
                    return { lockoutSeconds: 0, errorMessage: '' };
                }
                const nextSec = prev.lockoutSeconds - 1;
                return {
                    lockoutSeconds: nextSec,
                    errorMessage: `Too many attempts. Locked for security. Try again in ${nextSec}s.`
                };
            });
        }, 1000);
    };

    handleTabSwitch = (type) => {
        this.setState({ 
            portalType: type,
            errorMessage: '' 
        });
    }

    fillCredentials = (username, password) => {
        this.setState({
            username,
            password,
            errorMessage: ''
        });
    }

    
    handleResetPasswordSubmit = (e) => {
        e.preventDefault();
        const { forgotIdentifier, newPassword, confirmPassword } = this.state;
        if (!forgotIdentifier.trim()) {
            this.setState({ forgotError: 'Please enter your registered username or email.' });
            return;
        }
        if (newPassword.length < 4) {
            this.setState({ forgotError: 'New password must be at least 4 characters.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            this.setState({ forgotError: 'Passwords do not match. Please re-enter.' });
            return;
        }

        this.setState({ isResetting: true, forgotError: '', forgotSuccess: '' });
        const token = $('meta[name="csrf-token"]').attr('content');

        $.ajax({
            url: '/ResetPassword',
            type: 'POST',
            headers: { 'X-CSRF-TOKEN': token },
            data: {
                identifier: forgotIdentifier.trim(),
                new_password: newPassword
            },
            success: (res) => {
                this.setState({ isResetting: false });
                if (res && res.status === 200) {
                    this.setState({
                        forgotSuccess: res.message,
                        username: res.username || forgotIdentifier,
                        password: newPassword
                    });
                } else {
                    this.setState({ forgotError: (res && res.message) || 'Account not found. Please verify your username or email.' });
                }
            },
            error: (xhr) => {
                this.setState({
                    isResetting: false,
                    forgotError: xhr.responseJSON?.message || 'Unable to reset password. Please check your details.'
                });
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;

        if (!username.trim() || !password.trim()) {
            this.setState({ errorMessage: 'Please enter both username and password.' });
            return;
        }

        this.setState({ isSubmitting: true, errorMessage: '' });
        const token = $('meta[name="csrf-token"]').attr('content') || '';

        $.ajax({
            url: "/Login_req",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: { 
                username: username.trim(), 
                password: password.trim(), 
                token: token 
            },
            success: (data) => {
                this.setState({ isSubmitting: false });
                if (data && data.messages === 'success admin') {
                    window.location.href = "/admin";
                } else if (data && data.messages === 'success user') {
                    window.location.href = "/user";
                } else {
                    const msg = (data && data.messages) || 'Invalid username or password. Please try again.';
                    this.setState({ errorMessage: msg });
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Login Failed',
                            text: msg,
                            icon: 'error',
                            confirmButtonColor: '#2563eb'
                        });
                    }
                }
            },
            error: (xhr) => {
                this.setState({ isSubmitting: false });
                if (xhr.status === 429) {
                    const retrySeconds = (xhr.responseJSON && xhr.responseJSON.retry_after) || 60;
                    this.startLockoutTimer(retrySeconds);
                } else {
                    const msg = (xhr.responseJSON && (xhr.responseJSON.message || xhr.responseJSON.messages)) || 'Server connection error. Please try again.';
                    this.setState({ errorMessage: msg });
                }
            }
        });
    }

    render() {
        const { portalType, username, password, isSubmitting, errorMessage, lockoutSeconds } = this.state;
        const isDoctor = portalType === 'doctor';

        return (
            <>
                <Navbar />
                <div className="auth-wrapper py-5">
                    <div className="container">
                        <div className="row align-items-center justify-content-center g-5">
                            {/* Left Side: Illustration & Vision Therapy Benefits */}
                            <div className="col-12 col-lg-5 text-center d-none d-lg-block">
                                <div className="p-4 rounded-4 text-start shadow-sm" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                                            <i className="fa-solid fa-glasses"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-main">Dichoptic Therapeutics</h5>
                                            <span className="text-muted small">Clinical Amblyopia Platform</span>
                                        </div>
                                    </div>
                                    <p className="text-sub small mb-3" style={{ lineHeight: '1.65' }}>
                                        {isDoctor 
                                            ? 'Access the optometrist workstation to manage patient cohorts, monitor adherence rates, review therapy time logs, and submit clinical evaluations.'
                                            : 'Log in to access your prescribed 20-minute daily gaming sessions with real-time Red/Cyan contrast balance.'
                                        }
                                    </p>

                                    <div className="p-3 rounded-3 mb-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="small fw-bold text-main mb-2">Platform Capabilities:</div>
                                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small text-sub" style={{ fontSize: '0.82rem' }}>
                                            <li><i className="fa-solid fa-check text-success me-2"></i> Dual-channel chromatic separation (630nm / 490nm)</li>
                                            <li><i className="fa-solid fa-check text-success me-2"></i> 10 interactive therapeutic game engines</li>
                                            <li><i className="fa-solid fa-check text-success me-2"></i> Automated 20-min daily adherence logging</li>
                                            <li><i className="fa-solid fa-check text-success me-2"></i> Optometrist supervision &amp; consultation notes</li>
                                        </ul>
                                    </div>

                                    {/* Evaluation accounts switcher */}
                                    <div className="p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span className="small fw-bold text-main" style={{ fontSize: '0.78rem' }}>
                                                <i className="fa-solid fa-key text-warning me-1"></i> Demo Evaluation Credentials:
                                            </span>
                                            <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.7rem' }}>Click to auto-fill</span>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2" 
                                                style={{ fontSize: '0.74rem' }}
                                                onClick={() => { this.handleTabSwitch('patient'); this.fillCredentials('abhicoder', '4567'); }}
                                            >
                                                🎮 Patient: <strong>abhicoder</strong>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2" 
                                                style={{ fontSize: '0.74rem' }}
                                                onClick={() => { this.handleTabSwitch('doctor'); this.fillCredentials('dr_sarah', 'doctor123'); }}
                                            >
                                                🩺 Doctor: <strong>dr_sarah</strong>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-2" 
                                                style={{ fontSize: '0.74rem' }}
                                                onClick={() => { this.handleTabSwitch('doctor'); this.fillCredentials('admin', 'admin123'); }}
                                            >
                                                🛡️ Admin: <strong>admin</strong>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Tabbed Login Form */}
                            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div className="auth-card mx-auto shadow-lg" style={{ maxWidth: '500px' }}>
                                    {/* Portal Switcher Tabs */}
                                    <div className="d-flex p-1 rounded-pill mb-4" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                        <button
                                            type="button"
                                            className={`btn w-50 rounded-pill py-2 fw-semibold transition-all ${!isDoctor ? 'btn-primary shadow-sm text-white' : 'text-sub border-0'}`}
                                            onClick={() => this.handleTabSwitch('patient')}
                                            style={{ fontSize: '0.88rem' }}
                                        >
                                            <i className="fa-solid fa-gamepad me-1"></i> Patient Portal
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn w-50 rounded-pill py-2 fw-semibold transition-all ${isDoctor ? 'btn-primary shadow-sm text-white' : 'text-sub border-0'}`}
                                            onClick={() => this.handleTabSwitch('doctor')}
                                            style={{ fontSize: '0.88rem' }}
                                        >
                                            <i className="fa-solid fa-user-doctor me-1"></i> Doctor / Admin
                                        </button>
                                    </div>

                                    <div className="text-center mb-4">
                                        <div className={`d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 ${isDoctor ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary'}`} style={{ width: 64, height: 64 }}>
                                            <i className={`fa-solid ${isDoctor ? 'fa-user-doctor' : 'fa-glasses'} fa-xl`}></i>
                                        </div>
                                        <h2 className="fw-bold mb-1 text-main">
                                            {isDoctor ? 'Doctor & Admin Portal' : 'Patient Therapy Login'}
                                        </h2>
                                        <p className="subtitle mb-0" style={{ color: 'var(--text-sub)' }}>
                                            {isDoctor ? 'Sign in to access clinical records & analytics' : 'Sign in to launch your prescribed therapy games'}
                                        </p>
                                    </div>

                                    {lockoutSeconds > 0 ? (
                                        <div className="alert alert-warning py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-clock-rotate-left fa-lg text-warning"></i>
                                            <div>
                                                <strong>Security Lockout:</strong> Too many attempts. Try again in <strong>{lockoutSeconds}s</strong>.
                                            </div>
                                        </div>
                                    ) : errorMessage ? (
                                        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-circle-exclamation"></i>
                                            <span>{errorMessage}</span>
                                        </div>
                                    ) : null}

                                    <form onSubmit={this.handleSubmit} noValidate>
                                        <div className="modern-input-group">
                                            <div className="input-wrapper">
                                                <i className="fa-solid fa-user"></i>
                                                <input 
                                                    type="text" 
                                                    id="username" 
                                                    value={username}
                                                    onChange={(e) => this.setState({ username: e.target.value, errorMessage: '' })}
                                                    className="modern-input" 
                                                    placeholder={isDoctor ? "Doctor / Admin Username" : "Patient Username (e.g. abhicoder)"} 
                                                    required 
                                                    autoComplete="username"
                                                    disabled={lockoutSeconds > 0}
                                                />
                                            </div>
                                        </div>

                                        <div className="modern-input-group">
                                            <div className="input-wrapper">
                                                <i className="fa-solid fa-lock"></i>
                                                <input 
                                                    type="password" 
                                                    id="password" 
                                                    value={password}
                                                    onChange={(e) => this.setState({ password: e.target.value, errorMessage: '' })}
                                                    className="modern-input" 
                                                    placeholder="Password" 
                                                    required 
                                                    autoComplete="current-password"
                                                    disabled={lockoutSeconds > 0}
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn-modern-primary w-100 py-3 justify-content-center fw-bold mt-2"
                                            disabled={isSubmitting || lockoutSeconds > 0}
                                        >
                                            {lockoutSeconds > 0 ? (
                                                <><i className="fa-solid fa-lock me-2"></i> Locked ({lockoutSeconds}s)</>
                                            ) : isSubmitting ? (
                                                <><i className="fa-solid fa-spinner fa-spin me-2"></i> Signing in...</>
                                            ) : (
                                                <><i className="fa-solid fa-right-to-bracket me-2"></i> {isDoctor ? 'Access Clinical Console' : 'Launch Therapy Games'}</>
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                        {isDoctor ? (
                                            <p className="text-sub small mb-0">
                                                Practicing Optometrist? Need account access?{' '}
                                                <a href="/#contact" className="text-primary fw-bold ms-1 text-decoration-none">
                                                    Contact clinic admin
                                                </a>
                                            </p>
                                        ) : (
                                            <p className="text-sub small mb-0">
                                                New patient starting therapy?{' '}
                                                <a href="/Register_view" className="text-primary fw-bold ms-1 text-decoration-none">
                                                    Register here &rarr;
                                                </a>
                                            </p>
                                        )}
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
