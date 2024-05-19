document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-question-form');
    const responseType = document.getElementById('response-type');
    const customAnswersGroup = document.getElementById('custom-answers-group');
    const customAnswersContainer = document.getElementById('custom-answers-container');
    const addAnswerBtn = document.getElementById('add-answer-btn');

    let answerCount = 0;

    responseType.addEventListener('change', function () {
        if (responseType.value === 'custom') {
            customAnswersGroup.style.display = 'flex';
        } else {
            customAnswersGroup.style.display = 'none';
        }
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
        const questionText = document.getElementById('question-text').value;
        const responseTypeValue = responseType.value;

        const requestData = {
            text: questionText,
            responseType: responseTypeValue,
            customAnswers: []
        };

        if (responseTypeValue === 'custom') {
            const customAnswers = customAnswersContainer.querySelectorAll('input[type="text"]');
            let allAnswersFilled = true;
            customAnswers.forEach(answerInput => {
                if (!answerInput.value.trim()) {
                    allAnswersFilled = false;
                } else {
                    requestData.customAnswers.push(answerInput.value.trim());
                }
            });

            if (customAnswers.length === 0 || !allAnswersFilled) {
                alert('Please fill in all custom answers before submitting the form.');
                return; // Прекращаем выполнение функции submit
            }
        }

        fetch('https://node95.webte.fei.stuba.sk/webte_final/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Question submitted successfully');
                    form.reset();
                    customAnswersGroup.style.display = 'none';
                    customAnswersContainer.innerHTML = '';
                    answerCount = 0;
                } else {
                    throw new Error('Failed to submit question');
                }
            })
            .catch(error => {
                console.error('Error submitting question:', error);
            });
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

    // Скрытие custom-answers-group при загрузке страницы
    if (responseType.value === 'custom') {
        customAnswersGroup.style.display = 'flex';
    } else {
        customAnswersGroup.style.display = 'none';
    }
});
