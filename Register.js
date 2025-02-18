function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerText = message;
        errorElement.style.color = 'red'; // Optional: Make the error message visually distinct
    }
}

async function handleRegistration() {
    const user_name = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regConfirmPassword').value;
    const role = document.getElementById('role').value;

    // Clear previous error messages
    document.getElementById('usernameError').innerText = '';
    document.getElementById('fullnameError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('confirmPasswordError').innerText = '';
    document.getElementById('roleError').innerText = '';
    document.getElementById('successMessage').innerText = '';

    let isValid = true;

    // Validation checks
    if (user_name.length < 3) {
        alert('Username must be at least 3 characters long.');
        isValid = false;
    }

    if (name.length < 5) {
        alert('Full name must be at least 5 characters long.');
        isValid = false;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        isValid = false;
    }

    if (password !== password2) {
        alert('Passwords do not match. Please re-enter the passwords.');
        isValid = false;
    }

    if (!role) {
        alert('Please select a role.');
        isValid = false;
    }

    if (isValid) {
        // Proceed with API request
        sendRegistrationData(user_name, name, password, password2, role);
    }
}

async function sendRegistrationData(user_name, name, password, password2, role) {
    try {
        console.log("Sending registration request...");

        const response = await fetch('https://timesheet003.pythonanywhere.com/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name,
                name,
                password,
                password2,
                role
            })
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("Success:", result);
            // document.getElementById('successMessage').innerText = 'Registration successful!';
            alert('Registration successful!'); // Alert for success

            // Reset the form
            const registrationForm = document.getElementById('RegisterLink');
            if (registrationForm && registrationForm.reset) {
                registrationForm.reset(); // Reset the form fields
            }
        } else {
            const result = await response.json();
            console.log("Error response:", result);
            const errorMessage = result.message || 'Unknown error';
            // document.getElementById('successMessage').innerText = `Error in Registration: ${errorMessage}`;
            alert(`Error in Registration: ${errorMessage}`); // Alert for error
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('successMessage').innerText = 'An error occurred during registration.';
        alert('An error occurred during registration.'); // Alert for exception
    }
}

// Toggle Password Visibility for Password Field
const passwordInput = document.getElementById('regPassword');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

// Toggle Password Visibility for Confirm Password Field
const confirmPasswordInput = document.getElementById('regConfirmPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🙈';
});


