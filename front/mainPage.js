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

async function logout() {
    try {
        const response = await fetch('https://node95.webte.fei.stuba.sk/webte_final/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success') {
                // Redirect to the login page or perform other actions
                window.location.href = 'index.html';
            } else {
                console.error('Logout failed:', result.message);
            }
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}