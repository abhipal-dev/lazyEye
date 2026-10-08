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

        // Game distribution list
        const gameEntries = Object.entries(stats.game_distribution || {}).slice(0, 5);
        const maxGamePlays = Math.max(...gameEntries.map(e => e[1]), 1);

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
                                    className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#logConsultationModal"
                                >
                                    <i className="fa-solid fa-stethoscope"></i> Log Clinical Review
                                </button>
                                <button 
                                    className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#createStaffModal"
                                >
                                    <i className="fa-solid fa-user-plus"></i> Enroll Patient
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="btn btn-sm btn-outline-success rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    onClick={this.handleSeedDemoData}
                                    title="Generate realistic clinical patients, doctors, and game sessions"
                                >
                                    <i className="fa-solid fa-wand-magic-sparkles"></i> Seed Demo Data
                                </button>
                                <button 
                                    className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#createStaffModal"
                                >
                                    <i className="fa-solid fa-user-plus"></i> {isRoot ? 'Add User / Staff / Admin' : 'Add User / Doctor'}
                                </button>
                            </>
                        )}
                        <a 
                            href="/user" 
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-1 fw-bold"
                        >
                            <i className="fa-solid fa-gamepad"></i> Therapy Simulation
                        </a>
                    </div>
                </div>

                {/* 4 Primary KPI Cards */}
                <div className="row g-3 mb-4">
                    {/* Card 1: Patients */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div 
                            className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchUsers"
                            style={{ 
                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                                borderRadius: '1rem', 
                                color: '#fff',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="small text-white-50 fw-bold text-uppercase tracking-wider">
                                    {isDoctor ? 'My Assigned Patients' : 'Active Patients'}
                                </span>
                                <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                    <i className="fa-solid fa-users text-white"></i>
                                </div>
                            </div>
                            <h2 className="fw-bold mb-1 text-white">{stats.total_patients}</h2>
                            <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                <span>{isDoctor ? 'Assigned to Your Care' : 'Prescribed Therapy'}</span>
                                <span className="text-white fw-bold">View Patients <i className="fa-solid fa-arrow-right ms-1"></i></span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Doctors or Doctor Consultations */}
                    <div className="col-12 col-sm-6 col-xl-3">
                        {isDoctor ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchConsultations"
                                style={{ 
                                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)', 
                                    borderRadius: '1rem', 
                                    color: '#fff',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">My Clinical Reviews</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-stethoscope text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.total_consultations}</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Recorded Consultations</span>
                                    <span className="text-white fw-bold">View Reviews <i className="fa-solid fa-arrow-right ms-1"></i></span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchDoctors"
                                style={{ 
                                    background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
                                    borderRadius: '1rem', 
                                    color: '#fff',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Doctors &amp; Staff</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-user-doctor text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.total_doctors}</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Certified Clinical Staff</span>
                                    <span className="text-white fw-bold">View Doctors <i className="fa-solid fa-arrow-right ms-1"></i></span>
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
                                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                                    borderRadius: '1rem', 
                                    color: '#fff' 
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Cohort Adherence</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-chart-pie text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.compliance_rate}%</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Target Adherence</span>
                                    <span className="badge bg-white text-success fw-bold py-1 px-2">High Adherence</span>
                                </div>
                            </div>
                        ) : isRoot ? (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchAdmins"
                                style={{ 
                                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                                    borderRadius: '1rem', 
                                    color: '#fff',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">System Administrators</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-user-shield text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.total_admins}</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Root &amp; Clinic Admins</span>
                                    <span className="text-white fw-bold">Manage Admins <i className="fa-solid fa-arrow-right ms-1"></i></span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchConsultations"
                                style={{ 
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                                    borderRadius: '1rem', 
                                    color: '#fff',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Clinical Reviews</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-stethoscope text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.total_consultations}</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Logged Consultations</span>
                                    <span className="text-white fw-bold">View Reviews <i className="fa-solid fa-arrow-right ms-1"></i></span>
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
                                    background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
                                    borderRadius: '1rem', 
                                    color: '#fff' 
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Avg Daily Prescribed</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-stopwatch text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.avg_training_time} <span className="fs-6 fw-normal text-white-50">min</span></h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span>Prescribed Therapy Plan</span>
                                    <span className="badge bg-white text-info fw-bold py-1 px-2">Standard</span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="card border-0 shadow-sm h-100 p-3 cursor-pointer fetchRegisters"
                                style={{ 
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                                    borderRadius: '1rem', 
                                    color: '#fff',
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Pending Registrations</span>
                                    <div className="rounded-circle p-2 bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                        <i className="fa-solid fa-user-clock text-white"></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.pending_registers}</h2>
                                <div className="d-flex align-items-center justify-content-between small text-white-50 mt-1">
                                    <span className="badge bg-white text-dark py-1 px-2">{stats.pending_registers > 0 ? 'Requires Action' : 'All Clear'}</span>
                                    <span className="text-white fw-bold">Review <i className="fa-solid fa-arrow-right ms-1"></i></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Clinical Metrics Row */}
                {/* Secondary Clinical Metrics Row */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, minWidth: 48 }}>
                                    <i className="fa-solid fa-chart-pie fa-xl"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-bold text-uppercase" style={{ color: 'var(--text-sub)', fontSize: '0.74rem', letterSpacing: '0.06em' }}>Adherence Compliance</span>
                                    <h4 className="fw-bold mb-0 text-main">{stats.compliance_rate}%</h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${stats.compliance_rate}%` }}></div>
                            </div>
                            <small className="mt-2 d-block" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patients meeting daily assigned minutes</small>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3 bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, minWidth: 48 }}>
                                    <i className="fa-solid fa-stopwatch fa-xl"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-bold text-uppercase" style={{ color: 'var(--text-sub)', fontSize: '0.74rem', letterSpacing: '0.06em' }}>Avg Daily Session</span>
                                    <h4 className="fw-bold mb-0 text-main">{stats.avg_training_time} <span className="fs-6 fw-normal" style={{ color: 'var(--text-sub)' }}>minutes</span></h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar bg-info" role="progressbar" style={{ width: `${Math.min(stats.avg_training_time * 5, 100)}%` }}></div>
                            </div>
                            <small className="mt-2 d-block" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Optometrist standard target: 20 mins/day</small>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 p-3 bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, minWidth: 48 }}>
                                    <i className="fa-solid fa-glasses fa-xl"></i>
                                </div>
                                <div>
                                    <span className="d-block fw-bold text-uppercase" style={{ color: 'var(--text-sub)', fontSize: '0.74rem', letterSpacing: '0.06em' }}>Dichoptic Engines</span>
                                    <h4 className="fw-bold mb-0 text-main">10 Active Games</h4>
                                </div>
                            </div>
                            <div className="progress mt-3" style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }}></div>
                            </div>
                            <small className="mt-2 d-block" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Calibrated games with dual-contrast Red/Cyan filter</small>
                        </div>
                    </div>
                </div>

                {/* Charts & Analytics Section */}
                <div className="row g-4 mb-4">
                    {/* Weekly Activity Line/Area Chart */}
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                <div>
                                    <h5 className="fw-bold mb-1 text-main">
                                        <i className="fa-solid fa-chart-line text-primary me-2"></i>Weekly Therapy Session Volume
                                    </h5>
                                    <p className="small mb-0" style={{ color: 'var(--text-sub)' }}>Total dichoptic sessions completed across the past 7 days</p>
                                </div>
                                <span className="badge bg-success-subtle text-success py-1 px-2 fw-semibold">
                                    <i className="fa-solid fa-arrow-trend-up me-1"></i>+16.4% this week
                                </span>
                            </div>

                            {/* Responsive SVG Area Chart */}
                            <div className="position-relative w-100" style={{ height: 180 }}>
                                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-100 h-100 overflow-visible">
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                                        </linearGradient>
                                    </defs>

                                    {/* Horizontal Guidelines */}
                                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="3 3" />
                                    <line x1={padding} y1={padding + innerHeight / 2} x2={chartWidth - padding} y2={padding + innerHeight / 2} stroke="var(--border-color)" strokeDasharray="3 3" />
                                    <line x1={padding} y1={padding + innerHeight} x2={chartWidth - padding} y2={padding + innerHeight} stroke="var(--border-color)" />

                                    {/* Gradient Area Fill */}
                                    <path d={areaPath} fill="url(#areaGradient)" />

                                    {/* Line Stroke */}
                                    <polyline fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={pointsString} />

                                    {/* Data Points */}
                                    {points.map((p, idx) => (
                                        <g key={idx} className="cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                                            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-main)">
                                                {p.val}
                                            </text>
                                            <text x={p.x} y={chartHeight - 4} textAnchor="middle" fontSize="10" fill="var(--text-sub)">
                                                {stats.weekly_sessions?.labels[idx] || ''}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            <div className="d-flex align-items-center justify-content-between small mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)', color: 'var(--text-sub)' }}>
                                <span><i className="fa-solid fa-circle text-primary me-1" style={{ fontSize: 8 }}></i> Completed Sessions</span>
                                <span>Peak Day: <strong style={{ color: 'var(--text-main)' }}>Saturday (62 sessions)</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Game Engagement Bar Distribution */}
                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1 text-main">
                                        <i className="fa-solid fa-trophy text-warning me-2"></i>Most Prescribed Games
                                    </h5>
                                    <p className="small mb-0" style={{ color: 'var(--text-sub)' }}>Engagement frequency by game module</p>
                                </div>
                                <span className="badge bg-primary-subtle text-primary small">Top 5</span>
                            </div>

                            <div className="d-flex flex-column gap-3 mt-2">
                                {gameEntries.map(([name, count], idx) => {
                                    const percent = Math.round((count / maxGamePlays) * 100);
                                    const colors = ['#2563eb', '#0284c7', '#10b981', '#f59e0b', '#8b5cf6'];
                                    const color = colors[idx % colors.length];

                                    return (
                                        <div key={idx}>
                                            <div className="d-flex align-items-center justify-content-between small mb-1">
                                                <span className="fw-semibold text-main">{name}</span>
                                                <span className="fw-bold" style={{ color: 'var(--text-sub)' }}>{count} plays</span>
                                            </div>
                                            <div className="progress" style={{ height: 8, borderRadius: 4, backgroundColor: 'var(--bg-surface-secondary)' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    role="progressbar" 
                                                    style={{ width: `${percent}%`, backgroundColor: color, borderRadius: 4 }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center small" style={{ borderColor: 'var(--border-color)', color: 'var(--text-sub)' }}>
                                <span>Recommended by Optometrists</span>
                                <a href="/user" className="text-primary fw-semibold text-decoration-none">Test Modules &rarr;</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Navigation Tabs Bar */}
                <div className="card border-0 shadow-sm p-3 mb-2" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-bold text-main small me-2"><i className="fa-solid fa-filter me-1 text-primary"></i>Quick Records:</span>
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fetchUsers">
                                <i className="fa-solid fa-users me-1"></i> {isDoctor ? 'My Patients' : 'Patients'} ({stats.total_patients})
                            </button>
                            {!isDoctor && (
                                <button className="btn btn-sm btn-outline-info rounded-pill px-3 fetchDoctors">
                                    <i className="fa-solid fa-user-doctor me-1"></i> Doctors ({stats.total_doctors})
                                </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fetchConsultations">
                                <i className="fa-solid fa-stethoscope me-1"></i> {isDoctor ? 'My Reviews' : 'Clinical Reviews'} ({stats.total_consultations})
                            </button>
                            {isRoot && (
                                <button className="btn btn-sm btn-outline-success rounded-pill px-3 fetchAdmins">
                                    <i className="fa-solid fa-user-shield me-1"></i> Admins ({stats.total_admins})
                                </button>
                            )}
                            {!isDoctor && (
                                <button className="btn btn-sm btn-outline-warning rounded-pill px-3 fetchRegisters">
                                    <i className="fa-solid fa-user-clock me-1"></i> Pending Approvals ({stats.pending_registers})
                                </button>
                            )}
                        </div>
                        <div className="small" style={{ color: 'var(--text-muted)' }}>
                            Click any category above to view data records below &darr;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
