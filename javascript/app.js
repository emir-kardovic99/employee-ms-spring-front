const rootUrl = `http://localhost:8080/api/employees`;
const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');

let size = 5;
let page = 0;
let isFirst;
let isLast;

document.addEventListener("DOMContentLoaded", () => {
    listEmployees();
  });

const listEmployees = () => {
    $.ajax({
        url: `${rootUrl}?page=${page}&size=${size}`,
        type: 'GET',
        success: (response) => {
            isFirst = response.first;
            isLast = response.last;

            checkIfFirstOrLastPage();
            addContentInTable(response.content);
        },
        error: (error) => {
            if (error.status === 401) {
                window.location.href = "http://localhost:5500/login.html";
            }
        }
    });
}

const findByName = () => {
    const firstName = document.getElementById("src_name").value;
    const url = `${rootUrl}/search?page=${page}&size=${size}&firstName=${firstName}`

    $.ajax({
        url:  url,
        type: 'GET',
        success: (response) => {
            isFirst = response.first;
            isLast = response.last;

            addContentInTable(response.content);
        }
    });
}

const addContentInTable = (response) => {
    employees = response;

    let content = ``;
    response.forEach(element => {
        let yearsInCompany = diffBetweenTwoDatesInYears(new Date(element.startDate), new Date());
        console.log(element);
        content += `<tr> <td>` + element.firstName + `</td>` +
                        `<td>` + element.lastName + `</td>` +
                        `<td>` + element.jobTitle + `</td>` +
                        `<td>` + element.startDate + `</td>` +
                        `<td>` + yearsInCompany + `</td>` +
                        `<td> <a class='btn btn-primary' href='http://localhost:5500/info.html?id=` + element.id + `'>Info</a> </td>` +
                        `<td> <a class='btn btn-primary' href='http://localhost:5500/edit.html?id=` + element.id + `'>Edit</a> </td>` +
                        `<td> <a class='btn btn-danger' onclick='deleteEmployee(` + element.id + `)'>Delete</a></td></tr>`;
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
            'Authorization' : `Bearer ${jwtToken}`
        },
        success: (response) => {
            listEmployees();
        }
    });
}

const previousPage = () => {
    const previousLink = document.getElementById("previous");

    if (previousLink.getAttribute("class") !== "disabled") {
        page -= 1;
        listEmployees();
    }
}

const nextPage = () => {
    const nextLink = document.getElementById("next");

    if (nextLink.getAttribute("class") !== "disabled") {
        page += 1;
        listEmployees();
    }
}

const checkIfFirstOrLastPage = () => {
    const nextLink = document.getElementById("next");
    const previousLink = document.getElementById("previous");

    if (isFirst) {
        previousLink.setAttribute("class", "disabled");
    } else {
        previousLink.removeAttribute("class", "disabled");
    }

    if (isLast) {
        nextLink.setAttribute("class", "disabled");
    } else {
        nextLink.removeAttribute("class", "disabled");
    }
}

const diffBetweenTwoDatesInYears = (dateFrom, dateTo) => {
    return new Date(dateTo - dateFrom).getFullYear() - 1970;
}