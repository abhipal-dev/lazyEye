// import { isArguments } from "lodash";
var activeTableContentType = "";
$(document).ready(function () {
    fetchUsers();
});
window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});


function deleteData(id, type) {
    Swal.fire({
        title: 'Are you sure?',
        text: type + ' with ID ' + id + " will be deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let token = $('meta[name="csrf-token"]').attr('content');
            $.ajax({
                url: "/Delete",
                type: "post",
                headers: { 'X-CSRF-TOKEN': token },
                data: { id: id, type: type },
                success: function (data) {
                    console.log(data);
                    if (+data) {
                        if (type == 'users')
                            fetchUsers();
                        else if (type == 'registers')
                            fetchRegisters();
                        else if (type == 'admins')
                            fetchAdmins();
                        else if (type == 'doctors')
                            fetchDoctors();
                        else
                            fetchUsers();
                    }
                }
            });
            Swal.fire(
                'Deleted!',
                type + ' with ID ' + id + ' has been deleted.',
                'success'
            )
        }
    })

    // console.log("ID2 -> "+id)
    // console.log("Type -> "+type)
}
function approveRegisters(id, type) {
    Swal.fire({
        title: 'Are you sure?',
        text: type + ' of id ' + id + " will become User !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Approve it !'
    }).then((result) => {
        if (result.isConfirmed) {

            if (type == 'registers') {
                let token = $('meta[name="csrf-token"]').attr('content');
                $.ajax({
                    url: "/Approve",
                    type: "post",
                    headers: { 'X-CSRF-TOKEN': token },
                    data: { id: id, type: type },
                    success: function (data) {
                        console.log(data);
                        if (data == 'success')
                            fetchRegisters();
                        else {

                        }
                        // window.location.href = "/Login_view";
                    }
                });
            }
            Swal.fire(
                'Approved!',
                type + ' of id ' + id + ' is Approved',
                'success'
            )
        }
    })
}

function scrollToTable() {
    const el = document.getElementById('table-section');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

function formatUtcToLocal(utcString, format = 'DD MMM YYYY, hh:mm A') {
    if (!utcString) return 'Active';
    try {
        if (window.moment) {
            return window.moment.utc(utcString).local().format(format);
        }
        return new Date(utcString.endsWith('Z') ? utcString : utcString + 'Z').toLocaleString();
    } catch (e) {
        return utcString;
    }
}

function updateFilterActive(activeClass) {
    // 1. Table filter buttons - strictly one active
    $('.table-filter-btn').removeClass('active');
    $('.table-filter-btn.' + activeClass).addClass('active');

    // 2. Sidebar navigation items - clear ALL active states first, then activate strictly the current item
    $('#layoutSidenav_nav .nav-link').removeClass('active');
    $('#layoutSidenav_nav .nav-link.' + activeClass).addClass('active');
}

function fetchRegisters() {
    $.ajax({
        url: "/fetchRegisters",
        type: "get",
        success: function (data) {
            activeTableContentType = 'Registers';
            updateFilterActive('fetchRegisters');
            $('tbody').html('');
            $('thead').html('');
            $('div.card-header span.fw-semibold').text('Applications -> Pending Patient Registrations');
            $('thead').append(`
                <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Status</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Submitted (Local)</th>
                <th colspan="2" class="text-center">Action</th>
                </tr>
            `);
            if (!data || data.length === 0) {
                $('tbody').append(`<tr><td colspan="9" class="text-center text-muted py-4"><i class="fa-solid fa-circle-check text-success me-1"></i> No pending registrations at this time.</td></tr>`);
                return;
            }
            data.forEach((e) => {
                let localSubmitted = formatUtcToLocal(e.created_at, 'DD/MM/YYYY, hh:mm A');
                $('tbody').append(`
                    <tr>
                    <td>`+ e.reg_id + `</td>
                    <td><strong>`+ e.fullname + `</strong></td>
                    <td><span class="badge bg-secondary-subtle text-secondary">`+ e.username + `</span></td>
                    <td><span class="badge bg-warning-subtle text-warning"><i class="fa-solid fa-clock me-1"></i>Pending Approval</span></td>
                    <td>`+ e.gender + `</td>
                    <td>`+ e.email + `</td>
                    <td>`+ localSubmitted + `</td>
                    <td class="text-center"><button class="btn btn-sm btn-success rounded-pill px-3" onclick="approveRegisters(`+ e.reg_id + `,'registers')"><i class="fa-solid fa-check me-1"></i>Approve</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteData(`+ e.reg_id + `,'registers')"><i class="fa-solid fa-trash me-1"></i>Decline</button></td>
                    </tr>`
                );
            });
        }
    });
}

function fetchDoctors() {
    $.ajax({
        url: "/fetchDoctors",
        type: "get",
        success: function (data) {
            activeTableContentType = "Doctors";
            updateFilterActive('fetchDoctors');
            $('tbody').html('');
            $('thead').html('');
            $('div.card-header span.fw-semibold').text('Clinical Staff -> Doctors & Vision Therapists');
            $('thead').append(`
                <tr>
                <th>ID</th>
                <th>Doctor / Specialist</th>
                <th>Username</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Prescribed Target</th>
                <th>Joined (Local)</th>
                <th colspan="2" class="text-center">Action</th>
                </tr>
            `);
            if (!data || data.length === 0) {
                $('tbody').append(`<tr><td colspan="10" class="text-center text-muted py-4">No doctors registered yet. Click "Add User / Doctor" to onboard staff.</td></tr>`);
                return;
            }
            data.forEach((e) => {
                let localJoined = formatUtcToLocal(e.created_at, 'DD/MM/YYYY');
                $('tbody').append(`
                    <tr>
                    <td>`+ e.id + `</td>
                    <td><strong>`+ e.fullname + `</strong></td>
                    <td><span class="badge bg-secondary-subtle text-secondary">`+ e.username + `</span></td>
                    <td><span class="badge bg-info-subtle text-info"><i class="fa-solid fa-user-doctor me-1"></i>Doctor</span></td>
                    <td>`+ e.gender + `</td>
                    <td>`+ e.email + `</td>
                    <td>`+ (e.user_playing_time || 20) + ` mins/day</td>
                    <td>`+ localJoined + `</td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-primary rounded-pill px-3 edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="`+ e.id + `" data-fullname="`+ (e.fullname || '') + `" data-username="`+ (e.username || '') + `" data-email="`+ (e.email || '') + `" data-gender="`+ (e.gender || 'Male') + `" data-type="`+ (e.accounttype || 'doctor') + `" data-time="`+ (e.user_playing_time || 20) + `"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteData(`+ e.id + `,'doctors')"><i class="fa-solid fa-trash me-1"></i>Delete</button></td>
                    </tr>`
                );
            });
        }
    });
}

function fetchAdmins() {
    $.ajax({
        url: "/fetchAdmins",
        type: "get",
        success: function (data) {
            activeTableContentType = "Admins";
            updateFilterActive('fetchAdmins');
            $('tbody').html('');
            $('thead').html('');
            $('div.card-header span.fw-semibold').text('Administrative Staff -> System Administrators');
            $('thead').append(`
                <tr>
                <th>ID</th>
                <th>Admin Name</th>
                <th>Username</th>
                <th>Role Badge</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Access Level</th>
                <th>Joined (Local)</th>
                <th colspan="2" class="text-center">Action</th>
                </tr>
            `);
            if (!data || data.length === 0) {
                $('tbody').append(`<tr><td colspan="10" class="text-center text-muted py-4"><i class="fa-solid fa-lock text-warning me-2"></i>Restricted Access: Only Root Superadmin can view and manage system administrators.</td></tr>`);
                return;
            }
            data.forEach((e) => {
                let badge = (e.accounttype === 'root')
                    ? '<span class="badge bg-dark-subtle text-dark border"><i class="fa-solid fa-crown me-1 text-warning"></i>Root Superadmin</span>'
                    : '<span class="badge bg-danger-subtle text-danger"><i class="fa-solid fa-user-shield me-1"></i>Clinic Admin</span>';

                let localJoined = formatUtcToLocal(e.created_at, 'DD/MM/YYYY');
                $('tbody').append(`
                    <tr>
                    <td>`+ e.id + `</td>
                    <td><strong>`+ e.fullname + `</strong></td>
                    <td><span class="badge bg-secondary-subtle text-secondary">`+ e.username + `</span></td>
                    <td>`+ badge + `</td>
                    <td>`+ e.gender + `</td>
                    <td>`+ e.email + `</td>
                    <td>Full System Control</td>
                    <td>`+ localJoined + `</td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-primary rounded-pill px-3 edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="`+ e.id + `" data-fullname="`+ (e.fullname || '') + `" data-username="`+ (e.username || '') + `" data-email="`+ (e.email || '') + `" data-gender="`+ (e.gender || 'Male') + `" data-type="`+ (e.accounttype || 'admin') + `" data-time="`+ (e.user_playing_time || 20) + `"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteData(`+ e.id + `,'admins')"><i class="fa-solid fa-trash me-1"></i>Delete</button></td>
                    </tr>`
                );
            });
        }
    });
}

function fetchUsers() {
    $.ajax({
        url: "/fetchUsers",
        type: "get",
        success: function (data) {
            activeTableContentType = "Users";
            updateFilterActive('fetchUsers');
            $('tbody').html('');
            $('thead').html('');
            $('div.card-header span.fw-semibold').text('Patients -> Active Therapy Patients');
            $('thead').append(`
                <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Username</th>
                <th>Assigned Doctor</th>
                <th>Therapy Status</th>
                <th>Gender</th>
                <th>Target</th>
                <th>Enrolled (Local)</th>
                <th colspan="4" class="text-center">Action</th>
                </tr>
            `);
            if (!data || data.length === 0) {
                $('tbody').append(`<tr><td colspan="12" class="text-center text-muted py-4">No active patients found.</td></tr>`);
                return;
            }

            // Also populate consultation modal patient selector
            let patientSelect = $('#consultation_patient_select');
            if (patientSelect.length) {
                patientSelect.html('<option value="">-- Select Patient --</option>');
                data.forEach(p => {
                    patientSelect.append(`<option value="${p.id}">${p.fullname} (@${p.username})</option>`);
                });
            }

            data.forEach((e) => {
                let badge = (e.accounttype === 'Unpaid User')
                    ? '<span class="badge bg-warning-subtle text-warning">Pending Payment</span>'
                    : '<span class="badge bg-primary-subtle text-primary"><i class="fa-solid fa-circle-check me-1"></i>Active Patient</span>';

                let doctorBadge = '';
                if (e.doctor_name) {
                    doctorBadge = `
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge bg-info-subtle text-info fw-semibold"><i class="fa-solid fa-user-doctor me-1"></i>`+ e.doctor_name + `</span>
                            <button class="btn btn-xs btn-link text-primary p-0 assign-doc-btn" data-patient-id="`+ e.id + `" data-patient-name="`+ (e.fullname || '') + `" data-doctor-id="`+ (e.doctor_id || '') + `" title="Change Doctor"><i class="fa-solid fa-arrows-rotate"></i></button>
                        </div>`;
                } else {
                    doctorBadge = `
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge bg-warning-subtle text-warning fw-semibold">Unassigned</span>
                            <button class="btn btn-xs btn-outline-primary rounded-pill py-0 px-2 assign-doc-btn" data-patient-id="`+ e.id + `" data-patient-name="`+ (e.fullname || '') + `" data-doctor-id="" title="Assign Doctor"><i class="fa-solid fa-user-plus me-1"></i>Assign</button>
                        </div>`;
                }

                let localEnrolled = formatUtcToLocal(e.created_at, 'DD/MM/YYYY');

                $('tbody').append(`
                    <tr>
                    <td>`+ e.id + `</td>
                    <td><strong>`+ e.fullname + `</strong></td>
                    <td><span class="badge bg-secondary-subtle text-secondary">`+ e.username + `</span></td>
                    <td>`+ doctorBadge + `</td>
                    <td>`+ badge + `</td>
                    <td>`+ e.gender + `</td>
                    <td>`+ (e.user_playing_time || 20) + ` mins/day</td> 
                    <td>`+ localEnrolled + `</td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-success rounded-pill px-2 view-activity-btn" data-patient-id="`+ e.id + `" data-patient-name="`+ (e.fullname || '') + `" title="View Patient Activity Report & Heatmap"><i class="fa-solid fa-fire text-danger me-1"></i>Activity</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-info rounded-pill px-2 log-review-btn" data-patient-id="`+ e.id + `" data-patient-name="`+ (e.fullname || '') + `" data-doctor-id="`+ (e.doctor_id || 23) + `" title="Log Clinical Review"><i class="fa-solid fa-stethoscope me-1"></i>Review</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-primary rounded-pill px-3 edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="`+ e.id + `" data-fullname="`+ (e.fullname || '') + `" data-username="`+ (e.username || '') + `" data-email="`+ (e.email || '') + `" data-gender="`+ (e.gender || 'Male') + `" data-type="`+ (e.accounttype || 'user') + `" data-time="`+ (e.user_playing_time || 20) + `" data-doctor="`+ (e.doctor_id || '') + `"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</button></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteData(`+ e.id + `,'users')"><i class="fa-solid fa-trash me-1"></i>Delete</button></td>
                    </tr>`
                );
            });
        }
    });
}

function fetchConsultations() {
    $.ajax({
        url: "/fetchConsultations",
        type: "get",
        success: function (data) {
            activeTableContentType = "Consultations";
            updateFilterActive('fetchConsultations');
            $('tbody').html('');
            $('thead').html('');
            $('div.card-header span.fw-semibold').text('Clinical Staff -> Doctor Reviews & Patient Consultations');
            $('thead').append(`
                <tr>
                <th>Review ID</th>
                <th>Doctor / Specialist</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Compliance Assessment</th>
                <th>Prescribed Target</th>
                <th>Clinical Notes & Observations</th>
                <th>Reviewed At (Local)</th>
                </tr>
            `);
            if (!data || data.length === 0) {
                $('tbody').append(`<tr><td colspan="8" class="text-center text-muted py-4"><i class="fa-solid fa-stethoscope me-1 text-primary"></i> No doctor consultations recorded yet. Click "Review" on any patient row to log an assessment.</td></tr>`);
                return;
            }
            data.forEach((e) => {
                let statusBadge = (e.status === 'Reviewed')
                    ? '<span class="badge bg-success-subtle text-success"><i class="fa-solid fa-circle-check me-1"></i>Reviewed</span>'
                    : `<span class="badge bg-info-subtle text-info">${e.status}</span>`;

                let complianceColor = 'text-success bg-success-subtle';
                if (e.compliance_assessment === 'Moderate') complianceColor = 'text-warning bg-warning-subtle';
                if (e.compliance_assessment === 'Low') complianceColor = 'text-danger bg-danger-subtle';

                let localTime = formatUtcToLocal(e.created_at, 'DD MMM YYYY, hh:mm A');

                $('tbody').append(`
                    <tr>
                    <td><strong>#`+ e.id + `</strong></td>
                    <td>
                        <span class="fw-bold text-main d-block"><i class="fa-solid fa-user-doctor me-1 text-info"></i>`+ e.doctor_name + `</span>
                        <small class="text-muted">@`+ e.doctor_username + `</small>
                    </td>
                    <td>
                        <span class="fw-bold text-main d-block">`+ e.patient_name + `</span>
                        <small class="text-muted">@`+ e.patient_username + `</small>
                    </td>
                    <td>`+ statusBadge + `</td>
                    <td><span class="badge `+ complianceColor + ` py-1 px-2 fw-semibold">`+ e.compliance_assessment + `</span></td>
                    <td><span class="fw-bold text-primary">`+ e.prescribed_minutes + ` mins/day</span></td>
                    <td style="max-width: 280px;" class="small text-sub">`+ (e.notes || '<span class="text-muted italic">Routine clinical review completed.</span>') + `</td>
                    <td class="small text-nowrap"><i class="fa-regular fa-clock me-1 text-primary"></i>`+ localTime + `</td>
                    </tr>
                `);
            });
        }
    });
}
function logOutAlert() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be Logged Out !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Log Out !'
    }).then((result) => {
        if (result.isConfirmed) {
            let token = $('meta[name="csrf-token"]').attr('content');
            $.ajax({
                url: "/Logout",
                type: "post",
                headers: { 'X-CSRF-TOKEN': token },
                success: function (data) {
                    console.log(data);
                    window.location.href = "/Login_view";
                }
            });
            Swal.fire(
                'Logged Out!',
                'You are Logged Out',
                'success'
            )
        }
    })
}
$(document).on('click', '#sidebarToggle', function (event) {
    event.preventDefault();
    document.body.classList.toggle('sb-sidenav-toggled');
    localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
});
function showDashboard() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.fetchUsers = fetchUsers;
window.fetchDoctors = fetchDoctors;
window.fetchAdmins = fetchAdmins;
window.fetchRegisters = fetchRegisters;
window.fetchConsultations = fetchConsultations;
window.scrollToTable = scrollToTable;
window.showDashboard = showDashboard;

$(document).on('click', '.fetchRegisters', function () {
    fetchRegisters();
    scrollToTable();
});
$(document).on('click', '.fetchAdmins', function () {
    fetchAdmins();
    scrollToTable();
});
$(document).on('click', '.fetchUsers', function () {
    fetchUsers();
    scrollToTable();
});
$(document).on('click', '.fetchDoctors', function () {
    fetchDoctors();
    scrollToTable();
});
$(document).on('click', '.fetchConsultations', function () {
    fetchConsultations();
    scrollToTable();
});
$(document).on('click', '.dashboardButton', function () {
    $('#layoutSidenav_nav .nav-link').removeClass('active');
    $(this).addClass('active');
    $('.table-filter-btn').removeClass('active');
    showDashboard();
});
$(document).on('click', '.logoutButton', function () {
    logOutAlert();
});
$(document).on('click', 'button.close', function (e) {
    $('.modal').modal('hide');
});

// Assign Doctor to Patient Modal Handlers
$(document).on('click', '.assign-doc-btn', function () {
    let btn = $(this);
    let patientId = btn.attr('data-patient-id');
    let patientName = btn.attr('data-patient-name');
    let doctorId = btn.attr('data-doctor-id');

    $('#assign_patient_id').val(patientId);
    $('#assign_patient_name').val(patientName);
    $('#assign_doctor_select').val(doctorId || '');
    $('#assignDoctorModal').modal('show');
});

$(document).on('submit', '#assignDoctorForm', function (e) {
    e.preventDefault();
    let patientId = $('#assign_patient_id').val();
    let doctorId = $('#assign_doctor_select').val();
    let token = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        url: "/assignDoctor",
        type: "post",
        headers: { 'X-CSRF-TOKEN': token },
        data: { patient_id: patientId, doctor_id: doctorId },
        success: function (res) {
            $('#assignDoctorModal').modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Doctor Assigned!',
                text: 'Patient attending optometrist has been updated successfully.'
            });
            fetchUsers();
        },
        error: function () {
            Swal.fire('Error', 'Could not assign doctor.', 'error');
        }
    });
});

// Log Clinical Consultation Handlers
$(document).on('click', '.log-review-btn', function () {
    let btn = $(this);
    let patientId = btn.attr('data-patient-id');
    let doctorId = btn.attr('data-doctor-id') || '23';

    $('#consultation_patient_select').val(patientId);
    $('#consultation_doctor_select').val(doctorId);
    $('#logConsultationModal').modal('show');
});

$(document).on('submit', '#logConsultationForm', function (e) {
    e.preventDefault();
    let form = $(this);
    let token = $('meta[name="csrf-token"]').attr('content');
    let data = {
        patient_id: $('#consultation_patient_select').val(),
        doctor_id: $('#consultation_doctor_select').val(),
        compliance_assessment: form.find('select[name="compliance_assessment"]').val(),
        prescribed_minutes: form.find('input[name="prescribed_minutes"]').val(),
        notes: form.find('textarea[name="notes"]').val(),
        status: 'Reviewed'
    };

    $.ajax({
        url: "/logConsultation",
        type: "post",
        headers: { 'X-CSRF-TOKEN': token },
        data: data,
        success: function (res) {
            $('#logConsultationModal').modal('hide');
            form[0].reset();
            Swal.fire({
                icon: 'success',
                title: 'Consultation Logged!',
                text: 'Clinical review, observations, and prescribed target recorded with UTC timestamp.'
            });
            fetchConsultations();
            scrollToTable();
        },
        error: function () {
            Swal.fire('Error', 'Could not record clinical consultation.', 'error');
        }
    });
});

$(document).on('click', 'button.edit', function () {
    let btn = $(this);
    let id = btn.attr('data-id') || btn.closest('tr').find('td:nth-child(1)').text().trim();
    let fullname = btn.attr('data-fullname') || btn.closest('tr').find('td:nth-child(2)').text().trim();
    let username = btn.attr('data-username') || btn.closest('tr').find('td:nth-child(3)').text().trim();
    let email = btn.attr('data-email') || '';
    let gender = btn.attr('data-gender') || 'Male';
    let accounttype = btn.attr('data-type') || 'user';
    let allotted_time = btn.attr('data-time') || '20';
    let doctor_id = btn.attr('data-doctor') || '';

    $('.modal-title').html('<i class="fa-solid fa-user-pen text-primary me-2"></i>Update User / Staff Record');
    $('#editModal input[name="id"]').val(id);
    $('#editModal input[name="fullname"]').val(fullname);
    $('#editModal input[name="username"]').val(username);
    $('#editModal input[name="email"]').val(email);
    $('#editModal input[name="password"]').val('');
    $('#editModal input[name="allotted_time"]').val(allotted_time);
    $('#edit_accounttype').val(accounttype);
    $('#edit_doctor_id').val(doctor_id);

    if (accounttype === 'user') {
        $('#edit_doctor_group').show();
    } else {
        $('#edit_doctor_group').hide();
    }

    $('#editModal input[name="gender"]').prop("checked", false);
    if (gender === "Male") {
        $('#editModal input[name="gender"][value="Male"]').prop("checked", true);
    } else if (gender === "Female") {
        $('#editModal input[name="gender"][value="Female"]').prop("checked", true);
    } else {
        $('#editModal input[name="gender"][value="Other"]').prop("checked", true);
    }
});

$(document).on('change', '#edit_accounttype', function () {
    if ($(this).val() === 'user') {
        $('#edit_doctor_group').show();
    } else {
        $('#edit_doctor_group').hide();
    }
});

$(document).on('submit', 'form[name="edit"]', function (e) {
    e.preventDefault();
    let form = $(this);
    let formData = new FormData($(this)[0]);
    let token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
        url: "/Update",
        type: "post",
        processData: false,
        contentType: false,
        headers: { 'X-CSRF-TOKEN': token },
        data: formData,
        success: function (data) {
            if (+data) {
                $('#editModal').modal('hide');
                if (activeTableContentType == "Admins")
                    fetchAdmins();
                else if (activeTableContentType == "Registers")
                    fetchRegisters();
                else if (activeTableContentType == "Doctors")
                    fetchDoctors();
                else
                    fetchUsers();
                Swal.fire(
                    'Updated!',
                    'User record has been successfully updated.',
                    'success'
                );
            }
            else {
                Swal.fire(
                    'Update Failed!',
                    'Could not update record.',
                    'error'
                );
            }
        }
    });
});

$(document).on('submit', 'form[name="createStaff"]', function (e) {
    e.preventDefault();
    let form = $(this);
    let formData = new FormData(form[0]);
    let token = $('meta[name="csrf-token"]').attr('content');
    let submitBtn = form.find('button[type="submit"]');
    submitBtn.prop('disabled', true);

    $.ajax({
        url: "/createUser",
        type: "post",
        processData: false,
        contentType: false,
        headers: { 'X-CSRF-TOKEN': token },
        data: formData,
        success: function (res) {
            submitBtn.prop('disabled', false);
            if (res.status === 'success') {
                $('#createStaffModal').modal('hide');
                form[0].reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'New ' + (formData.get('accounttype') || 'user') + ' has been registered successfully.'
                });
                let role = formData.get('accounttype');
                if (role === 'doctor') {
                    fetchDoctors();
                } else if (role === 'admin' || role === 'root') {
                    fetchAdmins();
                } else {
                    fetchUsers();
                }
                scrollToTable();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Creation Failed',
                    text: res.message || 'Could not create account.'
                });
            }
        },
        error: function (xhr) {
            submitBtn.prop('disabled', false);
            let errMsg = 'Something went wrong.';
            if (xhr.responseJSON && xhr.responseJSON.messages) {
                errMsg = Object.values(xhr.responseJSON.messages).flat().join('<br>');
            }
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: errMsg
            });
        }
    });
});





$(document).on('submit', 'form[name="imageUpload"]', function (e) {
    e.preventDefault();
    let form = $(this);
    let formData = new FormData($(this)[0]);
    let token = $('meta[name="csrf-token"]').attr('content');
    console.log(formData)
    $.ajax({
        url: "/uploadImage",
        type: "post",
        processData: false,
        contentType: false,
        headers: { 'X-CSRF-TOKEN': token },
        data: formData,
        success: function (data) {
            if (data) {
                $('#uploadImageModal').modal('hide')
                Swal.fire(
                    'Updation Success!',
                    'User profile image is updated',
                    'success'
                )
            }
            else {
                $('#uploadImageModal').modal('hide')
                Swal.fire(
                    'Updation Failed!',
                    'User profile image is not updated',
                    'error'
                )
            }
            $('form[name="imageUpload"]').reset();
        }
    });
});

// Auto-close sidebar on mobile when navigating or tapping backdrop
$(document).on('click', '#layoutSidenav_nav .nav-link', function () {
    if (window.innerWidth < 992) {
        document.body.classList.remove('sb-sidenav-toggled');
    }
});

$(document).on('click', '#layoutSidenav_content', function (e) {
    if (window.innerWidth < 992 && document.body.classList.contains('sb-sidenav-toggled')) {
        if (!$(e.target).closest('#layoutSidenav_nav').length) {
            document.body.classList.remove('sb-sidenav-toggled');
        }
    }
});

// ==========================================
// PATIENT ACTIVITY REPORT & HEATMAP HANDLERS
// ==========================================

function findGameIconAddress(game_name) {
    if (game_name == 'Snake') return '/images/Snake-icon-1.png';
    if (game_name == 'Flappy Bird') return '/images/Flappy-Square.png';
    if (game_name == 'Sticky Holds') return '/images/Sticky-Holds.png';
    if (game_name == 'Menja') return '/images/Menja-icon.png';
    if (game_name == 'Tetris') return '/images/Tetris.png';
    if (game_name == 'Bubble Shooter') return '/images/Bubble.png';
    if (game_name == 'Ping Pong') return '/images/Ping-Pong.png';
    if (game_name == 'Maze') return '/images/Maze.png';
    if (game_name == 'Ball Catcher') return '/images/ballcatcher.jpeg';
    if (game_name == 'Bouncing Ball') return '/images/bouncing-ball.png';
    return '/images/lazyeye-icon.svg';
}

var currentPatientSessions = [];

function openPatientActivity(patientId) {
    if (!patientId) return;

    $('#pam_patient_name').text('Loading...');
    $('#pam_heatmap_wrapper').html('<div class="d-flex align-items-center justify-content-center py-4 text-sub"><i class="fa-solid fa-spinner fa-spin me-2"></i> Loading therapy activity heatmap...</div>');
    $('#pam_sessions_table tbody').html('<tr><td colspan="4" class="text-center py-3 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i> Loading records...</td></tr>');
    $('#pam_consultations_table tbody').html('<tr><td colspan="5" class="text-center py-3 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i> Loading consultations...</td></tr>');
    $('#pam_selected_date_filter').addClass('d-none');

    let modalEl = document.getElementById('patientActivityModal');
    if (modalEl) {
        let modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.show();
    }

    $.ajax({
        url: "/fetchPatientActivity",
        type: "get",
        data: { patient_id: patientId },
        success: function (res) {
            if (res.status !== 'success') {
                Swal.fire('Error', res.message || 'Could not load patient activity', 'error');
                return;
            }

            let p = res.patient;
            let m = res.metrics;
            currentPatientSessions = res.recent_sessions || [];

            // Patient Profile Snapshot
            $('#pam_patient_name').text(p.fullname || 'Patient');
            $('#pam_patient_username').text('@' + (p.username || ''));
            $('#pam_patient_email').text(p.email || '');
            $('#pam_doctor_name').html('<i class="fa-solid fa-user-doctor me-1"></i>' + (p.doctor_name || 'Unassigned'));
            $('#pam_target_time').text('Target: ' + (p.user_playing_time || 20) + ' mins/day');

            let initial = (p.fullname ? p.fullname.charAt(0) : 'P').toUpperCase();
            $('#pam_avatar').text(initial);

            // Metrics
            $('#pam_total_sessions').text(m.total_sessions);
            $('#pam_total_minutes').text(m.total_duration_minutes + ' min');
            $('#pam_compliance_rate').text(m.compliance_rate + '%');
            $('#pam_active_days').text(m.days_active);

            // Render Heatmap Calendar (84 days / 12 weeks)
            renderPatientHeatmap(res.heatmap_data || []);

            // Render Sessions
            renderPatientSessions(currentPatientSessions);
            $('#pam_session_count').text(currentPatientSessions.length);

            // Render Consultations
            renderPatientConsultations(res.consultations || []);
            $('#pam_consultation_count').text((res.consultations || []).length);
        },
        error: function (xhr) {
            let msg = 'Failed to retrieve patient activity report.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }
            Swal.fire('Restricted Access', msg, 'warning');
            $('#patientActivityModal').modal('hide');
        }
    });
}

function renderPatientHeatmap(heatmapData) {
    let heatmapMap = {};
    (heatmapData || []).forEach(item => {
        heatmapMap[item.date] = item;
    });

    let today = new Date();
    let daysToRender = 84;
    let startDate = new Date();
    startDate.setDate(today.getDate() - daysToRender + 1);

    let weeks = [];
    let curWeek = [];
    let cur = new Date(startDate);

    while (cur <= today) {
        let dateStr = cur.toISOString().slice(0, 10);
        let dayInfo = heatmapMap[dateStr] || { date: dateStr, count: 0, duration_minutes: 0, games: [] };
        curWeek.push(dayInfo);
        if (curWeek.length === 7) {
            weeks.push(curWeek);
            curWeek = [];
        }
        cur.setDate(cur.getDate() + 1);
    }
    if (curWeek.length > 0) {
        weeks.push(curWeek);
    }

    let html = '<div class="d-flex gap-2 justify-content-start overflow-auto p-2" style="min-width: 640px;">';
    
    // Day of week labels
    html += '<div class="d-flex flex-column gap-1 text-muted" style="font-size: 10px; line-height: 14px; margin-top: 1px;">';
    html += '<div style="height: 14px;">M</div>';
    html += '<div style="height: 14px;"></div>';
    html += '<div style="height: 14px;">W</div>';
    html += '<div style="height: 14px;"></div>';
    html += '<div style="height: 14px;">F</div>';
    html += '<div style="height: 14px;"></div>';
    html += '<div style="height: 14px;">S</div>';
    html += '</div>';

    weeks.forEach(week => {
        html += '<div class="d-flex flex-column gap-1">';
        week.forEach(day => {
            let count = day.count;
            let bgColor = 'var(--bg-surface-secondary, #e2e8f0)';
            let borderColor = 'var(--border-color, #cbd5e1)';
            if (count === 1) {
                bgColor = '#9be9a8';
                borderColor = '#40c463';
            } else if (count === 2) {
                bgColor = '#40c463';
                borderColor = '#30a14e';
            } else if (count >= 3) {
                bgColor = '#216e39';
                borderColor = '#196127';
            }

            let gamesStr = (day.games && day.games.length > 0) ? (' • Games: ' + day.games.join(', ')) : '';
            let title = day.date + ' • ' + count + ' session(s) (' + day.duration_minutes + ' mins)' + gamesStr;

            html += `<div 
                class="pam-heatmap-cell cursor-pointer rounded-1" 
                data-date="${day.date}" 
                data-count="${count}"
                title="${title}" 
                style="width: 14px; height: 14px; background-color: ${bgColor}; border: 1px solid ${borderColor}; transition: transform 0.15s ease;"
                onmouseover="this.style.transform='scale(1.25)'"
                onmouseout="this.style.transform='scale(1)'"
            ></div>`;
        });
        html += '</div>';
    });

    html += '</div>';
    $('#pam_heatmap_wrapper').html(html);
}

function renderPatientSessions(sessions, filterDate) {
    let tbody = $('#pam_sessions_table tbody');
    tbody.html('');

    let list = sessions || [];
    if (filterDate) {
        list = list.filter(s => s.played_at && s.played_at.slice(0, 10) === filterDate);
    }

    if (list.length === 0) {
        tbody.append(`<tr><td colspan="4" class="text-center py-4 text-muted">No sessions found${filterDate ? ' for ' + filterDate : ''}.</td></tr>`);
        return;
    }

    list.forEach(s => {
        let icon = findGameIconAddress(s.game_name);
        let mins = Math.floor((s.duration_seconds || 1200) / 60);
        let secs = (s.duration_seconds || 1200) % 60;
        let durationFormatted = mins + 'm ' + (secs < 10 ? '0' : '') + secs + 's';
        let localTime = formatUtcToLocal(s.played_at, 'DD/MM/YYYY hh:mm A');

        tbody.append(`
            <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="${icon}" style="width: 24px; height: 24px; object-fit: contain;" />
                    <span class="fw-semibold text-main">${s.game_name}</span>
                </div>
            </td>
            <td><span class="badge bg-primary-subtle text-primary fw-bold">${s.score} pts</span></td>
            <td><span class="text-sub"><i class="fa-regular fa-clock me-1"></i>${durationFormatted}</span></td>
            <td class="text-muted small">${localTime}</td>
            </tr>
        `);
    });
}

function renderPatientConsultations(consultations) {
    let tbody = $('#pam_consultations_table tbody');
    tbody.html('');

    if (!consultations || consultations.length === 0) {
        tbody.append('<tr><td colspan="5" class="text-center py-4 text-muted">No clinical reviews logged for this patient yet.</td></tr>');
        return;
    }

    consultations.forEach(c => {
        let localDate = formatUtcToLocal(c.created_at, 'DD/MM/YYYY');
        let compBadge = 'bg-info';
        if (c.compliance_assessment === 'Excellent') compBadge = 'bg-success';
        else if (c.compliance_assessment === 'Moderate') compBadge = 'bg-warning text-dark';
        else if (c.compliance_assessment === 'Low') compBadge = 'bg-danger';

        tbody.append(`
            <tr>
            <td class="text-nowrap fw-semibold">${localDate}</td>
            <td><i class="fa-solid fa-user-doctor text-info me-1"></i><strong>${c.doctor_name || 'Dr. Specialist'}</strong></td>
            <td><span class="badge ${compBadge}">${c.compliance_assessment || 'Good'}</span></td>
            <td><span class="fw-bold text-primary">${c.prescribed_minutes || 20} mins/day</span></td>
            <td class="small text-sub">${c.notes || '<span class="text-muted italic">Routine observation</span>'}</td>
            </tr>
        `);
    });
}

$(document).on('click', '.view-activity-btn', function () {
    let patientId = $(this).attr('data-patient-id');
    openPatientActivity(patientId);
});

$(document).on('click', '.pam-heatmap-cell', function () {
    let date = $(this).attr('data-date');
    if (date) {
        $('#pam_filter_date_label').text(date);
        $('#pam_selected_date_filter').removeClass('d-none');
        renderPatientSessions(currentPatientSessions, date);
    }
});

$(document).on('click', '#pam_clear_date_filter', function () {
    $('#pam_selected_date_filter').addClass('d-none');
    renderPatientSessions(currentPatientSessions);
});

window.openPatientActivity = openPatientActivity;


