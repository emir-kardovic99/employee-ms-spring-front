const username = localStorage.getItem("username");
const jwtToken = localStorage.getItem("jwtToken");
const refreshToken = localStorage.getItem("refreshToken");

$.ajax({
    type: "GET",
    url: `http://localhost:8080/api/employees/${username}`,
    dataType: 'json',
    headers:{
        'Authorization' : `Bearer ${jwtToken}`
    },
    success: (response) => {
        checkIsAdmin(response.roles);
    },
    error: (err) => {
        console.log(err);
    }
});

const checkIsAdmin = (roles) => {
    let isAdmin = false;
    roles.forEach(role => {
        if (role.name === "ROLE_ADMIN") {
            isAdmin = true;
        }
    });

    if (isAdmin) {
        window.location.href = "http://localhost:5500/index.html";
    } else {
        window.location.href = "http://localhost:5500/info.html";
    }
}