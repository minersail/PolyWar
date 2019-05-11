window.onload = function() {
    document.getElementById("login").onclick = createEndpointFunction("/api/login");
    document.getElementById("create").onclick = createEndpointFunction("/api/create_user");
}

function createEndpointFunction(endpoint) {
    return function() {        
        $.post(endpoint, {
            username: $("input[name='username']").val(),        
            password: $("input[name='password']").val()
        }, responseHandler);
    }
}

function responseHandler(res, status) {
    if (res.error) {
        $(".error").text(res.errorText);
    }
    else {
        document.location.assign("/");
    }
}