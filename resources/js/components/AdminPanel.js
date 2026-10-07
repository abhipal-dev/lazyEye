import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Dashboard from './Dashboard';
import Table from './Table';
import UserDetailsModal from './modals/UserDetailsModal';
import ImageUploadModal from './modals/ImageUploadModal';
import ThemeToggle from './ThemeToggle';
export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: "",
            id: '',
            fullname: '',
            username: '',
            data: {},
            userProfileImage: ''
        }
    }
    componentDidMount() {
        // console.log(this.props.id)
        // console.log(this.state.username)
        // console.log(this.state.data)
        let token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/fetchLoginUser",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: { id: this.props.id },
            success: (data) => {
                console.log(data)
                this.setState({
                    id: data[0].id,
                    fullname: data[0].fullname,
                    username: data[0].username,
                    data: data[0],
                    userProfileImage: `storage/images/${data[0].image_address}`
                })
                // document.querySelector('#leftColorTestDiv').style.backgroundColor=data[0].left_eye_contrast_color
                // document.querySelector('#rightColorTestDiv').style.backgroundColor=data[0].right_eye_contrast_color
                // document.querySelector('#leftColorTestDiv').innerHTML=data[0].left_eye_contrast_color
                // document.querySelector('#rightColorTestDiv').innerHTML=data[0].right_eye_contrast_color
                // document.getElementById('leftEyeColor').value=data[0].left_eye_color
                // document.getElementById('rightEyeColor').value=data[0].right_eye_color
                // document.querySelector('#leftColorContrastSlider').defaultValue = data[0].left_eye_contrastvalue
                // document.querySelector('#rightColorContrastSlider').defaultValue = data[0].right_eye_contrastvalue
                // console.log("Saved data")
                console.log(this.state.data)
            }
        });
    }
    render() {
        const role = this.state.data?.accounttype || 'admin';
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');

        return (
            <>
                <nav className="sb-topnav navbar navbar-expand dashboard-topbar">
                    {/* <!-- Navbar Brand--> */}
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/admin">
                        <img src="/images/lazyeye-icon.svg" className="d-inline-block align-top" alt="Logo" style={{ maxHeight: '34px', width: '34px' }} />
                        <span className="fw-bold d-none d-sm-inline">
                            Lazy<span className="text-primary">Eye</span> 
                            <span className={`badge ${isDoctor ? 'bg-info' : 'bg-danger'} ms-1 small`}>
                                {isDoctor ? 'Doctor Portal' : isRoot ? 'Superadmin' : 'Admin'}
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
                        <ThemeToggle />
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 text-main px-2 py-1" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: 34, height: 34, minWidth: 34, background: isDoctor ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontSize: '0.85rem' }}>
                                        {this.state.userProfileImage && !this.state.userProfileImage.includes('default') ? (
                                            <img src={`/${this.state.userProfileImage}`} alt="Avatar" className="rounded-circle w-100 h-100" style={{ objectFit: 'cover' }} />
                                        ) : (
                                            (this.state.fullname ? this.state.fullname.charAt(0) : 'A').toUpperCase()
                                        )}
                                    </div>
                                    <div className="d-none d-md-flex flex-column text-start lh-sm me-1">
                                        <span className="fw-bold text-main" style={{ fontSize: '0.86rem' }}>{this.state.fullname || 'Administrator'}</span>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{isDoctor ? 'Vision Therapist' : isRoot ? 'Superadmin' : 'Clinic Administrator'}</span>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                                    <li className="user-dropdown-header">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 40, height: 40, minWidth: 40, background: isDoctor ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontSize: '0.95rem' }}>
                                                {(this.state.fullname ? this.state.fullname.charAt(0) : 'A').toUpperCase()}
                                            </div>
                                            <div className="text-truncate">
                                                <strong className="d-block text-main text-truncate" style={{ fontSize: '0.92rem' }}>{this.state.fullname || 'Administrator'}</strong>
                                                <span className="small text-muted d-block text-truncate">@{this.state.username}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                                            <span className={`badge ${isDoctor ? 'bg-info-subtle text-info' : isRoot ? 'bg-dark-subtle text-dark' : 'bg-danger-subtle text-danger'} small`}>
                                                <i className={`fa-solid ${isDoctor ? 'fa-user-doctor' : isRoot ? 'fa-crown' : 'fa-user-shield'} me-1`}></i>
                                                {isDoctor ? 'Doctor / Therapist' : isRoot ? 'Root Superadmin' : 'Clinic Administrator'}
                                            </span>
                                            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>#{this.state.id}</span>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
                                            <i className="fa-solid fa-id-card text-primary me-2"></i>My Account Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#uploadImageModal">
                                            <i className="fa-solid fa-camera text-info me-2"></i>Change Profile Avatar
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/user">
                                            <i className="fa-solid fa-gamepad text-success me-2"></i>Patient Therapy View
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
                                    <div className="sb-sidenav-menu-heading">Administrative Controls</div>
                                    <a className="nav-link dashboardButton cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-gauge-high"></i></div>
                                        Overview Dashboard
                                    </a>

                                    <div className="sb-sidenav-menu-heading">User & Patient Records</div>
                                    <a className="nav-link fetchUsers cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-users"></i></div>
                                        Active Patients
                                    </a>
                                    <a className="nav-link fetchDoctors cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-user-doctor text-info"></i></div>
                                        Doctors & Staff
                                    </a>
                                    <a className="nav-link fetchConsultations cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-stethoscope text-danger"></i></div>
                                        Clinical Reviews
                                    </a>
                                    <a className="nav-link fetchRegisters cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-user-plus text-warning"></i></div>
                                        Pending Registrations
                                    </a>
                                    <a className="nav-link fetchAdmins cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-user-shield text-success"></i></div>
                                        Administrators
                                    </a>

                                    <div className="sb-sidenav-menu-heading">Clinical Modules</div>
                                    <a className="nav-link" href="/user">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-gamepad"></i></div>
                                        Patient Therapy View
                                    </a>

                                    <div className="sb-sidenav-menu-heading">Admin Profile</div>
                                    <a className="nav-link" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-id-card"></i></div>
                                        Admin Account
                                    </a>
                                    <a className="nav-link" data-bs-toggle="modal" data-bs-target="#uploadImageModal">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-camera"></i></div>
                                        Upload Avatar
                                    </a>
                                    <a className="nav-link logoutButton text-danger mt-3 cursor-pointer">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-right-from-bracket text-danger"></i></div>
                                        Logout
                                    </a>
                                </div>
                            </div>
                            <div className="sb-sidenav-footer">
                                <div className="small">System Administrator</div>
                                <div className="fw-bold text-primary text-truncate">{this.state.data.fullname || this.state.username}</div>
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
                                <Dashboard />
                                <div id="table-section">
                                    <Table />
                                </div>
                            </div>
                        </main>
                        
                        {/* Edit User/Staff Modal */}
                        <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                                <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                        <h4 className="modal-title fw-bold text-main" id="exampleModalLabel"><i className="fa-solid fa-user-pen text-primary me-2"></i>Update User / Staff Record</h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form name='edit'>
                                        <div className="modal-body p-4">
                                            <div className="row g-3">
                                                <input type="number" name='id' id="id" style={{ display: 'none' }} />
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                                                    <input type="text" name='fullname' id="fullname" minLength={3} maxLength={30} onInput={(e) => e.target.value = e.target.value.replace(/[^a-z A-Z]/g, '')} className="form-control" placeholder="Enter full name" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary" htmlFor="email1">Username</label>
                                                    <input type="text" name="username" id="username" minLength={5} maxLength={30} onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')} className="form-control" placeholder="Enter username" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                                                    <input type="email" className="form-control" name="email" placeholder="Enter email" required="" />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Password</label>
                                                    <input type="password" name="password" id="password" className="form-control" placeholder="Enter password" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Account Role</label>
                                                    <select name="accounttype" id="edit_accounttype" className="form-select">
                                                        <option value="user">Patient (User)</option>
                                                        <option value="doctor">Doctor / Optometrist</option>
                                                        <option value="admin">Clinic Administrator</option>
                                                        <option value="root">Root Superadmin</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-12 col-md-6" id="edit_doctor_group">
                                                    <label className="form-label small fw-semibold text-secondary">Assigned Attending Doctor</label>
                                                    <select name="doctor_id" id="edit_doctor_id" className="form-select">
                                                        <option value="">-- No Doctor Assigned --</option>
                                                        <option value="23">Dr. Sameer Arora (Vision Therapist)</option>
                                                        <option value="24">Dr. Neha Sharma (Pediatric Optometrist)</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Allotted Daily Therapy Time (minutes)</label>
                                                    <input type="number" name="allotted_time" id="allotted_time" className="form-control" min="0" max="60" placeholder="e.g. 20" required />
                                                </div>
                                                <div className="form-group col-12">
                                                    <label className="form-label small fw-semibold text-secondary">Gender</label>
                                                    <div className="d-flex gap-3 align-items-center mt-2">
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value={'Male'} /> Male
                                                        </label>
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value={'Female'} /> Female
                                                        </label>
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value={'Other'} /> Other
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                                            <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" className="btn btn-primary rounded-pill px-4"><i className="fa-solid fa-floppy-disk me-1"></i> Update Record</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Create New Staff / User Modal */}
                        <div className="modal fade" id="createStaffModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="createStaffModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                        <h4 className="modal-title fw-bold text-main" id="createStaffModalLabel">
                                            <i className="fa-solid fa-user-plus text-primary me-2"></i>Add New Doctor, Patient or Admin
                                        </h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form name='createStaff'>
                                        <div className="modal-body p-4">
                                            <div className="row g-3">
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                                                    <input type="text" name="fullname" className="form-control" placeholder="e.g. Dr. Priya Verma" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Username</label>
                                                    <input type="text" name="username" className="form-control" placeholder="e.g. dr_priya" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                                                    <input type="email" name="email" className="form-control" placeholder="priya@lazyeyeclinic.com" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Initial Password</label>
                                                    <input type="password" name="password" className="form-control" placeholder="Enter password (min 4 chars)" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Account Role</label>
                                                    <select name="accounttype" className="form-select" required>
                                                        <option value="doctor">Doctor / Optometrist</option>
                                                        <option value="user">Patient (User)</option>
                                                        <option value="admin">Clinic Administrator</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Allotted Daily Minutes</label>
                                                    <input type="number" name="allotted_time" className="form-control" defaultValue="20" min="5" max="60" required />
                                                </div>
                                                <div className="form-group col-12">
                                                    <label className="form-label small fw-semibold text-secondary">Gender</label>
                                                    <div className="d-flex gap-4 align-items-center mt-1">
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value="Male" defaultChecked /> Male
                                                        </label>
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value="Female" /> Female
                                                        </label>
                                                        <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer">
                                                            <input type="radio" className="form-check-input" name="gender" value="Other" /> Other
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                                            <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" className="btn btn-primary rounded-pill px-4">
                                                <i className="fa-solid fa-check me-1"></i> Create Account
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* Quick Assign Doctor Modal */}
                        <div className="modal fade" id="assignDoctorModal" tabIndex={-1} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                        <h5 className="modal-title fw-bold text-main">
                                            <i className="fa-solid fa-user-doctor text-info me-2"></i>Assign Doctor to Patient
                                        </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form id="assignDoctorForm">
                                        <div className="modal-body p-4">
                                            <input type="hidden" name="patient_id" id="assign_patient_id" />
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-secondary">Patient</label>
                                                <input type="text" id="assign_patient_name" className="form-control" readOnly />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-secondary">Select Attending Doctor</label>
                                                <select name="doctor_id" id="assign_doctor_select" className="form-select" required>
                                                    <option value="">-- Select Attending Doctor --</option>
                                                    <option value="23">Dr. Sameer Arora (Vision Therapist)</option>
                                                    <option value="24">Dr. Neha Sharma (Pediatric Optometrist)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                                            <button type="button" className="btn btn-secondary rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" className="btn btn-primary rounded-pill px-4">
                                                <i className="fa-solid fa-check me-1"></i> Save Assignment
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Log Clinical Consultation Modal */}
                        <div className="modal fade" id="logConsultationModal" tabIndex={-1} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                                    <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                        <h5 className="modal-title fw-bold text-main">
                                            <i className="fa-solid fa-stethoscope text-danger me-2"></i>Log Clinical Review &amp; Consultation
                                        </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form id="logConsultationForm">
                                        <div className="modal-body p-4">
                                            <div className="row g-3">
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Patient</label>
                                                    <select name="patient_id" id="consultation_patient_select" className="form-select" required>
                                                        <option value="">-- Select Patient --</option>
                                                    </select>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Reviewing Doctor</label>
                                                    <select name="doctor_id" id="consultation_doctor_select" className="form-select" required>
                                                        <option value="23">Dr. Sameer Arora (Vision Therapist)</option>
                                                        <option value="24">Dr. Neha Sharma (Pediatric Optometrist)</option>
                                                    </select>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Therapy Compliance Assessment</label>
                                                    <select name="compliance_assessment" className="form-select">
                                                        <option value="Excellent">Excellent (Daily Target Consistently Achieved)</option>
                                                        <option value="Good">Good (Regular Binocular Adherence)</option>
                                                        <option value="Moderate">Moderate (Needs Contrast Recalibration)</option>
                                                        <option value="Low">Low (Missed Multiple Sessions)</option>
                                                    </select>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Prescribed Daily Therapy (minutes)</label>
                                                    <input type="number" name="prescribed_minutes" className="form-control" defaultValue="20" min="5" max="60" required />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-semibold text-secondary">Clinical Observations &amp; Doctor Notes</label>
                                                    <textarea name="notes" className="form-control" rows="3" placeholder="Enter clinical assessment, amblyopia suppression status, stereopsis recovery progress..."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
                                            <button type="button" className="btn btn-secondary rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" className="btn btn-danger rounded-pill px-4">
                                                <i className="fa-solid fa-notes-medical me-1"></i> Record Consultation
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

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
                <UserDetailsModal data={this.state.data} />
                <ImageUploadModal data={this.state.data} />
            </>
        )
    }
}



if (document.getElementById('admin')) {
    // find element by id
    const element = document.getElementById('admin')

    // create new props object with element's data-attributes
    // result: {tsId: "1241"}
    const props = Object.assign({}, element.dataset)

    // render element with props (using spread)
    ReactDOM.render(<AdminDashboard {...props} />, element);
}
