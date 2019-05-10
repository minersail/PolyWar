window.onload = function() {
    document.getElementById("login").onclick = login;
    document.getElementById("create").onclick = createUser;
}

function createUser() {
    $.post("/api/create_user", {
        username: $("input[name='username']").val(),        
        password: $("input[name='password']").val()
    }, responseHandler);
}

function login() {
    $.post("/api/login", {
        username: $("input[name='username']").val(),        
        password: $("input[name='password']").val()
    }, responseHandler);
}

function responseHandler(res, status) {
    if (res.error) {
        $(".error").text(res.errorText);
    }
    else {
        document.location.assign("/");
    }
}