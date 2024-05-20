document.addEventListener('DOMContentLoaded', function() {
    // Get the question ID and user ID from the URL
    let options;
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');
    const userId = urlParams.get('userId');

    // Fetch the question data
    fetch(`https://node126.webte.fei.stuba.sk/webte_final/quest/id/${questionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response data:', data); // Log the response data to the console
        if (data.status === 'success') {
            // Display the question text in the HTML
            const questionText = data.question.text;
            options = data.question.options; // Assign options value to the variable
            document.getElementById('question-text').textContent = questionText;
    
            // Fetch the subject data
            const subjectId = data.question.subject_id;
            fetch(`https://node126.webte.fei.stuba.sk/webte_final/subject/${subjectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(subjectData => {
                if (subjectData.status === 'success') {
                    // Fill the textarea with the subject text
                    const subjectText = subjectData.subject.text;
                    document.getElementById('subject-text').textContent = subjectText;
                } else {
                    console.error('Error:', subjectData.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while fetching the subject data. Please try again.');
            });
        } else {
            console.error('Error:', data.message);
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching the question data. Please try again.');
    });

    // Handle form submission for updating the question
    document.getElementById('create-question-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the subject text and question text from the form
        const subjectText = document.getElementById('subject-text').value.trim();
        const questionText = document.getElementById('question-text').value.trim();

        // Create or update the subject
        fetch('https://node126.webte.fei.stuba.sk/webte_final/subject', {
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
            if (subjectData.status === 'success' || subjectData.message === 'Subject already exists.') {
                const subjectId = subjectData.subject.id || subjectData.subject_id;

                // Update the question with the subject ID
                

                const updateData = {
                    text: questionText,
                    subject_id: subjectId,
                    options: options // Use the retrieved options value
                };

                fetch(`https://node126.webte.fei.stuba.sk/webte_final/quest/${questionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Question updated successfully!');
                        // Optionally redirect to another page
                        window.location.href = 'mainPage.html';
                    } else {
                        console.error('Error:', data.message);
                        alert('Failed to update question. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating the question. Please try again.');
                });
            } else {
                console.error('Error:', subjectData.message);
                alert('Failed to create or update subject. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating or updating the subject. Please try again.');
        });
    });


    function sendRequest(status) {
        fetch(`https://node126.webte.fei.stuba.sk/webte_final/quest/${questionId}/${status}`, {
            method: 'PUT', // Adjust method as needed
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Request sent successfully!');

                // If status is 0 (inactive), display note textarea
                if (status === 0) {
                    displayNoteTextarea();
                }
            } else {
                console.error('Error:', data.message);
                alert('Failed to send request. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the request. Please try again.');
        });
    }

    // Function to display note textarea
    function displayNoteTextarea() {
        // Create textarea for note
        const noteTextarea = document.createElement('textarea');
        noteTextarea.id = 'note-text';
        noteTextarea.placeholder = 'Enter note here...';
        noteTextarea.required = true;

        // Create save note button
        const saveNoteButton = document.createElement('button');
        saveNoteButton.textContent = 'Save Note';
        saveNoteButton.type = 'button';

        // Append textarea and button to the form
        const form = document.getElementById('create-question-form');
        form.appendChild(noteTextarea);
        form.appendChild(saveNoteButton);

        // Add event listener to save note button
        saveNoteButton.addEventListener('click', function() {
            const noteText = noteTextarea.value.trim();
            if (noteText) {
                saveNote(noteText);
            } else {
                alert('Note text is required.');
            }
        });
    }

    // Function to save note
    function saveNote(noteText) {
        fetch('https://node126.webte.fei.stuba.sk/webte_final/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question_id: questionId,
                text: noteText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Note saved successfully!');
            } else {
                console.error('Error:', data.message);
                alert('Failed to save note. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving the note. Please try again.');
        });
    }

    // Handle button clicks for setting question status
    document.getElementById('button-option-1').addEventListener('click', function() {
        sendRequest(1);
    });

    document.getElementById('button-option-2').addEventListener('click', function() {
        sendRequest(0);
    });


});
