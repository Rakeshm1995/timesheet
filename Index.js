//For forgot password
// Get elements
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordPopup = document.getElementById('forgotPasswordPopup');
const closePopup = document.getElementById('closePopup');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const sendOtpButton = document.getElementById('sendOtp');

// Open the popup when clicking "Forgot Password"
forgotPasswordLink.addEventListener('click', function (event) {
    event.preventDefault();
    forgotPasswordPopup.style.display = 'flex';
});

// Close the popup when clicking the close button
closePopup.addEventListener('click', function () {
    forgotPasswordPopup.style.display = 'none';
});

// Close the popup if clicked outside the form
window.addEventListener('click', function (event) {
    if (event.target === forgotPasswordPopup) {
        forgotPasswordPopup.style.display = 'none';
    }
});

// Send OTP when clicking the "Send OTP" button
sendOtpButton.addEventListener('click', function () {
    const email = document.getElementById('forgotEmail').value;
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
    } else {
        alert('OTP sent to ' + email);
    }
});

//For Login
const registerLink = document.getElementById('registerLink');
const registrationPopup = document.getElementById('registrationPopup');
const closePopup2 = document.getElementById('closePopup2');

// Open the popup when clicking "Register" link
// registerLink.addEventListener('click', function (event) {
//     event.preventDefault();
//     registrationPopup.style.display = 'flex';
// });

// // Close the popup when clicking the close button
// closePopup2.addEventListener('click', function () {
//     registrationPopup.style.display = 'none';
// });

// // Close the popup if clicked outside the form
// window.addEventListener('click', function (event) {
//     if (event.target === registrationPopup) {
//         registrationPopup.style.display = 'none';
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const user_name = document.getElementById('text').value; // Ensure this ID matches your form's input ID
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://timesheet003.pythonanywhere.com/api/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_name, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful sign-in
                console.log(data); // Log the response data

                // Extract tokens and user role from the response
                const accessToken = data.Token.access;
                const refreshToken = data.Token.refresh;
                const isAdmin = data.user.is_admin;
                const user = data.user.user_name;


                // Save tokens and user role to localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken); // Optional: Store refresh token
                localStorage.setItem('isAdmin', isAdmin);
                localStorage.setItem('user', user);

                // Log tokens and user role to the console
                console.log('Access Token:', accessToken);
                console.log('Refresh Token:', refreshToken); 
                console.log("isAdmin:", isAdmin); // Optional
                console.log("user:", user); 

                alert('Sign-in successful!');
                window.location.href = "TimesheetEntry.html";

                // Call function to display navbar based on user role
                displayNavbar(isAdmin); // Call the function from navbar.js

            } else {
                const error = await response.json();
                // alert(`Error in sign-in: ${error.message}`);
                alert(`Error in sign-in`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // const fullname = document.getElementById('regName').value;
        const user_name = document.getElementById('regEmail').value; // Updated to match your form's input ID
        const name = document.getElementById('regName').value;
        const password = document.getElementById('regPassword').value;
        const password2 = document.getElementById('regConfirmPassword').value;

        // Clear previous error messages
        // document.getElementById('fullnameError').innerText = '';
        document.getElementById('usernameError').innerText = '';
        document.getElementById('fullnameError').innerText = '';
        // document.getElementById('emailError').innerText = '';
        document.getElementById('passwordError').innerText = '';
        document.getElementById('confirmPasswordError').innerText = '';
        document.getElementById('successMessage').innerText = '';

        let isValid = true;


        if (user_name.length < 3) {
            showError('usernameError', 'Username must be at least 3 characters long.');
            isValid = false;
        }

        if (name.length < 5) {
            showError('fullnameError', 'Username must be at least 5 characters long.');
            isValid = false;
        }

        // if (user_name.length < 3) {
        //     showError('usernameError', 'Username must be at least 3 characters long.');
        //     isValid = false;
        // }

        // const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        // if (!email.match(emailPattern)) {
        //     showError('emailError', 'Please enter a valid email.');
        //     isValid = false;
        // }

        // Password must be at least 6 characters
        if (password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (password !== password2) {
            showError('confirmPasswordError', 'Passwords do not match.');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('https://novazen007.pythonanywhere.com/api/user/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Make sure this is set to JSON
                    },
                    body: JSON.stringify({
                        // email,
                        // name,
                        // fullname,
                        user_name,
                        name,
                        password,
                        password2 // Confirm this matches the server's expectations
                    })
                });
        
                // Check if response is okay
                if (response.ok) {
                    const result = await response.json(); // Parse the response as JSON
                    document.getElementById('successMessage').innerText = 'Registration successful!';
                    registrationForm.reset();
                } else {
                    const result = await response.json(); // Parse error message
                    document.getElementById('successMessage').innerText = `Error in Registration: ${result.message}`;
                }
            } catch (error) {
                document.getElementById('successMessage').innerText = 'An error occurred during registration.';
            }
        }
        
    });

    // Function to show error messages
    function showError(elementId, message) {
        document.getElementById(elementId).innerText = message;
    }
});


// for forget password
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const forgotPasswordPopup = document.getElementById('forgotPasswordPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const sendOtpBtn = document.getElementById('sendOtp');
    const resetPasswordForm = document.getElementById('forgotPasswordForm');
    const otpInput = document.getElementById('otp');
    const forgotEmailInput = document.getElementById('forgotEmail');
    const newPasswordInput = document.getElementById('newPassword');
    // const confirmPasswordInput = document.getElementById('confirmPassword');

    // Event to close the popup
    closePopupBtn.addEventListener('click', function () {
        forgotPasswordPopup.style.display = 'none';
    });

    // Event to send OTP
    sendOtpBtn.addEventListener('click', async function () {
        const email = forgotEmailInput.value.trim();

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
      
        try {
            // Call the API to send OTP (assuming you have an endpoint for this)
            const response = await fetch('https://novazen007.pythonanywhere.com/api/user/sendOtp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert('OTP sent to your email!');
            } else {
                const errorData = await response.json();
                // alert(`Error: ${errorData.message}`);
                alert("Please enter valid Email.")
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again later.');
        }
    });


    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const email = forgotEmailInput.value.trim();
        const otp = otpInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        // const confirmPassword = confirmPasswordInput.value.trim();
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
            alert('Access token is missing. Please log in again.');
            return;
          }

        // Validate form inputs
        if (!email || !otp || !newPassword) {
            alert('Please fill out all fields.');
            return;
        }
    
        // if (newPassword !== confirmPassword) {
        //     alert('Passwords do not match.');
        //     return;
        // }
    
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            // Call the API to reset the password
            const response = await fetch('https://novazen007.pythonanywhere.com/api/user/reset-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: email,            // Ensure correct field names
                    otp: otp,                // Ensure correct field names
                    new_password: newPassword
                })
            });
    
            if (response.ok) {
                alert('Password reset successfully!');
                forgotPasswordPopup.style.display = 'none';
            } else {
                const errorData = await response.json();
                console.error('Error in password reset:', errorData); // Log entire error response for better understanding
                alert(`Error: ${errorData.message || errorData.detail || 'Failed to reset password'}`);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again later.');
        }
    });
    
    // Utility function to validate email format
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});

function displayNavbar(isAdmin) {
    // Get references to the navigation items and icons
    const employeeDetails = document.getElementById('addEmployeeLink'); // Link to employee details
    const timeSheetUpdate = document.getElementById('timeSheetUpdateLink'); // Link to time sheet update
    const timeSheetEntry = document.getElementById('timeSheetLink'); // Link to time sheet entry
    const reports = document.getElementById('reportsLink'); // Link to reports
    const register = document.getElementById('RegisterLink'); // Link to register
    const jobsetentry = document.getElementById('jobsetLink'); // Link to job set entry
    const JSRReport = document.getElementById('jobsetReportLink'); // Link to jSRReport
    const logoutButton = document.getElementById('logoutIcon'); // Logout button

    const employeeIcon = document.getElementById('employeeIcon'); // Icon for employee details
    const timesheetIcon = document.getElementById('timesheetIcon'); // Icon for timesheet update

    // Check if all elements exist
    if (!employeeDetails || !timeSheetUpdate || !timeSheetEntry || !reports || !register || !jobsetentry || !JSRReport || !logoutButton) {
        console.error('One or more nav items not found');
        return; // Exit if any element does not exist
    }

    // Show/hide items based on role
    employeeDetails.style.display = isAdmin ? 'block' : 'none'; // Show for admin, hide for supervisor
    timeSheetUpdate.style.display = isAdmin ? 'block' : 'none'; // Show for admin, hide for supervisor
    register.style.display = isAdmin ? 'block' : 'none'; // Show for admin, hide for supervisor
    timeSheetEntry.style.display = 'block'; // Always show time sheet entry for both roles
    reports.style.display = 'block'; // Always show reports for both roles
    jobsetentry.style.display = 'block'; // Always show job set entry for both roles
    JSRReport.style.display = 'block'; // Always sjow JSRReprt for both roles

    // Hide icons if not admin
    if (!isAdmin) {
        if (employeeIcon) employeeIcon.style.display = 'none'; // Hide employee icon
        if (timesheetIcon) timesheetIcon.style.display = 'none'; // Hide timesheet icon
    }

    // Attach logout functionality
    attachLogoutFunctionality();
}

// Function to attach logout functionality
function attachLogoutFunctionality() {
    const logoutButton = document.getElementById('logoutIcon');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const confirmation = confirm("Are you sure you want to logout");
            if (confirmation) {
                // Clear any session data
                alert("Logging out...");
                window.location.href = "Index.html"; // Redirect to sign-in page
            }
        });
    } else {
        console.error('Logout button not found');
    }
}

// Wait for the DOM to fully load before executing script
document.addEventListener('DOMContentLoaded', function() {
    // Assuming `isAdmin` is dynamically determined by your login logic
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')); // Retrieve the boolean value

    // Validate isAdmin value
    if (typeof isAdmin !== 'boolean') {
        console.error('isAdmin is not a boolean value or is not set');
        return; // Exit if isAdmin is not properly set
    }

    displayNavbar(isAdmin); // Call the function to display the navbar
});


const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the icon (optional)
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });