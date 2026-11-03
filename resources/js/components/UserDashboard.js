import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Table from './Table';
import UserDetailsModal from './modals/UserDetailsModal';
import ImageUploadModal from './modals/ImageUploadModal';
import Games from './Games';
import ActivityLog from './ActivityLog';
import ProgressReport from './ProgressReport';
import VisualAcuityTest from './VisualAcuityTest';
import ClinicalReport from './ClinicalReport';
import ThemeToggle from './ThemeToggle';
import GameSessionHUD from './GameSessionHUD';
import moment from 'moment';


var frameRef = React.createRef(null);
let message = {}
// Dichoptic lens calibration helpers
const padHex = (n) => (n.length < 2 ? "0" + n : n);
const buildColorHex = (color, contrastValue) => {
    const val = Math.max(0, Math.min(255, parseInt(contrastValue, 10) || 0));
    const r_hex = padHex(val.toString(16));
    const c = (color || 'red').toLowerCase();
    if (c === 'red') return "#" + r_hex + "0000";
    if (c === 'green') return "#00" + r_hex + "00";
    if (c === 'blue') return "#0000" + r_hex;
    if (c === 'cyan') return "#00" + r_hex + r_hex;
    return "#" + r_hex + "0000";
};

export default class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: "",
            id: '',
            fullname: '',
            username: '',
            data: {},
            userProfileImage: '',
            current_component: 'user',
            date_format: "DD/MM/YYYY",
            activeSession: null,
            calibration: {
                leftEyeColor: 'red',
                rightEyeColor: 'cyan',
                leftContrast: 255,
                rightContrast: 255,
                leftHex: '#ff0000',
                rightHex: '#00ffff'
            }
        }
    }
    
    handleStartSession = (game) => {
        this.setState({ activeSession: game });
    };

    getTodayCompletedSeconds = () => {
        const summary = this.state.today_games_summary;
        if (summary && typeof summary === 'object' && Object.keys(summary).length > 0) {
            return Object.values(summary).reduce((acc, curr) => acc + (Number(curr.duration_seconds) || 0), 0);
        }
        return 0;
    };

        handleResetToday = () => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Reset Today\'s Progress?',
                text: 'This will reset today\'s accumulated therapy time and score back to 0:00 for testing.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, Reset'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.executeResetToday();
                }
            });
        } else {
            if (confirm('Reset today\'s therapy time back to 0:00?')) {
                this.executeResetToday();
            }
        }
    };

    executeResetToday = () => {
        let token = $('meta[name="csrf-token"]').attr('content');
        this.setState({ today_games_summary: {} });
        $.ajax({
            url: "/resetTodayRecords",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: { id: this.state.id },
            success: () => {
                this.fetchUserData();
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Reset Complete', 'Today\'s therapy session progress has been reset to 0.', 'success');
                }
            },
            error: () => {
                this.fetchUserData();
            }
        });
    };

    handleSessionCompleted = (result) => {
        // Immediately reset active session so games can be opened repeatedly without requiring page refresh
        this.setState({ activeSession: null });

        if (!result || !result.gameName) {
            return;
        }

        const current_date_timestamp = Date.now();
        let existingRecords = {};
        try {
            const raw = this.state.data?.user_game_records;
            if (raw) existingRecords = typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch (e) {
            existingRecords = {};
        }

        const todayKey = String(current_date_timestamp);
        if (!existingRecords[todayKey]) existingRecords[todayKey] = {};
        const gameName = result.gameName || 'Therapy Game';
        const prevBest = existingRecords[todayKey][gameName] || 0;
        existingRecords[todayKey][gameName] = Math.max(prevBest, result.score || 0);
        const stringScore = JSON.stringify(existingRecords);

        // Update local today_games_summary immediately with total score and duration accumulation
        this.setState(prev => {
            const currentSummary = { ...(prev.today_games_summary || {}) };
            const prevEntry = currentSummary[gameName] || { duration_seconds: 0, total_score: 0, best_score: 0, sessions_count: 0 };
            currentSummary[gameName] = {
                duration_seconds: (prevEntry.duration_seconds || 0) + (result.durationSeconds || 0),
                total_score: (prevEntry.total_score || 0) + (result.score || 0),
                best_score: Math.max(prevEntry.best_score || 0, result.score || 0),
                sessions_count: (prevEntry.sessions_count || 0) + 1
            };
            return { today_games_summary: currentSummary };
        });

        let token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/SaveGameRecords",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: {
                id: this.state.id,
                score: existingRecords,
                string_score: stringScore,
                game_name: gameName,
                game_score: result.score || 0,
                duration: result.durationSeconds || 0
            },
            success: (data) => {
                this.fetchUserData();

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Therapy Session Logged!',
                        html: `You completed <strong>${result.elapsedFormatted || '00:01'}</strong> in <strong>${gameName}</strong>.<br><br><span class="badge bg-primary fs-6" style="padding: 6px 16px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 700;">+${result.score || 0} pts</span>`,
                        icon: 'success',
                        confirmButtonText: 'Great, Continue',
                        allowOutsideClick: true
                    }).then(() => {
                        document.querySelectorAll('.swal2-container').forEach(el => el.remove());
                        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
                    });
                }
            },
            error: () => {
                this.fetchUserData();
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Session Recorded!',
                        html: `You completed <strong>${result.elapsedFormatted || '00:01'}</strong> in <strong>${gameName}</strong>.<br><br><span class="badge bg-primary fs-6" style="padding: 6px 16px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: 700;">+${result.score || 0} pts</span>`,
                        icon: 'success',
                        confirmButtonText: 'Great, Continue',
                        allowOutsideClick: true
                    }).then(() => {
                        document.querySelectorAll('.swal2-container').forEach(el => el.remove());
                        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
                    });
                }
            }
        });
    };

    fetchUserData = () => {
        let token = $('meta[name="csrf-token"]').attr('content');
        const userId = this.props.id || this.state.id;

        $.ajax({
            url: "/fetchLoginUser",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: userId ? { id: userId } : {},
            success: (data) => {
                if (data && data.length > 0) {
                    this.setState({
                        id: data[0].id,
                        fullname: data[0].fullname,
                        username: data[0].username,
                        data: data[0],
                        data2: data,
                        today_games_summary: data[0].today_games_summary || {},
                        userProfileImage: `storage/images/${data[0].image_address}?v=${Date.now()}`,
                        calibration: {
                            leftEyeColor: data[0].left_eye_color || 'red',
                            rightEyeColor: data[0].right_eye_color || (data[0].left_eye_color === 'red' ? 'cyan' : 'blue'),
                            leftContrast: parseInt(data[0].left_eye_contrastvalue, 10) || 255,
                            rightContrast: parseInt(data[0].right_eye_contrastvalue, 10) || 255,
                            leftHex: data[0].left_eye_contrast_color || buildColorHex(data[0].left_eye_color || 'red', data[0].left_eye_contrastvalue || 255),
                            rightHex: data[0].right_eye_contrast_color || buildColorHex(data[0].right_eye_color || 'cyan', data[0].right_eye_contrastvalue || 255)
                        }
                    });
                    const leftDiv = document.querySelector('#leftColorTestDiv');
                    const rightDiv = document.querySelector('#rightColorTestDiv');
                    const leftEye = document.getElementById('leftEyeColor');
                    const rightEye = document.getElementById('rightEyeColor');
                    const leftSlider = document.querySelector('#leftColorContrastSlider');
                    const rightSlider = document.querySelector('#rightColorContrastSlider');

                    if (leftDiv) {
                        leftDiv.style.backgroundColor = data[0].left_eye_contrast_color;
                        leftDiv.innerHTML = data[0].left_eye_contrast_color;
                    }
                    if (rightDiv) {
                        rightDiv.style.backgroundColor = data[0].right_eye_contrast_color;
                        rightDiv.innerHTML = data[0].right_eye_contrast_color;
                    }
                    if (leftEye) leftEye.value = data[0].left_eye_color;
                    if (rightEye) rightEye.value = data[0].right_eye_color;
                    if (leftSlider) leftSlider.defaultValue = data[0].left_eye_contrastvalue;
                    if (rightSlider) rightSlider.defaultValue = data[0].right_eye_contrastvalue;
                }
            }
        });
    };

    handleProfileUpdated = (e) => {
        if (e && e.detail && (e.detail.image_address || e.detail.image_url)) {
            const addr = e.detail.image_address;
            const newImgPath = addr ? `storage/images/${addr}?v=${Date.now()}` : this.state.userProfileImage;
            this.setState(prevState => ({
                userProfileImage: newImgPath,
                data: {
                    ...prevState.data,
                    image_address: addr || prevState.data?.image_address
                }
            }));
        } else {
            this.fetchUserData();
        }
    };

    componentDidMount() {
        this.fetchUserData();
        window.addEventListener('lazyeye:game-completed', this.fetchUserData);
        window.addEventListener('lazyeye:profile-updated', this.handleProfileUpdated);
    }

    componentWillUnmount() {
        window.removeEventListener('lazyeye:game-completed', this.fetchUserData);
        window.removeEventListener('lazyeye:profile-updated', this.handleProfileUpdated);
    }
    pad = (n) => {
        return (n.length < 2) ? "0" + n : n;
    };

    makeColor = (color, contrastValue) => {
        return buildColorHex(color, contrastValue);
    };

    handleEyeColorChange = (eyeSide, color) => {
        this.setState(prev => {
            const cal = { ...prev.calibration };
            if (eyeSide === 'left') {
                cal.leftEyeColor = color;
                cal.leftHex = buildColorHex(color, cal.leftContrast);
            } else {
                cal.rightEyeColor = color;
                cal.rightHex = buildColorHex(color, cal.rightContrast);
            }
            return { calibration: cal };
        });
    };

    handleContrastChange = (eyeSide, value) => {
        const val = Math.max(0, Math.min(255, parseInt(value, 10) || 0));
        this.setState(prev => {
            const cal = { ...prev.calibration };
            if (eyeSide === 'left') {
                cal.leftContrast = val;
                cal.leftHex = buildColorHex(cal.leftEyeColor, val);
            } else {
                cal.rightContrast = val;
                cal.rightHex = buildColorHex(cal.rightEyeColor, val);
            }
            return { calibration: cal };
        });
    };

    applyCalibrationPreset = (preset) => {
        let leftEyeColor = 'red', rightEyeColor = 'cyan';
        if (preset === 'red-blue') {
            rightEyeColor = 'blue';
        } else if (preset === 'red-green') {
            rightEyeColor = 'green';
        }
        const leftHex = buildColorHex(leftEyeColor, 255);
        const rightHex = buildColorHex(rightEyeColor, 255);
        this.setState({
            calibration: {
                leftEyeColor,
                rightEyeColor,
                leftContrast: 255,
                rightContrast: 255,
                leftHex,
                rightHex
            }
        });
    };

    saveColorSettings = () => {
        const { calibration } = this.state;
        const speedVal = document.getElementById('userTherapySpeed')?.value || this.state.data?.game_speed || 'level-3';
        const userId = this.props.id || this.state.id || document.querySelector('section#user')?.dataset?.id;

        try {
            localStorage.setItem('lazyeye_lens_calibration', JSON.stringify({
                leftColor: calibration.leftHex,
                rightColor: calibration.rightHex,
                leftColorName: calibration.leftEyeColor,
                rightColorName: calibration.rightEyeColor,
                leftContrast: calibration.leftContrast,
                rightContrast: calibration.rightContrast
            }));
        } catch (e) {}

        const token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/saveColorSettings",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: {
                id: userId,
                left_eye_contrastvalue: calibration.leftContrast,
                right_eye_contrastvalue: calibration.rightContrast,
                left_eye_color: calibration.leftEyeColor,
                right_eye_color: calibration.rightEyeColor,
                left_eye_contrast_color: calibration.leftHex,
                right_eye_contrast_color: calibration.rightHex,
                game_speed: speedVal
            },
            success: (res) => {
                this.setState(prev => ({
                    data: {
                        ...prev.data,
                        left_eye_color: calibration.leftEyeColor,
                        right_eye_color: calibration.rightEyeColor,
                        left_eye_contrastvalue: calibration.leftContrast,
                        right_eye_contrastvalue: calibration.rightContrast,
                        left_eye_contrast_color: calibration.leftHex,
                        right_eye_contrast_color: calibration.rightHex,
                        game_speed: speedVal
                    }
                }));
            }
        });
    };
    render() {
        const isAdmin = (this.state.data && this.state.data.accounttype === 'admin') || this.props.type === 'admin';

        return (
            <>
                <p id="score_history" style={{ 'display': "none" }}>{this.state.data.user_game_records}</p>
                <span id="time" style={{ display: "none" }}>{this.state.data?.user_playing_time || 20}</span>



                <nav className="sb-topnav navbar navbar-expand dashboard-topbar">
                    {/* <!-- Navbar Brand--> */}
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/user">
                        <img src="/images/lazyeye-icon.svg" className="d-inline-block align-top" alt="Logo" style={{ maxHeight: '30px', width: '30px' }} />
                        <span className="fw-bold d-none d-sm-inline text-main" style={{ letterSpacing: '-0.02em' }}>
                            LazyEye
                            <span className="badge border font-mono small ms-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', fontSize: '0.7rem' }}>
                                {isAdmin ? 'Admin View' : 'Patient'}
                            </span>
                        </span>
                    </a>
                    {/* <!-- Sidebar Toggle--> */}
                    <button 
                        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-main" 
                        id="sidebarToggle" 
                        href="#!"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.classList.toggle('sb-sidenav-toggled');
                            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
                        }}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    
                    <div className="d-flex align-items-center ms-auto gap-2 gap-sm-3 me-1 me-sm-3 me-lg-4">
                        {isAdmin && (
                            <a href="/admin" className="btn btn-sm btn-secondary px-3 py-1 fw-semibold d-none d-sm-flex align-items-center gap-1">
                                <i className="fa-solid fa-arrow-left"></i> Admin Panel
                            </a>
                        )}
                        {!isAdmin && (() => {
                            const totalPlayedSecs = this.getTodayCompletedSeconds();
                            const totalPlayedMins = Math.floor(totalPlayedSecs / 60);
                            const prescMins = Number(this.state.data?.user_playing_time || 20);
                            const prescSecs = prescMins * 60;
                            const isAllGoalMet = totalPlayedSecs >= prescSecs;
                            const displayPlayed = isAllGoalMet 
                                ? `${prescMins}m` 
                                : (totalPlayedMins === 0 && totalPlayedSecs > 0 ? `${totalPlayedSecs}s` : `${totalPlayedMins}m`);

                            return (
                                <div className="d-none d-sm-flex align-items-center gap-2 px-3 py-1 rounded-pill border font-mono small" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)', fontSize: '0.8rem' }}>
                                    <i className="fa-solid fa-stopwatch text-primary"></i>
                                    <span>Prescription: <strong>{displayPlayed} / {prescMins}m</strong></span>
                                    {isAllGoalMet ? (
                                        <span className="badge bg-success text-white" style={{ fontSize: '0.65rem' }}>Goal Met 🎉</span>
                                    ) : (
                                        <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.65rem' }}>{Math.max(0, prescMins - totalPlayedMins)}m left</span>
                                    )}
                                </div>
                            );
                        })()}
                        <ThemeToggle />
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 px-2 py-1" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="rounded-circle text-main d-flex align-items-center justify-content-center fw-bold border position-relative overflow-hidden" style={{ width: 34, height: 34, minWidth: 34, backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', fontSize: '0.85rem' }}>
                                        <span>{(this.state.fullname ? this.state.fullname.charAt(0) : 'P').toUpperCase()}</span>
                                        {this.state.userProfileImage && !this.state.userProfileImage.includes('default') && (
                                            <img 
                                                src={encodeURI(this.state.userProfileImage.startsWith("/") ? this.state.userProfileImage : `/${this.state.userProfileImage}`)} 
                                                alt="" 
                                                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" 
                                                style={{ objectFit: 'cover' }} 
                                                onError={(e) => {
                                                    if (!e.currentTarget.dataset.retried) {
                                                        e.currentTarget.dataset.retried = '1';
                                                        e.currentTarget.src = '/images/0_default_male_profile_image.png';
                                                    } else {
                                                        e.currentTarget.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="d-none d-md-flex flex-column text-start me-1 lh-sm">
                                        <span className="fw-semibold text-main" style={{ fontSize: '0.86rem' }}>{this.state.fullname || 'Patient'}</span>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{isAdmin ? 'Admin View' : 'Patient Therapy'}</span>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                                    <li className="user-dropdown-header">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle text-main d-flex align-items-center justify-content-center fw-bold border position-relative overflow-hidden" style={{ width: 40, height: 40, minWidth: 40, backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', fontSize: '0.95rem' }}>
                                                <span>{(this.state.fullname ? this.state.fullname.charAt(0) : 'P').toUpperCase()}</span>
                                                {this.state.userProfileImage && !this.state.userProfileImage.includes('default') && (
                                                    <img 
                                                        src={encodeURI(this.state.userProfileImage.startsWith("/") ? this.state.userProfileImage : `/${this.state.userProfileImage}`)} 
                                                        alt="" 
                                                        className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" 
                                                        style={{ objectFit: 'cover' }} 
                                                        onError={(e) => {
                                                            if (!e.currentTarget.dataset.retried) {
                                                                e.currentTarget.dataset.retried = '1';
                                                                e.currentTarget.src = '/images/0_default_male_profile_image.png';
                                                            } else {
                                                                e.currentTarget.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="text-truncate">
                                                <strong className="d-block text-main text-truncate" style={{ fontSize: '0.92rem' }}>{this.state.fullname || 'Patient'}</strong>
                                                <span className="small text-muted d-block text-truncate font-mono">@{this.state.username}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                                            <span className="badge bg-primary-subtle text-primary small">
                                                <i className="fa-solid fa-gamepad me-1"></i> Patient Portal
                                            </span>
                                            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>#{this.state.id}</span>
                                        </div>
                                    </li>
                                    {isAdmin && (
                                        <>
                                            <li>
                                                <a className="dropdown-item text-primary fw-bold" href="/admin">
                                                    <i className="fa-solid fa-arrow-left me-2"></i>Return to Admin Panel
                                                </a>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                        </>
                                    )}
                                    <li>
                                        <a className="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
                                            <i className="fa-solid fa-id-card text-info me-2"></i>My Therapy Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#colorSettingModal">
                                            <i className="fa-solid fa-sliders text-warning me-2"></i>Calibrate Anaglyph Glasses
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a className="dropdown-item dropdown-item-danger logoutButton cursor-pointer">
                                            <i className="fa-solid fa-right-from-bracket me-2"></i>Sign Out
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        <nav className="sb-sidenav accordion" id="sidenavAccordion">
                            <div className="sb-sidenav-menu">
                                <div className="nav">
                                    {isAdmin && (
                                        <div className="px-3 py-2">
                                            <a href="/admin" className="btn btn-sm btn-primary w-100 rounded-pill fw-bold py-1 px-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.82rem' }}>
                                                <i className="fa-solid fa-arrow-left"></i> Exit to Admin Panel
                                            </a>
                                        </div>
                                    )}
                                    <div className="sb-sidenav-menu-heading">Therapy Training</div>
                                    <a 
                                        className={`nav-link ${this.state.current_component === 'user' ? 'active' : ''}`}
                                        onClick={() => this.setState({ current_component: 'user' })}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-gamepad"></i></div>
                                        Therapy Games
                                    </a>
                                    <a 
                                        className={`nav-link ${this.state.current_component === 'acuitytest' ? 'active' : ''}`}
                                        onClick={() => this.setState({ current_component: 'acuitytest' })}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-eye text-primary"></i></div>
                                        Visual Acuity Test
                                    </a>
                                    <a 
                                        className="nav-link" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#colorSettingModal"
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-glasses"></i></div>
                                        Glasses Calibration
                                    </a>

                                    <div className="sb-sidenav-menu-heading">Clinical Reports</div>
                                    <a 
                                        className={`nav-link ${this.state.current_component === 'clinicalreport' ? 'active' : ''}`}
                                        onClick={() => this.setState({ current_component: 'clinicalreport' })}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-file-medical text-info"></i></div>
                                        Clinical Summary & PDF
                                    </a>
                                    <a 
                                        className={`nav-link ${this.state.current_component === 'activitylog' ? 'active' : ''}`}
                                        onClick={() => this.setState({ current_component: 'activitylog' })}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-calendar-check"></i></div>
                                        Activity Heatmap
                                    </a>
                                    <a 
                                        className={`nav-link ${this.state.current_component === 'progressreport' ? 'active' : ''}`}
                                        onClick={() => this.setState({ current_component: 'progressreport' })}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-chart-line"></i></div>
                                        Progress Metrics
                                    </a>

                                    <div className="sb-sidenav-menu-heading">Account & Profile</div>
                                    <a 
                                        className="nav-link" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#userDetailsModal"
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-id-card"></i></div>
                                        Patient Details
                                    </a>
                                    <a 
                                        className="nav-link" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#uploadImageModal"
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-camera"></i></div>
                                        Upload Avatar
                                    </a>
                                    <a 
                                        className="nav-link logoutButton text-danger mt-3"
                                    >
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-right-from-bracket text-danger"></i></div>
                                        Logout
                                    </a>
                                </div>
                            </div>
                            <div className="sb-sidenav-footer">
                                <div className="small">Patient In Session</div>
                                <div className="fw-bold text-primary text-truncate">{this.state.fullname || this.state.username}</div>
                            </div>
                        </nav>
                    </div>
                    <div 
                        id="layoutSidenav_content"
                        onClick={(e) => {
                            if (window.innerWidth < 992 && document.body.classList.contains('sb-sidenav-toggled')) {
                                document.body.classList.remove('sb-sidenav-toggled');
                            }
                        }}
                    >
                        <main>
                            <div className="container-fluid px-2 px-sm-3 px-md-4">

                                {(this.state.current_component == 'user') ? <Games data={this.state.data.user_game_records} date_format={this.state.date_format} prescribedMinutes={this.state.data?.user_playing_time || 20} todayGameStats={this.state.today_games_summary || {}} onStartSession={this.handleStartSession} onResetToday={this.handleResetToday}/> : ''}

                                {(this.state.current_component == 'acuitytest') ? <VisualAcuityTest patient={this.state.data} /> : ''}

                                {(this.state.current_component == 'clinicalreport') ? <ClinicalReport data={this.state.data.user_game_records} patient={this.state.data} /> : ''}

                                {(this.state.current_component == 'progressreport') ? <ProgressReport data={this.state.data.user_game_records} date_format={this.state.date_format}/> : ''}

                                {(this.state.current_component == 'activitylog') ? <ActivityLog data={this.state.data.user_game_records} date_format={this.state.date_format}/> : ''}

                                {/* <Table /> */}

                            </div>
                        </main>
                        <iframe id="iframe" src="" ref={frameRef} width={0} height={0} allow="fullscreen" title="Snake Game Testing"></iframe>

                        <footer className="py-4 mt-auto border-top" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                            <div className="container-fluid px-4">
                                <div className="d-flex align-items-center justify-content-between small text-secondary">
                                    <div>Copyright &copy; LazyEye Vision Therapy 2026</div>
                                    <div className="d-flex gap-3">
                                        <a href="#" className="text-decoration-none text-secondary">Privacy Policy</a>
                                        &middot;
                                        <a href="#" className="text-decoration-none text-secondary">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>

                {this.state.activeSession && (
                    <GameSessionHUD 
                        game={this.state.activeSession}
                        prescribedMinutes={this.state.data?.user_playing_time || 20}
                        gameSpeed={this.state.data?.game_speed || 'level-3'}
                        alreadyPlayedSecondsToday={this.getTodayCompletedSeconds()}
                        onSessionCompleted={this.handleSessionCompleted}
                    />
                )}

                    </div>
                </div>

                {/* <!-- Button trigger modal --> */}

                <div className="modal fade" id="colorSettingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="colorSettingLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                <div>
                                    <h5 className="modal-title fw-bold text-main mb-0" id="colorSettingLabel">
                                        <i className="fa-solid fa-glasses text-primary me-2"></i>Dichoptic Glasses Calibration
                                    </h5>
                                    <small className="text-sub">Fine-tune RGB chromatic filters and eliminate ghosting crosstalk for physical 3D glasses</small>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.saveColorSettings()}></button>
                            </div>
                            <div className="modal-body p-4">
                                {/* Preset quick selector */}
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 p-2 px-3 rounded-pill" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155' }}>
                                    <span className="small text-white-50 fw-semibold"><i className="fa-solid fa-wand-magic-sparkles me-1 text-warning"></i>Presets:</span>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-sm btn-outline-info rounded-pill px-3 py-1"
                                            onClick={() => this.applyCalibrationPreset('red-cyan')}
                                        >
                                            Red - Cyan (Standard)
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-sm btn-outline-primary rounded-pill px-3 py-1"
                                            onClick={() => this.applyCalibrationPreset('red-blue')}
                                        >
                                            Red - Blue
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-sm btn-outline-success rounded-pill px-3 py-1"
                                            onClick={() => this.applyCalibrationPreset('red-green')}
                                        >
                                            Red - Green
                                        </button>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    {/* Left Eye Calibration Card */}
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 rounded-4 h-100" style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-danger px-3 py-2">Left Eye</span>
                                                <span className="badge bg-dark text-white-50 border border-secondary">
                                                    {Math.round(((this.state.calibration?.leftContrast ?? 255) / 255) * 100)}% Contrast
                                                </span>
                                            </div>
                                            <div 
                                                id="leftColorTestDiv" 
                                                className="d-flex align-items-center justify-content-center mx-auto my-3 text-white fw-bold shadow" 
                                                style={{ 
                                                    height: "120px", 
                                                    width: "120px", 
                                                    borderRadius: "50%", 
                                                    border: "3px solid rgba(255,255,255,0.2)", 
                                                    fontSize: "0.85rem",
                                                    backgroundColor: this.state.calibration?.leftHex || '#ff0000',
                                                    boxShadow: `0 0 20px ${this.state.calibration?.leftHex || '#ff0000'}44`
                                                }}
                                            >
                                                {this.state.calibration?.leftHex || '#ff0000'}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-white small fw-semibold">Lens Filter Color</label>
                                                <select 
                                                    id="leftEyeColor" 
                                                    className="form-select bg-dark text-white border-secondary" 
                                                    value={this.state.calibration?.leftEyeColor || 'red'}
                                                    onChange={(e) => this.handleEyeColorChange('left', e.target.value)}
                                                >
                                                    <option value="red">Red Filter</option>
                                                    <option value="cyan">Cyan Filter</option>
                                                    <option value="blue">Blue Filter</option>
                                                    <option value="green">Green Filter</option>
                                                </select>
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <label className="form-label text-white small fw-semibold mb-0">Contrast Level</label>
                                                    <small className="text-white-50">{this.state.calibration?.leftContrast ?? 255} / 255</small>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="255" 
                                                    id="leftColorContrastSlider" 
                                                    step="1" 
                                                    className="form-range" 
                                                    value={this.state.calibration?.leftContrast ?? 255}
                                                    onChange={(e) => this.handleContrastChange('left', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Eye Calibration Card */}
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 rounded-4 h-100" style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-primary px-3 py-2">Right Eye</span>
                                                <span className="badge bg-dark text-white-50 border border-secondary">
                                                    {Math.round(((this.state.calibration?.rightContrast ?? 255) / 255) * 100)}% Contrast
                                                </span>
                                            </div>
                                            <div 
                                                id="rightColorTestDiv" 
                                                className="d-flex align-items-center justify-content-center mx-auto my-3 text-white fw-bold shadow" 
                                                style={{ 
                                                    height: "120px", 
                                                    width: "120px", 
                                                    borderRadius: "50%", 
                                                    border: "3px solid rgba(255,255,255,0.2)", 
                                                    fontSize: "0.85rem",
                                                    backgroundColor: this.state.calibration?.rightHex || '#00ffff',
                                                    boxShadow: `0 0 20px ${this.state.calibration?.rightHex || '#00ffff'}44`
                                                }}
                                            >
                                                {this.state.calibration?.rightHex || '#00ffff'}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-white small fw-semibold">Lens Filter Color</label>
                                                <select 
                                                    id="rightEyeColor" 
                                                    className="form-select bg-dark text-white border-secondary" 
                                                    value={this.state.calibration?.rightEyeColor || 'cyan'}
                                                    onChange={(e) => this.handleEyeColorChange('right', e.target.value)}
                                                >
                                                    <option value="cyan">Cyan Filter (Recommended)</option>
                                                    <option value="blue">Blue Filter</option>
                                                    <option value="green">Green Filter</option>
                                                    <option value="red">Red Filter</option>
                                                </select>
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <label className="form-label text-white small fw-semibold mb-0">Contrast Level</label>
                                                    <small className="text-white-50">{this.state.calibration?.rightContrast ?? 255} / 255</small>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="255" 
                                                    id="rightColorContrastSlider" 
                                                    step="1" 
                                                    className="form-range" 
                                                    value={this.state.calibration?.rightContrast ?? 255}
                                                    onChange={(e) => this.handleContrastChange('right', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dichoptic Crosstalk Suppression Verification Box */}
                                    <div className="col-12">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: "#020617", border: "1px solid #1e293b" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-secondary px-3 py-2">
                                                    <i className="fa-solid fa-eye-low-vision me-1"></i> Suppression & Ghosting Crosstalk Test
                                                </span>
                                                <small className="text-white-50">Put on physical 3D glasses</small>
                                            </div>
                                            <p className="text-white-50 small mb-3" style={{ fontSize: '0.8rem' }}>
                                                Close your <strong>Right eye</strong>: only the Left target should remain visible. Close your <strong>Left eye</strong>: only the Right target should remain visible. If you see ghosting through either lens, adjust the corresponding contrast slider.
                                            </p>
                                            <div className="row text-center g-3">
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#000000', border: '1px dashed #334155' }}>
                                                        <div 
                                                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                                                            style={{ 
                                                                width: '56px', 
                                                                height: '56px', 
                                                                backgroundColor: this.state.calibration?.leftHex || '#ff0000', 
                                                                boxShadow: `0 0 16px ${this.state.calibration?.leftHex || '#ff0000'}` 
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-circle text-black fs-5"></i>
                                                        </div>
                                                        <div className="small text-white fw-bold">Left Eye Target</div>
                                                        <small className="text-white-50" style={{ fontSize: '0.72rem' }}>Visible through Left Filter Only</small>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#000000', border: '1px dashed #334155' }}>
                                                        <div 
                                                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                                                            style={{ 
                                                                width: '56px', 
                                                                height: '56px', 
                                                                backgroundColor: this.state.calibration?.rightHex || '#00ffff', 
                                                                boxShadow: `0 0 16px ${this.state.calibration?.rightHex || '#00ffff'}` 
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-square text-black fs-5"></i>
                                                        </div>
                                                        <div className="small text-white fw-bold">Right Eye Target</div>
                                                        <small className="text-white-50" style={{ fontSize: '0.72rem' }}>Visible through Right Filter Only</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prescribed Therapy Speed */}
                                    <div className="col-12">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-primary px-3 py-2"><i className="fa-solid fa-gauge-high me-1"></i> Therapy Speed & Velocity</span>
                                                <small className="text-white-50">Prescribed by Doctor / Clinic</small>
                                            </div>
                                            <select 
                                                id="userTherapySpeed" 
                                                className="form-select bg-dark text-white border-secondary"
                                                defaultValue={this.state.data?.game_speed || 'level-3'}
                                            >
                                                <option value="progressive">Dynamic / Progressive (Auto-speeds with score)</option>
                                                <option value="level-1">Level 1 - Very Slow / Rehab (0.5x)</option>
                                                <option value="level-2">Level 2 - Slow / Gentle (0.75x)</option>
                                                <option value="level-3">Level 3 - Normal / Baseline (1.0x)</option>
                                                <option value="level-4">Level 4 - Fast / Agile (1.25x)</option>
                                                <option value="level-5">Level 5 - Rapid / Agility (1.5x)</option>
                                            </select>
                                            <small className="text-white-50 d-block mt-2" style={{ fontSize: '0.8rem' }}>
                                                <i className="fa-solid fa-circle-info text-info me-1"></i>
                                                Controls game velocity across exercises. Progressive automatically tunes speed as your score climbs.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top" style={{ borderColor: 'var(--border-color)' }}>
                                <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm" data-bs-dismiss="modal" onClick={() => { this.saveColorSettings(); sweetAlert('Saved', 'Color & Contrast calibrated successfully!', 'success'); }}>
                                    <i className="fa-solid fa-floppy-disk me-2"></i>Save Calibration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <UserDetailsModal data={this.state.data} />

                <ImageUploadModal data={this.state.data} />

            </>
        )
    }
}
const userRoot = document.getElementById('user');
if (userRoot) {
    const props = Object.assign({}, userRoot.dataset);
    ReactDOM.render(<UserDashboard {...props} />, userRoot);
}
