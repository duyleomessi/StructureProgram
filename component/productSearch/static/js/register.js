$().ready(function () {
    var host = 'http://localhost:8080';
    $('#form_register').submit(function (event) {
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
        })
        .done(function(data) {
            console.log("Register successfully");
            window.location.href = host;
        })
        .fail(function(data) {
            console.log(data);
        });

        event.preventDefault();
        
    });
});