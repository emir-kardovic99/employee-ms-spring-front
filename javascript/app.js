const rootUrl = `http://localhost:8080/api/employees`;
const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

let size = 5;
let page = 0;
let isFirst;
let isLast;
let holidays;

const alertMsg = document.getElementById("alert-msg");
const inbox = document.getElementById("inbox");
const table = document.getElementById("holiday-body");

alertMsg.classList.add("d-none");

document.addEventListener("DOMContentLoaded", () => {
    listEmployees();
    getUnapprovedHolidays();
});

const listEmployees = () => {
    $.ajax({
        url: `${rootUrl}?page=${page}&size=${size}`,
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${jwtToken}` 
        }
    })
    .done((response) => {
        isFirst = response.first;
        isLast = response.last;

        checkIfFirstOrLastPage();
        addContentInTable(response.content);
    })
    .fail((err) => {
        console.log(err);
    })
}

const findByName = () => {
    const firstName = document.getElementById("src-name").value;
    const url = `${rootUrl}/search?page=${page}&size=${size}&firstName=${firstName}`

    $.ajax({
        url:  url,
        type: 'GET',
        headers: {
            Authorization: `Bearer ${jwtToken}` 
        }
    })
    .done((response) => {
        isFirst = response.first;
        isLast = response.last;

        addContentInTable(response.content);
    })
    .fail((err) => {
        console.log(err);
    })
}

const addContentInTable = (response) => {
    employees = response;

    let content = ``;
    if (employees.length === 0) return;

    response.forEach(element => {
        let yearsInCompany = diffBetweenTwoDatesInYears(new Date(element.startDate), new Date());
        console.log(element);
        content += `<tr> 
                        <td> ${element.id} </td> 
                        <td> ${element.firstName} </td> 
                        <td> ${element.lastName} </td> 
                        <td> ${element.jobTitle} </td> 
                        <td> ${element.startDate} </td> 
                        <td> ${yearsInCompany} </td>
                        <td> <a class='btn btn-primary' href='http://localhost:5500/info.html?id=${element.id}'>Info</a> </td>
                        <td> <a class='btn btn-primary' href='http://localhost:5500/edit.html?id=${element.id}'>Edit</a> </td>
                        <td> <a class='btn btn-danger' onclick='deleteEmployee(${element.id })'>Delete</a></td>
                    </tr>`;
    });

    document.getElementById("main-table").innerHTML = content;
}

const deleteEmployee = (id) => {
    if (!confirm("Are you sure you want to delete Employee?")) {
        return;
    }

    $.ajax({
        url: `${rootUrl}/${id}`,
        type: 'DELETE',
        headers:{
            Authorization : `Bearer ${jwtToken}`
        }
    })
    .done((response) => {
        listEmployees();
        alert("Employee deleted!");
    })
    .fail((err) => {
        console.log(err);
    })
}

const getUnapprovedHolidays = () => {
    $.ajax({
        type: "GET",
        url: `${rootUrl}/holidays`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    })
    .done((response) => {
        checkInbox(response);
    })
    .fail((err) => {
        console.log(err);
    })
}

const checkInbox = (response) => {
    if (response.length > 0) {
        inbox.classList.add("class", "fa-bounce");
        holidays = response;
        let content = ``;
        
        if (holidays.length === 0) return;

        holidays.forEach(holiday => {
            content += `
            <tr> 
                <td>${holiday.firstName} ${holiday.lastName}</td> 
                <td> ${holiday.reason} </td>
                <td> ${holiday.dateFrom} </td>
                <td> ${holiday.dateTo} </td>
                <td> <i class="fa-solid fa-thumbs-up" style="color: #0E6EFD" onclick="approveHoliday(${holiday.id})"></i> </td>
                <td> <i class="fa-solid fa-thumbs-down" style="color: #CF3241" onclick="dissaproveHoliday(${holiday.id})"></i> </td>
            </tr>`;
        });

        table.innerHTML += content;
    }
    else {
        inbox.classList.remove("class", "fa-bounce");
    }
}

const approveHoliday = (id) => {
    let holidayPut;

    holidays.forEach(holiday => {
        if (holiday.id === id) {
            holidayPut = {
                "id": holiday.id,
                "reason": holiday.reason,
                "dateFrom": holiday.dateFrom,
                "dateTo": holiday.dateTo,
                "employeeId": holiday.employeeId,
                "isApproved": true
            }
        }
    })

    $.ajax({
        type: "PUT",
        url: `${rootUrl}/holidays`,
        contentType: "application/json",
        data: JSON.stringify(holidayPut),
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    })
    .done((response) => {
        const table = document.getElementById("holiday-body").innerHTML = "";
        getUnapprovedHolidays();

        alertMsg.classList.remove("d-none");
        setTimeout(() => {alertMsg.classList.add("d-none");}, 2000);
    })
    .fail((err) => {
        console.log(err);
    })
}

const dissaproveHoliday = (id) => {
    $.ajax({
        type: "DELETE",
        url: `${rootUrl}/holidays/${id}`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    })
    .done((response) => {
        // const table = document.getElementById("holiday-body").innerHTML = "";
        table.innerHTML = "";
        getUnapprovedHolidays();
    })
    .fail((err) => {
        console.log(err);
    })
}

const previousPage = () => {
    const previousLink = document.getElementById("previous");

    if (!previousLink.classList.contains("disabled")) {
        page -= 1;
        listEmployees();
    }
}

const nextPage = () => {
    const nextLink = document.getElementById("next");

    if (!nextLink.classList.contains("disabled")) {
        page += 1;
        listEmployees();
    }
}

const checkIfFirstOrLastPage = () => {
    const nextLink = document.getElementById("next");
    const previousLink = document.getElementById("previous");

    if (isFirst) {
        previousLink.classList.add("disabled");
    } else {
        previousLink.classList.remove("disabled");
    }

    if (isLast) {
        nextLink.classList.add("disabled");
    } else {
        nextLink.classList.remove("disabled");
    }
}

const clearFilter = () => {
    page = 0;
    listEmployees();
}

const diffBetweenTwoDatesInYears = (dateFrom, dateTo) => {
    return new Date(dateTo - dateFrom).getFullYear() - 1970;
}