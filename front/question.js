document.addEventListener('DOMContentLoaded', function () {
    let questionId;
    let ws;
    let status;
    let userProfileVisible = false;
    let userId = null;

    // Fetch user ID from session
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
            userId = data.user_id;
        } else {
            alert('Error fetching user ID: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });

    // Function to fetch user info using user ID
    function fetchUserInfo(userId) {
        fetch(`https://node95.webte.fei.stuba.sk/webte_final/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include credentials for CORS
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                showUserProfile(data.name, data.email);
            } else {
                alert('Error fetching user info.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Function to create and display the user profile panel
    function showUserProfile(username, userId) {
        let userProfilePanel = document.getElementById('user-profile-panel');
        if (!userProfilePanel) {
            userProfilePanel = document.createElement('div');
            userProfilePanel.id = 'user-profile-panel';
            userProfilePanel.style.position = 'fixed';
            userProfilePanel.style.top = '50px';
            userProfilePanel.style.right = '10px';
            userProfilePanel.style.backgroundColor = '#20232a';
            userProfilePanel.style.padding = '20px';
            userProfilePanel.style.border = '1px solid #ccc';
            userProfilePanel.style.color = '#c5e9f3';
            userProfilePanel.style.visibility = 'hidden'; // Hide initially
            document.body.appendChild(userProfilePanel);
        }

        userProfilePanel.innerHTML = `
            <p>Name: ${username}</p>
            <p>Login: ${userId}</p>
        `;

        userProfilePanel.style.visibility = 'visible'; // Show panel
    }

    // Function to hide the user profile panel
    function hideUserProfile() {
        const userProfilePanel = document.getElementById('user-profile-panel');
        if (userProfilePanel) {
            userProfilePanel.style.visibility = 'hidden'; // Hide panel
        }
    }

    // Toggle user profile panel visibility
    document.getElementById('user-profile').addEventListener('click', function () {
        const userProfilePanel = document.getElementById('user-profile-panel');
        if (!userProfileVisible) {
            fetchUserInfo(userId);
        } else {
            hideUserProfile();
        }
        userProfileVisible = !userProfileVisible;
    });

    // Capture the question code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const questionCode = urlParams.get('code');

    if (questionCode) {
        fetch(`https://node95.webte.fei.stuba.sk/webte_final/quest/${questionCode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Question not found');
                }
                return response.json();
            })
            .then(question => {
                document.getElementById('question-text').textContent = question.question.text;
                document.getElementById('question-container').style.display = 'block';
                document.getElementById('responses-container').style.display = 'block';
                document.getElementById('code-input-container').style.display = 'none';

                questionId = question.question.id; // Set the global questionId
                status = question.question.status; // Set the global status
                const optionsValue = question.question.options;
                console.log('Options value:', optionsValue);

                let ws;

                if (optionsValue === 0) {
                    document.getElementById('response-text').style.display = 'block';
                    document.getElementById('submit-response').style.display = 'block';

                    fetch(`https://node95.webte.fei.stuba.sk/webte_final/response/question/${questionId}`)
                        .then(response => response.json())
                        .then(responses => {
                            const responsesContainer = document.getElementById('responses-container');
                            responsesContainer.innerHTML = ''; // Clear existing content
                            const responseCounts = {};

                            responses.forEach(response => {
                                if (responseCounts[response.text]) {
                                    responseCounts[response.text]++;
                                } else {
                                    responseCounts[response.text] = 1;
                                }
                            });

                            Object.keys(responseCounts).forEach(text => {
                                const responseWord = document.createElement('div');
                                responseWord.className = 'response-word';
                                responseWord.textContent = text;
                                responseWord.style.fontSize = `${1.2 + responseCounts[text] * 0.2}em`;

                                // Generate random positions within the container
                                const containerWidth = responsesContainer.clientWidth;
                                const containerHeight = responsesContainer.clientHeight;
                                const randomX = Math.floor(Math.random() * (containerWidth - 100));
                                const randomY = Math.floor(Math.random() * (containerHeight - 50));

                                responseWord.style.left = `${randomX}px`;
                                responseWord.style.top = `${randomY}px`;

                                responsesContainer.appendChild(responseWord);
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
                            const responsesContainer = document.getElementById('responses-container');
                            const existingResponses = Array.from(responsesContainer.getElementsByClassName('response-word'));
                            const existingResponse = existingResponses.find(response => response.textContent === message.response);

                            if (existingResponse) {
                                const currentFontSize = parseFloat(window.getComputedStyle(existingResponse).fontSize);
                                existingResponse.style.fontSize = `${currentFontSize * 1.2}px`;
                            } else {
                                const responseWord = document.createElement('div');
                                responseWord.className = 'response-word';
                                responseWord.textContent = message.response;

                                // Generate random positions within the container
                                const containerWidth = responsesContainer.clientWidth;
                                const containerHeight = responsesContainer.clientHeight;
                                const randomX = Math.floor(Math.random() * (containerWidth - 100));
                                const randomY = Math.floor(Math.random() * (containerHeight - 50));

                                responseWord.style.left = `${randomX}px`;
                                responseWord.style.top = `${randomY}px`;

                                responsesContainer.appendChild(responseWord);
                            }
                        }
                    };

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
                } else {
                    document.getElementById('response-text').style.display = 'none';
                    document.getElementById('submit-response').style.display = 'none';
                    document.getElementById('predefined-answers-container').style.display = 'block';

                    fetch(`https://node95.webte.fei.stuba.sk/webte_final/response/question/${questionId}`)
                        .then(response => response.json())
                        .then(responses => {
                            const predefinedAnswersList = document.getElementById('predefined-answers-list');
                            predefinedAnswersList.innerHTML = ''; // Clear existing content

                            const answerCounts = {};

                            responses.forEach(response => {
                                answerCounts[response.id] = response.votes;
                                const listItem = document.createElement('li');
                                const checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.value = response.id;
                                checkbox.name = 'response-checkbox';
                                listItem.appendChild(checkbox);
                                listItem.appendChild(document.createTextNode(response.text));
                                predefinedAnswersList.appendChild(listItem);
                            });

                            // Dynamically add the submit vote button
                            const submitVoteButton = document.createElement('button');
                            submitVoteButton.id = 'submit-vote';
                            submitVoteButton.textContent = 'Submit Vote';
                            submitVoteButton.style.marginTop = '20px';
                            submitVoteButton.style.padding = '15px 20px';
                            submitVoteButton.style.backgroundColor = '#c5e9f3';
                            submitVoteButton.style.color = '#20232a';
                            submitVoteButton.style.border = 'none';
                            submitVoteButton.style.borderRadius = '5px';
                            submitVoteButton.style.cursor = 'pointer';
                            submitVoteButton.style.fontSize = '1em';
                            submitVoteButton.onmouseover = function() {
                                submitVoteButton.style.backgroundColor = '#92b6c0';
                                submitVoteButton.style.color = '#20232a';
                            };
                            submitVoteButton.onmouseout = function() {
                                submitVoteButton.style.backgroundColor = '#c5e9f3';
                                submitVoteButton.style.color = '#20232a';
                            };
                            predefinedAnswersList.parentNode.appendChild(submitVoteButton);

                            document.getElementById('live-graph-container').style.display = 'block';
                            const liveGraph = document.getElementById('live-graph');
                            liveGraph.innerHTML = ''; // Clear existing content

                            Object.keys(answerCounts).forEach(answerId => {
                                const responseText = responses.find(response => response.id == answerId).text;

                                const barContainer = document.createElement('div');
                                barContainer.style.display = 'flex';
                                barContainer.style.flexDirection = 'column';
                                barContainer.style.alignItems = 'center';
                                barContainer.style.margin = '0 10px';

                                const bar = document.createElement('div');
                                bar.className = 'bar';
                                bar.style.height = `${answerCounts[answerId] * 10}px`;
                                bar.style.width = '50px';  // Set the width of the bars
                                bar.textContent = `${answerCounts[answerId]}`;
                                bar.setAttribute('data-response-id', answerId);

                                const barLabel = document.createElement('span');
                                barLabel.textContent = responseText;
                                barLabel.style.marginTop = '5px';
                                barLabel.style.color = '#333';  // Darker color for better readability

                                barContainer.appendChild(bar);
                                barContainer.appendChild(barLabel);

                                liveGraph.appendChild(barContainer);
                            });

                            submitVoteButton.addEventListener('click', function () {
                                const selectedResponses = document.querySelectorAll('input[name="response-checkbox"]:checked');
                                if (selectedResponses.length === 0) {
                                    alert('Please select a response before submitting your vote.');
                                    return;
                                }

                                selectedResponses.forEach(checkbox => {
                                    const responseId = checkbox.value;

                                    fetch(`https://node95.webte.fei.stuba.sk/webte_final/response/increment/${responseId}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({})
                                    })
                                    .then(response => {
                                        if (response.ok) {
                                            ws.send(JSON.stringify({
                                                action: 'vote_response',
                                                question_id: questionId,
                                                response_id: responseId
                                            }));
                                            alert('Your vote has been submitted successfully.');
                                            checkbox.checked = false;
                                        } else {
                                            throw new Error('Failed to submit vote.');
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error submitting vote:', error);
                                    });
                                });
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
                                if (message.action === 'vote_response' && message.question_id === questionId) {
                                    const liveGraph = document.getElementById('live-graph');
                                    const bars = liveGraph.getElementsByClassName('bar');
                                    for (let bar of bars) {
                                        if (bar.getAttribute('data-response-id') === message.response_id) {
                                            const currentHeight = parseFloat(bar.style.height);
                                            bar.style.height = `${currentHeight + 10}px`;
                                            bar.textContent = parseInt(bar.textContent) + 1;
                                            break;
                                        }
                                    }
                                }
                            };
                        })
                        .catch(error => {
                            console.error('Error fetching responses:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                alert('Question not found. Please enter a valid question code.');
            });
    } else {
        document.getElementById('code-input-container').style.display = 'block';
    }

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
