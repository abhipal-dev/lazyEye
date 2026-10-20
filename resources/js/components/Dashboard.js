import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: {
                total_patients: 0,
                total_doctors: 0,
                total_admins: 0,
                pending_registers: 0,
                compliance_rate: 92.4,
                avg_training_time: 20.0,
                weekly_sessions: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    data: [32, 41, 48, 45, 54, 62, 51]
                },
                game_distribution: {
                    'Tetris': 52,
                    'Snake': 46,
                    'Flappy Bird': 38,
                    'Menja': 35,
                    'Bubble Shooter': 34,
                    'Sticky Holds': 29,
                    'Ball Catcher': 28,
                    'Ping Pong': 26
                }
            },
            loading: true
        };
    }

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
    }

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
    }

    render() {
        const { stats } = this.state;
        const role = this.props.currentUser?.accounttype || stats.role || 'admin';
        const isDoctor = (role === 'doctor');
        const isRoot = (role === 'root');
        const isAdmin = (role === 'admin');
        const currentName = this.props.currentUser?.fullname || (isDoctor ? 'Doctor' : 'Administrator');

        const weeklyData = stats.weekly_sessions?.data || [30, 40, 45, 42, 50, 60, 52];
        const maxVal = Math.max(...weeklyData, 1);

        // Calculate SVG points for Area Chart
        const chartWidth = 500;
        const chartHeight = 160;
        const padding = 20;
        const innerWidth = chartWidth - padding * 2;
        const innerHeight = chartHeight - padding * 2;
        const stepX = innerWidth / (weeklyData.length - 1);

        const points = weeklyData.map((val, idx) => {
            const x = padding + idx * stepX;
            const y = padding + innerHeight - (val / (maxVal * 1.15)) * innerHeight;
            return { x, y, val };
        });

        const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
        const areaPath = `M ${points[0].x},${padding + innerHeight} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${padding + innerHeight} Z`;

        // Game standardized name mapping
        const GAME_DISPLAY_NAMES = {
            'Snake': 'Dichoptic Snake',
            'Flappy Bird': 'Altitude Flight',
            'Sticky Holds': 'Climber Holds',
            'Menja': '3D Spatial Slicer',
            'Tetris': 'Block Fusion',
            'Bubble Shooter': 'Bubble Target Aim',
            'Ping Pong': 'Table Rally 3D',
            'Maze': 'Labyrinth Search',
            'Ball Catcher': 'Target Catcher',
            'Bouncing Ball': 'Rebound Ball'
        };

        // Game distribution list - strictly sorted descending by plays
        const gameEntries = Object.entries(stats.game_distribution || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const maxGamePlays = Math.max(...gameEntries.map(e => e[1]), 1);

        // Dynamic Peak Day calculation from actual weekly data
        const maxDayIdx = weeklyData.indexOf(Math.max(...weeklyData));
        const dayLabels = stats.weekly_sessions?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const peakDayName = dayLabels[maxDayIdx] || 'Saturday';
        const peakDayVolume = weeklyData[maxDayIdx] || 0;

        return (
            <div className="mb-4">
                {/* Header & Quick Action Row */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4 mb-3">
                    <div>
                        <h2 className="fw-bold mb-1 text-main">
                            {isDoctor ? (
                                <><i className="fa-solid fa-user-doctor text-info me-2"></i>Doctor Clinical Practice</>
                            ) : isRoot ? (
                                <><i className="fa-solid fa-crown text-warning me-2"></i>Master Superadmin Console</>
                            ) : (
                                <><i className="fa-solid fa-gauge-high text-primary me-2"></i>Clinic Operations Dashboard</>
                            )}
                        </h2>
                        <p className="text-sub small mb-0">
                            {isDoctor ? (
                                <>Welcome back, <strong>{currentName}</strong> &bull; Therapy compliance and recovery tracking for your assigned cohort</>
                            ) : isRoot ? (
                                <>Master system jurisdiction &bull; System administrators, multi-clinic records, and database supervision</>
                            ) : (
                                <>Real-time patient adherence, clinical reviews, and optometrist staff management</>
                            )}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        {isDoctor ? (
                            <>
                                <button 
                                    className="btn btn-sm btn-danger px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#logConsultationModal"
                                >
                                    <i className="fa-solid fa-stethoscope"></i> Log Clinical Review
                                </button>
                                <button 
                                    className="btn btn-sm btn-primary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#createStaffModal"
                                >
                                    <i className="fa-solid fa-user-plus"></i> Enroll Patient
                                </button>
                            </>
                        ) : (
                            <button 
                                className="btn btn-sm btn-primary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                data-bs-toggle="modal" 
                                data-bs-target="#createStaffModal"
                            >
                                <i className="fa-solid fa-user-plus"></i> {isRoot ? 'Add User / Staff / Admin' : 'Add User / Doctor'}
                            </button>
                        )}
                        <a 
                            href="/user" 
                            className="btn btn-sm btn-secondary px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                        >
                            <i className="fa-solid fa-gamepad"></i> Therapy Simulation
                        </a>
                    </div>
                </div>

                {/* 4 Primary KPI Cards - Monochrome Architectural Surface Design */}
                <div className="row g-3 mb-4">
                    {/* Card 1: Patients */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                            onClick={() => {
                                if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchUsers');
                                else if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                            }}
                            style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px', 
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>
                                    {isDoctor ? 'Assigned Patients' : 'Active Patients'}
                                </span>
                                <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                    <i className="fa-solid fa-users"></i>
                                </div>
                            </div>
                            <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.total_patients}</h2>
                            <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{isDoctor ? 'Under Direct Care' : 'Prescribed Cohort'}</span>
                                <span className="text-main fw-semibold">View List &rarr;</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Doctors / Clinical Staff */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        {isDoctor ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchConsultations');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchConsultations');
                                }}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px', 
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Clinical Reviews</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-stethoscope"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.total_consultations || 0}</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Logged Sessions</span>
                                    <span className="text-main fw-semibold">View Reviews &rarr;</span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchDoctors');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchDoctors');
                                }}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px', 
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Doctors &amp; Staff</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-user-doctor"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.total_doctors}</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Certified Practitioners</span>
                                    <span className="text-main fw-semibold">View Staff &rarr;</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card 3: Adherence Rate for Doctor / Reviews for Admin / Admins for Root */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        {isDoctor ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3"
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px' 
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Cohort Adherence</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-chart-pie"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.compliance_rate}%</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Target Protocol</span>
                                    <span className="badge bg-success-subtle text-success fw-semibold py-1 px-2 font-mono">High Adherence</span>
                                </div>
                            </div>
                        ) : isRoot ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchAdmins');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchAdmins');
                                }}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px', 
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>System Admins</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-user-shield"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.total_admins}</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Root &amp; Clinic Admins</span>
                                    <span className="text-main fw-semibold">Manage Admins &rarr;</span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchConsultations');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchConsultations');
                                }}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px', 
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Clinical Reviews</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-notes-medical"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.total_consultations || 0}</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Doctor Assessments</span>
                                    <span className="text-main fw-semibold">View Reviews &rarr;</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card 4: Avg Time for Doctor / Pending Intake for Admin & Root */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        {isDoctor ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3"
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px' 
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Avg Daily Prescribed</span>
                                    <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                        <i className="fa-solid fa-stopwatch"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.avg_training_time} <span className="fs-6 fw-normal text-sub">min</span></h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Daily Standard</span>
                                    <span className="badge bg-primary-subtle text-main fw-semibold py-1 px-2 font-mono">20 min plan</span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer kpi-card"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchRegisters');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchRegisters');
                                }}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: stats.pending_registers > 0 ? '1px solid var(--warning)' : '1px solid var(--border-color)',
                                    borderRadius: '10px', 
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-semibold text-uppercase tracking-wider font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.74rem' }}>Pending Registrations</span>
                                    <div className={`rounded-2 p-2 d-flex align-items-center justify-content-center`} style={{ width: 34, height: 34, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: stats.pending_registers > 0 ? 'var(--warning)' : 'var(--text-sub)' }}>
                                        <i className="fa-solid fa-user-clock"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-main tabular-nums">{stats.pending_registers}</h2>
                                <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                    <span className={`badge ${stats.pending_registers > 0 ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'} py-1 px-2 fw-semibold font-mono`}>
                                        {stats.pending_registers > 0 ? 'Requires Action' : 'All Clear'}
                                    </span>
                                    <span className="text-main fw-semibold">Review &rarr;</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Clinical Metrics Row */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-2 p-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, minWidth: 44, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                    <i className="fa-solid fa-chart-pie fa-lg"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-semibold text-uppercase font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Adherence Compliance</span>
                                    <h4 className="fw-bold mb-0 text-main tabular-nums">{stats.compliance_rate}%</h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar" role="progressbar" style={{ width: `${stats.compliance_rate}%`, backgroundColor: 'var(--text-main)' }}></div>
                            </div>
                            <small className="mt-2 d-block text-muted" style={{ fontSize: '0.78rem' }}>Patients meeting daily assigned minutes</small>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-2 p-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, minWidth: 44, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                    <i className="fa-solid fa-stopwatch fa-lg"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-semibold text-uppercase font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Avg Daily Session</span>
                                    <h4 className="fw-bold mb-0 text-main tabular-nums">{stats.avg_training_time} <span className="fs-6 fw-normal text-sub">minutes</span></h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar" role="progressbar" style={{ width: `${Math.min(stats.avg_training_time * 5, 100)}%`, backgroundColor: 'var(--text-main)' }}></div>
                            </div>
                            <small className="mt-2 d-block text-muted" style={{ fontSize: '0.78rem' }}>Optometrist standard target: 20 mins/day</small>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-2 p-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, minWidth: 44, backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                                    <i className="fa-solid fa-glasses fa-lg"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-semibold text-uppercase font-mono" style={{ color: 'var(--text-sub)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Dichoptic Engines</span>
                                    <h4 className="fw-bold mb-0 text-main tabular-nums">10 Active Games</h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar" role="progressbar" style={{ width: '100%', backgroundColor: 'var(--text-main)' }}></div>
                            </div>
                            <small className="mt-2 d-block text-muted" style={{ fontSize: '0.78rem' }}>Calibrated games with dual-contrast Red/Cyan filter</small>
                        </div>
                    </div>
                </div>

                {/* Charts & Analytics Section */}
                <div className="row g-3 mb-4">
                    {/* Weekly Activity Line/Area Chart */}
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                <div>
                                    <h5 className="fw-bold mb-1 text-main">
                                        <i className="fa-solid fa-chart-line text-main me-2"></i>Weekly Therapy Session Volume
                                    </h5>
                                    <p className="small mb-0 text-sub">Total dichoptic sessions completed across the past 7 days</p>
                                </div>
                                <span className="badge bg-success-subtle text-success py-1 px-2 fw-semibold font-mono">
                                    <i className="fa-solid fa-arrow-trend-up me-1"></i>+16.4% this week
                                </span>
                            </div>

                            {/* Responsive SVG Area Chart - Monochrome Style */}
                            <div className="position-relative w-100" style={{ height: 180 }}>
                                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-100 h-100 overflow-visible">
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--text-main)" stopOpacity="0.12" />
                                            <stop offset="100%" stopColor="var(--text-main)" stopOpacity="0.01" />
                                        </linearGradient>
                                    </defs>

                                    {/* Horizontal Guidelines */}
                                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="3 3" />
                                    <line x1={padding} y1={padding + innerHeight / 2} x2={chartWidth - padding} y2={padding + innerHeight / 2} stroke="var(--border-color)" strokeDasharray="3 3" />
                                    <line x1={padding} y1={padding + innerHeight} x2={chartWidth - padding} y2={padding + innerHeight} stroke="var(--border-color)" />

                                    {/* Gradient Area Fill */}
                                    <path d={areaPath} fill="url(#areaGradient)" />

                                    {/* Line Stroke */}
                                    <polyline fill="none" stroke="var(--text-main)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsString} />

                                    {/* Data Points */}
                                    {points.map((p, idx) => (
                                        <g key={idx} className="cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="4.5" fill="var(--bg-card)" stroke="var(--text-main)" strokeWidth="2" />
                                            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-main)" fontFamily="'JetBrains Mono', monospace">
                                                {p.val}
                                            </text>
                                            <text x={p.x} y={chartHeight - 4} textAnchor="middle" fontSize="10" fill="var(--text-sub)" fontFamily="'JetBrains Mono', monospace">
                                                {stats.weekly_sessions?.labels[idx] || ''}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)', color: 'var(--text-sub)' }}>
                                <span><i className="fa-solid fa-circle text-main me-1" style={{ fontSize: 7 }}></i> Completed Sessions</span>
                                <span>Peak Day: <strong style={{ color: 'var(--text-main)' }}>{peakDayName} ({peakDayVolume} sessions)</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Game Engagement Bar Distribution - Monochromatic Scale */}
                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1 text-main">
                                        <i className="fa-solid fa-trophy text-main me-2"></i>Most Prescribed Games
                                    </h5>
                                    <p className="small mb-0 text-sub">Engagement frequency by game module</p>
                                </div>
                                <span className="badge bg-primary-subtle text-main small font-mono">Top 5</span>
                            </div>

                            <div className="d-flex flex-column gap-3 mt-2">
                                {gameEntries.map(([name, count], idx) => {
                                    const percent = Math.round((count / maxGamePlays) * 100);
                                    const opacities = [1, 0.85, 0.7, 0.55, 0.4];
                                    const opacity = opacities[idx % opacities.length];

                                    return (
                                        <div key={idx}>
                                            <div className="d-flex align-items-center justify-content-between small mb-1">
                                                <span className="fw-semibold text-main">{GAME_DISPLAY_NAMES[name] || name}</span>
                                                <span className="fw-semibold font-mono" style={{ color: 'var(--text-sub)' }}>{count} plays</span>
                                            </div>
                                            <div className="progress" style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    role="progressbar" 
                                                    style={{ width: `${percent}%`, backgroundColor: 'var(--text-main)', opacity: opacity, borderRadius: 3 }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center small" style={{ borderColor: 'var(--border-color)', color: 'var(--text-sub)' }}>
                                <span>Recommended by Optometrists</span>
                                <a href="/user" className="text-main fw-semibold text-decoration-none">Test Modules &rarr;</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dedicated Records Navigation Card */}
                <div className="card border-0 shadow-sm p-3 mb-2" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-bold text-main small me-2 font-mono">
                                <i className="fa-solid fa-database text-main me-1"></i>Database Records:
                            </span>
                            <button 
                                type="button"
                                className="btn btn-sm btn-secondary px-3 fw-semibold"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchUsers');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchUsers');
                                }}
                            >
                                <i className="fa-solid fa-users me-1"></i> {isDoctor ? 'My Patients' : 'Active Patients'} ({stats.total_patients})
                            </button>
                            {!isDoctor && (
                                <button 
                                    type="button"
                                    className="btn btn-sm btn-secondary px-3 fw-semibold"
                                    onClick={() => {
                                        if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchDoctors');
                                        else if (window.switchToAdminTable) window.switchToAdminTable('fetchDoctors');
                                    }}
                                >
                                    <i className="fa-solid fa-user-doctor me-1"></i> Doctors ({stats.total_doctors})
                                </button>
                            )}
                            <button 
                                type="button"
                                className="btn btn-sm btn-secondary px-3 fw-semibold"
                                onClick={() => {
                                    if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchConsultations');
                                    else if (window.switchToAdminTable) window.switchToAdminTable('fetchConsultations');
                                }}
                            >
                                <i className="fa-solid fa-stethoscope me-1"></i> {isDoctor ? 'My Reviews' : 'Clinical Reviews'} ({stats.total_consultations})
                            </button>
                            {isRoot && (
                                <button 
                                    type="button"
                                    className="btn btn-sm btn-secondary px-3 fw-semibold"
                                    onClick={() => {
                                        if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchAdmins');
                                        else if (window.switchToAdminTable) window.switchToAdminTable('fetchAdmins');
                                    }}
                                >
                                    <i className="fa-solid fa-user-shield me-1"></i> Admins ({stats.total_admins})
                                </button>
                            )}
                            {!isDoctor && (
                                <button 
                                    type="button"
                                    className="btn btn-sm btn-secondary px-3 fw-semibold"
                                    onClick={() => {
                                        if (this.props.onNavigateToTable) this.props.onNavigateToTable('fetchRegisters');
                                        else if (window.switchToAdminTable) window.switchToAdminTable('fetchRegisters');
                                    }}
                                >
                                    <i className="fa-solid fa-user-clock me-1"></i> Pending Approvals ({stats.pending_registers})
                                </button>
                            )}
                        </div>
                        <div className="small text-muted">
                            <i className="fa-solid fa-arrow-right text-main me-1"></i> Open dedicated table view
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
