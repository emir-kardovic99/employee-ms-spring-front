localStorage.clear();

const login = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = Boolean(document.getElementById("remember-me").value);
    let jwtToken;
    let refreshToken;

    loginData = {
        "username": username,
        "password": password,
        "rememberMe": rememberMe
    }

    console.log(loginData);

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/authenticate/login",
        contentType: "application/json",
        data: JSON.stringify(loginData),
        success: (response) => {
            jwtToken = response.accessToken;
            refreshToken = response.refreshToken;
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('username', username);
            setTimeout(() => {  
                window.location.href = "http://localhost:5500/redirect.html";
            }, 100);
        },
        error: (error) => {
            console.log(error);
        }
    });
}   
