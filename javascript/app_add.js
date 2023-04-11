const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

const addEmployee = () => {
    let fName = document.getElementById("first_name").value;
    let lName = document.getElementById("last_name").value;
    let jobTitle = document.getElementById("job_title").value;
    let startDate = document.getElementById("start_date").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let expName = document.getElementsByClassName("exp_name");
    let expDateFrom = document.getElementsByClassName("exp_date_from");
    let expDateTo = document.getElementsByClassName("exp_date_to");

    let experiences = [];
    for (let i=0; i < expName.length; i++) {
        if (dateDiffInDays(expDateFrom[i].value, expDateTo[i].value) < 0) {
            alert("Dates must be in order!");
            return;
        }
        experiences.push({
            "name": expName[i].value,
            "dateFrom": expDateFrom[i].value,
            "dateTo": expDateTo[i].value
        })
    }

    let employeeData = {
        "firstName": fName,
        "lastName": lName,
        "jobTitle": jobTitle,
        "startDate": startDate,
        "username": username,
        "password": password
    }

    console.log(employeeData);
    console.log(experiences);

    $.ajax({
        url: `http://localhost:8080/api/employees`,
        type: 'POST',
        data: JSON.stringify(employeeData),
        contentType: 'application/json',
        headers: {
            "Authoriation": `Bearer ${jwtToken}`
        },
        success: (response) => {
            employeeData["id"] = response;
        },
        error: (error) => {
            console.log("ERROR!");
        }
    }).then(() => {
        experiences.forEach(experience => {
            experience["employeeId"] = employeeData["id"];
            console.log(experience);
            $.ajax({
                url: `http://localhost:8080/api/employees/experiences`,
                type: 'POST',
                data: JSON.stringify(experience),
                contentType: 'application/json',
                headers: {
                    "Authoriation": `Bearer ${jwtToken}`
                },
                success: (response) => {
                    window.location.href = `http://localhost:5500/index.html`;
                }
            })
        }) 
    }).catch((err) => {
        console.log(err);
    });
}

const addExperience = () => {
    content = `
    <hr>
    <div class="inp-wrapper">
        <label >Company name</label>
        <input type="text" class="form-control exp_name" maxlength="255">
    </div>
    <div class="inp-date inp-wrapper">
        <div>
            <label>From:</label>
            <input type="date" class="form-control exp_date_from">
        </div>
        <div>
            <label>To:</label>
            <input type="date" class="form-control exp_date_to">
        </div>
    </div>`;

    document.getElementById('experiences-div').innerHTML += content;
}

const dateDiffInDays = (dateFrom, dateTo) => {
    const a = new Date(dateFrom);
    const b = new Date(dateTo);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}