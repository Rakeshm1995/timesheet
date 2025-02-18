document.getElementById('logoutIcon').addEventListener('click', function (event) {
    event.preventDefault();
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        window.location.href = "SignIn.html";
        // Perform actual logout action here, e.g., redirect or clear session
        alert("Logging out...");
    }
});

// Function to display navigation items based on the user role
function displayNavbar(isAdmin) {
    // Get references to the navigation items
    const employeeDetails = document.getElementById('addEmployeeLink'); // Link to employee details
    const timeSheetUpdate = document.getElementById('timeSheetUpdateLink'); // Link to time sheet update
    const timeSheetEntry = document.getElementById('timeSheetLink'); // Link to time sheet entry
    const jobsetEntry = document.getElementById('jobsetLink'); // Link to time sheet entry
    const reports = document.getElementById('reportsLink'); // Link to reports
    const register = document.getElementById('RegisterLink'); // Link to register
    const logoutButton = document.getElementById('logoutIcon'); // Logout button

    // Check if all elements exist
    if (!employeeDetails || !timeSheetUpdate || !timeSheetEntry || !reports || !register || !logoutButton || !jobsetEntry) {
        console.error('One or more nav items not found');
        return; // Exit if any element does not exist
    }

    // Show/hide items based on role
    if (isAdmin) {
        // Show admin items
        employeeDetails.style.display = 'block';
        timeSheetUpdate.style.display = 'block';
        register.style.display = 'block';
    } else {
        // Hide admin items
        employeeDetails.style.display = 'none';
        timeSheetUpdate.style.display = 'none';
        register.style.display = 'none';
    }

    // Always show these items for both roles
    timeSheetEntry.style.display = 'block';
    reports.style.display = 'block';

    // Attach logout functionality
    // attachLogoutFunctionality();
}

// Wait for the DOM to fully load before executing script
document.addEventListener('DOMContentLoaded', function () {
    // Assuming `isAdmin` is dynamically determined by your login logic
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')); // Retrieve the boolean value

    if (typeof isAdmin !== 'boolean') {
        console.error('isAdmin is not a boolean value');
        return; // Exit if isAdmin is not properly set
    }

    displayNavbar(isAdmin);
});

// Example: Scroll to the top of the sidebar on page load
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.side-menu');
    sidebar.scrollTop = 0;
  });
  
  // Example: Programmatically scroll the sidebar to a specific position
  function scrollToPosition(position) {
    const sidebar = document.querySelector('.side-menu');
    sidebar.scrollTop = position;
  }