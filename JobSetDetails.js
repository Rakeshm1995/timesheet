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

// document.getElementById("save").addEventListener("click", async (event) => {
//     // Prevent the form from submitting and refreshing the page
//     event.preventDefault();

//     // Get the input values
//     const jobDetails = {
//         low_stub: parseInt(document.getElementById("low_stub").value) || 0,
//         anode_covering: parseInt(document.getElementById("anode_covering").value) || 0,
//         side_making: parseInt(document.getElementById("side_making").value) || 0,
//         hole: parseInt(document.getElementById("hole").value) || 0,
//         house_keeping: parseInt(document.getElementById("house_keeping").value) || 0,
//         supply: parseInt(document.getElementById("supply").value) || 0,
//     };

//     // Calculate totals
//     const skilled = jobDetails.low_stub + jobDetails.side_making;
//     const semi_skilled = jobDetails.hole + jobDetails.anode_covering;
//     const unskilled = jobDetails.house_keeping + jobDetails.supply;

//     // Prepare API payload
//     const payload = {
//         date: document.getElementById("date").value,
//         zone: document.getElementById("zone").value,
//         supervisor_name: document.getElementById("supervisor").value,
//         ...jobDetails,
//         skilled: skilled,
//         semi_skilled: semi_skilled,
//         unskilled: unskilled,
//     };

//     console.log("Payload being sent:", payload);

//     const accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) {
//         alert("Access token is missing. Please log in again.");
//         return;
//     }

//     // Log the access token for debugging
//     console.log("Access token:", accessToken);

//     try {
//         // Send data to API
//         const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/jobsheet/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${accessToken}`,  // Ensure this is valid
//             },
//             body: JSON.stringify(payload),
//         });

//         if (response.ok) {
//             const data = await response.json();

//             // Update UI with saved job details
//             document.getElementById("skilled").innerText = data.skilled;
//             document.getElementById("semi_skilled").innerText = data.semi_skilled;
//             document.getElementById("unskilled").innerText = data.unskilled;

//             alert("Job details saved successfully!");
//             console.log("API Response:", data);


//         } else {
//             const error = await response.json();
//             console.error("Error:", error);
//             // alert("Failed to save job details. Please try again.");
//             alert("Job details for this date already exist. Please choose a different date.");
//         }
//     } catch (error) {
//         console.error("Network error:", error);
//         alert("Network error. Please check your connection.");
//     }
// });

function resetForm() {
    
    document.getElementById('jobset-sumry').innerHTML = '';
   
  }

  document.getElementById("save").addEventListener("click", async (event) => {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();

    // Get the input values
    const jobDetails = {
        low_stub: parseInt(document.getElementById("low_stub").value) || 0,
        anode_covering: parseInt(document.getElementById("anode_covering").value) || 0,
        side_making: parseInt(document.getElementById("side_making").value) || 0,
        hole: parseInt(document.getElementById("hole").value) || 0,
        house_keeping: parseInt(document.getElementById("house_keeping").value) || 0,
        supply: parseInt(document.getElementById("supply").value) || 0,
    };

    // // Prepare API payload
    // const payload = {
    //     date: document.getElementById("date").value,
    //     zone: document.getElementById("zone").value,
    //     supervisor_name: document.getElementById("supervisor").value,
    //     ...jobDetails,
    // };

    // Get zone value
    const zone = document.getElementById("zone").value.trim();
    const shift = document.getElementById("shift_select").value.trim();
    
    // Validate if zone is selected
    if (!zone) {
        alert("Please select a zone before saving.");
        return;
    }

    if (!shift) {
        alert("Please select a shift before saving.");
        return;
    }

    // Prepare API payload
    const payload = {
        date: document.getElementById("date").value,
        zone: zone,
        shift: shift,
        supervisor_name: document.getElementById("supervisor").value,
        ...jobDetails,
    };

    console.log("Payload being sent:", payload);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        alert("Access token is missing. Please log in again.");
        return;
    }

    // Log the access token for debugging
    console.log("Access token:", accessToken);

    try {
        // Send data to API
        const response = await fetch("https://timesheet003.pythonanywhere.com/api/user/jobsheet/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();

            // Update UI with calculated job summary from API response
            document.getElementById("low_stub").value = data.low_stub;
            document.getElementById("anode_covering").value = data.anode_covering;
            document.getElementById("side_making").value = data.side_making;
            document.getElementById("hole").value = data.hole;
            document.getElementById("house_keeping").value = data.house_keeping;
            document.getElementById("supply").value = data.supply;

            // Display calculated values from API response
            document.getElementById("skilled").innerText = data.skilled;
            document.getElementById("semi_skilled").innerText = data.semi_skilled;
            document.getElementById("unskilled").innerText = data.unskilled;

            alert("Job details saved successfully!");
            console.log("API Response:", data);

        } else {
            const error = await response.json();
            console.error("Error:", error);
            alert("Job details for this date already exist. Please choose a different date.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please check your connection.");
    }
});





