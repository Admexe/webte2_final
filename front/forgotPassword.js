document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            console.log(`Password reset requested for: ${email}`);
        });
    }

    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            // Проверяем, является ли элемент input или textarea, чтобы установить атрибут placeholder
            if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                element.placeholder = i18n[lang][key];
            } else {
                // Иначе, устанавливаем текст контента
                element.textContent = i18n[lang][key];
            }
        });
    }
    

    const i18n = {
        en: {
            title: 'Forgot Password',
            submit: 'Send Verification Code',
            back: 'Back to Login',
            email_placeholder: 'Enter your email'
        },
        sk: {
            title: 'Zabudnuté heslo',
            submit: 'Odoslať overovací kód',
            back: 'Späť na prihlásenie',
            email_placeholder: 'Zadajte svoj email'
        }
    };

   

    // Обработчик кнопок переключения языка
    const languageButtons = document.querySelectorAll('.language-switcher button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Устанавливаем язык по умолчанию
    switchLanguage('en');
});
