import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

export default class UserDetailsModal extends React.Component {
    formatLocalDateTime(utcString) {
        if (!utcString) return 'Active';
        try {
            if (window.moment) {
                return window.moment.utc(utcString).local().format('DD MMM YYYY, hh:mm A');
            }
            const d = new Date(utcString.endsWith('Z') ? utcString : utcString + 'Z');
            return d.toLocaleString();
        } catch (e) {
            return utcString;
        }
    }

    render() {
        const data = this.props.data || {};
        const role = data.accounttype || 'user';
        const isPatient = (role === 'user' || role === 'Unpaid User');
        const isAdmin = (role === 'admin' || role === 'root');
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');

        let statusBadge = (
            <span className="badge bg-primary-subtle text-primary small">
                <i className="fa-solid fa-circle-check me-1"></i>Active Patient
            </span>
        );
        if (isRoot) {
            statusBadge = (
                <span className="badge bg-dark-subtle text-dark border small">
                    <i className="fa-solid fa-crown text-warning me-1"></i>Root Superadmin
                </span>
            );
        } else if (isAdmin) {
            statusBadge = (
                <span className="badge bg-danger-subtle text-danger small">
                    <i className="fa-solid fa-user-shield me-1"></i>Clinic Administrator
                </span>
            );
        } else if (isDoctor) {
            statusBadge = (
                <span className="badge bg-info-subtle text-info small">
                    <i className="fa-solid fa-user-doctor me-1"></i>Vision Therapist
                </span>
            );
        }

        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

        return (
            <div className="modal fade" id="userDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="d-flex align-items-center gap-2">
                                <i className="fa-solid fa-id-card text-primary fa-lg"></i>
                                <h5 className="modal-title fw-bold text-main mb-0" id="staticBackdropLabel">
                                    Account Profile &amp; Clinical Details
                                </h5>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="row g-4">
                                {/* Left Column: Avatar & Role Summary */}
                                <div className="col-12 col-lg-4">
                                    <div className="card shadow-sm border h-100 p-3" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                                        <div className="card-body p-2 d-flex flex-column align-items-center text-center">
                                            <div className="position-relative mb-3">
                                                <img 
                                                    src={(data.image_address) ? `/storage/images/${data.image_address}` : '/images/lazyeye-icon.svg'} 
                                                    alt="Avatar" 
                                                    className="rounded-circle border p-1 shadow-sm" 
                                                    width="120" 
                                                    height="120" 
                                                    style={{ objectFit: 'cover', borderColor: 'var(--border-color)' }}
                                                />
                                            </div>

                                            <h4 className="fw-bold mb-1 text-main">{data.fullname || 'Anonymous'}</h4>
                                            <p className="text-muted small mb-3">@{data.username}</p>

                                            <div className="mb-3">
                                                {statusBadge}
                                            </div>

                                            <button 
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 mb-3 w-100" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#uploadImageModal"
                                            >
                                                <i className="fa-solid fa-camera me-1"></i> Update Avatar
                                            </button>

                                            {/* Role Attributes List */}
                                             <div className="w-100 border-top pt-3 text-start small" style={{ borderColor: 'var(--border-color)' }}>
                                                <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                                    <span className="text-sub fw-medium"><i className="fa-solid fa-hashtag me-2 text-primary"></i>Account ID</span>
                                                    <strong className="text-main">#{data.id}</strong>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                                    <span className="text-sub fw-medium"><i className="fa-solid fa-venus-mars me-2 text-info"></i>Gender</span>
                                                    <strong className="text-main">{data.gender || 'Not specified'}</strong>
                                                </div>

                                                {isPatient ? (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-clock me-2 text-warning"></i>Daily Target</span>
                                                            <strong className="text-primary">{data.user_playing_time || 20} mins/day</strong>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center py-2" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-user-doctor me-2 text-info"></i>Assigned Doctor</span>
                                                            <strong className="text-main">{data.doctor_name || 'Dr. Sameer Arora'}</strong>
                                                        </div>
                                                    </>
                                                ) : isDoctor ? (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-briefcase me-2 text-info"></i>Scope</span>
                                                            <strong className="text-info">Optometry Clinic</strong>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center py-2" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-stethoscope me-2 text-success"></i>License</span>
                                                            <span className="badge bg-success-subtle text-success">Clinical Access</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-shield-halved me-2 text-danger"></i>Authority</span>
                                                            <strong className="text-danger">Full System Access</strong>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center py-2" style={{ borderColor: 'var(--border-color)' }}>
                                                            <span className="text-sub fw-medium"><i className="fa-solid fa-lock me-2 text-primary"></i>Security Tier</span>
                                                            <span className="badge bg-danger-subtle text-danger">Administrative</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Core Account Details & Timestamps */}
                                <div className="col-12 col-lg-8">
                                    <div className="card shadow-sm border p-4 mb-4" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                                            <h6 className="fw-bold text-main mb-0">
                                                <i className="fa-solid fa-circle-info text-primary me-2"></i>Primary Identity Details
                                            </h6>
                                            <span className="badge bg-secondary-subtle text-secondary small">
                                                <i className="fa-solid fa-globe me-1"></i>TZ: {userTimezone}
                                            </span>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">Full Legal Name</label>
                                                <div className="p-2 rounded fw-semibold text-main border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    {data.fullname || '—'}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">System Username</label>
                                                <div className="p-2 rounded fw-semibold text-main border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    {data.username || '—'}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">Official Email Address</label>
                                                <div className="p-2 rounded text-main border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    {data.email || '—'}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">Assigned Role</label>
                                                <div className="p-2 rounded text-main border text-capitalize" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    {role}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">Account Created (Converted from UTC)</label>
                                                <div className="p-2 rounded text-main border small" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    <i className="fa-regular fa-calendar me-1 text-primary"></i>
                                                    {this.formatLocalDateTime(data.created_at)}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <label className="text-sub small fw-semibold d-block mb-1">Last System Update (Converted from UTC)</label>
                                                <div className="p-2 rounded text-main border small" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                                                    <i className="fa-regular fa-clock me-1 text-info"></i>
                                                    {this.formatLocalDateTime(data.updated_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lower Box: Eye Filters if Patient OR Administrative Privileges if Staff */}
                                    {isPatient ? (
                                        <div className="row g-3">
                                            <div className="col-12 col-sm-6">
                                                <div className="card shadow-sm border p-3 h-100" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                                                    <h6 className="fw-bold text-main mb-3">
                                                        <i className="fa-solid fa-eye text-danger me-2"></i>Left Eye (Therapy)
                                                    </h6>
                                                    <div className="d-flex justify-content-between align-items-center mb-2 small">
                                                        <span className="text-sub">Filter Color:</span>
                                                        <strong className="text-main">{data.left_eye_color || 'red'}</strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mb-2 small">
                                                        <span className="text-sub">Contrast Color:</span>
                                                        <span className="badge px-2 py-1" style={{ backgroundColor: data.left_eye_contrast_color || '#ff0000', color: '#fff' }}>
                                                            {data.left_eye_contrast_color || '#ff0000'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="d-flex justify-content-between small text-sub mb-1">
                                                            <span>Stimulus Strength</span>
                                                            <strong className="text-main">{Math.round((data.left_eye_contrastvalue || 255) * 100 / 255)}%</strong>
                                                        </div>
                                                        <div className="progress" style={{ height: '6px' }}>
                                                            <div className="progress-bar bg-danger" style={{ width: (data.left_eye_contrastvalue || 255) * 100 / 255 + '%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6">
                                                <div className="card shadow-sm border p-3 h-100" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                                                    <h6 className="fw-bold text-main mb-3">
                                                        <i className="fa-solid fa-eye text-info me-2"></i>Right Eye (Fellow)
                                                    </h6>
                                                    <div className="d-flex justify-content-between align-items-center mb-2 small">
                                                        <span className="text-sub">Filter Color:</span>
                                                        <strong className="text-main">{data.right_eye_color || 'cyan'}</strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mb-2 small">
                                                        <span className="text-sub">Contrast Color:</span>
                                                        <span className="badge px-2 py-1" style={{ backgroundColor: data.right_eye_contrast_color || '#00ffff', color: '#000' }}>
                                                            {data.right_eye_contrast_color || '#00ffff'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="d-flex justify-content-between small text-sub mb-1">
                                                            <span>Fellow Attenuation</span>
                                                            <strong className="text-main">{Math.round((data.right_eye_contrastvalue || 255) * 100 / 255)}%</strong>
                                                        </div>
                                                        <div className="progress" style={{ height: '6px' }}>
                                                            <div className="progress-bar bg-info" style={{ width: (data.right_eye_contrastvalue || 255) * 100 / 255 + '%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card shadow-sm border p-3" style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)' }}>
                                            <h6 className="fw-bold text-main mb-3">
                                                <i className="fa-solid fa-key text-success me-2"></i>System Capabilities &amp; Access Roles
                                            </h6>
                                            <div className="row g-2 small">
                                                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-circle-check text-success"></i>
                                                    <span className="fw-medium text-main">{isAdmin ? 'Staff Onboarding & Role Promotion' : 'View Assigned Patient Records'}</span>
                                                </div>
                                                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-circle-check text-success"></i>
                                                    <span className="fw-medium text-main">{isAdmin ? 'Pending Registrations Approval' : 'Conduct Clinical Consultations'}</span>
                                                </div>
                                                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-circle-check text-success"></i>
                                                    <span className="fw-medium text-main">{isAdmin ? 'System-Wide KPI Analytics & Audits' : 'Calibrate Target Prescription Minutes'}</span>
                                                </div>
                                                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-circle-check text-success"></i>
                                                    <span className="fw-medium text-main">{isAdmin ? 'Direct Doctor-to-Patient Assignment' : 'Dichoptic Therapy Simulation View'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color)' }}>
                            <span className="small text-muted">
                                <i className="fa-solid fa-clock me-1"></i>Server Time: UTC | Rendered in Local Timezone
                            </span>
                            <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
