

function validate() {
  document.getElementById('employeeForm').addEventListener('submit', function (event) {
    // var dateOfJoin = document.getElementById('dateOfJoin');
    var zone = document.getElementById('zone');
    var employeeCode = document.getElementById('employee_code');
    var employeeName = document.getElementById('employee_name');
    var department = document.getElementById('department');
    var category = document.getElementById('category');
    var supervisor = document.getElementById('supervisor');

    // var dateOfJoinError = document.getElementById('dateOfJoinError');
    var zoneerrormessage = document.getElementById('zone_error');
    var codeerrormessage = document.getElementById('empcode_error');
    var nameerrormessage = document.getElementById('empname_error');
    var depterrormessage = document.getElementById('empdept_error');
    var ctgerrormessage = document.getElementById('empctg_error');
    var supererrormessage = document.getElementById('empsuper_error');

    var valid = true;


    // Validate Zone
    if (zone.value === "") {
      zoneerrormessage.textContent = "Zone is required.";
      zoneerrormessage.style.display = "inline";
      zoneerrormessage.style.color = "red";
      zoneerrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      zoneerrormessage.style.display = "none";
    }

    // Validate Employee Code
    if (employeeCode.value.trim() === "") {
      codeerrormessage.textContent = "Employee Code is required.";
      codeerrormessage.style.display = "inline";
      codeerrormessage.style.color = "red";
      codeerrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      codeerrormessage.style.display = "none";
    }

    // Validate Employee Name
    if (employeeName.value.trim() === "") {
      nameerrormessage.textContent = "Employee Name is required.";
      nameerrormessage.style.display = "inline";
      nameerrormessage.style.color = "red";
      nameerrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      nameerrormessage.style.display = "none";
    }
    // Validate Department
    if (department.value.trim() === "") {
      depterrormessage.textContent = "Department is required.";
      depterrormessage.style.display = "inline";
      depterrormessage.style.color = "red";
      depterrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      depterrormessage.style.display = "none";
    }

    // Validate Category
    if (category.value.trim() === "") {
      ctgerrormessage.textContent = "Category is required.";
      ctgerrormessage.style.display = "inline";
      ctgerrormessage.style.color = "red";
      ctgerrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      ctgerrormessage.style.display = "none";
    }

    //Validate Supervisor
    if (supervisor.value.trim() === "") {
      supererrormessage.textContent = "Supervisor name is required.";
      supererrormessage.style.display = "inline";
      supererrormessage.style.color = "red";
      supererrormessage.style.fontSize = "12px";
      valid = false;
    } else {
      supererrormessage.style.display = "none";
    }

    // Prevent form submission if any field is invalid
    if (!valid) {
      event.preventDefault();
    }
  });

}

let employeeData = [];
let editingIndex = null;

// Automatically set today's date
document.getElementById('date').valueAsDate = new Date();

// function saveData() {
//   const formData = getFormData();

//   if (!formData) return; // Validation failure

//   if (editingIndex === null) {
//     employeeData.push(formData); // Add new data
//   } else {
//     employeeData[editingIndex] = formData; // Update existing data
//     editingIndex = null;
//   }

//   console.log("Updated employeeData:", employeeData); // Log the updated employee data

//   updateTable();
//   resetForm();

//   // Clear the table (optional step if needed)
//   setTimeout(() => {
//     employeeTableBody.innerHTML = ''; // Clear the table after 2 seconds
//   }, 3000);

//   const accessToken = localStorage.getItem('accessToken'); // Retrieve access token from localStorage
//   postDataToDatabase(formData, accessToken); // Save to database using API

//   document.getElementById('date').valueAsDate = new Date();
// }

// document.getElementById("saveButton").addEventListener("click", function (event) {
//   saveData(event); // Pass the event object to prevent default behavior
// });


function saveData(event) {
  if (event) event.preventDefault(); // Prevent page refresh

  const formData = getFormData();

  // if (!formData) {
  //   alert("Please fill all the fields."); // Show validation message
  //   return; // Exit the function if validation fails
  // }
  if (!formData) return; // Validation failure

  if (editingIndex === null) {
    employeeData.push(formData); // Add new data
  } else {
    employeeData[editingIndex] = formData; // Update existing data
    editingIndex = null;
  }

  console.log("Updated employeeData:", employeeData); // Log the updated employee data

  updateTable();
  resetForm();

  // Clear the table (optional step if needed)
  setTimeout(() => {
    employeeTableBody.innerHTML = ''; // Clear the table after 2 seconds
  }, 3000);

  const accessToken = localStorage.getItem('accessToken'); // Retrieve access token from localStorage
  postDataToDatabase(formData, accessToken); // Save to database using API

  document.getElementById('date').valueAsDate = new Date();
}



document.addEventListener('DOMContentLoaded', function () {
  function updateData() {
    document.getElementById('updateButton').addEventListener('click', async function (event) {
      event.preventDefault(); // Prevent form from refreshing the page

      // Get form field values
      const dateOfWork = document.getElementById('date').value;
      const zone = document.getElementById('zone').value;
      const employeeCode = document.getElementById('employee_code').value;
      const employeeName = document.getElementById('employee_name').value;
      const department = document.getElementById('department').value;
      const category = document.getElementById('category').value;
      const supervisorName = document.getElementById('supervisor_name').value;

      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken); // Print the token for debugging

      if (!accessToken) {
        alert('Access token is missing. Please log in again.');
        return;
      }

      // Prepare the data to be sent
      const updatedData = {
        date: dateOfWork,
        zone: zone,
        employee_code: employeeCode,
        employee_name: employeeName,
        department: department,
        category: category,
        supervisor_name: supervisorName
      };

      console.log(updatedData);
      console.log(JSON.stringify(updatedData));

      updateTable();

      try {
        // Sending the PUT request to update employee data based on employee code
        const response = await fetch(`https://timesheet003.pythonanywhere.com/api/user/employees/${employeeCode}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` // Add authorization if needed
          },
          body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
          alert('Employee details updated successfully!');
          // Optionally, reset the form after update
          document.getElementById('employeeForm').reset();
          editingIndex = null;
        } else {
          alert(`Failed to update: ${result.message}`);
        }
      } catch (error) {
        console.error('Error updating employee data:', error);
        alert('An error occurred while updating. Please try again.');
      }
    });
  }

  updateData(); // Call the function after DOM is loaded
  updateTable();
});

function updateTable(data = employeeData) {
  const tbody = document.getElementById('employeeTableBody');
  tbody.innerHTML = '';

  data.forEach((employee, index) => {
    // const row = `<tr ondblclick="editRow(${index})">
    const row = `<tr>
              <td>${employee.date}</td>
              <td>${employee.zone}</td>
              <td>${employee.employee_code}</td>
              <td>${employee.employee_name}</td>
              <td>${employee.department}</td>
              <td>${employee.category}</td>
              <td>${employee.supervisor_name}</td>
              <td>
                  <i class="fas fa-edit" style="cursor: pointer;" onclick="editRow(${index})"></i>
                  
                  <i class="fas fa-trash" style="cursor: pointer;" onclick="deleteRow('${employee.employee_code}')"></i>

             </td>
          </tr>`;

    tbody.innerHTML += row;
  });
}

function highlightRow(index) {
  const rows = document.querySelectorAll('#employeeTableBody tr');
  rows.forEach((row, i) => row.classList.toggle('highlighted', i === index));
}

// Search and auto-fill the form when employee_code is entered

async function searchEmployeeByCode(event) {
  if (event) event.preventDefault(); // Prevent page refresh

  const zone = document.getElementById("zone").value.trim();
  const employeeCode = document.getElementById("employee_code").value.trim();
  const supervisorName = document.getElementById('supervisor_name').value.trim().toUpperCase();

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    alert('Access token is missing. Please log in again.');
    return;
  }

  // Validate that at least one field is filled
  if (!zone && !employeeCode && !supervisorName) {
    alert("Please select zone or enter Employee Code or Supervisor Name.");
    return;
  }

  console.log("Zone:", zone);
  console.log("Employee Code:", employeeCode);
  console.log("Supervisor Name:", supervisorName);

  try {
    const body = {};
    if (zone) {
      body.zone = zone; // Include zone if provided
    }
    if (employeeCode) {
      body.employee_code = employeeCode; // Include employee code if provided
    }
    if (supervisorName) {
      body.supervisor_name = supervisorName; // Include supervisor name if provided
    }

    const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/employee/search/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body) // Send the body object dynamically
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error Response from backend:', errorResponse);
      alert("Supervisor name does not exixt.");
      clearTable();
      throw new Error('Failed to fetch employee data.');
    }

    const employee = await response.json();
    console.log("Fetched Employee Data:", employee); // Check the structure

    // Ensure employee is defined and has necessary properties
    if (employee && Array.isArray(employee) && employee.length > 0) {
      currentPage = 1; // Reset to first page
      // fillFormFields(employee[0]); // Fill form fields with the first employee's data
      updateTable(employee); // Update table with the fetched employee data
      // displayPage(currentPage); // Display the first page
    } else {
      alert("No employee found with the provided criteria.");
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to clear the table
function clearTable() {
  const tbody = document.getElementById('employeeTableBody');
  tbody.innerHTML = ''; // Remove all rows from the table
}

// Function to auto-fill the form fields with the fetched employee data
function fillFormFields(employee) {
  if (employee && employee.date) {
    let formattedDate;

    // Check if the date is already in yyyy-MM-dd format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression to match yyyy-MM-dd format

    if (datePattern.test(employee.date)) {
      // If the date is already in yyyy-MM-dd format, use it directly
      formattedDate = employee.date;
    } else {
      // Assume the date is in dd-MM-yyyy format
      const dateParts = employee.date.split("-");

      if (dateParts.length === 3) {
        // Make sure the split resulted in 3 parts
        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange to yyyy-MM-dd
      } else {
        // If not, handle as needed (e.g., set to empty or log an error)
        console.error("Invalid date format:", employee.date);
        formattedDate = ""; // Or you can choose to keep it unchanged
      }
    }

    // Set the formatted date value
    document.getElementById('date').value = formattedDate; // Set value in yyyy-MM-dd format
  } else {
    document.getElementById('date').value = ""; // Handle if date is missing
  }

  // Set other form fields
  document.getElementById('zone').value = employee.zone || '';
  document.getElementById('employee_code').value = employee.employee_code || '';
  document.getElementById('employee_name').value = employee.employee_name || '';
  document.getElementById('department').value = employee.department || '';
  document.getElementById('category').value = employee.category || '';
  document.getElementById('supervisor_name').value = employee.supervisor_name || '';
}

function getFormData() {
  const date = document.getElementById('date').value;
  const zone = document.getElementById('zone').value;
  const employeeCode = document.getElementById('employee_code').value.trim();
  const employeeName = document.getElementById('employee_name').value.trim();
  const department = document.getElementById('department').value.trim();
  const category = document.getElementById('category').value.trim();
  const supervisor_name = document.getElementById('supervisor_name').value.trim();

  if (!date || !zone || !employeeCode || !employeeName || !department || !category || !supervisor_name) {
    alert('Please fill in all fields.');
    return null;
  }

  return { date, zone, employee_code: employeeCode, employee_name: employeeName, department, category, supervisor_name };
}

function editRow(index) {
  alert("Are you sure want to Edit?")

  // Function to populate form when a row is clicked
  function populateForm(date, zone, employee_code, employee_name, department, category, supervisor_name) {
    // Find the form fields by their IDs
    document.getElementById('date').value = date;
    document.getElementById('zone').value = zone;
    document.getElementById('employee_code').value = employee_code;
    document.getElementById('employee_name').value = employee_name;
    document.getElementById('department').value = department;
    document.getElementById('category').value = category;
    document.getElementById('supervisor_name').value = supervisor_name;
    console.log("Populated Zone:", zone); // Log populated value
  }

  // Add event listeners to table rows
  document.querySelectorAll('#tabledata tr').forEach(row => {
    row.addEventListener('click', function () {
      // Get the data from the clicked row
      const date = this.cells[0].innerText;
      const zone = this.cells[1].innerText;
      const employee_code = this.cells[2].innerText;
      const employee_name = this.cells[3].innerText;
      const department = this.cells[4].innerText;
      const category = this.cells[5].innerText;
      const supervisor_name = this.cells[6].innerText;

      // Populate the form fields
      populateForm(date, zone, employee_code, employee_name, department, category, supervisor_name);

      console.log("Date:", date);
      console.log("Zone:", zone);

      console.log("Employee Code:", employee_code);
      console.log("Employee Name:", employee_name);
      console.log("Department:", department);
      console.log("Category:", category);
      console.log("Supervisor Name:", supervisor_name);
    });
  });
}


async function deleteRow(employeeCode) {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    alert('Access token is missing. Please log in again.');
    return;
  }

  // Confirm deletion
  const confirmDelete = confirm(`Are you sure you want to delete employee with code: ${employeeCode}?`);
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://timesheet003.pythonanywhere.com/api/user/employees/${employeeCode}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Check for response status
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error Response from backend:', errorResponse);
      alert('Failed to delete employee data: ' + (errorResponse.message || 'Unknown error'));
      return;
    }

    alert("Employee successfully deleted!");

    // Remove the table row from the DOM
    const rowElement = document.querySelector(`tr[data-employee-code="${employeeCode}"]`);
    if (rowElement) {
      rowElement.remove();
    }

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while deleting employee data.');
  }
}

function resetForm() {
  document.getElementById('employeeForm').reset();
  editingIndex = null;
  // Clear the table body (remove all rows)
  document.getElementById('employeeTableBody').innerHTML = '';

  // Optionally, clear the employeeData array (if you're storing table data in a variable)
  employeeData = [];
}

async function postDataToDatabase(data) {
  const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token
  console.log('Access Token:', accessToken); // Print the token for debugging

  if (!accessToken) {
    alert('Access token is missing. Please log in again.');
    return;
  }

  try {
    const response = await fetch('https://timesheet003.pythonanywhere.com/api/user/employees/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Ensure correct formatting
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error Response from backend:', errorResponse);
      alert('employee with this employee code already exists.', errorResponse);
      throw new Error('Failed to save data.');
    }

    const responseData = await response.json();
    console.log('Data successfully saved:', responseData);
    alert('Data successfully saved:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Search function to filter employee data based on input
function searchEmployee() {
  const input = document.getElementById("searchInput").value.toUpperCase();
  const table = document.getElementById("tabledata");
  const rows = table.getElementsByTagName("tr");

  // Loop through all table rows (except the first one for the headers)
  for (let i = 1; i < rows.length; i++) {
    const employeeCodeCell = rows[i].getElementsByTagName("td")[2]; // Employee Code column
    const employeeNameCell = rows[i].getElementsByTagName("td")[3]; // Employee Name column
    const employeeCode = employeeCodeCell.textContent.toUpperCase();
    const employeeName = employeeNameCell.textContent.toUpperCase();

    // Check if input matches employee name or employee code
    if (employeeCode.indexOf(input) > -1 || employeeName.indexOf(input) > -1) {
      rows[i].style.display = ""; // Show the row if it matches
    } else {
      rows[i].style.display = "none"; // Hide the row if it doesn't match
    }
  }
}

function downloadExcel() {
  const table = document.getElementById("tabledata");

  if (!table) {
    alert('No data available to download.');
    return;
  }

  // Convert HTML table to Excel workbook
  const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

  // Export the workbook as an Excel file
  XLSX.writeFile(wb, "EmployeeData.xlsx");
}


async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById("tabledata");

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
  doc.save("EmployeeData.pdf");
}












