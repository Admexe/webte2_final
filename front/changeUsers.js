document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки данных пользователей из базы данных и отображения в таблице
    function loadUsers() {
        // Здесь должен быть код для загрузки данных из базы данных, например, с помощью AJAX
        // После загрузки данных, они могут быть вставлены в таблицу с помощью JavaScript
    }

    // Функция для создания нового пользователя
    function createUser() {
        // Здесь должен быть код для создания нового пользователя, например, с помощью AJAX
    }

    // Функция для удаления выбранного пользователя
    function deleteUser() {
        // Здесь должен быть код для удаления пользователя, например, с помощью AJAX
    }

    // Функция для изменения языка на английский
    function changeToEnglish() {
        document.querySelector('h1').innerText = 'Change Users';
        document.querySelectorAll('th')[0].innerText = 'Notes';
        document.querySelectorAll('th')[1].innerText = 'Questions';
        document.querySelectorAll('th')[2].innerText = 'Responses';
        document.querySelectorAll('th')[3].innerText = 'Subjects';
        document.querySelectorAll('th')[4].innerText = 'Users';
        document.getElementById('create-button').innerText = 'Create';
        document.getElementById('delete-button').innerText = 'Delete';
    }

    // Функция для изменения языка на словацкий
    function changeToSlovak() {
        document.querySelector('h1').innerText = 'Zmeniť Používateľov';
        document.querySelectorAll('th')[0].innerText = 'Poznámky';
        document.querySelectorAll('th')[1].innerText = 'Otázky';
        document.querySelectorAll('th')[2].innerText = 'Odpovede';
        document.querySelectorAll('th')[3].innerText = 'Predmety';
        document.querySelectorAll('th')[4].innerText = 'Používatelia';
        document.getElementById('create-button').innerText = 'Vytvoriť';
        document.getElementById('delete-button').innerText = 'Vymazať';
    }

    // Загрузка пользователей при загрузке страницы
    loadUsers();

    // Обработчики событий для кнопок
    document.getElementById('create-button').addEventListener('click', createUser);
    document.getElementById('delete-button').addEventListener('click', deleteUser);

    // Обработчики событий для кнопок переключения языка
    document.querySelector('.language-switcher button[data-lang="en"]').addEventListener('click', changeToEnglish);
    document.querySelector('.language-switcher button[data-lang="sk"]').addEventListener('click', changeToSlovak);
});
