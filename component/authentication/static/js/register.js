$().ready(function () {
    var host = 'http://localhost:8080';
    $('#form_register').submit(function (event) {
        //event.preventDefault();
        // when user click login button
        // get user's input
        var email = $("input[name='email']").val();
        var password = $("input[name='password']").val();
        // send the request
        $.ajax({
            type: "POST",
            url: (host + "/user/register"),
            data: {
                email: email,
                password: password
            },
            dataType: "json",
            success: function(data) {
                window.location.href = host;
            },
            error: function() {
                //window.location.href = host + "/user/login";
                alert("Email already exists");
            }
        });

        // .done(function(data) {
        //     console.log("Register successfully");
        //     window.location.href = host;
        // })
        // .fail(function(data) {
        //     console.log(data);
        //     //window.location.href = host + '/user/register';
        //     window.location.href = host + '/user/login';
        // });
        
    });
});