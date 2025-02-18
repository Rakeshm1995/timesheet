function resetForm() {
    // Manually reset form fields by targeting each input element
    document.getElementById('fromdate').value = '';
    document.getElementById('todate').value = '';
    document.getElementById('employee_code').value = '';
    document.getElementById('employee_name').value = '';
    document.getElementById('supervisor_name').value = '';
    editingIndex = null;
    // Clear the table body (remove all rows)
    document.getElementById('employeeTableBody').innerHTML = '';

    // Optionally, clear the employeeData array (if you're storing table data in a variable)
    employeeData = [];
}

document.addEventListener('DOMContentLoaded', function () {
    // Automatically set today's date for fromDate and toDate
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromdate').value = today;
    document.getElementById('todate').value = today;

    document.getElementById('submit').addEventListener('click', async function (event) {
        event.preventDefault();

        const fromDate = document.getElementById('fromdate').value;
        const toDate = document.getElementById('todate').value;
        const employeeCode = document.getElementById('employee_code').value.trim();
        const supervisorName = document.getElementById('supervisor_name').value.trim().toUpperCase();

        // Validate the compulsory date range fields
        if (!fromDate || !toDate) {
            alert('Please provide a valid date range.');
            return;
        }

        // Fetch access token from local storage (if applicable)
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('Access token is missing. Please log in again.');
            return;
        }

        // Prepare API request body
        const requestBody = {
            from_date: fromDate,
            to_date: toDate,
            ...(employeeCode && { employee_code: employeeCode }),
            ...(supervisorName && { supervisor_name: supervisorName })
        };

        try {
            const response = await fetch('https://timesheet003.pythonanywhere.com/api/user/report/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                alert(`Error: ${errorResponse.message || 'Data are not available'}`);
                clearTable();
                return;
            }

            const result = await response.json();
            console.log("Fetched data:", result);

            // Initialize pagination with fetched data
            initializePagination(result);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching the data.');
        }
    });
});

// Function to clear the table
function clearTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = ''; // Remove all rows from the table
}

// Pagination variables
let currentPage = 1;
const recordsPerPage = 10;
let paginatedData = [];

// Function to initialize pagination
function initializePagination(data) {
    const totalPages = Math.ceil(data.length / recordsPerPage);
    paginatedData = data;

    // Render the first page
    renderPage(currentPage, paginatedData);

    // Create pagination controls
    createPaginationControls(totalPages);
}

// Function to render the current page
function renderPage(pageNumber, data) {
    const start = (pageNumber - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = data.slice(start, end);

    populateTable(pageData);
}

// Function to create pagination controls
function createPaginationControls(totalPages) {
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage, paginatedData);
            updatePaginationControls(totalPages);
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.toggle('active', i === currentPage);
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentPage, paginatedData);
            updatePaginationControls(totalPages);
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage, paginatedData);
            updatePaginationControls(totalPages);
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Function to update pagination controls state
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.querySelectorAll('button').forEach((button, index) => {
        if (index === 0) {
            // Update "Previous" button state
            button.disabled = currentPage === 1;
        } else if (index === paginationContainer.childElementCount - 1) {
            // Update "Next" button state
            button.disabled = currentPage === totalPages;
        } else {
            // Update page number buttons
            button.classList.toggle('active', parseInt(button.textContent) === currentPage);
        }
    });
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date_of_work}</td>
            <td>${entry.zone}</td>
            <td>${entry.employee_code}</td>
            <td>${entry.employee_name}</td>
            <td>${entry.department}</td>
            <td>${entry.category}</td>
            <td>${entry.supervisor_name}</td>
            <td>${entry.shift}</td>
            <td class="no-border"><input type="text" value="${entry.sk}" class="editable" disabled /></td>
            <td class="no-border"><input type="text" value="${entry.sk_ot}" class="editable" disabled /></td>
            <td class="no-border"><input type="text" value="${entry.ssk}" class="editable" disabled /></td>
            <td class="no-border"><input type="text" value="${entry.ssk_ot}" class="editable" disabled /></td>
            <td class="no-border"><input type="text" value="${entry.usk}" class="editable" disabled /></td>
            <td class="no-border"><input type="text" value="${entry.usk_ot}" class="editable" disabled /></td>
            <td class="no-border">
                <input type="checkbox" class="attendance-checkbox" ${entry.attendance ? 'checked' : ''} disabled />
            </td>
            <td>
                <button class="edit-btn" data-id="${entry.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="save-btn" data-id="${entry.id}" style="display:none;">
                    <i class="fas fa-save"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const row = event.target.closest('tr');

            // Enable editable fields
            row.querySelectorAll('.editable').forEach(input => input.disabled = false);

            // Add dropdown to the "Shift" column
            const shiftCell = row.cells[7]; // Assuming the shift is in the 7th cell
            const currentShift = shiftCell.textContent.trim(); // Get current value
            const shiftOptions = ['A', 'B', 'C', 'Gen']; // Replace with your actual shift options
            const select = document.createElement('select');

            shiftOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (option === currentShift) {
                    opt.selected = true; // Select current shift
                }
                select.appendChild(opt);
            });

            shiftCell.textContent = ''; // Clear the cell
            shiftCell.appendChild(select); // Add the dropdown

            // Enable attendance column checkboxes
            const attendanceColumns = [8, 9, 10, 11, 12, 13]; // Replace with actual indexes of attendance fields
            attendanceColumns.forEach(index => {
                const attendanceCell = row.cells[index];
                const checkbox = attendanceCell.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.disabled = false; // Enable checkbox
                }
            });

            // Enable the attendance checkbox specifically
            const attendanceCheckbox = row.querySelector('.attendance-checkbox');
            if (attendanceCheckbox) {
                attendanceCheckbox.disabled = false;
            }

            row.querySelector('.edit-btn').style.display = 'none';
            row.querySelector('.save-btn').style.display = 'inline';
        });
    });

    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', async function (event) {
            const row = event.target.closest('tr');
            const employee_code = row.cells[2].textContent.trim();
            const date_of_work = row.cells[0].textContent.trim();

            // Get updated values
            const updatedEntry = {
                shift: row.cells[7].querySelector('select').value || '', // Get the selected value
                sk: row.cells[8].querySelector('input').value.trim(),
                sk_ot: row.cells[9].querySelector('input').value.trim(),
                ssk: row.cells[10].querySelector('input').value.trim(),
                ssk_ot: row.cells[11].querySelector('input').value.trim(),
                usk: row.cells[12].querySelector('input').value.trim(),
                usk_ot: row.cells[13].querySelector('input').value.trim(),
                // attendance: row.cells[14].querySelector('input[type="checkbox"]').value.trim()
                attendance: row.cells[14].querySelector('input[type="checkbox"]').checked ? 'true' : 'false'

            };

            const apiUrl = `https://timesheet003.pythonanywhere.com/api/user/attendance/update/${date_of_work}/${employee_code}/`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify(updatedEntry)
                });
                console.log('Payload sent to server:', JSON.stringify(updatedEntry));

                if (response.ok) {
                    alert('Data updated successfully');

                    // Replace dropdown with the selected text
                    const shiftCell = row.cells[7];
                    const selectedShift = shiftCell.querySelector('select').value;
                    shiftCell.textContent = selectedShift;

                    // Disable editable fields
                    row.querySelectorAll('.editable').forEach(input => input.disabled = true);

                    // Show the Edit button and hide the Save button
                    row.querySelector('.edit-btn').style.display = 'inline';
                    row.querySelector('.save-btn').style.display = 'none';
                } else {
                    const errorResponse = await response.json();
                    alert(`Error: ${errorResponse.message}`);
                }
            } catch (error) {
                console.error('Error updating data:', error);
                alert('An error occurred while updating the data.');
            }
        });
    });
}







