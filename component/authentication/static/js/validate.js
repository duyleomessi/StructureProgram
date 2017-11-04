$().ready(function () {
    $("#form_register").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 4
            },
            confirm_password: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email"
            },
            password: {
                required: "Please enter your password",
                minlength: "This field required at least 4 character"
            },
            confirm_password: {
                required: "Please enter your password",
                equalTo: "The password is not match"
            }
        }
    });

    $("#form_login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 4
            },
            confirm_password: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email"
            },
            password: {
                required: "Please enter your password",
                minlength: "This field required at least 4 character"
            },
            confirm_password: {
                required: "Please enter your password",
                equalTo: "The password is not match"
            }
        }
    });
})
