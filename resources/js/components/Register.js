import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import $ from 'jquery';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                fullname: '',
                username: '',
                email: '',
                password: '',
                repeat_password: '',
                age: '12',
                gender: 'Male',
                consent: true
            },
            touched: {},
            errors: {},
            isSubmitting: false
        };
    }

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        this.setState(prevState => ({
            values: {
                ...prevState.values,
                [name]: val
            }
        }), () => {
            if (this.state.touched[name]) {
                this.validateField(name);
            }
        });
    }

    handleBlur = (e) => {
        const { name } = e.target;
        this.setState(prevState => ({
            touched: {
                ...prevState.touched,
                [name]: true
            }
        }), () => {
            this.validateField(name);
        });
    }

    validateField = (fieldName) => {
        const { values } = this.state;
        let error = '';

        switch (fieldName) {
            case 'fullname':
                if (!values.fullname.trim()) {
                    error = 'Please provide your Full Name.';
                } else if (values.fullname.trim().length < 3) {
                    error = 'Full Name must be at least 3 characters.';
                }
                break;
            case 'username':
                if (!values.username.trim()) {
                    error = 'Please choose a username.';
                } else if (values.username.trim().length < 4) {
                    error = 'Username must be at least 4 characters.';
                }
                break;
            case 'email':
                if (!values.email.trim()) {
                    error = 'Please enter a valid email address.';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
                    error = 'Please enter a valid email format.';
                }
                break;
            case 'password':
                if (!values.password) {
                    error = 'Please enter a password.';
                } else if (values.password.length < 4) {
                    error = 'Password must be at least 4 characters.';
                }
                break;
            case 'repeat_password':
                if (!values.repeat_password) {
                    error = 'Please confirm your password.';
                } else if (values.repeat_password !== values.password) {
                    error = 'Passwords do not match.';
                }
                break;
            case 'age':
                const ageNum = parseInt(values.age, 10);
                if (isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
                    error = 'Please enter a valid age (3–100).';
                }
                break;
            case 'consent':
                if (!values.consent) {
                    error = 'Consent is required to create a patient profile.';
                }
                break;
            default:
                break;
        }

        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                [fieldName]: error
            }
        }));

        return !error;
    }

    validateAll = () => {
        const fields = ['fullname', 'username', 'email', 'password', 'repeat_password', 'age', 'consent'];
        const touched = {};
        fields.forEach(f => { touched[f] = true; });
        this.setState({ touched });

        let allValid = true;
        fields.forEach(f => {
            const valid = this.validateField(f);
            if (!valid) allValid = false;
        });

        return allValid;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.validateAll()) {
            return;
        }

        this.setState({ isSubmitting: true });
        const { values } = this.state;

        const formData = new FormData();
        formData.append('fullname', values.fullname.trim());
        formData.append('username', values.username.trim());
        formData.append('email', values.email.trim());
        formData.append('password', values.password);
        formData.append('repeat_password', values.repeat_password);
        formData.append('gender', values.gender);
        formData.append('age', values.age);

        const csrfToken = $('meta[name="csrf-token"]').attr('content') || '';

        $.ajax({
            url: "/Register_req",
            type: 'post',
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': csrfToken },
            data: formData,
            success: (res) => {
                this.setState({ isSubmitting: false });
                if (res && res.status === 'failed') {
                    let msg = "";
                    for (let i in res.messages) {
                        for (let key in res.messages[i]) {
                            msg += `${res.messages[i][key]}<br>`;
                        }
                    }
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Registration Incomplete',
                            html: msg || 'Please verify your details and try again.',
                            icon: 'error'
                        });
                    } else {
                        alert('Registration error: ' + msg.replace(/<br>/g, '\n'));
                    }
                } else {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Registration Submitted!',
                            text: 'Your patient therapy account has been created. You can now log in.',
                            icon: 'success',
                            confirmButtonColor: '#2563eb'
                        }).then(() => {
                            window.location.href = '/Login_view';
                        });
                    } else {
                        alert('Registration successful! Redirecting to login...');
                        window.location.href = '/Login_view';
                    }
                }
            },
            error: () => {
                this.setState({ isSubmitting: false });
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Server Error',
                        text: 'Unable to submit registration right now. Please check your connection.',
                        icon: 'error'
                    });
                } else {
                    alert('Server error during registration.');
                }
            }
        });
    }

    render() {
        const { values, touched, errors, isSubmitting } = this.state;

        return (
            <>
                <Navbar />
                <div className="auth-wrapper py-5">
                    <div className="container">
                        <div className="row align-items-center justify-content-center g-5">
                            {/* Left Side: Clinical Onboarding Specs Card */}
                            <div className="col-12 col-lg-5 text-center d-none d-lg-block">
                                <div className="p-4 rounded-4 text-start shadow-sm" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">Patient Intake</span>
                                        <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill fw-semibold">Red/Cyan Protocol</span>
                                    </div>
                                    <h3 className="fw-bold mb-3 text-main">Amblyopia Therapy Program</h3>
                                    <p className="text-sub small mb-4" style={{ lineHeight: '1.7' }}>
                                        Create a patient record to calibrate your chromatic filter balance, unlock 10 interactive therapy engines, and log daily recovery sessions.
                                    </p>

                                    <div className="d-flex flex-column gap-3 mb-4">
                                        <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                            <div className="rounded-3 p-2 bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, minWidth: 36 }}>
                                                <i className="fa-solid fa-glasses"></i>
                                            </div>
                                            <div>
                                                <strong className="d-block text-main small">Anaglyph Glasses Required</strong>
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Standard Red/Cyan optical lenses for binocular separation.</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                            <div className="rounded-3 p-2 bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, minWidth: 36 }}>
                                                <i className="fa-solid fa-stopwatch"></i>
                                            </div>
                                            <div>
                                                <strong className="d-block text-main small">15–20 Mins / Day</strong>
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Configurable daily session targets for pediatric engagement.</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                            <div className="rounded-3 p-2 bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, minWidth: 36 }}>
                                                <i className="fa-solid fa-chart-line"></i>
                                            </div>
                                            <div>
                                                <strong className="d-block text-main small">Doctor Oversight</strong>
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Adherence and session records reviewed by clinical specialists.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-3" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <small className="d-block text-sub" style={{ fontSize: '0.78rem' }}>
                                            <i className="fa-solid fa-circle-info text-primary me-1"></i>
                                            <strong>Research Prototype Notice:</strong> LazyEye is an open-source digital therapeutics demo engineered for dichoptic vision research.
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Registration Form */}
                            <div className="col-12 col-md-9 col-lg-7">
                                <div className="auth-card mx-auto shadow-lg" style={{ maxWidth: '540px' }}>
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary-subtle mb-3" style={{ width: 64, height: 64 }}>
                                            <i className="fa-solid fa-user-plus text-primary fa-xl"></i>
                                        </div>
                                        <h2 className="fw-bold mb-1 text-main">Register for Therapy</h2>
                                        <p className="subtitle mb-0" style={{ color: 'var(--text-sub)' }}>Create your patient account to begin vision training</p>
                                    </div>

                                    <form onSubmit={this.handleSubmit} noValidate>
                                        {/* Full Name */}
                                        <div className="modern-input-group">
                                            <div className="input-wrapper">
                                                <i className="fa-solid fa-address-card"></i>
                                                <input 
                                                    type="text" 
                                                    name="fullname" 
                                                    value={values.fullname}
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleBlur}
                                                    className="modern-input" 
                                                    placeholder="Full Name (e.g. Maya Sharma)" 
                                                    autoComplete="name"
                                                    required
                                                />
                                            </div>
                                            {touched.fullname && errors.fullname && (
                                                <div className="text-danger small mt-1 ms-1">{errors.fullname}</div>
                                            )}
                                        </div>

                                        {/* Username & Email */}
                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <div className="input-wrapper">
                                                        <i className="fa-solid fa-user"></i>
                                                        <input 
                                                            type="text" 
                                                            name="username" 
                                                            value={values.username}
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleBlur}
                                                            className="modern-input" 
                                                            placeholder="Username" 
                                                            autoComplete="username"
                                                            required
                                                        />
                                                    </div>
                                                    {touched.username && errors.username && (
                                                        <div className="text-danger small mt-1 ms-1">{errors.username}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <div className="input-wrapper">
                                                        <i className="fa-solid fa-envelope"></i>
                                                        <input 
                                                            type="email" 
                                                            name="email" 
                                                            value={values.email}
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleBlur}
                                                            className="modern-input" 
                                                            placeholder="Email Address" 
                                                            autoComplete="email"
                                                            required
                                                        />
                                                    </div>
                                                    {touched.email && errors.email && (
                                                        <div className="text-danger small mt-1 ms-1">{errors.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password & Repeat Password */}
                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <div className="input-wrapper">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <input 
                                                            type="password" 
                                                            name="password" 
                                                            value={values.password}
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleBlur}
                                                            className="modern-input" 
                                                            placeholder="Password" 
                                                            autoComplete="new-password"
                                                            required
                                                        />
                                                    </div>
                                                    {touched.password && errors.password && (
                                                        <div className="text-danger small mt-1 ms-1">{errors.password}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="modern-input-group">
                                                    <div className="input-wrapper">
                                                        <i className="fa-solid fa-key"></i>
                                                        <input 
                                                            type="password" 
                                                            name="repeat_password" 
                                                            value={values.repeat_password}
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleBlur}
                                                            className="modern-input" 
                                                            placeholder="Repeat Password" 
                                                            autoComplete="new-password"
                                                            required
                                                        />
                                                    </div>
                                                    {touched.repeat_password && errors.repeat_password && (
                                                        <div className="text-danger small mt-1 ms-1">{errors.repeat_password}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Patient Age & Gender */}
                                        <div className="row g-3 mb-3">
                                            <div className="col-12 col-sm-5">
                                                <div className="modern-input-group mb-0">
                                                    <label className="form-label small fw-semibold text-sub mb-1">Patient Age</label>
                                                    <div className="input-wrapper">
                                                        <i className="fa-solid fa-cake-candles"></i>
                                                        <input 
                                                            type="number" 
                                                            name="age" 
                                                            min={3}
                                                            max={100}
                                                            value={values.age}
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleBlur}
                                                            className="modern-input" 
                                                            placeholder="Age" 
                                                            required
                                                        />
                                                    </div>
                                                    {touched.age && errors.age && (
                                                        <div className="text-danger small mt-1 ms-1">{errors.age}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-7">
                                                <label className="form-label small fw-semibold text-sub mb-1">Gender</label>
                                                <div className="d-flex align-items-center gap-3 pt-2">
                                                    {['Male', 'Female', 'Other'].map(g => (
                                                        <label key={g} className="form-check-label d-flex align-items-center gap-1 cursor-pointer small">
                                                            <input 
                                                                type="radio" 
                                                                name="gender" 
                                                                value={g} 
                                                                checked={values.gender === g}
                                                                onChange={this.handleChange}
                                                                className="form-check-input mt-0" 
                                                            />
                                                            <span className="text-sub">{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guardian / Patient Consent */}
                                        <div className="form-check mb-4 p-3 rounded-3" style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                            <input 
                                                className="form-check-input ms-0 me-2" 
                                                type="checkbox" 
                                                id="consentCheck" 
                                                name="consent"
                                                checked={values.consent}
                                                onChange={this.handleChange}
                                                onBlur={this.handleBlur}
                                                required 
                                            />
                                            <label className="form-check-label small text-sub" htmlFor="consentCheck" style={{ fontSize: '0.82rem' }}>
                                                I confirm the patient is 18+ or I am a parent/legal guardian providing consent for vision therapy gamification. I agree to the <a href="#terms" className="text-primary text-decoration-none fw-semibold">Terms of Service</a> &amp; <a href="#privacy" className="text-primary text-decoration-none fw-semibold">Privacy Policy</a>.
                                            </label>
                                            {touched.consent && errors.consent && (
                                                <div className="text-danger small mt-1">{errors.consent}</div>
                                            )}
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn-modern-primary w-100 py-3 justify-content-center fw-bold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <><i className="fa-solid fa-spinner fa-spin me-2"></i> Registering...</>
                                            ) : (
                                                <><i className="fa-solid fa-user-check me-2"></i> Register Patient Account</>
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                        <p className="text-sub small mb-0">
                                            Already registered?{' '}
                                            <a href="/Login_view" className="text-primary fw-bold ms-1 text-decoration-none">
                                                Sign in here &rarr;
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
