import React, { useState, useEffect } from 'react';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('lazyeye-theme') || 
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (document.body) {
            document.body.setAttribute('data-theme', theme);
        }
        localStorage.setItem('lazyeye-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <button
            type="button"
            className={`theme-toggle-btn ${className}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <span className="theme-toggle-icon">
                {theme === 'dark' ? (
                    <i className="fa-solid fa-sun text-warning"></i>
                ) : (
                    <i className="fa-solid fa-moon text-primary"></i>
                )}
            </span>
            <span className="theme-toggle-label d-none d-md-inline ms-2">
                {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}

