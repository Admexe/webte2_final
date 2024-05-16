function toggleInfoPanel() {
    var panel = document.getElementById('guidePanel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}


const userRoles = {
    "neprihlasenyPouzivatel": {
        "name": "Neprihlásený používateľ",
        "description": "Podrobný popis pre neprihlásených používateľov."
    },
    "prihlasenyPouzivatel": {
        "name": "Prihlásený používateľ",
        "description": "Podrobný popis pre prihlásených používateľov."
    },
    "administrator": {
        "name": "Administrátor",
        "description": "Podrobný popis pre administrátorov."
    }
};

function generateUserGuideContent() {
    let content = '';
    for (const role in userRoles) {
        const roleName = userRoles[role].name;
        const roleDescription = userRoles[role].description;
        content += `
            <div class="user-role">
                <h3>${roleName}</h3>
                <p>${roleDescription}</p>
            </div>
        `;
    }
    return content;
}

/*document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('path/to/your/check_role_and_get_data.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('role').textContent = `Role: ${data.role}`;
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const payload = {
            name: name,
            email: email
        };

        try {
            const response = await fetch('path/to/your/update_profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});


function getUser(){



}*/