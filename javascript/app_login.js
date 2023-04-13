localStorage.clear();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const err = urlParams.get('err');

// DOM elements
const content = document.getElementsByClassName("container-inner").item(0);

if (err) {
    errMsg = 
    `<div class="alert alert-danger" role="alert">
        Invalid username or password!
    </div>`;
    content.innerHTML = errMsg + content.innerHTML;
}

const login = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = Boolean(document.getElementById("remember-me").value);

    loginData = {
        "username": username,
        "password": password,
        "rememberMe": rememberMe
    }

    let settings = {
        type: "POST",
        url: "http://localhost:8080/api/authenticate/login",
        contentType: "application/json",
        data: JSON.stringify(loginData)
    }

    $.ajax(settings)
        .done((response) => {
            localStorage.setItem('jwtToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('username', username);

            setTimeout(() => {  
                window.location.href = "http://localhost:5500/redirect.html";
            }, 100);
        })
        .fail((err) => {
            window.location.href = "http://localhost:5500/login.html?err=1";
        });
}   
