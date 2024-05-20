let logged_in = false;

document.addEventListener('DOMContentLoaded', function() {
    checkSession().then(isLoggedIn => {
        logged_in = isLoggedIn;
        console.log(logged_in);

        if (!logged_in) {
            window.location.href = 'index.html';
        } else {
            document.getElementById('current-votes').classList.remove('hidden');
            document.getElementById('past-votes').classList.remove('hidden');
            document.getElementById('profile').classList.remove('hidden');

            document.getElementById('logout').addEventListener('click', function() {
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
                        window.location.href = 'index.html';
                    } else {
                        alert('Logout failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                    alert('An error occurred. Please try again.');
                });
            });

            fetchUserDetailsAndQuestions();
        }
    }).catch(error => {
        console.error('Error checking session:', error);
        window.location.href = 'index.html';
    });

    function checkSession() {
        return fetch('https://node95.webte.fei.stuba.sk/webte_final/auth/checkSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('User is logged in:', data);
                return true;
            } else {
                console.log('User is not logged in:', data.message);
                return false;
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            return false;
        });
    }

    function fetchUserDetailsAndQuestions() {
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

                fetch(`https://node95.webte.fei.stuba.sk/webte_final/quest/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const currentQuestions = data.questions.filter(question => question.status === 1);
                        const pastQuestions = data.questions.filter(question => question.status === 0);

                        displayQuestions(currentQuestions, 'current-votes', 'votes-list');
                        displayQuestions(pastQuestions, 'past-votes', 'votes-results');
                    } else {
                        console.error('Error:', data.message);
                    }
                });
            } else {
                alert('Error fetching user ID: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
                    document.getElementById('username').value = data.name;
                    document.getElementById('email').value = data.email;
                } else {
                    alert('Error fetching user info.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        }

        document.getElementById('profile-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const name = document.getElementById('username').value;
            const password = document.getElementById('new-password').value;

            const updateData = { email, name };
            if (password) {
                updateData.password = password;
            }

            fetch(`https://node95.webte.fei.stuba.sk/webte_final/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('User info updated successfully!');
                    document.getElementById('username').value = name;
                    document.getElementById('email').value = email;
                    document.getElementById('new-password').value = '';
                    location.reload();
                } else {
                    alert('Error updating user info: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }

    function displayQuestions(questions, sectionId, listClass) {
        const section = document.getElementById(sectionId);
        const list = section.querySelector(`.${listClass}`);
        list.innerHTML = '';

        questions.forEach(question => {
            const p = document.createElement('p');
            p.textContent = question.text;
            p.classList.add('question-link');
            p.dataset.questionId = question.id;
            p.addEventListener('click', () => {
                const questionId = question.id;
                window.location.href = `https://node95.webte.fei.stuba.sk/webte_final/front/editQuestion.html?questionId=${questionId}&userId=${userId}`;
            });
            list.appendChild(p);
        });

        section.classList.remove('hidden');
    }
});
