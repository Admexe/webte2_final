document.addEventListener('DOMContentLoaded', function() {
    const userType = getUserType(); // Function to get the user type (e.g., from server or cookies)

    if (userType === 'user') {
        document.getElementById('current-votes').classList.remove('hidden');
        document.getElementById('past-votes').classList.remove('hidden');
        document.getElementById('profile').classList.remove('hidden');
    } else if (userType === 'admin') {
        document.getElementById('current-votes').classList.remove('hidden');
        document.getElementById('past-votes').classList.remove('hidden');
        document.getElementById('profile').classList.remove('hidden');
        document.getElementById('admin').classList.remove('hidden');
        document.getElementById('admin-link').classList.remove('hidden');
    }
});

function getUserType() {
    // Logic to determine the user type, e.g., from server or cookies
    // For demonstration, returning 'user' or 'admin'
    return 'user'; // Change to 'admin' to test admin functionality
}

function logout() {
    // Logic for logging out the user
}


// function toggleInfoPanel() {
//     var panel = document.getElementById('guidePanel');
//     panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
// }


// const userRoles = {
//     "neprihlasenyPouzivatel": {
//         "name": "Neprihlásený používateľ",
//         "description": "Podrobný popis pre neprihlásených používateľov."
//     },
//     "prihlasenyPouzivatel": {
//         "name": "Prihlásený používateľ",
//         "description": "Podrobný popis pre prihlásených používateľov."
//     },
//     "administrator": {
//         "name": "Administrátor",
//         "description": "Podrobný popis pre administrátorov."
//     }
// };

// function generateUserGuideContent() {
//     let content = '';
//     for (const role in userRoles) {
//         const roleName = userRoles[role].name;
//         const roleDescription = userRoles[role].description;
//         content += `
//             <div class="user-role">
//                 <h3>${roleName}</h3>
//                 <p>${roleDescription}</p>
//             </div>
//         `;
//     }
//     return content;
// }


document.getElementById('logout').addEventListener('click', function() {
    // Define the URL for the logout endpoint
    const url = 'https://node95.webte.fei.stuba.sk/webte_final/auth/logout';

    // Make the POST request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Successfully logged out, handle any UI changes
            alert('Logout successful!');
            // Optionally redirect to the login page or home page
            window.location.href = 'index.html'; // Adjust the URL as needed
        } else {
            // Handle error
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        alert('An error occurred. Please try again.');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch user ID from session
    let userId = null;
    fetch('https://node95.webte.fei.stuba.sk/webte_final/controllers/get_user_id.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Include credentials for CORS
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            userId = data.user_id;
            fetchUserInfo(userId);
        } else {
            alert('Error fetching user ID: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });

    // Function to fetch user info using user ID
    function fetchUserInfo(userId) {
        fetch(`https://node95.webte.fei.stuba.sk/webte_final/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include credentials for CORS
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('username').value = data.name;
                document.getElementById('email').value = data.email;
            } else {
                alert('Error fetching user info.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Handle form submission for updating user info
    document.getElementById('profile-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const name = document.getElementById('username').value;
        const password = document.getElementById('new-password').value;

        const updateData = { email, name };
        if (password) {
            updateData.password = password;
        }

        fetch(`https://node95.webte.fei.stuba.sk/webte_final/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include credentials for CORS
            body: JSON.stringify(updateData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('User info updated successfully!');
                // Optionally update the displayed user info
                document.getElementById('username').value = name;
                document.getElementById('email').value = email;
                document.getElementById('new-password').value = '';
                location.reload();
            } else {
                alert('Error updating user info: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});

