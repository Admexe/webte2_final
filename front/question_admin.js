document.addEventListener('DOMContentLoaded', function () {
    let questionId;
    let ws;
    let status;
    let userProfileVisible = false;

    // Submit code functionality
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
            changeLanguage(lang); // Call the language change function
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
            if (translations[lang] && translations[lang][translationKey]) {
                element.textContent = translations[lang][translationKey];
            } else {
                console.warn(`Translation key "${translationKey}" not found for language "${lang}"`);
            }
        });
    }

    changeLanguage('en'); // Set default language to English

    // User profile and logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        const url = 'https://node95.webte.fei.stuba.sk/webte_final/auth/logout';
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Logout successful!');
                window.location.href = 'index.html'; // Adjust the URL as needed
            } else {
                alert('Logout failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('An error occurred. Please try again.');
        });
    });

    // Define the showUserProfile function
    function showUserProfile(name, userId) {
        let userProfilePanel = document.getElementById('user-profile-panel');

        if (!userProfilePanel) {
            userProfilePanel = document.createElement('div');
            userProfilePanel.id = 'user-profile-panel';

            const userName = document.createTextNode(`Name: ${name}`);
            const userLogin = document.createTextNode(`Login: ${userId}`);

            userProfilePanel.appendChild(userName);
            userProfilePanel.appendChild(document.createElement('br'));
            userProfilePanel.appendChild(userLogin);

            userProfilePanel.style.position = 'fixed';
            userProfilePanel.style.top = '50px';
            userProfilePanel.style.right = '10px';
            userProfilePanel.style.backgroundColor = '#20232a';
            userProfilePanel.style.padding = '20px';
            userProfilePanel.style.border = '1px solid #ccc';
            userProfilePanel.style.color = '#c5e9f3';

            document.body.appendChild(userProfilePanel);
        }

        userProfilePanel.style.display = userProfilePanel.style.display === 'none' ? 'block' : 'none';
    }

    // Fetch user ID from session and user info
    fetch('https://node95.webte.fei.stuba.sk/webte_final/controllers/get_user_id.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const userId = data.user_id;
            fetchUserInfo(userId);
        } else {
            alert('Error fetching user ID: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching user ID:', error);
        alert('An error occurred. Please try again.');
    });

    function fetchUserInfo(userId) {
        fetch(`https://node95.webte.fei.stuba.sk/webte_final/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                showUserProfile(data.name, data.user_id);
            } else {
                alert('Error fetching user info.');
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Add event listener for the user profile button
    const userProfileButton = document.getElementById('user-profile');
    userProfileButton.addEventListener('click', function () {
        const userProfilePanel = document.getElementById('user-profile-panel');
        if (userProfilePanel && userProfilePanel.style.display === 'block') {
            userProfilePanel.style.display = 'none';
        } else {
            fetch('https://node95.webte.fei.stuba.sk/webte_final/controllers/get_user_id.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    fetchUserInfo(data.user_id);
                } else {
                    alert('Error fetching user ID: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching user ID:', error);
                alert('An error occurred. Please try again.');
            });
        }
    });

    // Input navigation for code inputs
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

    // Function to hide user profile
    function hideUserProfile() {
        const userProfilePanel = document.getElementById('user-profile-panel');
        if (userProfilePanel) {
            userProfilePanel.style.display = 'none';
        }
    }
});
