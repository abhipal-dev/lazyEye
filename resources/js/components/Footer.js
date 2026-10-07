import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="site-footer pt-5 pb-4 mt-5 border-top" style={{ backgroundColor: 'var(--bg-surface)', borderTopColor: 'var(--border-color)' }}>
                <div className="container">
                    <div className="row g-4 justify-content-between">
                        <div className="col-12 col-md-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img src="/images/lazyeye-icon.svg" alt="LazyEye Logo" style={{ height: '36px', width: '36px' }} />
                                <h5 className="fw-bold mb-0">Lazy<span className="text-primary">Eye</span></h5>
                            </div>
                            <p className="text-muted small pe-lg-4" style={{ lineHeight: '1.7' }}>
                                An advanced web-based dichoptic vision therapy platform engineered for amblyopia (lazy eye) rehabilitation. Utilizing interactive binocular stimulation to rebuild neural visual pathways.
                            </p>
                            <div className="d-flex align-items-center gap-3 text-muted mt-3">
                                <span className="small"><i className="fa-solid fa-shield-halved text-primary me-1"></i> Clinical Protocol</span>
                                <span className="small"><i className="fa-solid fa-glasses text-info me-1"></i> Red/Blue Dichoptic</span>
                            </div>
                        </div>

                        <div className="col-6 col-md-3">
                            <h6 className="fw-bold mb-3 text-main"><i className="fa-solid fa-compass text-primary me-2"></i>Navigation</h6>
                            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                                <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
                                <li><a href="/#ABT" className="text-muted text-decoration-none">About Amblyopia</a></li>
                                <li><a href="/#INS" className="text-muted text-decoration-none">Therapy Instructions</a></li>
                                <li><a href="/#contact" className="text-muted text-decoration-none">Contact Clinic</a></li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-3">
                            <h6 className="fw-bold mb-3 text-main"><i className="fa-solid fa-user-doctor text-primary me-2"></i>Patient Portal</h6>
                            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                                <li><a href="/Login_view" className="text-muted text-decoration-none">Patient Login</a></li>
                                <li><a href="/Register_view" className="text-muted text-decoration-none">New Registration</a></li>
                                <li><a href="/user" className="text-muted text-decoration-none">Games Panel</a></li>
                                <li><a href="/admin" className="text-muted text-decoration-none">Doctor Admin Portal</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-top pt-4 mt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small text-muted" style={{ borderColor: 'var(--border-color)' }}>
                        <p className="mb-0">&copy; {new Date().getFullYear()} LazyEye Vision Therapy. All rights reserved.</p>
                        <p className="mb-0 text-muted"><i className="fa-solid fa-heart-pulse text-danger me-1"></i> Designed for Binocular Recovery</p>
                    </div>
                </div>
            </footer>
        );
    }
}
