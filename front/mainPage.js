document.addEventListener('DOMContentLoaded', function() {
    

   
    document.getElementById('current-votes').classList.remove('hidden');
    document.getElementById('past-votes').classList.remove('hidden');
    document.getElementById('profile').classList.remove('hidden');

});



document.getElementById('logout').addEventListener('click', function() {
// Define the URL for the logout endpoint
const url = 'https://node126.webte.fei.stuba.sk/webte_final/auth/logout';

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
fetch('https://node126.webte.fei.stuba.sk/webte_final/controllers/get_user_id.php', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include' 
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        userId = data.user_id;
        fetchUserInfo(userId);

        fetch(`https://node126.webte.fei.stuba.sk/webte_final/quest/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const currentQuestions = data.questions.filter(question => question.status === 1);
        const pastQuestions = data.questions.filter(question => question.status === 0);

        // Display current questions
        const currentVotesSection = document.getElementById('current-votes');
        const currentVotesList = currentVotesSection.querySelector('.votes-list');
        currentVotesList.innerHTML = ''; // Clear previous content
        currentQuestions.forEach(question => {
            const p = document.createElement('p');
            p.textContent = question.text;
            currentVotesList.appendChild(p);
        });
        currentVotesSection.classList.remove('hidden');

        // Display past questions
        const pastVotesSection = document.getElementById('past-votes');
        const pastVotesList = pastVotesSection.querySelector('.votes-results');
        pastVotesList.innerHTML = ''; // Clear previous content
        pastQuestions.forEach(question => {
            const p = document.createElement('p');
            p.textContent = question.text;
            pastVotesList.appendChild(p);
        });
        pastVotesSection.classList.remove('hidden');
                console.log(data.questions); // Vypíše otázky pre aktuálneho používateľa
            } else {
                console.error('Error:', data.message);
            }
        })
        
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
    fetch(`https://node126.webte.fei.stuba.sk/webte_final/users/${userId}`, {
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

    fetch(`https://node126.webte.fei.stuba.sk/webte_final/users/${userId}`, {
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