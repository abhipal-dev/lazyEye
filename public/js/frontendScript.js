$(document).ready(function () {
    hideErrors();
    AOS.init();
});

function sweetAlert(head, msg, type) {
    Swal.fire(
        head,
        msg,
        type,
    )
};

function hideErrors() {
    $('span#fullname_error').hide();
    $('span#username_error').hide();
    $('span#email_error').hide();
    $('span#password_error').hide();
    $('span#repeat_password_error').hide();
    $('span#mismatch_password_error').hide();
}

function emptyForm() {
    $('input#fullname').val('');
    $('input#username').val('');
    $('input#email').val('');
    $('input#password').val('');
    $('input#repeat_password').val('');
    // $("input[name='gender'][value='Male']").checked();
}

function validate(data) {
    let errors = [];
    if (data.get('fullname') == "") {
        // document.register_form.fullname.focus() ;
        // return false;
        errors.push("fullname");
    }
    if (data.get('username') == "") {
        // document.register_form.username.focus() ;
        errors.push("username");
    }
    if (data.get('email') == "") {
        // document.register_form.email.focus() ;
        errors.push("email");
    }
    if (data.get('password') == "") {
        // document.register_form.password.focus() ;
        errors.push("password");
    }
    if (data.get('repeat_password') == "") {
        // document.register_form.repeat_password.focus() ;
        errors.push("repeat_password");
    }
    if (!(data.get('repeat_password') == data.get('password'))) {
        // document.register_form.repeat_password.focus() ;
        errors.push("mismatch_password");
    }
    return errors;
}

$(document).on('submit', 'form#register_form', function (e) {
    e.preventDefault();
    let res = [];
    let form = $(this);
    let formData = new FormData($(this)[0]);
    console.log(formData)
    res = validate(formData);
    if (!res.length) {
        hideErrors();
        // console.log('No Error')
        $.ajax({
            url: "/Register_req",
            type: 'post',
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            data: formData,
            success: function (res) {

                console.log(res.messages)
                if (res.status == 'failed') {
                    let msg = "";
                    for (var i in res.messages) {
                        for (var key in res.messages[i]) {
                            //    msg+= `${i} : ${res.messages[i][key]}<br>`;
                            msg += `${res.messages[i][key]}<br>`;
                        }
                    }
                    Swal.fire({
                        title: '! Failed !',
                        html: msg,
                        icon: 'error'
                    })
                }
                else {
                    console.log("Passed");
                    sweetAlert('Sended', 'Your Request is Sended.');
                    emptyForm();
                }

            },
            error: function () {
                console.log('Error');
            }
        });
    } else {
        for (i = 0; i < res.length; i++) {
            if (res[i] == 'fullname')
                $('span#fullname_error').show();
            else if (res[i] == 'username')
                $('span#username_error').show();
            else if (res[i] == 'email')
                $('span#email_error').show();
            else if (res[i] == 'password')
                $('span#password_error').show();
            else if (res[i] == 'repeat_password')
                $('span#repeat_password_error').show();
            else if (res[i] == 'mismatch_password')
                $('span#mismatch_password_error').show();
        }
    }
});

$(document).on('click', 'button.loginButton', function (e) {
    e.preventDefault();
    let username = $('input#username').val();
    let password = $('input#password').val();
    let token = $('meta[name="csrf-token"]').attr('content');

    if (!username || !password) {
        sweetAlert('Missing Fields', 'Please enter your username and password.', 'warning');
        return;
    }

    $.ajax({
        url: "/Login_req",
        type: "post",
        headers: { 'X-CSRF-TOKEN': token },
        data: { username: username.trim(), password: password.trim(), token: token },
        success: function (data) {
            if (data['messages'] == 'success admin') {
                window.location.href = "/admin";
            }
            else if (data['messages'] == 'success user') {
                window.location.href = "/user";
            }
            else {
                sweetAlert('Login Failed', data['messages'] || 'Username or Password did not match!', 'error');
            }
        },
        error: function (xhr) {
            let msg = 'Unable to reach the server. Please check your connection or database credentials.';
            if (xhr.responseJSON && xhr.responseJSON.messages) {
                msg = xhr.responseJSON.messages;
            }
            sweetAlert('Server / Database Error', msg, 'error');
        }
    });
});

$(document).on('keypress', 'input#username, input#password', function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('button.loginButton').trigger('click');
    }
});

function updateData(id, type) {
    console.log("ID -> " + id)
    console.log("Type -> " + type)
}

function deleteData(id, type) {
    console.log("ID -> " + id)
    console.log("Type -> " + type)
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

$(document).ready(function () {
    $('.accordion  a').click(function () {
        $(this).toggleClass('active');
        $(this).next('.content').slideToggle(400);
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
});
