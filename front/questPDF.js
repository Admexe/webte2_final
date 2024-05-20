document.addEventListener('DOMContentLoaded', function() {
    // Fetch user ID from session
    let options;
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');

    

            // Fetch question details using user ID
            fetch(`https://node95.webte.fei.stuba.sk/webte_final/quest/id/${questionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(questionData => {
                if (questionData.status === 'success') {
                    const questionText = questionData.question.text;
                    console.log('Question Text:', questionText);

                    // Display question text in HTML
                    document.getElementById('question-text').textContent = questionText;

                    // Fetch responses for the question
                    fetch(`https://node95.webte.fei.stuba.sk/webte_final/response/question/${questionId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        // Process response data and create HTML
                        responseData.forEach(response => {
                            const responseText = response.text;
                            const votes = response.votes;

                            // Create HTML elements for response text and votes
                            const responseItem = document.createElement('div');
                            responseItem.classList.add('response-item');
                            responseItem.innerHTML = `<p class="response-text">${responseText}</p><span class="votes">Votes: ${votes}</span>`;

                            // Append response item to the container
                            document.getElementById('responses-container').appendChild(responseItem);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching responses:', error);
                    });
                } else {
                    console.error('Error fetching question data:', questionData.message);
                }
            })
            .catch(error => {
                console.error('Error fetching question details:', error);
            });
            
     // Generate and download PDF on button click
document.querySelector('.pdf-download').addEventListener('click', function() {
    fetch('https://node95.webte.fei.stuba.sk/webte_final/controllers/generate_questPDF.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'html=' + encodeURIComponent(document.documentElement.innerHTML)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'question_and_answers.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error generating PDF:', error);
    });
});

});
