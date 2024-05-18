document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const langButtons = document.querySelectorAll('.language-switcher button');

    // Функция для изменения языка
    function changeLanguage(lang) {
        const translations = {
            'en': {
                'register_account': 'Register Your Account',
                'name': 'Name',
                'email': 'Email',
                'password': 'Password',
                'show': 'Show',
                'register': 'Register',
                'already_have_account': 'Already have an account? Login'
            },
            'sk': {
                'register_account': 'Registrácia účtu',
                'name': 'Meno',
                'email': 'Email',
                'password': 'Heslo',
                'show': 'Zobraziť',
                'register': 'Registrovať sa',
                'already_have_account': 'Už máte účet? Prihlásiť sa'
            }
        };

        const elementsToTranslate = document.querySelectorAll('[data-translate]');

        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });

        // Установка языка для заголовка страницы
        document.title = translations[lang]['register_account'];
    }

    // Обработчики событий для кнопок выбора языка
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang); // Вызываем функцию изменения языка при нажатии на кнопку
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
            togglePassword.textContent = 'Skryť';
        } else {
            passwordField.type = 'password';
            togglePassword.textContent = 'Zobraziť';
        }
    }

    // Вызываем функцию togglePasswordVisibility при клике на элемент togglePassword
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

    changeLanguage('en'); // Установка английского языка по умолчанию
});
