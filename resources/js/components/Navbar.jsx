import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-modern">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                        <img src="/images/lazyeye-icon.svg" alt="LazyEye Logo" style={{ width: '36px', height: '36px' }} />
                        <span className="brand-text fw-bold">Lazy<span className="text-primary">Eye</span></span>
                    </a>
                    
                    <div className="d-flex align-items-center gap-2 d-lg-none">
                        <ThemeToggle />
                        <button 
                            className="navbar-toggler border-0 shadow-none" 
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
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#ABT">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#INS">Instructions</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#contact">Contact</a>
                            </li>
                        </ul>
                        
                        <div className="d-flex align-items-center justify-content-center gap-2 mt-3 mt-lg-0">
                            <div className="d-none d-lg-block">
                                <ThemeToggle />
                            </div>
                            <a href="/Login_view" className="btn-modern-outline">
                                <i className="fa-solid fa-right-to-bracket me-1"></i> Login
                            </a>
                            <a href="/Register_view" className="btn-modern-primary">
                                <i className="fa-solid fa-user-plus me-1"></i> Register
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
