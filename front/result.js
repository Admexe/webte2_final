document.addEventListener('DOMContentLoaded', function () {
    const langButtons = document.querySelectorAll('.language-switcher button');
    const translations = {
        'en': {
            'question_answers': 'Question Answers',
            'answers': ['Answer 1', 'Answer 2', 'Answer 3']
        },
        'sk': {
            'question_answers': 'Odpovede na otázky',
            'answers': ['Odpoveď 1', 'Odpoveď 2', 'Odpoveď 3']
        }
    };

    let currentLang = 'en';

    langButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentLang = this.dataset.lang;
            changeLanguage(currentLang);
            updateChart(currentLang);
        });
    });

    function changeLanguage(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const translationKey = element.dataset.translate;
            element.textContent = translations[lang][translationKey];
        });
    }

    function getRandomLightBlueColor() {
        const r = Math.floor(Math.random() * 56 + 200); // Range 200-255
        const g = Math.floor(Math.random() * 56 + 200); // Range 200-255
        const b = Math.floor(Math.random() * 156 + 100); // Range 100-255
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    }

    function getRandomLightBlueColorBorder() {
        const r = Math.floor(Math.random() * 56 + 200); // Range 200-255
        const g = Math.floor(Math.random() * 56 + 200); // Range 200-255
        const b = Math.floor(Math.random() * 156 + 100); // Range 100-255
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    let chart;

    function createChart(data) {
        const ctx = document.getElementById('answersChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateChart(lang) {
        const data = {
            labels: translations[lang].answers,
            datasets: [{
                label: translations[lang].question_answers,
                data: [10, 20, 30],
                backgroundColor: translations[lang].answers.map(() => getRandomLightBlueColor()),
                borderColor: translations[lang].answers.map(() => getRandomLightBlueColorBorder()),
                borderWidth: 1
            }]
        };
        if (chart) {
            chart.destroy();
        }
        createChart(data);
    }

    changeLanguage('en');
    updateChart('en');
});
