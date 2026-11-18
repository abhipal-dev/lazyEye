import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: {
                total_patients: 8,
                total_doctors: 2,
                total_admins: 4,
                pending_registers: 4,
                compliance_rate: 92.4,
                avg_training_time: 20.0,
                total_consultations: 7,
                weekly_sessions: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    data: [32, 48, 54, 62, 58, 70, 42]
                },
                game_distribution: {
                    'Tetris': 52,
                    'Snake': 46,
                    'Bubble Shooter': 34,
                    'Ping Pong': 26
                },
                compliance_radar: {
                    total_cohort: 8,
                    compliant_count: 5,
                    needs_review_count: 2,
                    at_risk_count: 1
                }
            },
            leftContrast: 65,
            rightContrast: 85,
            activePreset: 'moderate',
            loading: true
        };
    }

    setPreset = (preset) => {
        if (preset === 'mild') {
            this.setState({ leftContrast: 85, rightContrast: 70, activePreset: 'mild' });
        } else if (preset === 'moderate') {
            this.setState({ leftContrast: 65, rightContrast: 85, activePreset: 'moderate' });
        } else if (preset === 'severe') {
            this.setState({ leftContrast: 40, rightContrast: 95, activePreset: 'severe' });
        }
    };

    componentDidMount() {
        this.fetchStats();
    }

    fetchStats = () => {
        $.ajax({
            url: "/fetchDashboardStats",
            type: "get",
            success: (data) => {
                if (data) {
                    this.setState({
                        stats: Object.assign({}, this.state.stats, data),
                        loading: false
                    });
                }
            },
            error: () => {
                this.setState({ loading: false });
            }
        });
    };

    handleSeedDemoData = () => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Initialize Clinical Records?',
                text: 'This will seed verified doctors, patients, pending registrations, and recent therapy logs.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, Populate Data'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post("/seedDemoData", () => {
                        Swal.fire('Success!', 'Clinical demo records successfully initialized.', 'success');
                        this.fetchStats();
                    });
                }
            });
        } else {
            if (confirm('Initialize clinical demo records?')) {
                $.post("/seedDemoData", () => {
                    alert('Clinical demo records initialized!');
                    this.fetchStats();
                });
            }
        }
    };

    render() {
        const { stats, leftContrast, rightContrast } = this.state;
        const role = this.props.currentUser?.accounttype || stats.role || 'admin';
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');
        const currentName = this.props.currentUser?.fullname || (isDoctor ? 'Dr. Sameer Arora' : 'Clinic Operations');

        // Cohort Metrics
        const totalCohort = stats.compliance_radar?.total_cohort || stats.total_patients || 8;
        const atRiskCount = stats.compliance_radar?.at_risk_count || 1;
        const complianceRate = stats.compliance_rate || 88;

        // Spline Chart Points for Weekly Clinical Adherence
        const splineData = [
            { day: 'Mon', val: 48.5 },
            { day: 'Tue', val: 78.5 },
            { day: 'Wed', val: 83.0 },
            { day: 'Thu', val: 97.2 },
            { day: 'Fri', val: 85.7 },
            { day: 'Sat', val: 65.0 },
            { day: 'Sun', val: 39.0 }
        ];

        return (
            <div className="lazyeye-bento-dashboard mb-4">
                {/* Header & Quick Action Row */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4 mb-4">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge px-2 py-1 rounded-2 text-primary" style={{ backgroundColor: 'rgba(56, 139, 253, 0.15)', border: '1px solid rgba(56, 139, 253, 0.3)', fontSize: '0.75rem', fontWeight: 600 }}>
                                <i className="fa-solid fa-circle-dot text-success me-1"></i> Live Telemetry
                            </span>
                            <span className="text-sub small">LazyEye Clinical Platform v2.4</span>
                        </div>
                        <h2 className="fw-bold mb-1 text-main">
                            {isDoctor ? (
                                <><i className="fa-solid fa-stethoscope text-primary me-2"></i>Pediatric Vision Therapy Suite</>
                            ) : (
                                <><i className="fa-solid fa-cubes-stacked text-primary me-2"></i>Clinic Operations Command</>
                            )}
                        </h2>
                        <p className="text-sub small mb-0">
                            {isDoctor ? (
                                <>Welcome back, <strong>{currentName}</strong> &bull; Binocular fusion progression and amblyopia scotoma tracking</>
                            ) : (
                                <>Clinic management &bull; <strong>{currentName}</strong> &bull; Active cohorts, optometrist staff, and triage queues</>
                            )}
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        {isDoctor ? (
                            <>
                                <button 
                                    className="btn btn-sm btn-outline-danger px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#logConsultationModal"
                                >
                                    <i className="fa-solid fa-stethoscope"></i> Log Review
                                </button>
                                <button 
                                    className="btn btn-sm btn-primary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#createStaffModal"
                                    style={{ background: 'linear-gradient(135deg, #1f6feb 0%, #238636 100%)', border: 'none' }}
                                >
                                    <i className="fa-solid fa-user-plus"></i> Enroll Patient
                                </button>
                            </>
                        ) : (
                            <button 
                                className="btn btn-sm btn-primary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                data-bs-toggle="modal" 
                                data-bs-target="#createStaffModal"
                                style={{ background: 'linear-gradient(135deg, #1f6feb 0%, #238636 100%)', border: 'none' }}
                            >
                                <i className="fa-solid fa-user-plus"></i> {isRoot ? 'Add Staff / Doctor' : 'Add User / Doctor'}
                            </button>
                        )}
                        <a 
                            href="/user" 
                            className="btn btn-sm btn-secondary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                            style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                        >
                            <i className="fa-solid fa-gamepad"></i> Therapy Simulation
                        </a>
                    </div>
                </div>

                {/* ========================================================
                    BENTO METRICS ROW: Live Registry & Clinical Staff Hub
                    ======================================================== */}
                <div className="row g-3 mb-4">
                    {/* Active Patients */}
                    <div className="col-6 col-lg-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px' }}
                            onClick={() => {
                                if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchUsers');
                                else if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small text-uppercase tracking-wider fw-bold text-sub font-mono" style={{ fontSize: '0.72rem' }}>
                                    {isDoctor ? 'My Patients' : 'Active Patients'}
                                </span>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-primary" style={{ width: 28, height: 28, backgroundColor: 'rgba(56, 139, 253, 0.15)' }}>
                                    <i className="fa-solid fa-users" style={{ fontSize: '0.75rem' }}></i>
                                </span>
                            </div>
                            <h3 className="fw-black mb-1 text-main font-mono">{stats.total_patients || 0}</h3>
                            <div className="d-flex align-items-center justify-content-between small text-sub" style={{ fontSize: '0.78rem' }}>
                                <span>Prescribed Cohort</span>
                                <span className="text-primary fw-semibold">View List &rarr;</span>
                            </div>
                        </div>
                    </div>

                    {/* Doctors & Staff */}
                    <div className="col-6 col-lg-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px' }}
                            onClick={() => {
                                if (!isDoctor) {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchDoctors');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchDoctors');
                                }
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small text-uppercase tracking-wider fw-bold text-sub font-mono" style={{ fontSize: '0.72rem' }}>
                                    Doctors &amp; Staff
                                </span>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-info" style={{ width: 28, height: 28, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
                                    <i className="fa-solid fa-user-doctor" style={{ fontSize: '0.75rem' }}></i>
                                </span>
                            </div>
                            <h3 className="fw-black mb-1 text-main font-mono">{stats.total_doctors || 0}</h3>
                            <div className="d-flex align-items-center justify-content-between small text-sub" style={{ fontSize: '0.78rem' }}>
                                <span>Certified Vision Staff</span>
                                <span className="text-info fw-semibold">{isDoctor ? 'Active' : 'View Staff \u2192'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Reviews */}
                    <div className="col-6 col-lg-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px' }}
                            onClick={() => {
                                if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchConsultations');
                                else if (window.switchToAdminTable) window.switchToAdminTable('fetchConsultations');
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small text-uppercase tracking-wider fw-bold text-sub font-mono" style={{ fontSize: '0.72rem' }}>
                                    {isDoctor ? 'My Reviews' : 'Clinical Reviews'}
                                </span>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-danger" style={{ width: 28, height: 28, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                                    <i className="fa-solid fa-stethoscope" style={{ fontSize: '0.75rem' }}></i>
                                </span>
                            </div>
                            <h3 className="fw-black mb-1 text-main font-mono">{stats.total_consultations || 0}</h3>
                            <div className="d-flex align-items-center justify-content-between small text-sub" style={{ fontSize: '0.78rem' }}>
                                <span>Doctor Assessments</span>
                                <span className="text-danger fw-semibold">View Reviews &rarr;</span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Registrations (or Protocol for Doctor) */}
                    <div className="col-6 col-lg-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px' }}
                            onClick={() => {
                                if (!isDoctor) {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchRegisters');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchRegisters');
                                }
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small text-uppercase tracking-wider fw-bold text-sub font-mono" style={{ fontSize: '0.72rem' }}>
                                    {isDoctor ? 'Protocol Target' : 'Pending Registrations'}
                                </span>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-warning" style={{ width: 28, height: 28, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                                    <i className={`fa-solid ${isDoctor ? 'fa-bullseye' : 'fa-user-clock'}`} style={{ fontSize: '0.75rem' }}></i>
                                </span>
                            </div>
                            <h3 className="fw-black mb-1 text-main font-mono">
                                {isDoctor ? `${stats.avg_training_time || 20}m` : (stats.pending_registers || 0)}
                            </h3>
                            <div className="d-flex align-items-center justify-content-between small text-sub" style={{ fontSize: '0.78rem' }}>
                                <span>{isDoctor ? 'Daily Target' : 'Requires Review'}</span>
                                <span className="text-warning fw-semibold">{isDoctor ? 'Standard' : 'Review \u2192'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    BENTO GRID ROW 1: Hero Fusion Arc & At-Risk Triage Queue
                    ======================================================== */}
                <div className="row g-3 mb-4">
                    {/* BENTO CARD 1: Hero Cohort Fusion Index (7 Cols) */}
                    <div className="col-12 col-xl-7">
                        <div 
                            className="card border-0 shadow-sm h-100 p-4 position-relative overflow-hidden" 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '16px',
                                background: 'radial-gradient(circle at 10% 20%, rgba(31, 111, 235, 0.08) 0%, var(--bg-card) 60%)'
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                                <div>
                                    <span className="small text-uppercase tracking-wider fw-bold text-primary font-mono">Clinical Recovery Index</span>
                                    <h4 className="fw-bold mb-0 text-main">Cohort Fusion Index</h4>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge px-3 py-2 rounded-pill font-mono" style={{ backgroundColor: 'rgba(56, 139, 253, 0.15)', color: '#58A6FF', border: '1px solid rgba(56, 139, 253, 0.3)', fontSize: '0.8rem' }}>
                                        {totalCohort} Active Patients
                                    </span>
                                    <button 
                                        type="button" 
                                        className="btn btn-sm px-3 py-1 rounded-pill fw-bold text-dark"
                                        style={{ backgroundColor: '#F59E0B', border: 'none', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)' }}
                                        onClick={() => {
                                            if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                                            setTimeout(() => {
                                                if (window.filterUsersByCompliance) window.filterUsersByCompliance('at_risk');
                                            }, 100);
                                        }}
                                    >
                                        Review {atRiskCount} At-Risk &rarr;
                                    </button>
                                </div>
                            </div>

                            {/* Circular Radial Fusion Gauge */}
                            <div className="row align-items-center my-auto py-2">
                                <div className="col-12 col-md-5 text-center position-relative">
                                    <svg viewBox="0 0 200 130" style={{ width: '100%', maxWidth: '220px' }}>
                                        {/* Background Track Arc */}
                                        <path 
                                            d="M 25 110 A 75 75 0 0 1 175 110" 
                                            fill="none" 
                                            stroke="rgba(255, 255, 255, 0.08)" 
                                            strokeWidth="14" 
                                            strokeLinecap="round" 
                                        />
                                        {/* Glowing Progress Arc */}
                                        <path 
                                            d="M 25 110 A 75 75 0 0 1 175 110" 
                                            fill="none" 
                                            stroke="url(#fusionArcGradient)" 
                                            strokeWidth="14" 
                                            strokeDasharray="235.6" 
                                            strokeDashoffset="30" 
                                            strokeLinecap="round" 
                                        />
                                        <defs>
                                            <linearGradient id="fusionArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#06B6D4" />
                                                <stop offset="50%" stopColor="#3B82F6" />
                                                <stop offset="100%" stopColor="#10B981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div style={{ marginTop: '-42px' }}>
                                        <h1 className="fw-black mb-0 text-main tabular-nums" style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}>{complianceRate}%</h1>
                                        <div className="small text-sub fw-semibold">Binocular Fusion Progression</div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-7 mt-3 mt-md-0">
                                    <div className="p-3 rounded-3 mb-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between small mb-1">
                                            <span className="text-sub">Suppression Scotoma Reduction</span>
                                            <span className="text-success fw-bold font-mono">+38.4% improvement</span>
                                        </div>
                                        <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                                            <div className="progress-bar bg-success" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex align-items-center justify-content-between small mb-1">
                                            <span className="text-sub">Daily Therapy Adherence Target</span>
                                            <span className="text-primary fw-bold font-mono">20m / session</span>
                                        </div>
                                        <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                                            <div className="progress-bar" style={{ width: '68%', background: 'linear-gradient(90deg, #1f6feb, #38bdf8)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between small text-sub pt-3 border-top mt-3" style={{ borderColor: 'var(--border-color)' }}>
                                <span><i className="fa-solid fa-shield-halved text-success me-1"></i> Continuous interocular suppression scotoma tracking active</span>
                                <span className="text-main fw-semibold cursor-pointer" onClick={() => window.switchToAdminTable && window.switchToAdminTable('fetchUsers')}>
                                    Full Cohort List &rarr;
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BENTO CARD 2: At-Risk Patient Queue (5 Cols) */}
                    <div className="col-12 col-xl-5">
                        <div 
                            className="card border-0 shadow-sm h-100 p-4" 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '16px' 
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <span className="small text-uppercase tracking-wider fw-bold text-danger font-mono">Triage Interventions</span>
                                    <h5 className="fw-bold mb-0 text-main">At-Risk Patient Queue</h5>
                                </div>
                                <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill font-mono">
                                    3 Lapsed
                                </span>
                            </div>

                            {/* Patient Triage List */}
                            <div className="d-flex flex-column gap-2 my-auto">
                                {/* Patient 1 */}
                                <div className="p-2 p-md-3 rounded-3 d-flex align-items-center justify-content-between gap-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 36, height: 36, minWidth: 36, backgroundColor: '#f97316', fontSize: '0.85rem' }}>
                                            LM
                                        </div>
                                        <div>
                                            <div className="fw-bold text-main" style={{ fontSize: '0.88rem' }}>Leo M., 7yo</div>
                                            <small className="text-danger font-mono" style={{ fontSize: '0.74rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation me-1"></i>3 missed therapy sessions
                                            </small>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-primary px-2 py-1 rounded-2 fw-semibold"
                                        style={{ fontSize: '0.76rem', backgroundColor: '#1f6feb', border: 'none' }}
                                        onClick={() => alert('Adherence reminder sent to Leo M. parent.')}
                                    >
                                        Contact
                                    </button>
                                </div>

                                {/* Patient 2 */}
                                <div className="p-2 p-md-3 rounded-3 d-flex align-items-center justify-content-between gap-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 36, height: 36, minWidth: 36, backgroundColor: '#a855f7', fontSize: '0.85rem' }}>
                                            SK
                                        </div>
                                        <div>
                                            <div className="fw-bold text-main" style={{ fontSize: '0.88rem' }}>Sophia K., 5yo</div>
                                            <small className="text-danger font-mono" style={{ fontSize: '0.74rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation me-1"></i>3 missed therapy sessions
                                            </small>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-primary px-2 py-1 rounded-2 fw-semibold"
                                        style={{ fontSize: '0.76rem', backgroundColor: '#1f6feb', border: 'none' }}
                                        onClick={() => alert('Adherence reminder sent to Sophia K. parent.')}
                                    >
                                        Contact
                                    </button>
                                </div>

                                {/* Patient 3: Puneet Kushwaha (#18) */}
                                <div className="p-2 p-md-3 rounded-3 d-flex align-items-center justify-content-between gap-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 36, height: 36, minWidth: 36, backgroundColor: '#ef4444', fontSize: '0.85rem' }}>
                                            PK
                                        </div>
                                        <div>
                                            <div className="fw-bold text-main" style={{ fontSize: '0.88rem' }}>Puneet K. (#18)</div>
                                            <small className="text-danger font-mono" style={{ fontSize: '0.74rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation me-1"></i>Inactive &gt; 7 days (At-Risk)
                                            </small>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-primary px-2 py-1 rounded-2 fw-semibold"
                                        style={{ fontSize: '0.76rem', backgroundColor: '#1f6feb', border: 'none' }}
                                        onClick={() => {
                                            if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                                            setTimeout(() => {
                                                if (window.filterUsersByCompliance) window.filterUsersByCompliance('at_risk');
                                            }, 100);
                                        }}
                                    >
                                        Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    BENTO GRID ROW 2: Dichoptic Telemetry & Prescribed Engines
                    ======================================================== */}
                <div className="row g-3 mb-4">
                    {/* BENTO CARD 3: Dichoptic Anaglyph Telemetry (6 Cols) */}
                    <div className="col-12 col-lg-6">
                        <div 
                            className="card border-0 shadow-sm h-100 p-4" 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '16px' 
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="small text-uppercase tracking-wider fw-bold text-primary font-mono">Optical Calibration</span>
                                        <span className="badge bg-primary-subtle text-primary font-mono" style={{ fontSize: '0.7rem' }}>Anti-Suppression</span>
                                    </div>
                                    <h5 className="fw-bold mb-0 text-main">Dichoptic Anaglyph Telemetry</h5>
                                    <small className="text-sub">Balances contrast attenuation between dominant &amp; amblyopic eyes</small>
                                </div>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-primary" style={{ width: 34, height: 34, backgroundColor: 'rgba(56, 139, 253, 0.15)' }}>
                                    <i className="fa-solid fa-glasses"></i>
                                </span>
                            </div>

                            {/* Clinical Presets Bar */}
                            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                                <span className="small text-sub font-mono me-1" style={{ fontSize: '0.74rem' }}>Clinical Presets:</span>
                                <button
                                    type="button"
                                    onClick={() => this.setPreset('mild')}
                                    className={`btn btn-xs rounded-pill px-2 py-1 font-mono fw-semibold ${this.state.activePreset === 'mild' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '0.72rem' }}
                                >
                                    Mild (85% / 70%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => this.setPreset('moderate')}
                                    className={`btn btn-xs rounded-pill px-2 py-1 font-mono fw-semibold ${this.state.activePreset === 'moderate' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '0.72rem' }}
                                >
                                    Standard (65% / 85%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => this.setPreset('severe')}
                                    className={`btn btn-xs rounded-pill px-2 py-1 font-mono fw-semibold ${this.state.activePreset === 'severe' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '0.72rem' }}
                                >
                                    Severe (40% / 95%)
                                </button>
                            </div>

                            {/* Dual Channel Sliders Visualizer */}
                            <div className="d-flex flex-column gap-3 my-auto py-1">
                                {/* Left Eye Channel */}
                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold text-danger">
                                            <i className="fa-solid fa-eye me-1"></i> Left Eye (Red Filter &bull; Non-Dominant)
                                        </span>
                                        <span className="fw-bold text-main font-mono">{leftContrast}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                                        <div 
                                            className="progress-bar" 
                                            style={{ 
                                                width: `${leftContrast}%`, 
                                                background: 'linear-gradient(90deg, #dc2626, #ef4444)', 
                                                borderRadius: '6px',
                                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
                                                transition: 'width 0.4s ease'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Right Eye Channel */}
                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold" style={{ color: '#06b6d4' }}>
                                            <i className="fa-solid fa-eye me-1"></i> Right Eye (Cyan Filter &bull; Dominant Attenuation)
                                        </span>
                                        <span className="fw-bold text-main font-mono">{rightContrast}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                                        <div 
                                            className="progress-bar" 
                                            style={{ 
                                                width: `${rightContrast}%`, 
                                                background: 'linear-gradient(90deg, #0284c7, #06b6d4)', 
                                                borderRadius: '6px',
                                                boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)',
                                                transition: 'width 0.4s ease'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Suppression Index Readout */}
                                <div className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)' }}>
                                    <span className="small text-sub">Cortical Suppression Index:</span>
                                    {Math.abs(leftContrast - rightContrast) <= 15 ? (
                                        <span className="badge bg-success-subtle text-success font-mono fw-semibold">Balanced &bull; Zero Diplopia</span>
                                    ) : Math.abs(leftContrast - rightContrast) <= 30 ? (
                                        <span className="badge bg-info-subtle text-info font-mono fw-semibold">Anti-Suppression Active &bull; Binocular Fusion</span>
                                    ) : (
                                        <span className="badge bg-warning-subtle text-warning font-mono fw-semibold">Deep Scotoma Attenuation &bull; Rebalancing</span>
                                    )}
                                </div>

                                <div className="d-flex align-items-center justify-content-between small pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span className="text-sub font-mono" style={{ fontSize: '0.74rem' }}>
                                        <i className="fa-solid fa-circle-info text-primary me-1"></i>Forces cortical visual cortex to integrate both eyes
                                    </span>
                                    <a href="/games" className="btn btn-xs btn-outline-primary py-0 px-2 fw-semibold font-mono" style={{ fontSize: '0.72rem' }}>
                                        Test Anaglyph &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BENTO CARD 4: Most Prescribed Therapy Engines (6 Cols) */}
                    <div className="col-12 col-lg-6">
                        <div 
                            className="card border-0 shadow-sm h-100 p-4" 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '16px' 
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <span className="small text-uppercase tracking-wider fw-bold text-primary font-mono">Pediatric Engagement</span>
                                    <h5 className="fw-bold mb-0 text-main">Most Prescribed Therapy Engines</h5>
                                    <small className="text-sub">Cumulative therapeutic playtime hours across cohort</small>
                                </div>
                                <span className="badge rounded-circle p-2 d-flex align-items-center justify-content-center text-primary" style={{ width: 32, height: 32, backgroundColor: 'rgba(56, 139, 253, 0.15)' }}>
                                    <i className="fa-solid fa-gamepad"></i>
                                </span>
                            </div>

                            {/* Game Progress Bars */}
                            <div className="d-flex flex-column gap-3 my-auto py-1">
                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold text-main">Tetris (Dichoptic Blocks)</span>
                                        <span className="text-sub font-mono">16 hours &bull; Top Performer</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                                        <div className="progress-bar" style={{ width: '85%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold text-main">Snake (Binocular Path)</span>
                                        <span className="text-sub font-mono">12 hours</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                                        <div className="progress-bar" style={{ width: '65%', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold text-main">Bubble Shooter (Scotoma Burst)</span>
                                        <span className="text-sub font-mono">8 hours</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                                        <div className="progress-bar" style={{ width: '45%', background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center justify-content-between small mb-1">
                                        <span className="fw-semibold text-main">Ping Pong (Dynamic Vergence)</span>
                                        <span className="text-sub font-mono">5 hours</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                                        <div className="progress-bar" style={{ width: '30%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    BENTO GRID ROW 3: Weekly Clinical Adherence Spline Chart
                    ======================================================== */}
                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <div 
                            className="card border-0 shadow-sm p-4" 
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '16px' 
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="small text-uppercase tracking-wider fw-bold text-success font-mono">Session Volume Telemetry</span>
                                        <span className="badge bg-success-subtle text-success font-mono" style={{ fontSize: '0.7rem' }}>Cohort Average</span>
                                    </div>
                                    <h5 className="fw-bold mb-0 text-main">Weekly Clinical Adherence</h5>
                                    <small className="text-sub">Daily therapeutic session volume across assigned patient cohort</small>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-warning-subtle text-warning py-1 px-2 font-mono rounded-pill" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa-solid fa-bullseye me-1"></i>Target 70%
                                    </span>
                                    <span className="badge bg-success-subtle text-success py-1 px-3 fw-bold font-mono rounded-pill" style={{ fontSize: '0.78rem' }}>
                                        <i className="fa-solid fa-arrow-trend-up me-1"></i>+16.4% this week
                                    </span>
                                </div>
                            </div>

                            {/* Clean Responsive Mathematically Aligned SVG Spline Chart */}
                            <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                                <svg viewBox="0 0 700 120" style={{ width: '100%', height: '100%', display: 'block' }}>
                                    <defs>
                                        <linearGradient id="splineGradientCyan" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                                            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.12" />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                                        </linearGradient>
                                        <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Subtle Horizontal Grid Lines */}
                                    <line x1="50" y1="20" x2="650" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                                    <line x1="50" y1="60" x2="650" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                                    <line x1="50" y1="105" x2="650" y2="105" stroke="rgba(255,255,255,0.08)" />

                                    {/* Clinical Target Line (70% = y: 45) */}
                                    <line x1="50" y1="45" x2="650" y2="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,5" strokeOpacity="0.5" />
                                    <text x="645" y="40" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace" opacity="0.8">Target 70%</text>

                                    {/* Spline Area Fill (Passing through all 7 coordinates) */}
                                    <path 
                                        d="M 50,56.2 C 100,56.2 100,32.2 150,32.2 C 200,32.2 200,28.6 250,28.6 C 300,28.6 300,17.2 350,17.2 C 400,17.2 400,26.4 450,26.4 C 500,26.4 500,43.0 550,43.0 C 600,43.0 600,63.8 650,63.8 L 650,105 L 50,105 Z" 
                                        fill="url(#splineGradientCyan)" 
                                    />

                                    {/* Primary Spline Line */}
                                    <path 
                                        d="M 50,56.2 C 100,56.2 100,32.2 150,32.2 C 200,32.2 200,28.6 250,28.6 C 300,28.6 300,17.2 350,17.2 C 400,17.2 400,26.4 450,26.4 C 500,26.4 500,43.0 550,43.0 C 600,43.0 600,63.8 650,63.8" 
                                        fill="none" 
                                        stroke="#06b6d4" 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                        filter="url(#splineGlow)"
                                    />

                                    {/* 7 Aligned Data Node Circles */}
                                    {[
                                        { x: 50, y: 56.2, val: 48.5 },
                                        { x: 150, y: 32.2, val: 78.5 },
                                        { x: 250, y: 28.6, val: 83.0 },
                                        { x: 350, y: 17.2, val: 97.2 },
                                        { x: 450, y: 26.4, val: 85.7 },
                                        { x: 550, y: 43.0, val: 65.0 },
                                        { x: 650, y: 63.8, val: 39.0 }
                                    ].map((pt, idx) => (
                                        <g key={idx}>
                                            <circle cx={pt.x} cy={pt.y} r="5" fill="#0D1117" stroke="#06b6d4" strokeWidth="2.5" />
                                            <circle cx={pt.x} cy={pt.y} r="2" fill="#38bdf8" />
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            {/* Spline X-Axis 7 Columns Aligned Directly with Nodes */}
                            <div className="d-flex justify-content-between text-sub small font-mono mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)', fontSize: '0.8rem' }}>
                                {splineData.map((d, i) => (
                                    <div key={i} className="text-center" style={{ flex: 1 }}>
                                        <div className="fw-bold text-main" style={{ fontSize: '0.82rem' }}>{d.day}</div>
                                        <span 
                                            className={`badge rounded-pill font-mono mt-1 ${d.val >= 70 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}
                                            style={{ fontSize: '0.72rem', border: d.val >= 70 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)' }}
                                        >
                                            {d.val}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
