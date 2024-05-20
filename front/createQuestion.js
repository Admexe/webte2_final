document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-question-form');
    const responseType = document.getElementById('response-type');
    const customAnswersGroup = document.getElementById('custom-answers-group');
    const customAnswersContainer = document.getElementById('custom-answers-container');
    const addAnswerBtn = document.getElementById('add-answer-btn');
    const questionCodeContainer = document.getElementById('question-code-container');
    const questionCodeSpan = document.getElementById('question-code');
    const joinQuestionBtn = document.getElementById('join-question-btn');
    let answerCount = 0;
    let userId = null;
    var logged_in = false;
    console.log(logged_in);
    checkSession(logged_in);
    console.log(logged_in);
    if(!logged_in){
        window.location.href = 'question.html';
    }
    else{
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

        responseType.addEventListener('change', function () {
            customAnswersGroup.style.display = responseType.value === 'custom' ? 'flex' : 'none';
            form.dataset.options = responseType.value === 'custom' ? 1 : 0;
        });

        addAnswerBtn.addEventListener('click', function () {
            answerCount++;
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-input';
            answerDiv.innerHTML = `
                <input type="text" name="custom-answer-${answerCount}" placeholder="Answer ${answerCount}" required>
                <button type="button" class="remove-answer-btn">&times;</button>
            `;
            customAnswersContainer.appendChild(answerDiv);

            answerDiv.querySelector('.remove-answer-btn').addEventListener('click', function () {
                customAnswersContainer.removeChild(answerDiv);
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const subjectText = document.getElementById('subject-text').value.trim();
            const questionText = document.getElementById('question-text').value.trim();
            const options = answerCount > 0 ? 1 : 0; // Adjust options based on answer count
        
            if (!subjectText) {
                alert('Subject is required.');
                return;
            }
        
            // Create subject
            fetch('https://node95.webte.fei.stuba.sk/webte_final/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: subjectText
                })
            })
            .then(response => response.json())
            .then(subjectData => {
                if (subjectData.status === 'success') {
                    // Subject created successfully
                    const subjectId = subjectData.subject.id;
        
                    // Proceed with creating the question
                    const requestData = {
                        user_id: userId,
                        subject_id: subjectId,
                        text: questionText,
                        options: options
                    };
        
                    if (options === 1) {
                        // Send the question data to create a question
                        fetch('https://node95.webte.fei.stuba.sk/webte_final/quest', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        })
                        .then(response => response.json())
                        .then(questionData => {
                            if (questionData.status === 'success') {
                                const questionId = questionData.question_id;
                                const questionCode = questionData.code; // Get the 5-digit code

                                // Iterate over custom answers and send each response individually
                                customAnswersContainer.querySelectorAll('input[type="text"]').forEach(answerInput => {
                                    const responseText = answerInput.value.trim();
                                    const responseData = {
                                        question_id: questionId,
                                        text: responseText,
                                        votes: 0
                                    };
                                    // Send response data to the server
                                    fetch('https://node95.webte.fei.stuba.sk/webte_final/response', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(responseData)
                                    })
                                    .then(response => response.json())
                                    .then(responseData => {
                                        console.log('Response:', responseData);
                                    })
                                    .catch(error => {
                                        console.error('Error submitting response:', error);
                                    });
                                });

                                displayQuestionCode(questionCode); // Display the question code
                            } else {
                                throw new Error('Failed to create question');
                            }
                        })
                        .catch(error => {
                            console.error('Error creating question:', error);
                        });
                    } else {
                        // Send the data to the server for processing without custom answers
                        fetch('https://node95.webte.fei.stuba.sk/webte_final/quest', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        })
                        .then(response => response.json())
                        .then(questionData => {
                            if (questionData.status === 'success') {
                                const questionCode = questionData.code; // Get the 5-digit code
                                displayQuestionCode(questionCode); // Display the question code
                            } else {
                                throw new Error('Failed to submit question');
                            }
                        })
                        .catch(error => {
                            console.error('Error submitting question:', error);
                        });
                    }
                } else {
                    throw new Error('Failed to create subject');
                }
            })
            .catch(error => {
                console.error('Error creating subject:', error);
            });
        });

        // Function to display question code
        function displayQuestionCode(questionCode) {
            questionCodeSpan.textContent = questionCode;
            questionCodeContainer.style.display = 'block';
        }

        joinQuestionBtn.addEventListener('click', function () {
            const questionCodeInput = document.getElementById('question-code-input').value.trim();
            if (questionCodeInput) {
                window.location.href = `question.html?code=${questionCodeInput}`;
            } else {
                alert('Please enter a valid question code.');
            }
        });
        

        // Language Switcher Functionality
        const langButtons = document.querySelectorAll('.language-switcher button');
        langButtons.forEach(button => {
            button.addEventListener('click', function () {
                const lang = this.dataset.lang;
                changeLanguage(lang); // Call the function to change language on button click
            });
        });

        function changeLanguage(lang) {
            const translations = {
                'en': {
                    'create_question': 'Create a Question',
                    'subject_label': 'Subject:',
                    'question_label': 'Question:',
                    'submit_question': 'Submit Question',
                    'response_type_label': 'Response Type:',
                    'response_type_custom': 'Custom Answers',
                    'response_type_user': 'User Input Answers',
                    'custom_answers_label': 'Custom Answers:',
                    'add_answer': 'Add Answer',
                    'question_submitted_successfully': 'Question submitted successfully',
                    'failed_to_submit_question': 'Failed to submit question',
                    'fill_all_custom_answers': 'Please fill in all custom answers before submitting the form.'
                },
                'sk': {
                    'create_question': 'Vytvoriť otázku',
                    'subject_label': 'Predmet:',
                    'question_label': 'Otázka:',
                    'submit_question': 'Odoslať otázku',
                    'response_type_label': 'Typ odpovede:',
                    'response_type_custom': 'Vlastné odpovede',
                    'response_type_user': 'Odpovede používateľa',
                    'custom_answers_label': 'Vlastné odpovede:',
                    'add_answer': 'Pridať odpoveď',
                    'question_submitted_successfully': 'Otázka bola úspešne odoslaná',
                    'failed_to_submit_question': 'Odoslanie otázky zlyhalo',
                    'fill_all_custom_answers': 'Vyplňte všetky vlastné odpovede pred odoslaním formulára.'
                }
            };

            const elementsToTranslate = document.querySelectorAll('[data-translate]');

            elementsToTranslate.forEach(element => {
                const translationKey = element.dataset.translate;
                element.textContent = translations[lang][translationKey];
            });
        }

        changeLanguage('en'); // Set default language to English

        // Initial display setup for custom answers group
        customAnswersGroup.style.display = responseType.value === 'custom' ? 'flex' : 'none';
    }
});


    function checkSession(logged_in) {
        fetch('https://node95.webte.fei.stuba.sk/webte_final/auth/checkSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' // Ensure cookies are sent with the request
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('User is logged in:', data);
                logged_in = true;
                
            } else {
                console.log('User is not logged in:', data.message);

            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    
}
