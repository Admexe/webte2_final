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
            element.textContent = i18n[lang][key];
        });
    }

    const i18n = {
        en: {
            title: 'Forgot Password',
            submit: 'Send Verification Code',
            back: 'Back to Login'
        },
        sk: {
            title: 'Zabudnuté heslo',
            submit: 'Odoslať overovací kód',
            back: 'Späť na prihlásenie'
        }
    };

    window.switchLanguage = switchLanguage;

    switchLanguage('en');
});
