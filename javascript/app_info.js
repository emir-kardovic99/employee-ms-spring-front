const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

const url = new URL(window.location.href);
const srcParams = url.searchParams;
const id = srcParams.get('id');
let isAdmin = false;
let employee;
let vacationDays;

let totalExp = 0;
let total = 0;

$.ajax({
    type: "GET",
    url: `http://localhost:8080/api/employees/${id}/info`,
    dataType: 'json',
    headers:{
        'Authorization' : `Bearer ${jwtToken}`
    },
    success: (response) => {
        console.log(response);
        employee = response;
        console.log(response);
        displayExperience(response.pastExperiences);
        displayEmployee(response);
        displayHoliday(response.holidays);
    },
    error: (err) => {
        console.log(err);
    }
})


const displayEmployee = (employee) => {
    let content = ``;
    const yearsInCompany = diffBetweenTwoDatesInYears(new Date(employee.startDate), new Date());
    total = yearsInCompany + totalExp; 

    content += `<tr> <td> First Name: </td> <td> ` + employee.firstName + ` </td> </tr>`;
    content += `<tr> <td> Last Name: </td> <td> ` + employee.lastName + ` </td> </tr>`;
    content += `<tr> <td> Job Title: </td> <td>` + employee.jobTitle + `</td> </tr>`;
    content += `<tr> <td> Starting Date: </td> <td>` + employee.startDate + `</td> </tr>`;
    content += `<tr> <td> Years in Company: </td> <td>` + yearsInCompany + `</td> </tr>`;
    content += `<tr> <th> Total experience: </th> <th>` + total + `</th> </tr>`;

    document.getElementById('employee-info').innerHTML = content;
} 

const displayExperience = (experiences) => {
    let content = ``;
    experiences.forEach(experience => {
        let yearsWorked = diffBetweenTwoDatesInYears(new Date(experience.dateFrom), new Date(experience.dateTo));
        content += `<tr> <td>` + experience.name + `</td> <td>` + yearsWorked + `</td> </tr>`;
        totalExp += yearsWorked;
    });

    content += `<tr> <th> Total: </th> <th>` + totalExp + `</th> </tr>`;
    document.getElementById('employee-experience').innerHTML += content;
}

const displayHoliday = (holidays) => {
    vacationDays = Math.floor(vacationDaysLeft(holidays));

    let content = ``;
    content += `<tr> <th> Days available: </th> <th>` + vacationDays + `</th> </tr>`;
    content += `<tr> <th>Reason:</th> <th>Days off:</th> </tr>`;

    holidays.forEach(holiday => {
        let daysOff = dateDiffInDays(holiday.dateFrom, holiday.dateTo);
        content += `<tr> <td> ` + holiday.reason + ` </td> <td> ` + daysOff + ` </td> </tr>`
    });

    document.getElementById('employee-holiday').innerHTML += content;
}

const addHoliday = () => {
    const dateFrom = document.getElementById('hol-date-from').value;
    const dateTo = document.getElementById('hol-date-to').value;
    const reason = document.getElementById('hol-reason').value;

    let daysOff = dateDiffInDays(dateFrom, dateTo);

    if ( daysOff < 0 || ((vacationDays - daysOff) < 0)) {
        alert("You can't go on vacation, no free days!");
        return;
    }

    if (daysOff === 0) {
        daysOff = 1;
    }

    let newHoliday = {
        "reason": reason,
        "dateFrom": dateFrom,
        "dateTo": dateTo,
        "employeeId": id
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/employees/holidays",
        data: JSON.stringify(newHoliday),
        contentType: "application/json",
        headers:{
            'Authorization' : `Bearer ${jwtToken}`
        },
        success: (response) => {
            location.reload();
        },
        error: (err) => {
            console.log(err);
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

const diffBetweenTwoDatesInYears = (dateFrom, dateTo) => {
    return new Date(dateTo - dateFrom).getFullYear() - 1970;
}

const vacationDaysLeft = (holidays) => {
    let daysLeft = 20 + total / 5;

    holidays.forEach(holiday => {
        daysLeft -= dateDiffInDays(holiday.dateFrom, holiday.dateTo);
    });

    return daysLeft;
}