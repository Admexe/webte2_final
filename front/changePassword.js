document.addEventListener('DOMContentLoaded', function() {
    // Функция для установки языка
    function setLanguage(lang) {
        const translations = {
            'en': {
                'changePasswordTitle': 'Change Password',
                'currentPasswordLabel': 'Current Password:',
                'newPasswordLabel': 'New Password:',
                'confirmPasswordLabel': 'Confirm New Password:',
                'changePasswordButton': 'Change Password'
            },
            'sk': {
                'changePasswordTitle': 'Zmeniť heslo',
                'currentPasswordLabel': 'Súčasné heslo:',
                'newPasswordLabel': 'Nové heslo:',
                'confirmPasswordLabel': 'Potvrďte nové heslo:',
                'changePasswordButton': 'Zmeniť heslo'
            }
        };

        const currentLanguage = translations[lang];

        document.getElementById('change-password-title').textContent = currentLanguage.changePasswordTitle;
        document.getElementById('current-password-label').textContent = currentLanguage.currentPasswordLabel;
        document.getElementById('new-password-label').textContent = currentLanguage.newPasswordLabel;
        document.getElementById('confirm-password-label').textContent = currentLanguage.confirmPasswordLabel;
        document.getElementById('change-password-button').textContent = currentLanguage.changePasswordButton;
    }

    // Получаем кнопки переключения языка
    const languageButtons = document.querySelectorAll('.language-switcher button');

    // Перебираем кнопки и добавляем обработчик события для каждой
    languageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Получаем язык из атрибута data-lang
            const lang = this.getAttribute('data-lang');
            // Устанавливаем язык
            setLanguage(lang);
        });
    });
});
