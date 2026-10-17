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
            userProfileImage: '',
            activeView: 'dashboard', // 'dashboard' or 'table'
            activeTableCategory: 'fetchUsers'
        };
    }

    componentDidMount() {
        // Enforce strict mutual exclusivity on load
        $('#table-section').hide().addClass('d-none');
        $('#dashboard-section').show().removeClass('d-none');

        // Expose view switcher methods globally for adminScript and buttons
        window.switchToAdminDashboard = () => {
            this.switchToDashboard();
        };
        window.switchToAdminTable = (categoryFn) => {
            this.switchToTable(categoryFn);
        };

        let token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            url: "/fetchLoginUser",
            type: "post",
            headers: { 'X-CSRF-TOKEN': token },
            data: { id: this.props.id },
            success: (data) => {
                if (data && data[0]) {
                    this.setState({
                        id: data[0].id,
                        fullname: data[0].fullname,
                        username: data[0].username,
                        data: data[0],
                        userProfileImage: `storage/images/${data[0].image_address}`
                    });
                }
            }
        });
    }

    switchToDashboard = () => {
        if (this.state.activeView === 'dashboard') {
            return;
        }
        this.setState({ activeView: 'dashboard' }, () => {
            $('#table-section').hide().addClass('d-none');
            $('#dashboard-section').show().removeClass('d-none');
        });
        $('#layoutSidenav_nav .nav-link').removeClass('active');
        $('#layoutSidenav_nav .nav-link.dashboardButton').addClass('active');
        $('.table-filter-btn').removeClass('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    switchToTable = (categoryFn) => {
        const cat = categoryFn || 'fetchUsers';
        if (this.state.activeView === 'table' && this.state.activeTableCategory === cat) {
            return;
        }
        this.setState({ activeView: 'table', activeTableCategory: cat }, () => {
            $('#dashboard-section').hide().addClass('d-none');
            $('#table-section').show().removeClass('d-none');
            if (typeof window[cat] === 'function') {
                window[cat]();
            }
            $('#layoutSidenav_nav .nav-link').removeClass('active');
            $('#layoutSidenav_nav .nav-link.' + cat).addClass('active');
            $('.table-filter-btn').removeClass('active');
            $('.table-filter-btn.' + cat).addClass('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    };
    render() {
        const role = this.state.data?.accounttype || this.props.role || 'admin';
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');
        const isAdmin = (role === 'admin');

        return (
            <>
                <nav className="sb-topnav navbar navbar-expand dashboard-topbar">
                    {/* <!-- Navbar Brand--> */}
                    <a className="navbar-brand d-flex align-items-center gap-2" href="/admin">
                        <img src="/images/lazyeye-icon.svg" className="d-inline-block align-top" alt="Logo" style={{ maxHeight: '34px', width: '34px' }} />
                        <span className="fw-bold d-none d-sm-inline">
                            Lazy<span className="text-primary">Eye</span> 
                            <span className={`badge ${isDoctor ? 'bg-info' : isRoot ? 'bg-dark' : 'bg-primary'} ms-1 small`}>
                                {isDoctor ? 'Doctor Portal' : isRoot ? 'Superadmin' : 'Clinic Admin'}
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
                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm position-relative overflow-hidden" style={{ width: 34, height: 34, minWidth: 34, background: isDoctor ? 'linear-gradient(135deg, #0284c7, #0369a1)' : isRoot ? 'linear-gradient(135deg, #334155, #0f172a)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontSize: '0.85rem' }}>
                                        <span>{(this.state.fullname ? this.state.fullname.charAt(0) : (isDoctor ? 'D' : 'A')).toUpperCase()}</span>
                                        {this.state.userProfileImage && !this.state.userProfileImage.includes('default') && (
                                            <img 
                                                src={`/${this.state.userProfileImage}`} 
                                                alt="" 
                                                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" 
                                                style={{ objectFit: 'cover' }} 
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        )}
                                    </div>
                                    <div className="d-none d-md-flex flex-column text-start lh-sm me-1">
                                        <span className="fw-bold text-main" style={{ fontSize: '0.86rem' }}>{this.state.fullname || (isDoctor ? 'Doctor' : 'Administrator')}</span>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{isDoctor ? 'Vision Specialist' : isRoot ? 'Master Superadmin' : 'Clinic Operations'}</span>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                                    <li className="user-dropdown-header">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 40, height: 40, minWidth: 40, background: isDoctor ? 'linear-gradient(135deg, #0284c7, #0369a1)' : isRoot ? 'linear-gradient(135deg, #334155, #0f172a)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontSize: '0.95rem' }}>
                                                {(this.state.fullname ? this.state.fullname.charAt(0) : 'A').toUpperCase()}
                                            </div>
                                            <div className="text-truncate">
                                                <strong className="d-block text-main text-truncate" style={{ fontSize: '0.92rem' }}>{this.state.fullname || 'Administrator'}</strong>
                                                <span className="small text-muted d-block text-truncate">@{this.state.username}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                                            <span className={`badge ${isDoctor ? 'bg-info-subtle text-info' : isRoot ? 'bg-dark-subtle text-dark' : 'bg-primary-subtle text-primary'} small`}>
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
                                    <div className="sb-sidenav-menu-heading">
                                        {isDoctor ? 'Clinical Practice' : isRoot ? 'Superadmin Jurisdiction' : 'Clinic Operations'}
                                    </div>
                                    <a className={`nav-link dashboardButton cursor-pointer ${this.state.activeView === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToDashboard(); }}>
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-gauge-high"></i></div>
                                        {isDoctor ? 'Clinical Overview' : 'Overview Dashboard'}
                                    </a>

                                    <div className="sb-sidenav-menu-heading">
                                        {isDoctor ? 'Assigned Patients' : 'User & Patient Records'}
                                    </div>
                                    <a className={`nav-link fetchUsers cursor-pointer ${this.state.activeView === 'table' && this.state.activeTableCategory === 'fetchUsers' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToTable('fetchUsers'); }}>
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-users text-primary"></i></div>
                                        {isDoctor ? 'My Assigned Patients' : 'Active Patients'}
                                    </a>

                                    {!isDoctor && (
                                        <a className={`nav-link fetchDoctors cursor-pointer ${this.state.activeView === 'table' && this.state.activeTableCategory === 'fetchDoctors' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToTable('fetchDoctors'); }}>
                                            <div className="sb-nav-link-icon"><i className="fa-solid fa-user-doctor text-info"></i></div>
                                            Doctors &amp; Staff
                                        </a>
                                    )}

                                    <a className={`nav-link fetchConsultations cursor-pointer ${this.state.activeView === 'table' && this.state.activeTableCategory === 'fetchConsultations' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToTable('fetchConsultations'); }}>
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-stethoscope text-danger"></i></div>
                                        {isDoctor ? 'My Clinical Reviews' : 'Clinical Reviews'}
                                    </a>

                                    {!isDoctor && (
                                        <a className={`nav-link fetchRegisters cursor-pointer ${this.state.activeView === 'table' && this.state.activeTableCategory === 'fetchRegisters' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToTable('fetchRegisters'); }}>
                                            <div className="sb-nav-link-icon"><i className="fa-solid fa-user-plus text-warning"></i></div>
                                            Pending Registrations
                                        </a>
                                    )}

                                    {isRoot && (
                                        <a className={`nav-link fetchAdmins cursor-pointer ${this.state.activeView === 'table' && this.state.activeTableCategory === 'fetchAdmins' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.switchToTable('fetchAdmins'); }}>
                                            <div className="sb-nav-link-icon"><i className="fa-solid fa-user-shield text-success"></i></div>
                                            Administrators
                                        </a>
                                    )}

                                    <div className="sb-sidenav-menu-heading">Clinical Modules</div>
                                    <a className="nav-link" href="/user">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-gamepad"></i></div>
                                        Patient Therapy View
                                    </a>

                                    <div className="sb-sidenav-menu-heading">Profile &amp; Security</div>
                                    <a className="nav-link" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
                                        <div className="sb-nav-link-icon"><i className="fa-solid fa-id-card"></i></div>
                                        Account Profile
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
                                <div className="small">
                                    {isDoctor ? 'Certified Vision Specialist' : isRoot ? 'Root Superadmin' : 'Clinic Administrator'}
                                </div>
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
                                <div 
                                    id="dashboard-section" 
                                    className={this.state.activeView === 'dashboard' ? '' : 'd-none'}
                                    style={{ display: this.state.activeView === 'dashboard' ? 'block' : 'none' }}
                                >
                                    <Dashboard 
                                        currentUser={this.state.data} 
                                        onNavigateToTable={(category) => this.switchToTable(category)} 
                                    />
                                </div>
                                <div 
                                    id="table-section" 
                                    className={this.state.activeView === 'table' ? '' : 'd-none'}
                                    style={{ display: this.state.activeView === 'table' ? 'block' : 'none' }}
                                >
                                    <Table 
                                        currentUser={this.state.data} 
                                        activeCategory={this.state.activeTableCategory}
                                        onSelectCategory={(category) => this.switchToTable(category)}
                                        onBackToDashboard={() => this.switchToDashboard()} 
                                    />
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
                                            <i className="fa-solid fa-user-plus text-primary me-2"></i>
                                            {isDoctor ? 'Enroll New Assigned Patient' : isRoot ? 'Add Patient, Doctor or Administrator' : 'Add New Patient or Doctor'}
                                        </h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form name='createStaff'>
                                        <div className="modal-body p-4">
                                            <div className="row g-3">
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                                                    <input type="text" name="fullname" className="form-control" placeholder={isDoctor ? "e.g. John Doe" : "e.g. Dr. Priya Verma"} required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Username</label>
                                                    <input type="text" name="username" className="form-control" placeholder={isDoctor ? "e.g. patient_john" : "e.g. dr_priya"} required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                                                    <input type="email" name="email" className="form-control" placeholder="user@lazyeyeclinic.com" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Initial Password</label>
                                                    <input type="password" name="password" className="form-control" placeholder="Enter password (min 4 chars)" required />
                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="form-label small fw-semibold text-secondary">Account Role</label>
                                                    <select name="accounttype" id="create_accounttype_select" className="form-select" required>
                                                        {isDoctor ? (
                                                            <option value="user">Patient (Assigned to You)</option>
                                                        ) : isRoot ? (
                                                            <>
                                                                <option value="user">Patient (User)</option>
                                                                <option value="doctor">Doctor / Optometrist</option>
                                                                <option value="admin">Clinic Administrator</option>
                                                                <option value="root">Root Superadmin</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <option value="user">Patient (User)</option>
                                                                <option value="doctor">Doctor / Optometrist</option>
                                                            </>
                                                        )}
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

                {/* Comprehensive Patient Activity Report & Heatmap Modal */}
                <div className="modal fade" id="patientActivityModal" tabIndex={-1} aria-labelledby="patientActivityModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                        <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                            <div className="modal-header border-bottom py-3" style={{ borderColor: 'var(--border-color)' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                        <i className="fa-solid fa-fire fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold text-main mb-0" id="patientActivityModalLabel">
                                            Patient Clinical Activity &amp; Therapy Heatmap
                                        </h5>
                                        <small className="text-sub" id="pam_patient_subtitle">Detailed compliance, game history, and binocular engagement</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                                        id="pam_print_btn"
                                        onClick={() => window.print()}
                                        title="Print Clinical Summary Dossier"
                                    >
                                        <i className="fa-solid fa-print me-1 text-primary"></i> Print Report
                                    </button>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>
                            <div className="modal-body p-4">
                                {/* Patient Profile Snapshot Banner */}
                                <div className="card border-0 p-3 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm" id="pam_avatar" style={{ width: 52, height: 52, minWidth: 52, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontSize: '1.2rem' }}>
                                                P
                                            </div>
                                            <div>
                                                <h4 className="fw-bold mb-0 text-main" id="pam_patient_name">Patient Name</h4>
                                                <div className="d-flex align-items-center gap-2 small mt-1 flex-wrap">
                                                    <span className="badge bg-secondary-subtle text-secondary" id="pam_patient_username">@username</span>
                                                    <span className="text-sub">&bull;</span>
                                                    <span className="text-sub" id="pam_patient_email">email@example.com</span>
                                                    <span className="text-sub">&bull;</span>
                                                    <span className="badge bg-info-subtle text-info" id="pam_doctor_name"><i className="fa-solid fa-user-doctor me-1"></i>Dr. Assigned</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 shadow-sm d-flex align-items-center gap-1"
                                                id="pam_quick_seed_btn"
                                                title="Generate 30-Day Therapy Sessions for Demo Evaluation"
                                            >
                                                <i className="fa-solid fa-bolt text-warning"></i>
                                                <span>Simulate 30-Day Sessions</span>
                                            </button>
                                            <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold" id="pam_target_time">Target: 20 mins/day</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Clinical Empty State Card (Visible when 0 therapy records exist) */}
                                <div id="pam_empty_state" className="card border-0 p-4 mb-4 text-center d-none" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                                    <div className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                                        <i className="fa-solid fa-gamepad fa-xl"></i>
                                    </div>
                                    <h5 className="fw-bold text-main mb-1">No Therapy Sessions Recorded Yet</h5>
                                    <p className="text-sub mx-auto mb-3 small" style={{ maxWidth: 540 }}>
                                        This patient is enrolled in the dichoptic vision therapy program. When the patient logs in at <code>/user</code> and plays assigned dichoptic games (Snake, Tetris, Bubble Shooter), their compliance, score, and visual acuity records will appear here automatically.
                                    </p>
                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm" id="pam_seed_patient_btn">
                                            <i className="fa-solid fa-bolt me-1"></i> Generate 30-Day Clinical Records (Demo Mode)
                                        </button>
                                        <a href="/user" target="_blank" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                                            <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> Open Patient Game Portal
                                        </a>
                                    </div>
                                </div>

                                {/* Main Metrics & Heatmap Container */}
                                <div id="pam_metrics_and_charts">
                                    {/* 4 Summary Stat Cards */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 rounded-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                                <div className="small text-sub text-uppercase fw-bold">Total Sessions</div>
                                                <h3 className="fw-bold text-main mt-1 mb-0" id="pam_total_sessions">0</h3>
                                                <small className="text-muted">Therapy plays logged</small>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 rounded-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                                <div className="small text-sub text-uppercase fw-bold">Therapy Time</div>
                                                <h3 className="fw-bold text-primary mt-1 mb-0" id="pam_total_minutes">0 mins</h3>
                                                <small className="text-muted">Cumulative binocular work</small>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 rounded-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                                <div className="small text-sub text-uppercase fw-bold">Compliance Rate</div>
                                                <h3 className="fw-bold text-success mt-1 mb-0" id="pam_compliance_rate">0%</h3>
                                                <small className="text-muted">Daily target met ratio</small>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="p-3 rounded-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                                <div className="small text-sub text-uppercase fw-bold">Active Days</div>
                                                <h3 className="fw-bold text-warning mt-1 mb-0" id="pam_active_days">0</h3>
                                                <small className="text-muted" id="pam_streak_label">Therapy engagement</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Therapy Heatmap Card */}
                                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                            <div>
                                                <h5 className="fw-bold mb-1 text-main">
                                                    <i className="fa-solid fa-calendar-days text-primary me-2"></i>Therapy Activity Heatmap Calendar
                                                </h5>
                                                <small className="text-sub">Daily therapy intensity and session frequency over the past 84 days (12 weeks). Click any day to filter sessions below.</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-1 small text-sub">
                                                <span>Less</span>
                                                <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: 'var(--border-color)' }}></span>
                                                <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#a7f3d0' }}></span>
                                                <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#34d399' }}></span>
                                                <span className="d-inline-block rounded-1" style={{ width: 12, height: 12, background: '#059669' }}></span>
                                                <span>More</span>
                                            </div>
                                        </div>

                                        {/* Heatmap Grid Container rendered dynamically by adminScript */}
                                        <div className="overflow-auto pb-2" id="pam_heatmap_wrapper" style={{ minHeight: '120px' }}>
                                            <div className="d-flex align-items-center justify-content-center py-4 text-sub">
                                                <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading therapy activity heatmap...
                                            </div>
                                        </div>
                                        <div id="pam_selected_date_filter" className="small text-primary fw-semibold mt-2 d-none">
                                            Showing sessions for selected date: <span id="pam_filter_date_label"></span>
                                            <button type="button" className="btn btn-sm btn-link text-decoration-none ms-2" id="pam_clear_date_filter">Clear Filter</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs for Recent Sessions & Consultations */}
                                <ul className="nav nav-pills mb-3 gap-2" id="pamTabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active rounded-pill px-3 py-1 fw-semibold small" id="pam-sessions-tab" data-bs-toggle="tab" data-bs-target="#pam-sessions" type="button" role="tab">
                                            <i className="fa-solid fa-gamepad me-1"></i> Recent Game Sessions (<span id="pam_session_count">0</span>)
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link rounded-pill px-3 py-1 fw-semibold small" id="pam-consultations-tab" data-bs-toggle="tab" data-bs-target="#pam-consultations" type="button" role="tab">
                                            <i className="fa-solid fa-stethoscope me-1"></i> Doctor Reviews (<span id="pam_consultation_count">0</span>)
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content" id="pamTabContent">
                                    <div className="tab-pane fade show active" id="pam-sessions" role="tabpanel">
                                        <div className="table-responsive rounded-3 border" style={{ borderColor: 'var(--border-color)', maxHeight: '320px' }}>
                                            <table className="table table-hover table-striped mb-0 small" id="pam_sessions_table">
                                                <thead className="table-light sticky-top">
                                                    <tr>
                                                        <th>Game</th>
                                                        <th>Score</th>
                                                        <th>Duration</th>
                                                        <th>Played Date &amp; Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td colSpan="4" className="text-center py-3 text-muted">No session records found.</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Modal Sessions Pagination Toolbar */}
                                        <div className="d-flex align-items-center justify-content-between p-2 mt-1 flex-wrap gap-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderRadius: '0.5rem' }}>
                                            <small className="text-sub" id="pam_sessions_page_info">Showing 0 to 0 of 0 sessions</small>
                                            <div className="btn-group btn-group-sm" id="pam_sessions_pagination_btns">
                                                <button className="btn btn-outline-secondary btn-sm" id="pam_sessions_prev_btn" type="button" disabled>
                                                    <i className="fa-solid fa-chevron-left me-1"></i> Prev
                                                </button>
                                                <button className="btn btn-outline-secondary btn-sm" id="pam_sessions_next_btn" type="button" disabled>
                                                    Next <i className="fa-solid fa-chevron-right ms-1"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pam-consultations" role="tabpanel">
                                        <div className="table-responsive rounded-3 border" style={{ borderColor: 'var(--border-color)', maxHeight: '320px' }}>
                                            <table className="table table-hover table-striped mb-0 small" id="pam_consultations_table">
                                                <thead className="table-light sticky-top">
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Doctor</th>
                                                        <th>Compliance</th>
                                                        <th>Prescription</th>
                                                        <th>Clinical Observations &amp; Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td colSpan="5" className="text-center py-3 text-muted">No clinical reviews logged.</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top py-2" style={{ borderColor: 'var(--border-color)' }}>
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clinical Record & Dossier Inspection Modal (Recruiter & Doctor Friendly) */}
                <div className="modal fade" id="recordDetailsModal" tabIndex={-1} aria-labelledby="recordDetailsModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '1rem' }}>
                            <div className="modal-header border-bottom py-3" style={{ borderColor: 'var(--border-color)' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div id="rdm_icon_container" className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                                        <i id="rdm_header_icon" className="fa-solid fa-file-medical fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold text-main mb-0" id="rdm_title">Patient Clinical Dossier</h5>
                                        <small className="text-sub" id="rdm_subtitle">Comprehensive clinical profile &amp; therapy parameters</small>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4" id="rdm_body">
                                {/* Dynamically populated by adminScript.js */}
                            </div>
                            <div className="modal-footer border-top py-2 d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color)' }}>
                                <span className="small text-muted d-none d-sm-inline">
                                    <i className="fa-solid fa-shield-halved text-success me-1"></i> Verified Clinical Record &bull; LazyEye Systems
                                </span>
                                <div className="d-flex gap-2" id="rdm_action_buttons">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                                </div>
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



if (document.getElementById('admin')) {
    // find element by id
    const element = document.getElementById('admin')

    // create new props object with element's data-attributes
    // result: {tsId: "1241"}
    const props = Object.assign({}, element.dataset)

    // render element with props (using spread)
    ReactDOM.render(<AdminDashboard {...props} />, element);
}
