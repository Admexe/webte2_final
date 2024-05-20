document.addEventListener('DOMContentLoaded', function () {
    // fetch('https://node95.webte.fei.stuba.sk/webte_final/questions')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         const questionsList = document.getElementById('questions-list');
    //         data.forEach(question => {
    //             const questionItem = document.createElement('div');
    //             questionItem.className = 'question-item';
    //             questionItem.textContent = question.text;
    //             questionsList.appendChild(questionItem);
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Error fetching questions:', error);
    //     });

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
                'questions_title': 'Questions'
            },
            'sk': {
                'questions_title': 'Otázky'
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
