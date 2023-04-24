const url = new URL(window.location.href);
const srcParams = url.searchParams;
const id = srcParams.get('id');
let numOfExp = 0;

const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

const endDate = document.getElementById('end_date');
endDate.classList.add("d-none");

document.addEventListener("DOMContentLoaded", () => {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/employees/${id}/info`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    })
    .done((response) => {
        fillFieldsWithData(response);
    })
    .fail((err) => {
        console.log(err);
    });
});

const editEmployee = () => {
    let fName = document.getElementById("first_name").value;
    let lName = document.getElementById("last_name").value;
    let jobTitle = document.getElementById("job_title").value;
    let startDate = document.getElementById("start_date").value;
    let endDate = document.getElementById("end_date").value;
    let username = document.getElementById("username").value;

    if (endDate === '') {
        endDate = null;
    }

    const employee = {
        id: id,
        firstName: fName,
        lastName: lName,
        jobTitle: jobTitle,
        startDate: startDate,
        endDate: endDate,
        username: username
    }

    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/api/employees`,
        data: JSON.stringify(employee),
        contentType: "application/json",
        headers:{
            'Authorization' : `Bearer ${jwtToken}`
        }
    })
    .done(() => {
        location.replace("http://localhost:5500/index.html?msg=edit-success"); 
    })
    .fail((err) => {
        if (err.status === 400) {
            document.getElementById("alert-div").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Employee with username '${username}' already exists.
                </div>`
        }
    }); 
}

const dateDiffInDays = (dateFrom, dateTo) => {
    const a = new Date(dateFrom);
    const b = new Date(dateTo);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const fillFieldsWithData = (response) => {
    document.getElementById('first_name').value = response.firstName;
    document.getElementById('last_name').value = response.lastName;
    document.getElementById('job_title').value = response.jobTitle;
    document.getElementById('start_date').value = response.startDate;
    document.getElementById('username').value = response.username;
    
    console.log(response);
    if (response.endDate !== null) {
        const checkBox = document.getElementById('cb_ex_employee');
        endDate.classList.remove("d-none");
        checkBox.disabled = true;

        document.getElementById('end_date').value = response.endDate;
    }
}

const isExEmployee = () => {
    const checkBox = document.getElementById('cb_ex_employee');

    if (checkBox.checked === true) {
        endDate.classList.remove("d-none");
    } else {
        endDate.classList.add("d-none");
    }
}