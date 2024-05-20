document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const langButtons = document.querySelectorAll('.language-switcher button');
    let currentLanguage = 'en';

   
    function changeLanguage(lang) {
        currentLanguage = lang; 
        const translations = {
            'en': {
                'register_account': 'Register Your Account',
                'name': 'Name',
                'email': 'Email',
                'password': 'Password',
                'show': 'Show',
                'hide': 'Hide',
                'register': 'Register',
                'already_have_account': 'Already have an account? Login'
            },
            'sk': {
                'register_account': 'Registrácia účtu',
                'name': 'Meno',
                'email': 'Email',
                'password': 'Heslo',
                'show': 'Zobraziť',
                'hide': 'Skryť',
                'register': 'Registrovať sa',
                'already_have_account': 'Už máte účet? Prihlásiť sa'
            }
        };

        document.title = translations[lang]['register_account'];

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        nameInput.placeholder = translations[lang]['name'];
        emailInput.placeholder = translations[lang]['email'];
        passwordInput.placeholder = translations[lang]['password'];

        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });

        const togglePassword = document.getElementById('togglePassword');
        togglePassword.textContent = translations[lang][passwordInput.type === 'password' ? 'show' : 'hide'];
    }

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });

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
            const response = await fetch('https://node126.webte.fei.stuba.sk/webte_final/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            try {
                const result = JSON.parse(text);
                if (response.ok) {
                    alert(result.message);
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
        const translations = {
            'en': {
                'show': 'Show',
                'hide': 'Hide'
            },
            'sk': {
                'show': 'Zobraziť',
                'hide': 'Skryť'
            }
        };
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePassword.textContent = translations[currentLanguage]['hide'];
        } else {
            passwordField.type = 'password';
            togglePassword.textContent = translations[currentLanguage]['show'];
        }
    }

    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

    changeLanguage('en');
});




