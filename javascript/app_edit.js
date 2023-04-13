const url = new URL(window.location.href);
const srcParams = url.searchParams;
const id = srcParams.get('id');

const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

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
        console.log(response);
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
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let expId = document.getElementsByClassName("exp_id");
    let expName = document.getElementsByClassName("exp_name");
    let expDateFrom = document.getElementsByClassName("exp_date_from");
    let expDateTo = document.getElementsByClassName("exp_date_to");

    if (password === "") {
        alert("Password field can't be empty");
        return;
    }

    const employee = {
        id: id,
        firstName: fName,
        lastName: lName,
        jobTitle: jobTitle,
        startDate: startDate,
        username: username,
        password: password
    }

    let experiences = [];
    for (let i=0; i < expName.length; i++) {
        if (dateDiffInDays(expDateFrom[i].value, expDateTo[i].value) < 0) {
            alert("Dates must be in order!");
            return;
        } else {
            experiences.push({
                id: expId[i].value,
                name: expName[i].value,
                dateFrom: expDateFrom[i].value,
                dateTo: expDateTo[i].value,
                employeeId: id
            });
        }
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
    .done((response) => {
        experiences.forEach(experience => { 
            $.ajax({
                url: `http://localhost:8080/api/employees/experiences`,
                type: "PUT",
                data: JSON.stringify(experience),
                contentType: "application/json",
                headers:{
                    'Authorization' : `Bearer ${jwtToken}`
                }
            });
        });
    })
    .done(() => {
        location.reload(); 
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

    const experiences = response.pastExperiences;
    let content = ``;
    experiences.forEach(experience => {
        content += `
        <hr>
        <div class="inp-wrapper">
            <label for="exp_name">Company name</label>
            <input type="text" class="form-control exp_name" id="exp_name" maxlength="20" value='${experience.name}'>
            <input type="hidden" class="exp_id" value='${experience.id}'>
        </div>
        <div class="inp-date inp-wrapper">
            <div>
                <label for="exp_date_from">From:</label>
                <input type="date" class="form-control exp_date_from" id="exp_date_from" value='${experience.dateFrom}'>
            </div>
            <div>
                <label for="exp_date_to">To:</label>
                <input type="date" class="form-control exp_date_to" id="exp_date_to" value='${experience.dateTo}'>
            </div>
        </div>`;
        
    });
    document.getElementById('experiences-div').innerHTML = content;
}