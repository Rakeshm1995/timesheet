document.addEventListener('DOMContentLoaded', function () {
    // Automatically set today's date for fromDate and toDate
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('from-date').value = today;
    document.getElementById('to-date').value = today;

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission
    // console.log("Daily report button clicked.");
    // Your code here
});
});

const isAdmin = localStorage.getItem('isAdmin') ? JSON.parse(localStorage.getItem('isAdmin')) : false;
const userName = localStorage.getItem('user') || ''; // Fallback to empty string if not set
const supervisorErrorSpan = document.getElementById('empsuper_error');
const supervisorName = document.getElementById("supervisor-name");

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

const apiURL = 'https://timesheet003.pythonanywhere.com/api/user/jobsheet_timesheet/';

async function fetchReport() {
  const fromDate = document.getElementById('from-date').value;
  const toDate = document.getElementById('to-date').value;
  const supervisorName = document.getElementById('supervisor-name').value;
  const accessToken = localStorage.getItem('accessToken');

  // Validate the input
  if (!fromDate || !toDate) {
    alert('Please select both From Date and To Date.');
    return;
  }

  // Prepare request payload
  const requestData = {
    from_date: fromDate,
    to_date: toDate,
    supervisor_name: supervisorName || null,
  };

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      console.log(`Request URL: ${apiURL}`);
      console.log(`Request Data:`, requestData);
      // alert('Failed to fetch the report. Please try again later.');
      alert("No records found for the given criteria.");
      return;
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Process and display data
    displayReport(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('An error occurred while fetching the report. Please check your connection and try again.');
  }
}


function formatValue(value) {
  // Check if the value is an integer
  return Number.isInteger(value) ? value : value.toFixed(2);
}

// function displayReport(data) {
//   if (!data.attendance_records || !data.job_set_summary) {
//     console.error('Unexpected response format:', data);
//     return;
//   }

//   const tableBody = document.querySelector('#reportTable tbody');

//   // Clear existing table rows (if any)
//   tableBody.innerHTML = '';

//   // Combine data from job_set_summary and attendance_records by date and supervisor_name
//   const groupedData = {};

//   // Helper function to create unique keys
//   const getKey = (date, supervisorName) => `${date}_${supervisorName || 'N/A'}`;

//   // Process job_set_summary data
//   data.job_set_summary.forEach((item) => {
//     const key = getKey(item.date, item.supervisor_name);

//     if (!groupedData[key]) {
//       groupedData[key] = {
//         date: item.date,
//         supervisor_name: item.supervisor_name || 'N/A',
//         job_set: {
//           skilled: formatValue(item.skilled || 0),
//           semi_skilled: formatValue(item.semi_skilled || 0),
//           unskilled: formatValue(item.unskilled || 0),
//         },
//         timesheet: {
//           skilled: 0,
//           semi_skilled: 0,
//           unskilled: 0,
//         },
//       };
//     } else {
//       // Sum job set details if already present
//       groupedData[key].job_set.skilled = formatValue(
//         parseFloat(groupedData[key].job_set.skilled) + (item.skilled || 0)
//       );
//       groupedData[key].job_set.semi_skilled = formatValue(
//         parseFloat(groupedData[key].job_set.semi_skilled) + (item.semi_skilled || 0)
//       );
//       groupedData[key].job_set.unskilled = formatValue(
//         parseFloat(groupedData[key].job_set.unskilled) + (item.unskilled || 0)
//       );
//     }
//   });

//   // Process attendance_records data, checking if the data exists before using it
//   if (data.attendance_records && data.attendance_records.length > 0) {
//     data.attendance_records.forEach((record) => {
//       const key = getKey(record.date, record.supervisor_name);

//       if (!groupedData[key]) {
//         groupedData[key] = {
//           date: record.date,
//           supervisor_name: record.supervisor_name || 'N/A',
//           job_set: {
//             skilled: 0,
//             semi_skilled: 0,
//             unskilled: 0,
//           },
//           timesheet: {
//             skilled: formatValue(record.total_sk || 0),
//             semi_skilled: formatValue(record.total_ssk || 0),
//             unskilled: formatValue(record.total_usk || 0),
//           },
//         };
//       } else {
//         // Sum timesheet details if already present, using default values of 0 for null or undefined
//         groupedData[key].timesheet.skilled = formatValue(
//           parseFloat(groupedData[key].timesheet.skilled) + (record.total_sk || 0)
//         );
//         groupedData[key].timesheet.semi_skilled = formatValue(
//           parseFloat(groupedData[key].timesheet.semi_skilled) + (record.total_ssk || 0)
//         );
//         groupedData[key].timesheet.unskilled = formatValue(
//           parseFloat(groupedData[key].timesheet.unskilled) + (record.total_usk || 0)
//         );
//       }
//     });
//   } else {
//     console.warn('No attendance records found.');
//   }

//   // Sort the grouped data by date and supervisor name (ascending)
//   const sortedData = Object.values(groupedData).sort((a, b) => {
//     const dateComparison = new Date(a.date) - new Date(b.date);
//     if (dateComparison !== 0) return dateComparison;

//     // If dates are the same, compare supervisor names
//     return a.supervisor_name.localeCompare(b.supervisor_name);
//   });

//   // Generate table rows grouped by date and supervisor_name, combining job_set and timesheet data
//   sortedData.forEach((entry) => {
//     const row = document.createElement('tr');

//     // Combine the job_set and timesheet data into a single row
//     const jobSet = entry.job_set;
//     const timesheet = entry.timesheet;

//     row.innerHTML = `
//       <td>${entry.date}</td>
//       <td>${entry.supervisor_name}</td>
//       <td style="background-color: ${parseFloat(jobSet.skilled) < parseFloat(timesheet.skilled) ? 'red' : 'transparent'};">${jobSet.skilled}</td>
//       <td style="background-color: ${parseFloat(jobSet.semi_skilled) < parseFloat(timesheet.semi_skilled) ? 'red' : 'transparent'};">${jobSet.semi_skilled}</td>
//       <td style="background-color: ${parseFloat(jobSet.unskilled) < parseFloat(timesheet.unskilled) ? 'red' : 'transparent'};">${jobSet.unskilled}</td>
//       <td>${timesheet.skilled}</td>
//       <td>${timesheet.semi_skilled}</td>
//       <td>${timesheet.unskilled}</td>
//     `;

//     tableBody.appendChild(row);
//   });
// }

function displayReport(data) {
  if (!data.attendance_records || !data.job_set_summary) {
    console.error('Unexpected response format:', data);
    return;
  }

  const tableBody = document.querySelector('#reportTable tbody');
  tableBody.innerHTML = ''; // Clear existing table rows (if any)

  const groupedData = {};

  // Helper function to create a normalized unique key
  const getKey = (date, supervisorName) => {
    return `${date}_${(supervisorName || 'N/A').trim().toLowerCase()}`;
  };

  // Process job_set_summary data
  data.job_set_summary.forEach((item) => {
    const key = getKey(item.date, item.supervisor_name);

    if (!groupedData[key]) {
      groupedData[key] = {
        date: item.date,
        supervisor_name: item.supervisor_name || 'N/A',
        job_set: {
          skilled: formatValue(item.skilled || 0),
          semi_skilled: formatValue(item.semi_skilled || 0),
          unskilled: formatValue(item.unskilled || 0),
        },
        timesheet: { skilled: 0, semi_skilled: 0, unskilled: 0 }
      };
    } else {
      groupedData[key].job_set.skilled = formatValue(
        parseFloat(groupedData[key].job_set.skilled) + (item.skilled || 0)
      );
      groupedData[key].job_set.semi_skilled = formatValue(
        parseFloat(groupedData[key].job_set.semi_skilled) + (item.semi_skilled || 0)
      );
      groupedData[key].job_set.unskilled = formatValue(
        parseFloat(groupedData[key].job_set.unskilled) + (item.unskilled || 0)
      );
    }
  });

  // Process attendance_records data
  data.attendance_records.forEach((record) => {
    const key = getKey(record.date, record.supervisor_name);

    if (!groupedData[key]) {
      groupedData[key] = {
        date: record.date,
        supervisor_name: record.supervisor_name || 'N/A',
        job_set: { skilled: 0, semi_skilled: 0, unskilled: 0 },
        timesheet: {
          skilled: formatValue(record.total_sk || 0),
          semi_skilled: formatValue(record.total_ssk || 0),
          unskilled: formatValue(record.total_usk || 0)
        }
      };
    } else {
      groupedData[key].timesheet.skilled = formatValue(
        parseFloat(groupedData[key].timesheet.skilled) + (record.total_sk || 0)
      );
      groupedData[key].timesheet.semi_skilled = formatValue(
        parseFloat(groupedData[key].timesheet.semi_skilled) + (record.total_ssk || 0)
      );
      groupedData[key].timesheet.unskilled = formatValue(
        parseFloat(groupedData[key].timesheet.unskilled) + (record.total_usk || 0)
      );
    }
  });

  // Sort grouped data
  const sortedData = Object.values(groupedData).sort((a, b) => {
    const dateComparison = new Date(a.date) - new Date(b.date);
    return dateComparison !== 0 ? dateComparison : a.supervisor_name.localeCompare(b.supervisor_name);
  });

  // Generate table rows
  sortedData.forEach((entry) => {
    const row = document.createElement('tr');
    const { job_set, timesheet } = entry;

    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.supervisor_name}</td>
      <td style="background-color: ${parseFloat(job_set.skilled) < parseFloat(timesheet.skilled) ? 'red' : 'transparent'};">${job_set.skilled}</td>
      <td style="background-color: ${parseFloat(job_set.semi_skilled) < parseFloat(timesheet.semi_skilled) ? 'red' : 'transparent'};">${job_set.semi_skilled}</td>
      <td style="background-color: ${parseFloat(job_set.unskilled) < parseFloat(timesheet.unskilled) ? 'red' : 'transparent'};">${job_set.unskilled}</td>
      <td>${timesheet.skilled}</td>
      <td>${timesheet.semi_skilled}</td>
      <td>${timesheet.unskilled}</td>
    `;
    tableBody.appendChild(row);
  });
}



function downloadExcel() {
  const table = document.querySelector('#reportTable table'); // Get the table

  // Convert the table to a worksheet and include styles
  const worksheet = XLSX.utils.table_to_sheet(table, { raw: true });

  // Loop through each cell to apply background color styling for mismatched values
  const rows = worksheet['!rows'] || []; // Get existing row styling data
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const cells = row['cells'];

    // Iterate over each cell in the row to check and apply the styles
    cells.forEach((cell, colIndex) => {
      if (cell && cell.s && cell.s.fill && cell.s.fill.fgColor.rgb === 'FF0000') { // Check if red color was applied
        const excelCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })];
        if (!excelCell) {
          worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })] = {};
        }

        // Set the background color for the highlighted cells (for Excel)
        worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })].s = {
          fill: {
            fgColor: { rgb: 'FF0000' }, // Red color for mismatch
          },
        };
      }
    });
  }

  // Create a new workbook with the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  // Export the workbook to Excel format
  XLSX.writeFile(workbook, 'report.xlsx');
}







  