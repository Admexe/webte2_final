





document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
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
                'hide': 'Hide', // Добавляем перевод для "Hide"
                'register': 'Register',
                'already_have_account': 'Already have an account? Login'
            },
            'sk': {
                'register_account': 'Registrácia účtu',
                'name': 'Meno',
                'email': 'Email',
                'password': 'Heslo',
                'show': 'Zobraziť',
                'hide': 'Skryť', // Добавляем перевод для "Hide"
                'register': 'Registrovať sa',
                'already_have_account': 'Už máte účet? Prihlásiť sa'
            }
        };

        // Устанавливаем язык для заголовка страницы
        document.title = translations[lang]['register_account'];

        // Находим соответствующие элементы и устанавливаем переводы для атрибута placeholder
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        nameInput.placeholder = translations[lang]['name'];
        emailInput.placeholder = translations[lang]['email'];
        passwordInput.placeholder = translations[lang]['password'];

        // Устанавливаем текст для остальных элементов
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });

        // Изменяем текст кнопки togglePassword
        const togglePassword = document.getElementById('togglePassword');
        togglePassword.textContent = translations[lang][passwordInput.type === 'password' ? 'show' : 'hide'];
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
            const response = await fetch('https://node126.webte.fei.stuba.sk/webte_final/users', {
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
        // Добавляем вызов функции changeLanguage, чтобы обновить текст кнопки при смене языка
        const lang = document.querySelector('.language-switcher button.active').dataset.lang;
        changeLanguage(lang);
    }

    // Вызываем функцию togglePasswordVisibility при клике на элемент togglePassword
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

    changeLanguage('en'); // Установка английского языка по умолчанию
});
