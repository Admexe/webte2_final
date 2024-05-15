document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const payload = {
            name: name,
            email: email,
            password: password
        };

        try {
            const response = await fetch('https://node95.webte.fei.stuba.sk/webte_final/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const text = await response.text();  // Read the response as text
            try {
                const result = JSON.parse(text);  // Try to parse the response as JSON
                if (response.ok) {
                    alert(result.message);
                    // Redirect to login page or other actions
                    window.location.href = 'index.html';
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('JSON parse error:', error);
                alert('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    function togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePassword.textContent = 'Hide';
        } else {
            passwordField.type = 'password';
            togglePassword.textContent = 'Show';
        }
    }

    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);
});
