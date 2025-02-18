
// Get form elements
const date = document.getElementById("date");
const zone = document.getElementById("zone");
const employeeCode = document.getElementById("employee_code");
const employeeName = document.getElementById("employee_name");
const department = document.getElementById("department");
const category = document.getElementById("category");
const supervisorName = document.getElementById("supervisor_name");

function resetForm() {
    // Manually reset form fields by targeting each input element
    document.getElementById('date').value = '';
    document.getElementById('zone').value = '';
    // document.getElementById('employee_code').value = '';
    // document.getElementById('employee_name').value = '';
    // document.getElementById('department').value = '';
    // document.getElementById('category').value = '';
    document.getElementById('supervisor_name').value = '';
    editingIndex = null;
    // Clear the table body (remove all rows)
    document.getElementById('employeeTableBody').innerHTML = '';

    // Optionally, clear the employeeData array (if you're storing table data in a variable)
    employeeData = [];
}

document.getElementById("timeSheetLink").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission refresh

    // Call your search function here
    // searchEmployeeByCode();
});

// async function searchEmployeeByCode(event) {
//     event.preventDefault(); // Prevent the form from submitting and refreshing the page
//     // const zone = document.getElementById("zone").value.trim();
//     // const employeeCode = document.getElementById("employee_code").value.trim();
//     const supervisorName = document.getElementById('supervisor_name').value.trim().toUpperCase();
//     const accessToken = localStorage.getItem('accessToken');

//     if (!accessToken) {
//         alert('Access token is missing. Please log in again.');
//         return;
//     }

//     // Validate that at least one field is filled
//     if (!employeeCode && !supervisorName) {
//         alert("Please Enter Supervisor Name.");
//         return;
//     }

//     console.log("Employee Code:", employeeCode);
//     console.log("Supervisor Name:", supervisorName);

//     try {
//         const body = {};
//         if (employeeCode) {
//             body.employee_code = employeeCode; // Include employee code if provided
//         }
//         if (supervisorName) {
//             body.supervisor_name = supervisorName; // Include supervisor name if provided
//         }

//         // console.log('Request Body:', body); // Log request body to check structure
//         console.log('Request Body:', JSON.stringify(body, null, 2)); // Log request body for debugging

//         const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/employee/search/", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(body) // Send the body object dynamically
//         });

//         // console.log(response.status, response.statusText); // Log response status
//         console.log('Response Status:', response.status, response.statusText); // Log response status

//         if (!response.ok) {
//             const errorResponse = await response.json();
//             console.error('Error Response from backend:', errorResponse);
//             alert(`Error: ${errorResponse.message || 'No employee data are available.'}`);
//             clearTable(); // Clear the table if there's an error
//             return;
//         }

//         const employees = await response.json();
//         console.log("Fetched Employee Data:", employees); // Log the fetched data

//         // Ensure employees are defined and it's an array with items
//         if (employees && Array.isArray(employees) && employees.length > 0) {
//             updateTable(employees); // Update table with the fetched employee data
//         } else {
//             alert("No employees found with the provided criteria.");
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while fetching employee data.');
//     }
// }

// Function to clear the table
function clearTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = ''; // Remove all rows from the table
}

// async function saveTableData(event) {
//     event.preventDefault(); // Prevents the page from refreshing

//     const tbody = document.getElementById('employeeTableBody');
//     const rows = tbody.querySelectorAll('tr');
//     const tableData = [];

//     // Loop through each row to collect the data
//     rows.forEach(row => {
//         const dateInput = row.querySelector('input[type="date"]').value; // Get the date value from the input field
//         const formattedDate = new Date(dateInput).toISOString().split('T')[0]; // Ensure the date is in YYYY-MM-DD format

//         // Capture the checkbox value
//         const isPresent = row.querySelector('.attendance-checkbox').checked; // Check if the checkbox is checked
//         const attendanceStatus = isPresent ? true : false; // Set attendance as "p" (Present) or "a" (Absent)

//         const rowData = {
//             // date_of_work: row.cells[0].textContent || '',  // Date from the table (static)
//             date_of_work: formattedDate,  // Date from the table (static)
//             zone: row.cells[1].textContent || '',  // Zone from the table (static)
//             employee_code: row.cells[2].textContent || '',  // Employee code from the table (static)
//             employee_name: row.cells[3].textContent || '',  // Employee name from the table (static)
//             department: row.cells[4].textContent || '',  // Department from the table (static)
//             category: row.cells[5].textContent || '',  // Category from the table (static)
//             supervisor_name: row.cells[6].textContent || '',  // Supervisor name from the table (static)
//             shift: row.cells[7].querySelector('select').value || '', // Shift dropdown
//             sk: row.cells[8].querySelector('input').value || '',  // Manual input field for SK
//             sk_ot: row.cells[9].querySelector('input').value || '',  // Manual input field for OT
//             ssk: row.cells[10].querySelector('input').value || '',  // Manual input field for SSK
//             ssk_ot: row.cells[11].querySelector('input').value || '',  // Manual input field for OT (second)
//             usk: row.cells[12].querySelector('input').value || '',  // Manual input field for USK
//             usk_ot: row.cells[13].querySelector('input').value || '',  // Manual input field for OT (third)
//             // attendance: row.cells[13].querySelector('input').value || ''  // Manual input field for Attendance
//             attendance: attendanceStatus  // Capture the attendance status based on the checkbox
//         };

//         tableData.push(rowData); // Add each row data to the array
//         console.log(JSON.stringify(rowData));  // Log each row data for debugging
//     });

//     console.log("Prepared Table Data to Save:", JSON.stringify(tableData)); // Log full data

//     const accessToken = localStorage.getItem('accessToken');

//     if (!accessToken) {
//         alert('Access token is missing. Please log in again.');
//         return;
//     }

//     try {
//         const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/attendance/", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(tableData) // Send array directly
//         });

//         console.log('Response Status:', response.status, response.statusText); // Log the response

//         if (!response.ok) {
//             const errorResponse = await response.json();
//             console.error('Error Response from backend:', errorResponse);
//             alert('Attendance for this employee has already been recorded for this date.')
//             // alert(`Error: ${errorResponse.message || 'Failed to save employee data.'}`);
//             return;
//         }

//         alert('Employee data saved successfully!');
//         console.log('Data saved successfully:', await response.json()); // Log the successful response
//         resetForm();

//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while saving employee data.');
//     }
// }

async function saveTableData(event) {
    event.preventDefault(); // Prevents the page from refreshing

    const tbody = document.getElementById('employeeTableBody');
    const rows = tbody.querySelectorAll('tr');
    const tableData = [];

    // Loop through each row to collect the data
    rows.forEach(row => {
        const dateInput = row.querySelector('input[type="date"]').value;
        const formattedDate = new Date(dateInput).toISOString().split('T')[0];

        // Capture the checkbox value
        const isPresent = row.querySelector('.attendance-checkbox').checked;
        const attendanceStatus = isPresent ? true : false;

        // Function to get the value or default to 0 if empty
        const getInputValueOrZero = (cellIndex) => {
            const value = row.cells[cellIndex].querySelector('input').value;
            return value.trim() !== '' ? value : '0'; // Return '0' if empty
        };

        const rowData = {
            date_of_work: formattedDate,
            zone: row.cells[1].textContent || '',
            employee_code: row.cells[2].textContent || '',
            employee_name: row.cells[3].textContent || '',
            department: row.cells[4].textContent || '',
            category: row.cells[5].textContent || '',
            supervisor_name: row.cells[6].textContent || '',
            shift: row.cells[7].textContent || '',
            // shift: row.cells[7].querySelector('select').value || '',
            sk: getInputValueOrZero(8),
            sk_ot: getInputValueOrZero(9),
            ssk: getInputValueOrZero(10),
            ssk_ot: getInputValueOrZero(11),
            usk: getInputValueOrZero(12),
            usk_ot: getInputValueOrZero(13),
            attendance: attendanceStatus
        };

        tableData.push(rowData); 
        console.log(JSON.stringify(rowData)); 
    });

    console.log("Prepared Table Data to Save:", JSON.stringify(tableData));

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert('Access token is missing. Please log in again.');
        return;
    }

    try {
        const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/attendance/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(tableData) 
        });

        console.log('Response Status:', response.status, response.statusText);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error Response from backend:', errorResponse);
            alert('Attendance for this employee has already been recorded for this date.');
            return;
        }

        alert('Employee data saved successfully!');
        console.log('Data saved successfully:', await response.json()); 
        resetForm();

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving employee data.');
    }
}


let currentPage = 1; // Keep track of the current page
const recordsPerPage = 10; // Number of records to display per page
let totalPages = 1; // Total pages will be updated later
let employeesData = []; // This will hold the fetched employee data

function updateTable(employees) {
    employeesData = employees; // Store the employee data
    totalPages = Math.ceil(employeesData.length / recordsPerPage); // Calculate total pages
    displayPage(currentPage); // Display the first page
    toggleColumnVisibility()
    // updatePaginationInfo(); // Update pagination display
}


// correct by pratykti
const isAdmin = localStorage.getItem('isAdmin') ? JSON.parse(localStorage.getItem('isAdmin')) : false;
const userName = localStorage.getItem('user') || ''; // Fallback to empty string if not set
const supervisorErrorSpan = document.getElementById('empsuper_error');

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


// function displayPage(page) {
//     const tbody = document.getElementById('employeeTableBody');
//     tbody.innerHTML = ''; // Clear existing table data

//     // Calculate the start and end index for the current page
//     const startIndex = (page - 1) * recordsPerPage;
//     const endIndex = Math.min(startIndex + recordsPerPage, employeesData.length);

//     let rowsAdded = 0;

//     for (let i = startIndex; i < endIndex; i++) {
//         const employee = employeesData[i];
//         const today = new Date().toISOString().split('T')[0];

//         if (!employee.supervisor_name || employee.supervisor_name.trim() === '') {
//             console.warn(`Skipping employee with missing supervisor name:`, employee);
//             continue;
//         }

//         const row = `
//             <tr>
//                 <td><input type="date" value="${today}" disabled></td>
//                 <td class="zone-column">${employee.zone || 'N/A'}</td>
//                 <td>${employee.employee_code || 'N/A'}</td>
//                 <td>${employee.employee_name || 'No Name Available'}</td>
//                 <td class="department-column">${employee.department || 'N/A'}</td>
//                 <td class="category-column">${employee.category || 'N/A'}</td>
//                 <td class="supervisor-column">${employee.supervisor_name || 'N/A'}</td>
//                 <td class="no-border">
//                     <select class="shift-dropdown">
//                         <option value="A">A</option>
//                         <option value="B">B</option>
//                         <option value="C">C</option>
//                         <option value="G">G</option>
//                     </select>
//                 </td>
//                 <td class="no-border"><input type="text" class="attendance-field sk-field"></td>
                
                
//                 <td class="no-border"><input type="text"></td>
//                 <td class="no-border"><input type="text" class="attendance-field ssk-field"></td>
//                 <td class="no-border"><input type="text"></td>
//                 <td class="no-border"><input type="text" class="attendance-field usk-field"></td>
//                 <td class="no-border"><input type="text"></td>
//                 <td class="no-border">
//                     <input type="checkbox" class="attendance-checkbox">
//                 </td>
//             </tr>`;
//         tbody.innerHTML += row;
//         rowsAdded++;
//     }

//     // If no rows were added, show an alert and clear the table
//     if (rowsAdded === 0) {
//         alert("No data available for the entered supervisor name.");
//         tbody.innerHTML = ''; // Ensure the table is completely empty
//     }

//     // Attach event listeners to the SK, SSK, and USK fields
//     const attendanceFields = document.querySelectorAll('.sk-field, .ssk-field, .usk-field');
//     attendanceFields.forEach((field) => {
//         field.addEventListener('input', (event) => {
//             const row = event.target.closest('tr');
//             const checkbox = row.querySelector('.attendance-checkbox');

//             // Check if any SK, SSK, or USK field in the row has a value of "1"
//             const skValue = row.querySelector('.sk-field')?.value.trim();
//             const sskValue = row.querySelector('.ssk-field')?.value.trim();
//             const uskValue = row.querySelector('.usk-field')?.value.trim();

//             console.log(`SK: ${skValue}, SSK: ${sskValue}, USK: ${uskValue}`); // Debugging line

//             if (skValue === '1' || sskValue === '1' || uskValue === '1') {
//                 checkbox.checked = true;
//             } else {
//                 checkbox.checked = false;
//             }
//         });
//     });
// }

function toggleColumnVisibility() {
    const rows = document.querySelectorAll('#employeeTableBody tr');
    if (rows.length === 0) {
        console.warn('No rows to toggle visibility.');
        return;
    }

    rows.forEach(row => {
        row.querySelector('.zone-column')?.classList.toggle('hidden-column');
        row.querySelector('.department-column')?.classList.toggle('hidden-column');
        row.querySelector('.category-column')?.classList.toggle('hidden-column');
        row.querySelector('.supervisor-column')?.classList.toggle('hidden-column');
    });
}


// Pagination controls
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage); // Display the previous page
        updatePaginationInfo(); // Update pagination info display
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage); // Display the next page
        updatePaginationInfo(); // Update pagination info display
    }
}

function updatePaginationInfo() {
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

async function searchEmployeeByCode(event) {
    event.preventDefault();
    
    const supervisorName = document.getElementById('supervisor_name').value.trim().toUpperCase();
    const selectedShift = document.getElementById('shift_select').value; // Get selected shift from the form
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        alert('Access token is missing. Please log in again.');
        return;
    }

    if (!supervisorName) {
        alert("Please Enter Supervisor Name.");
        return;
    }

    try {
        const body = { supervisor_name: supervisorName };

        const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/employee/search/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.message || 'No employee data are available.'}`);
            return;
        }

        employeesData = await response.json(); // Store fetched data
        if (employeesData.length > 0) {
            displayPage(1, selectedShift); // Pass selected shift when calling displayPage
        } else {
            alert("No employees found with the provided criteria.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching employee data.');
    }
}

function displayPage(page, selectedShift) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = ''; // Clear existing table data

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, employeesData.length);

    let rowsAdded = 0;

    for (let i = startIndex; i < endIndex; i++) {
        const employee = employeesData[i];
        const today = new Date().toISOString().split('T')[0];

        if (!employee.supervisor_name || employee.supervisor_name.trim() === '') {
            console.warn(`Skipping employee with missing supervisor name:`, employee);
            continue;
        }

        const row = `
            <tr>
                <td><input type="date" value="${today}" disabled></td>
                <td class="zone-column">${employee.zone || 'N/A'}</td>
                <td>${employee.employee_code || 'N/A'}</td>
                <td>${employee.employee_name || 'No Name Available'}</td>
                <td class="department-column">${employee.department || 'N/A'}</td>
                <td class="category-column">${employee.category || 'N/A'}</td>
                <td class="supervisor-column">${employee.supervisor_name || 'N/A'}</td>
                <td class="no-border">${selectedShift || 'N/A'}</td>  <!-- Display Selected Shift -->
                <td class="no-border"><input type="text" class="attendance-field sk-field"></td>
                <td class="no-border"><input type="text"></td>
                <td class="no-border"><input type="text" class="attendance-field ssk-field"></td>
                <td class="no-border"><input type="text"></td>
                <td class="no-border"><input type="text" class="attendance-field usk-field"></td>
                <td class="no-border"><input type="text"></td>
                <td class="no-border">
                    <input type="checkbox" class="attendance-checkbox">
                </td>
            </tr>`;
        tbody.innerHTML += row;
        rowsAdded++;
    }

    // If no rows were added, show an alert and clear the table
    if (rowsAdded === 0) {
        alert("No data available for the entered supervisor name.");
        tbody.innerHTML = ''; // Ensure the table is completely empty
    }

    // Attach event listeners to the SK, SSK, and USK fields
    const attendanceFields = document.querySelectorAll('.sk-field, .ssk-field, .usk-field');
    attendanceFields.forEach((field) => {
        field.addEventListener('input', (event) => {
            const row = event.target.closest('tr');
            const checkbox = row.querySelector('.attendance-checkbox');

            // Check if any SK, SSK, or USK field in the row has a value of "1"
            const skValue = row.querySelector('.sk-field')?.value.trim();
            const sskValue = row.querySelector('.ssk-field')?.value.trim();
            const uskValue = row.querySelector('.usk-field')?.value.trim();

            console.log(`SK: ${skValue}, SSK: ${sskValue}, USK: ${uskValue}`); // Debugging line

            if (skValue === '1' || sskValue === '1' || uskValue === '1') {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    });
    toggleColumnVisibility();
    // attachEventListeners();
}

// Function to Attach Event Listeners for Attendance Fields
function attachEventListeners() {
    const attendanceFields = document.querySelectorAll('.sk-field, .ssk-field, .usk-field');
    attendanceFields.forEach((field) => {
        field.addEventListener('input', (event) => {
            const row = event.target.closest('tr');
            const checkbox = row.querySelector('.attendance-checkbox');

            const skValue = row.querySelector('.sk-field')?.value.trim();
            const sskValue = row.querySelector('.ssk-field')?.value.trim();
            const uskValue = row.querySelector('.usk-field')?.value.trim();

            console.log(`SK: ${skValue}, SSK: ${sskValue}, USK: ${uskValue}`); 

            checkbox.checked = (skValue === '1' || sskValue === '1' || uskValue === '1');
        });
    });
}







