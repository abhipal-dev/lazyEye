import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import {NavLink} from 'react-router-dom';
export default class Table extends React.Component{
    render(){
        return(
            <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <div className="card-header bg-transparent d-flex align-items-center justify-content-between py-3 flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-table text-primary"></i>
                        <span className="fw-semibold text-main">Data Records</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="table-filter-group">
                            <button className="table-filter-btn fetchUsers active" type="button" onClick={() => window.fetchUsers && window.fetchUsers()}>
                                <i className="fa-solid fa-users me-1 text-primary"></i>Patients
                            </button>
                            <button className="table-filter-btn fetchDoctors" type="button" onClick={() => window.fetchDoctors && window.fetchDoctors()}>
                                <i className="fa-solid fa-user-doctor me-1 text-info"></i>Doctors
                            </button>
                            <button className="table-filter-btn fetchConsultations" type="button" onClick={() => window.fetchConsultations && window.fetchConsultations()}>
                                <i className="fa-solid fa-stethoscope me-1 text-danger"></i>Clinical Reviews
                            </button>
                            <button className="table-filter-btn fetchAdmins" type="button" onClick={() => window.fetchAdmins && window.fetchAdmins()}>
                                <i className="fa-solid fa-user-shield me-1 text-success"></i>Admins
                            </button>
                            <button className="table-filter-btn fetchRegisters" type="button" onClick={() => window.fetchRegisters && window.fetchRegisters()}>
                                <i className="fa-solid fa-user-plus me-1 text-warning"></i>Pending
                            </button>
                        </div>
                        <button 
                            className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-semibold text-nowrap"
                            data-bs-toggle="modal" 
                            data-bs-target="#createStaffModal"
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            <span>Add User / Doctor</span>
                        </button>
                    </div>
                </div>
                <div className="table-scroll-hint d-none">
                    <i className="fa-solid fa-arrows-left-right me-1"></i> Swipe horizontally to see all columns
                </div>
                <div className="card-body table-responsive p-0">
                    <table id="datatablesSimple" className='table table-hover table-striped mb-0'>
                        <thead className='thead-info'>
                            
                        </thead>
                        <tbody>           
                           
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


