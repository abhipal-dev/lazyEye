import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import {NavLink} from 'react-router-dom';
export default class Table extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            complianceFilter: window.currentComplianceFilter || 'all'
        };
    }

    componentDidMount() {
        window.updateTableFilterUI = (filter) => {
            this.setState({ complianceFilter: filter });
        };
    }

    componentWillUnmount() {
        if (window.updateTableFilterUI) {
            window.updateTableFilterUI = null;
        }
    }

    setFilter = (status) => {
        this.setState({ complianceFilter: status });
        if (window.filterUsersByCompliance) {
            window.filterUsersByCompliance(status);
        }
    };

    render(){
        const role = this.props.currentUser?.accounttype || 'admin';
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');

        return(
            <div className="mb-4">
                {/* Back to Overview & Title Header */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-sm px-3 d-flex align-items-center gap-2 fw-semibold"
                            onClick={() => {
                                if (this.props.onBackToDashboard) {
                                    this.props.onBackToDashboard();
                                } else if (window.switchToAdminDashboard) {
                                    window.switchToAdminDashboard();
                                } else if (window.showDashboard) {
                                    window.showDashboard();
                                }
                            }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Overview</span>
                        </button>
                        <div>
                            <h3 className="fw-bold mb-0 text-main" style={{ fontSize: '1.25rem' }}>
                                {isDoctor ? 'Assigned Clinical Cohort' : 'Database Records & Management'}
                            </h3>
                            <small className="text-sub">Manage patients, clinical staff, and therapy records</small>
                        </div>
                    </div>
                                            {(!this.props.activeCategory || this.props.activeCategory === 'fetchUsers') && (
                            <div className="d-flex align-items-center gap-1 p-1 rounded border font-mono small mt-2 mt-md-0" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', fontSize: '0.78rem' }}>
                                <span className="px-2 text-sub small fw-semibold">Radar:</span>
                                <button 
                                    type="button" 
                                    className={`btn btn-xs ${this.state.complianceFilter === 'all' ? 'btn-secondary text-white' : 'btn-outline-secondary'} compliance-filter-btn all ${this.state.complianceFilter === 'all' ? 'active' : ''} px-2 py-0`} 
                                    onClick={() => this.setFilter('all')}
                                >
                                    All
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-xs ${this.state.complianceFilter === 'compliant' ? 'btn-success text-white' : 'btn-outline-success'} compliance-filter-btn compliant ${this.state.complianceFilter === 'compliant' ? 'active' : ''} px-2 py-0`} 
                                    onClick={() => this.setFilter('compliant')}
                                >
                                    <i className="fa-solid fa-circle-check me-1"></i>Compliant
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-xs ${this.state.complianceFilter === 'needs_review' ? 'btn-warning text-dark' : 'btn-outline-warning'} compliance-filter-btn needs_review ${this.state.complianceFilter === 'needs_review' ? 'active' : ''} px-2 py-0`} 
                                    onClick={() => this.setFilter('needs_review')}
                                >
                                    <i className="fa-solid fa-clock-rotate-left me-1"></i>Review
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-xs ${this.state.complianceFilter === 'at_risk' ? 'btn-danger text-white' : 'btn-outline-danger'} compliance-filter-btn at_risk ${this.state.complianceFilter === 'at_risk' ? 'active' : ''} px-2 py-0`} 
                                    onClick={() => this.setFilter('at_risk')}
                                >
                                    <i className="fa-solid fa-triangle-exclamation me-1"></i>At-Risk
                                </button>
                            </div>
                        )}

                        <div className="d-flex align-items-center gap-2">
                        <span className="badge border font-mono small px-3 py-2 rounded-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                            <i className="fa-solid fa-circle-info me-1"></i> Tip: Click any row to inspect complete clinical dossier
                        </span>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div className="card-header bg-transparent d-flex align-items-center justify-content-between py-3 flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fas fa-table text-main"></i>
                            <span className="fw-semibold text-main">{isDoctor ? 'Assigned Clinical Records' : 'Data Records'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <div className="table-filter-group">
                                <button 
                                    className={`table-filter-btn fetchUsers ${(!this.props.activeCategory || this.props.activeCategory === 'fetchUsers') ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (this.props.onSelectCategory) this.props.onSelectCategory('fetchUsers');
                                        else if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                                    }}
                                >
                                    <i className="fa-solid fa-users me-1"></i>{isDoctor ? 'My Patients' : 'Patients'}
                                </button>
                                {!isDoctor && (
                                    <button 
                                        className={`table-filter-btn fetchDoctors ${this.props.activeCategory === 'fetchDoctors' ? 'active' : ''}`} 
                                        type="button" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (this.props.onSelectCategory) this.props.onSelectCategory('fetchDoctors');
                                            else if (window.switchToAdminTable) window.switchToAdminTable('fetchDoctors');
                                        }}
                                    >
                                        <i className="fa-solid fa-user-doctor me-1"></i>Doctors
                                    </button>
                                )}
                                <button 
                                    className={`table-filter-btn fetchConsultations ${this.props.activeCategory === 'fetchConsultations' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (this.props.onSelectCategory) this.props.onSelectCategory('fetchConsultations');
                                        else if (window.switchToAdminTable) window.switchToAdminTable('fetchConsultations');
                                    }}
                                >
                                    <i className="fa-solid fa-stethoscope me-1"></i>{isDoctor ? 'My Reviews' : 'Clinical Reviews'}
                                </button>
                                {!isDoctor && (
                                    <button 
                                        className={`table-filter-btn fetchAdmins ${this.props.activeCategory === 'fetchAdmins' ? 'active' : ''}`} 
                                        type="button" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (this.props.onSelectCategory) this.props.onSelectCategory('fetchAdmins');
                                            else if (window.switchToAdminTable) window.switchToAdminTable('fetchAdmins');
                                        }}
                                    >
                                        <i className="fa-solid fa-user-shield me-1"></i>Admins
                                    </button>
                                )}
                                {!isDoctor && (
                                    <button 
                                        className={`table-filter-btn fetchRegisters ${this.props.activeCategory === 'fetchRegisters' ? 'active' : ''}`} 
                                        type="button" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (this.props.onSelectCategory) this.props.onSelectCategory('fetchRegisters');
                                            else if (window.switchToAdminTable) window.switchToAdminTable('fetchRegisters');
                                        }}
                                    >
                                        <i className="fa-solid fa-user-plus me-1"></i>Pending
                                    </button>
                                )}
                            </div>
                            <button 
                                className="btn btn-primary btn-sm px-3 shadow-sm d-flex align-items-center gap-1 fw-semibold text-nowrap"
                                data-bs-toggle="modal" 
                                data-bs-target="#createStaffModal"
                            >
                                <i className="fa-solid fa-user-plus"></i>
                                <span>{isDoctor ? 'Enroll Patient' : isRoot ? 'Add User / Staff / Admin' : 'Add User / Doctor'}</span>
                            </button>
                        </div>
                    </div>
                <div className="table-scroll-hint d-none">
                    <i className="fa-solid fa-arrows-left-right me-1"></i> Swipe horizontally to see all columns
                </div>

                {/* Table Live Search & Rows-Per-Page Toolbar */}
                <div className="card-body p-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface-secondary)' }}>
                    <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: 380 }}>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="search" 
                                id="adminTableSearchInput" 
                                className="form-control form-control-sm border-start-0" 
                                placeholder="Search by name, username, email, doctor..." 
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-sub text-nowrap">Show:</span>
                        <select 
                            id="adminTablePageSize" 
                            className="form-select form-select-sm" 
                            style={{ width: 'auto', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                            defaultValue="10"
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="all">All records</option>
                        </select>
                    </div>
                </div>

                <div className="card-body table-responsive p-0">
                    <table id="datatablesSimple" className='table table-hover table-striped mb-0'>
                        <thead className='thead-info'>
                            
                        </thead>
                        <tbody>           
                           
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="card-footer bg-transparent py-3 px-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="small text-sub" id="adminTablePaginationInfo">
                        Showing 0 to 0 of 0 entries
                    </div>
                    <nav aria-label="Table pagination">
                        <ul className="pagination pagination-sm mb-0" id="adminTablePaginationNav">
                            {/* Dynamically populated by adminScript.js */}
                        </ul>
                    </nav>
                </div>
            </div>
            </div>
        );
    }
}


