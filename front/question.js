document.addEventListener('DOMContentLoaded', function () {
    let questionId;
    let ws;
    let status;
    let userProfileVisible = false;

    document.getElementById('submit-code').addEventListener('click', function () {
        const codeInputs = document.querySelectorAll('.code-input');
        let questionCode = '';
        codeInputs.forEach(input => {
            questionCode += input.value;
        });

        fetch(`https://node95.webte.fei.stuba.sk/webte_final/quest/${questionCode}`)
            .then(response => response.json())
            .then(question => {
                document.getElementById('question-text').textContent = question.question.text;
                document.getElementById('question-container').style.display = 'block';
                document.getElementById('responses-container').style.display = 'block';

                questionId = question.question.id;
                status = question.question.status;

                fetch(`https://node95.webte.fei.stuba.sk/webte_final/response/question/${questionId}`)
                    .then(response => response.json())
                    .then(responses => {
                        const responseList = document.getElementById('response-list');
                        responseList.innerHTML = '';
                        responses.forEach(response => {
                            const listItem = document.createElement('li');
                            listItem.textContent = response.text;
                            responseList.appendChild(listItem);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching responses:', error);
                    });

                ws = new WebSocket(`wss://node95.webte.fei.stuba.sk/wss`);

                ws.onopen = function () {
                    console.log('WebSocket connection established');
                };

                ws.onerror = function (error) {
                    console.error('WebSocket error:', error);
                };

                ws.onmessage = function (event) {
                    const message = JSON.parse(event.data);
                    if (message.action === 'new_response' && message.question_id === questionId) {
                        const responseList = document.getElementById('response-list');
                        const listItem = document.createElement('li');
                        listItem.textContent = message.response;
                        responseList.appendChild(listItem);
                    }
                };
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                alert('Question not found. Please enter a valid question code.');
            });
    });

    document.getElementById('submit-response').addEventListener('click', function () {
        const responseText = document.getElementById('response-text').value;

        if (!questionId) {
            console.error('Question ID not available');
            alert('Question ID not available. Please enter a valid question code first.');
            return;
        }

        if (status === 1) {
            fetch('https://node95.webte.fei.stuba.sk/webte_final/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question_id: questionId,
                    text: responseText,
                    votes: 1
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert('Response submitted successfully');
                        document.getElementById('response-text').value = '';
                        ws.send(JSON.stringify({
                            action: 'new_response',
                            question_id: questionId,
                            response: responseText
                        }));
                    } else {
                        throw new Error('Failed to submit response');
                    }
                })
                .catch(error => {
                    console.error('Error submitting response:', error);
                });
        } else {
            alert('This question is not active. Response cannot be submitted.');
        }
    });

    // Language Switcher Functionality
    const langButtons = document.querySelectorAll('.language-switcher button');
    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.dataset.lang;
            changeLanguage(lang); // Вызываем функцию изменения языка при нажатии на кнопку
        });
    });

    function changeLanguage(lang) {
        const translations = {
            'en': {
                'question-label': 'Enter Question Code:',
                'submit': 'Submit',
                'question': 'Question:',
                'type_your_response_here': 'Type your response here...',
                'submit_response': 'Submit Response',
                'responses': 'Responses:',
                'response_submitted_successfully': 'Response submitted successfully',
                'failed_to_submit_response': 'Failed to submit response',
                'question_not_found': 'Question not found. Please enter a valid question code.',
                'question_id_not_available': 'Question ID not available. Please enter a valid question code first.',
                'question_not_active': 'This question is not active. Response cannot be submitted.'
            },
            'sk': {
                'question-label': 'Zadajte kód otázky:',
                'submit': 'Odoslať',
                'question': 'Otázka:',
                'type_your_response_here': 'Sem napíšte svoju odpoveď...',
                'submit_response': 'Odoslať odpoveď',
                'responses': 'Odpovede:',
                'response_submitted_successfully': 'Odpoveď úspešne odoslaná',
                'failed_to_submit_response': 'Odoslanie odpovede zlyhalo',
                'question_not_found': 'Otázka sa nenašla. Zadajte prosím platný kód otázky.',
                'question_id_not_available': 'Identifikátor otázky nie je k dispozícii. Najskôr zadajte platný kód otázky.',
                'question_not_active': 'Táto otázka nie je aktívna. Odpoveď nemôže byť odoslaná.'
            }
        };

        const elementsToTranslate = document.querySelectorAll('[data-translate]');

        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });
    }

    changeLanguage('en'); // Установка английского языка по умолчанию
});



    // Логика для кнопки Logout/Login
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', function () {
        // Проверяем авторизован ли пользователь
        const isAuthenticated = checkAuthentication();
        
        if (isAuthenticated) {
            logoutUser();
        } else {
            window.location.href = 'index.html';
        }
    });

    function checkAuthentication() {
        // Пример проверки, можно заменить на реальную логику
        // Предположим, что у нас есть флаг в localStorage, который указывает на статус авторизации
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    function logoutUser() {
        // Пример логики логаута, можно заменить на реальную
        localStorage.removeItem('isAuthenticated');
        alert('You are logged off.');
        // Перенаправление на главную страницу или другую страницу
        window.location.href = 'index.html';
    }


document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.code-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.code-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
// Функция для создания и добавления панели с именем и логином пользователя
function showUserProfile() {
    // Создаем элементы для имени и логина пользователя
    var userProfilePanel = document.createElement('div');
    userProfilePanel.id = 'user-profile-panel'; // Устанавливаем ID для панели
    var userName = document.createTextNode('Name: username'); // Замените на имя пользователя
    var userLogin = document.createTextNode('Login: user_id'); // Замените на логин пользователя
    
    // Добавляем имя и логин в панель
    userProfilePanel.appendChild(userName);
    userProfilePanel.appendChild(document.createElement('br')); // Добавляем перенос строки
    userProfilePanel.appendChild(userLogin);
    userProfilePanel.appendChild(document.createElement('br'));

    // Создаем элемент с надписью "Password"
    var passwordLabel = document.createTextNode('Password: ');
    userProfilePanel.appendChild(passwordLabel);

    // Создаем элемент с значком ключа
    var keyIcon = document.createElement('i');
    keyIcon.className = 'fas fa-key fa-inverse'; // Добавляем класс fa-inverse для белого цвета
    var changePasswordLink = document.createElement('a');
    changePasswordLink.href = 'changePassword.html'; // Замените на свою ссылку
    changePasswordLink.appendChild(keyIcon);
    // Добавляем надпись "Change Password" с ссылкой и значком ключа
    userProfilePanel.appendChild(changePasswordLink);
    
    // Стилизуем панель
    userProfilePanel.style.position = 'fixed';
    userProfilePanel.style.top = '50px';
    userProfilePanel.style.right = '10px';
    userProfilePanel.style.backgroundColor = '#20232a';
    userProfilePanel.style.padding = '20px';
    userProfilePanel.style.border = '1px solid #ccc';
    userProfilePanel.style.color = '#c5e9f3';
    
    // Добавляем панель на страницу
    document.body.appendChild(userProfilePanel);
}




// Функция для удаления панели с именем и логином пользователя
function hideUserProfile() {
    var userProfilePanel = document.getElementById('user-profile-panel');
    if (userProfilePanel) {
        userProfilePanel.parentNode.removeChild(userProfilePanel);
    }
}


    // Найти кнопку "Личный кабинет"
    const userProfileButton = document.getElementById('user-profile');

    // Добавить обработчик события на нажатие кнопки "Личный кабинет"
    userProfileButton.addEventListener('click', function () {
        // Показываем или скрываем панель профиля в зависимости от ее текущего состояния
        const userProfilePanel = document.getElementById('user-profile-panel');
        if (!userProfilePanel) {
            // Если панель не существует, показываем ее
            showUserProfile();
        } else {
            // Если панель уже существует, скрываем ее
            hideUserProfile();
        }
    });

});










