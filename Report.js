function resetForm() {
    document.getElementById('ReportForm').reset();
    editingIndex = null;
    // Clear the table body (remove all rows)
    document.getElementById('tabledata').innerHTML = '';

    // Optionally, clear the employeeData array (if you're storing table data in a variable)
    employeeData = [];
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
}

function resetForm() {
    // Manually reset form fields by targeting each input element
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('supervisor').value = '';
    editingIndex = null;
    // Clear the table body (remove all rows)
    document.getElementById('reportTableBody').innerHTML = '';

    // Optionally, clear the employeeData array (if you're storing table data in a variable)
    employeeData = [];
}

function downloadExcel() {
    const table = document.getElementById("reportTable");

    if (!table) {
        alert('No data available to download.');
        return;
    }

    // Convert HTML table to Excel workbook
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "EmployeeReport.xlsx");
}


async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const table = document.getElementById("reportTable");

    if (!table) {
        alert('No data available to download.');
        return;
    }

    const rows = Array.from(table.rows);
    const body = [];
    const header = Array.from(rows[0].cells).map(cell => cell.innerText); // Get header

    // Extract row data for PDF
    rows.slice(1).forEach(row => {
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        body.push(rowData);
    });

    // Use autoTable plugin for creating well-formatted PDF tables
    doc.autoTable({
        head: [header],   // Table header
        body: body,       // Table rows
        startY: 10,       // Starting position for the table
        theme: 'striped', // Optional styling for the table
        margin: { top: 10 }
    });

    // Save the generated PDF
    doc.save("EmployeeReport.pdf");
}

let currentPage = 1; // Track the current page
const recordsPerPage = 6; // Number of records per page
let allRecords = []; // Store all fetched records globally

const isAdmin = localStorage.getItem('isAdmin') ? JSON.parse(localStorage.getItem('isAdmin')) : false;
const userName = localStorage.getItem('user') || ''; // Fallback to empty string if not set
const supervisorErrorSpan = document.getElementById('empsuper_error');
const supervisorName = document.getElementById("supervisor");

console.log("isAdmin:", isAdmin);
console.log("Logged-in user:", userName);


// Apply logic based on isAdmin status
if (isAdmin) {
    // Admin: Supervisor field is editable
    supervisorName.removeAttribute('readonly'); // Make sure it is editable
    supervisorName.placeholder = "Enter Supervisor Name"; // Set placeholder if needed
    supervisorErrorSpan.textContent = ''; // Clear any previous error message if any
} else {
    // Non-admin: Supervisor field is read-only and shows supervisor_name or userName
    supervisorName.setAttribute('readonly', true); // Make it read-only
    supervisorName.value = userName || ''; // Show userName if supervisor_name is not available
    supervisorErrorSpan.textContent = ''; // Clear any previous error message if any
}

const API_URL = "https://timesheet003.pythonanywhere.com/api/user/report/"; // Replace with your API URL

// correct by datewise horizentally

document.addEventListener('DOMContentLoaded', function () {
    // Automatically set today's date for fromDate and toDate
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;

document.getElementById("submitBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission
    // console.log("Daily report button clicked.");
    // Your code here
});
});


// async function fetchReportData() {
//     const fromDate = document.getElementById("fromDate").value;
//     const toDate = document.getElementById("toDate").value;
//     const supervisorName = document.getElementById("supervisor").value;
//     const accessToken = localStorage.getItem('accessToken');

//     // Validate inputs
//     if (!fromDate || !toDate) {
//         alert("Please provide both From Date and To Date.");
//         return;
//     }

//     const requestBody = {
//         from_date: fromDate,
//         to_date: toDate,
//         supervisor_name: supervisorName,
//     };

//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 'Authorization': `Bearer ${accessToken}` // Pass the token here
//             },
//             body: JSON.stringify(requestBody),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Error Details:", errorData);
//             throw new Error(`Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         populateTable(data, fromDate, toDate);
//     } catch (error) {
//         console.error("Error fetching report data:", error);
//         alert("Failed to fetch report data. Please check your input and try again.");
//     }
// }

async function fetchReportData() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const supervisorName = document.getElementById("supervisor").value.trim(); // Trim to avoid empty spaces
    const accessToken = localStorage.getItem('accessToken');

    // Validate date inputs
    if (!fromDate || !toDate) {
        alert("Please provide both From Date and To Date.");
        return;
    }

    // Construct request body
    const requestBody = {
        from_date: fromDate,
        to_date: toDate,
    };

    // Add supervisor_name if provided
    if (supervisorName) {
        requestBody.supervisor_name = supervisorName;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // Pass the token here
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error Details:", errorData);
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            populateTable(data, fromDate, toDate); // Populate table with data
        } else {
            alert("No records found for the given criteria.");
        }
    } catch (error) {
        console.error("Error fetching report data:", error);
        // alert("Failed to fetch report data. Please check your input and try again.");
        alert("No records found for the given criteria.");
    }
}


function populateTable(data, fromDate, toDate) {
    const tableHead = document.querySelector("#reportTable thead");
    const tableBody = document.querySelector("#reportTable tbody");

    // Clear existing table data
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    // Generate date range
    const dates = getDateRange(fromDate, toDate);

    // Add headers to table
    const headerRow1 = document.createElement("tr");
    headerRow1.innerHTML = `
        <th>SL</th>
        <th>Zone</th> <!-- Added Zone Column -->
        <th>Employee Code</th>
        <th>Employee Name</th>
        <th>Category</th>
    `;

    dates.forEach(date => {
        const dateTh = document.createElement("th");
        dateTh.colSpan = 6; // Each date has 6 fields
        dateTh.textContent = date;
        headerRow1.appendChild(dateTh);
    });

    headerRow1.innerHTML += `
        <th colspan="6">Total</th>
        <th>T.DAYS</th>
        <th>T.OT</th>
    `;

    const headerRow2 = document.createElement("tr");
    headerRow2.innerHTML = `
        <th></th><th></th><th></th><th></th><th></th>
        ${dates.map(() => `
            <th>SK</th>
            <th>OT</th>
            <th>SSK</th>
            <th>OT</th>
            <th>USK</th>
            <th>OT</th>
        `).join("")}
        <th>SK</th>
        <th>OT</th>
        <th>SSK</th>
        <th>OT</th>
        <th>USK</th>
        <th>OT</th>
        <th></th>
        <th></th>
    `;

    tableHead.appendChild(headerRow1);
    tableHead.appendChild(headerRow2);

    // Group data by employee_code
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.employee_code]) {
            acc[item.employee_code] = {
                zone: item.zone, // Added Zone
                employee_name: item.employee_name,
                category: item.category,
                attendance: {}
            };
        }
        acc[item.employee_code].attendance[item.date_of_work] = {
            sk: item.sk || 0,
            sk_ot: item.sk_ot || 0,
            ssk: item.ssk || 0,
            ssk_ot: item.ssk_ot || 0,
            usk: item.usk || 0,
            usk_ot: item.usk_ot || 0
        };
        return acc;
    }, {});

    // Initialize totals for all columns (per day)
    const totals = {
        sk: Array(dates.length).fill(0),
        sk_ot: Array(dates.length).fill(0),
        ssk: Array(dates.length).fill(0),
        ssk_ot: Array(dates.length).fill(0),
        usk: Array(dates.length).fill(0),
        usk_ot: Array(dates.length).fill(0),
        tDays: 0, // Total T.DAYS
        tOt: 0 // Total T.OT
    };

    // Populate table body
    let serial = 1;
    for (const [employeeCode, employeeData] of Object.entries(groupedData)) {
        const row = document.createElement("tr");
        let skTotal = 0, skOtTotal = 0, sskTotal = 0, sskOtTotal = 0, uskTotal = 0, uskOtTotal = 0;

        row.innerHTML = `
            <td>${serial++}</td>
            <td>${employeeData.zone}</td> <!-- Added Zone Data -->
            <td>${employeeCode}</td>
            <td>${employeeData.employee_name}</td>
            <td>${employeeData.category}</td>
            ${dates.map((date, index) => {
                const attendance = employeeData.attendance[date] || {};

                const sk = attendance.sk || 0;
                const sk_ot = attendance.sk_ot || 0;
                const ssk = attendance.ssk || 0;
                const ssk_ot = attendance.ssk_ot || 0;
                const usk = attendance.usk || 0;
                const usk_ot = attendance.usk_ot || 0;

                // Update total for each field row-wise
                skTotal += sk;
                skOtTotal += sk_ot;
                sskTotal += ssk;
                sskOtTotal += ssk_ot;
                uskTotal += usk;
                uskOtTotal += usk_ot;

                // Add to the totals for each date
                totals.sk[index] += sk;
                totals.sk_ot[index] += sk_ot;
                totals.ssk[index] += ssk;
                totals.ssk_ot[index] += ssk_ot;
                totals.usk[index] += usk;
                totals.usk_ot[index] += usk_ot;

                return `
                    <td>${sk}</td>
                    <td>${sk_ot}</td>
                    <td>${ssk}</td>
                    <td>${ssk_ot}</td>
                    <td>${usk}</td>
                    <td>${usk_ot}</td>
                `;
            }).join("")}
            <td>${skTotal}</td>
            <td>${skOtTotal}</td>
            <td>${sskTotal}</td>
            <td>${sskOtTotal}</td>
            <td>${uskTotal}</td>
            <td>${uskOtTotal}</td>
            <td>${skTotal + sskTotal + uskTotal}</td>
            <td>${skOtTotal + sskOtTotal + uskOtTotal}</td>
        `;
        totals.tDays += skTotal + sskTotal + uskTotal; // Update the overall T.DAYS total
        totals.tOt += skOtTotal + sskOtTotal + uskOtTotal; // Update the overall T.OT total
        tableBody.appendChild(row);
    }

    // Add a row for the totals at the end
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="5"><strong>Total</strong></td> <!-- Adjusted colspan -->
        ${totals.sk.map((total, index) => `
            <td>${total}</td>
            <td>${totals.sk_ot[index]}</td>
            <td>${totals.ssk[index]}</td>
            <td>${totals.ssk_ot[index]}</td>
            <td>${totals.usk[index]}</td>
            <td>${totals.usk_ot[index]}</td>
        `).join("")}
        <td>${totals.sk.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.sk_ot.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.ssk.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.ssk_ot.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.usk.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.usk_ot.reduce((sum, val) => sum + val, 0)}</td>
        <td>${totals.tDays}</td>
        <td>${totals.tOt}</td>
    `;
    tableBody.appendChild(totalRow);
}

function getDateRange(start, end) {
    const dateArray = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}




