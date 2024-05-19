document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('create-question-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const questionText = document.getElementById('question-text').value;

        fetch('https://node95.webte.fei.stuba.sk/webte_final/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: questionText
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Question submitted successfully');
                    document.getElementById('question-text').value = '';
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
                'question_submitted_successfully': 'Question submitted successfully',
                'failed_to_submit_question': 'Failed to submit question'
            },
            'sk': {
                'create_question': 'Vytvoriť otázku',
                'question_label': 'Otázka:',
                'submit_question': 'Odoslať otázku',
                'question_submitted_successfully': 'Otázka bola úspešne odoslaná',
                'failed_to_submit_question': 'Odoslanie otázky zlyhalo'
            }
        };

        const elementsToTranslate = document.querySelectorAll('[data-translate]');

        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });
    }

    changeLanguage('en'); // Set default language to English
});
