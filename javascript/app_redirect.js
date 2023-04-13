const username = localStorage.getItem("username");
const jwtToken = localStorage.getItem("jwtToken");
const refreshToken = localStorage.getItem("refreshToken");

let settings = {
    url: `http://localhost:8080/api/employees/${username}`,
    method: "GET",
    headers: {
        Authorization : `Bearer ${jwtToken}`
    },
};

$.ajax(settings)
    .done((response) => {
        checkIsAdmin(response.roles);
    })
    .fail((err) => {
        if (err.status === 401) {
            window.location.replace("http://localhost:5500/login.html?err=1");
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
        window.location.replace("http://localhost:5500/index.html");
    } else {
        window.location.replace("http://localhost:5500/info.html");
    }
}