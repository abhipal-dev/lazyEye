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


var frameRef = React.createRef(null);
let message = {}
$(document).ready(function () {
    // console.log('ready')
    var l, r, leftDiv, rightDiv, leftColor, rightColor;

    //  'l' and 'r' references to contrast sliders
    l = document.querySelector('#leftColorContrastSlider')
    r = document.querySelector('#rightColorContrastSlider')

    // 'leftDiv' & 'rightDiv' are references to left and right color div
    leftDiv = document.querySelector('#leftColorTestDiv')
    rightDiv = document.querySelector('#rightColorTestDiv')

    // 'leftColor' & 'rightColor' are references to left and right color options
    leftColor = document.getElementById('leftEyeColor').value
    rightColor = document.getElementById('rightEyeColor').value
    // console.log(leftColor)
    // console.log(rightColor)

    function pad(n) {
        return (n.length < 2) ? "0" + n : n;
    }
    function makeColor(color, contrastValue) {
        let hex, r_hex;
        r_hex = parseInt(contrastValue, 10).toString(16)
        if (color === 'red') {
            return hex = "#" + pad(r_hex) + pad("00") + pad("00");
        }
        else if (color === 'green') {
            return hex = "#" + pad('00') + pad(r_hex) + pad("00");
        }
        else if (color === 'blue') {
            return hex = "#" + pad("00") + pad("00") + pad(r_hex);
        }
    }
    function setLeftColor() {
        var hex;
        leftColor = document.getElementById('leftEyeColor').value //getting left options color value
        hex = makeColor(leftColor, l.value)
        console.log("Left color :" + leftColor)
        console.log("Color code :" + hex)
        leftDiv.style.backgroundColor = hex;
        leftDiv.innerHTML = hex;
    }

    function setRightColor() {
        var hex;
        rightColor = document.getElementById('rightEyeColor').value
        hex = makeColor(rightColor, r.value)
        console.log("right color :" + rightColor)
        console.log("Color code :" + hex)
        rightDiv.style.backgroundColor = hex;
        rightDiv.innerHTML = hex;
    }

    l.addEventListener('change', function () {
        console.log('left Changed')
        setLeftColor();
    }, false);
    l.addEventListener('input', function () {
        console.log('left Changed')

        setLeftColor();
    }, false);
    r.addEventListener('change', function () {
        console.log('right Changed')

        setRightColor();
    }, false);
    r.addEventListener('input', function () {
        console.log('right Changed')

        setRightColor();
    }, false);

});

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
            date_format:"DD/MM/YYYY"
        }
    }
    componentDidMount() {
        let token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/fetchLoginUser",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: { id: this.props.id },
            success: (data) => {
                this.setState({
                    id: data[0].id,
                    fullname: data[0].fullname,
                    username: data[0].username,
                    data: data[0],
                    data2: data,
                    userProfileImage: `storage/images/${data[0].image_address}`
                })
                document.querySelector('#leftColorTestDiv').style.backgroundColor = data[0].left_eye_contrast_color
                document.querySelector('#rightColorTestDiv').style.backgroundColor = data[0].right_eye_contrast_color
                document.querySelector('#leftColorTestDiv').innerHTML = data[0].left_eye_contrast_color
                document.querySelector('#rightColorTestDiv').innerHTML = data[0].right_eye_contrast_color
                document.getElementById('leftEyeColor').value = data[0].left_eye_color
                document.getElementById('rightEyeColor').value = data[0].right_eye_color
                document.querySelector('#leftColorContrastSlider').defaultValue = data[0].left_eye_contrastvalue
                document.querySelector('#rightColorContrastSlider').defaultValue = data[0].right_eye_contrastvalue
                console.log(this.state.data)
            }
        });
    }
    pad = (n) => {
        return (n.length < 2) ? "0" + n : n;
    }
    makeColor(color, contrastValue) {
        let hex, r_hex;
        r_hex = parseInt(contrastValue, 10).toString(16)
        if (color === 'red') {
            return hex = "#" + this.pad(r_hex) + this.pad("00") + this.pad("00");
        }
        else if (color === 'green') {
            return hex = "#" + this.pad('00') + this.pad(r_hex) + this.pad("00");
        }
        else if (color === 'blue') {
            return hex = "#" + this.pad("00") + this.pad("00") + this.pad(r_hex);
        }
    }
    changeColor = (eyeSide) => {
        console.log(this.state.username)
        console.log(this.state.fullname)
        let hex, leftColor, rightColor,
            l = document.querySelector('#leftColorContrastSlider'),
            r = document.querySelector('#rightColorContrastSlider'),
            leftDiv = document.querySelector('#leftColorTestDiv'),
            rightDiv = document.querySelector('#rightColorTestDiv')
        if (eyeSide === 'left') {
            leftColor = document.getElementById('leftEyeColor').value
            hex = this.makeColor(leftColor, l.value)
            console.log("left color :" + leftColor)
            console.log("Color code :" + hex)
            leftDiv.style.backgroundColor = hex;
            leftDiv.innerHTML = hex;
        }
        else if (eyeSide === 'right') {
            rightColor = document.getElementById('rightEyeColor').value
            hex = this.makeColor(rightColor, r.value)
            console.log("right color :" + rightColor)
            console.log("Color code :" + hex)
            rightDiv.style.backgroundColor = hex;
            rightDiv.innerHTML = hex;
        }
    }


    saveColorSettings() {
        console.log("Save Color Settings")
        let l = document.querySelector('#leftColorContrastSlider'),
            r = document.querySelector('#rightColorContrastSlider'),
            leftDiv = document.querySelector('#leftColorTestDiv'),
            rightDiv = document.querySelector('#rightColorTestDiv')
        leftColor = document.getElementById('leftEyeColor').value
        rightColor = document.getElementById('rightEyeColor').value
        let leftContrastColor = leftDiv.innerHTML
        let rightContrastColor = rightDiv.innerHTML

        console.log(l.value)
        console.log(r.value)
        console.log(leftColor)
        console.log(rightColor)
        console.log(leftContrastColor)
        console.log(rightContrastColor)

        let token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/saveColorSettings",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: {
                id: this.props.id,
                left_eye_contrastvalue: l.value,
                right_eye_contrastvalue: r.value,
                left_eye_color: leftColor,
                right_eye_color: rightColor,
                left_eye_contrast_color: leftContrastColor,
                right_eye_contrast_color: rightContrastColor
            },
            success: (data) => {
                console.log(data)
            }
        });


    }
    render() {
        const isAdmin = (this.state.data && this.state.data.accounttype === 'admin') || this.props.type === 'admin';

        return (
            <>
                <p id="score_history" style={{ 'display': "none" }}>{this.state.data.user_game_records}</p>
                <span id="time" style={{ display: "none" }}>{this.state.data?.user_playing_time || 20}</span>

                {/* Admin Mode Floating Banner */}
                {isAdmin && (
                    <div className="bg-primary text-white py-2 px-3 d-flex align-items-center justify-content-between flex-wrap gap-2 small shadow-sm position-relative" style={{ zIndex: 1050 }}>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-white text-primary fw-bold text-uppercase">Admin Simulator</span>
                            <span>You are currently in <strong>Patient Therapy View</strong> as an Administrator.</span>
                        </div>
                        <a href="/admin" className="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3 py-1 shadow-sm d-flex align-items-center gap-1">
                            <i className="fa-solid fa-arrow-left"></i> Return to Admin Panel
                        </a>
                    </div>
                )}

                <nav className="sb-topnav navbar navbar-expand dashboard-topbar">
                    {/* <!-- Navbar Brand--> */}
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/user">
                        <img src="/images/lazyeye-icon.svg" className="d-inline-block align-top" alt="Logo" style={{ maxHeight: '34px', width: '34px' }} />
                        <span className="fw-bold d-none d-sm-inline">
                            Lazy<span className="text-primary">Eye</span> 
                            <span className={`badge ${isAdmin ? 'bg-warning-subtle text-warning' : 'bg-primary-subtle text-primary'} small ms-1`}>
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
                            <a href="/admin" className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold d-none d-sm-flex align-items-center gap-1">
                                <i className="fa-solid fa-arrow-left"></i> Admin Panel
                            </a>
                        )}
                        <ThemeToggle />
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 px-2 py-1 rounded-pill" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 32, height: 32, minWidth: 32, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', fontSize: '0.85rem' }}>
                                        {(this.state.fullname ? this.state.fullname.charAt(0) : 'P').toUpperCase()}
                                    </div>
                                    <div className="d-none d-md-flex flex-column text-start me-1">
                                        <span className="fw-bold text-main" style={{ fontSize: '0.86rem' }}>{this.state.fullname || 'Patient'}</span>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{isAdmin ? 'Admin View' : 'Patient Therapy'}</span>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                                    <li className="user-dropdown-header">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 40, height: 40, minWidth: 40, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', fontSize: '0.95rem' }}>
                                                {(this.state.fullname ? this.state.fullname.charAt(0) : 'P').toUpperCase()}
                                            </div>
                                            <div className="text-truncate">
                                                <strong className="d-block text-main text-truncate" style={{ fontSize: '0.92rem' }}>{this.state.fullname || 'Patient'}</strong>
                                                <span className="small text-muted d-block text-truncate">@{this.state.username}</span>
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

                                {(this.state.current_component == 'user') ? <Games data={this.state.data.user_game_records} date_format={this.state.date_format}/> : ''}

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
                                    <small className="text-sub">Adjust colors and contrast so each eye sees only its designated elements</small>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.saveColorSettings()}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-danger px-3 py-2">Left Eye</span>
                                                <small className="text-white-50">Filter Check</small>
                                            </div>
                                            <div id="leftColorTestDiv" className="d-flex align-items-center justify-content-center mx-auto my-3 text-white fw-bold shadow" style={{ height: "130px", width: "130px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)", fontSize: "0.9rem" }}></div>
                                            <div className="mb-3">
                                                <label className="form-label text-white small fw-semibold">Lens Color</label>
                                                <select id="leftEyeColor" className="form-select bg-dark text-white border-secondary" onChange={this.changeColor.bind(this, 'left')}>
                                                    <option value="red">Red Filter</option>
                                                    <option value="green">Green Filter</option>
                                                    <option value="blue">Blue Filter</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label text-white small fw-semibold">Contrast Balance (0 - 255)</label>
                                                <input type="range" min="0" max="255" id="leftColorContrastSlider" step="1" className="form-range" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-primary px-3 py-2">Right Eye</span>
                                                <small className="text-white-50">Filter Check</small>
                                            </div>
                                            <div id="rightColorTestDiv" className="d-flex align-items-center justify-content-center mx-auto my-3 text-white fw-bold shadow" style={{ height: "130px", width: "130px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)", fontSize: "0.9rem" }}></div>
                                            <div className="mb-3">
                                                <label className="form-label text-white small fw-semibold">Lens Color</label>
                                                <select id="rightEyeColor" className="form-select bg-dark text-white border-secondary" onChange={this.changeColor.bind(this, 'right')}>
                                                    <option value="blue">Blue Filter</option>
                                                    <option value="red">Red Filter</option>
                                                    <option value="green">Green Filter</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label text-white small fw-semibold">Contrast Balance (0 - 255)</label>
                                                <input type="range" min="0" max="255" id="rightColorContrastSlider" step="1" className="form-range" />
                                            </div>
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
// if (document.getElementById('user')) {
//   ReactDOM.render(<UserDashboard />, document.getElementById('user'))
// }
if (document.getElementById('user')) {
    // find element by id
    const element = document.getElementById('user')

    // create new props object with element's data-attributes
    // result: {tsId: "1241"}
    const props = Object.assign({}, element.dataset)

    // render element with props (using spread)
    ReactDOM.render(<UserDashboard {...props} />, element);
}
