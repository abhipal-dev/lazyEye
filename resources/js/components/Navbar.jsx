
import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-modern">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                        <img src="/images/lazyeye-icon.svg" alt="LazyEye Logo" style={{ width: '30px', height: '30px' }} />
                        <span className="brand-text fw-bold text-main" style={{ letterSpacing: '-0.02em' }}>LazyEye</span>
                    </a>
                    
                    <div className="d-flex align-items-center gap-2 d-lg-none">
                        <ThemeToggle />
                        <button 
                            className="navbar-toggler border-0 shadow-none text-main" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarSupportedContent" 
                            aria-controls="navbarSupportedContent" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center gap-lg-1">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Overview</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#science">Clinical Science</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#how-it-works">Protocol</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#games">Game Suite</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/Login_view?role=doctor">Doctor Portal</a>
                            </li>
                        </ul>
                        
                        <div className="d-flex align-items-center justify-content-center gap-2 mt-3 mt-lg-0">
                            <div className="d-none d-lg-block">
                                <ThemeToggle />
                            </div>
                            <a href="/Login_view" className="btn btn-secondary btn-sm px-3">
                                <i className="fa-solid fa-right-to-bracket me-1"></i> Sign In
                            </a>
                            <a href="/Register_view" className="btn btn-primary btn-sm px-3">
                                <i className="fa-solid fa-user-plus me-1"></i> Register
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
