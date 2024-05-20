function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const translations = {
        'en': {
            'show': 'Show',
            'hide': 'Hide'
        },
        'sk': {
            'show': 'Zobraziť',
            'hide': 'Skryť'
        }
    };
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        togglePassword.textContent = translations[currentLanguage]['hide'];
    } else {
        passwordField.type = 'password';
        togglePassword.textContent = translations[currentLanguage]['show'];
    }
}
// Object containing data for each language
const languageData = {
    en: {
        loginTitle: "Login to Your Account",
        usernamePlaceholder: "Email or Username",
        passwordPlaceholder: "Password",
        loginButton: "Login",
        forgotPassword: "Forgot password?",
        registerNow: "Register now",
        showPassword: "Show",
        hidePassword: "Hide"
    },
    sk: {
        loginTitle: "Prihláste sa na váš učet",
        usernamePlaceholder: "E-mail alebo používateľské meno",
        passwordPlaceholder: "Heslo",
        loginButton: "Prihlásiť sa",
        forgotPassword: "Zabudli ste heslo?",
        registerNow: "Registrovať sa",
        showPassword: "Zobraziť",
        hidePassword: "Skryť"
    }
};

// Function to switch language and update the page content
function switchLanguage(lang) {
    document.querySelector("h1.center-text").textContent = languageData[lang].loginTitle;
    document.getElementById("username").placeholder = languageData[lang].usernamePlaceholder;
    document.getElementById("password").placeholder = languageData[lang].passwordPlaceholder;
    document.querySelector(".login-button").textContent = languageData[lang].loginButton;
    document.querySelector(".forgot-password").textContent = languageData[lang].forgotPassword;
    document.querySelector(".register-link").textContent = languageData[lang].registerNow;
    document.getElementById("togglePassword").textContent = languageData[lang].showPassword;

    // Save the selected language in localStorage for future visits
    localStorage.setItem("selectedLanguage", lang);
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const togglePasswordButton = document.getElementById("togglePassword");
    const lang = localStorage.getItem("selectedLanguage") || 'en';
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    togglePasswordButton.textContent = languageData[lang].hidePassword;
    } else {
        passwordInput.type = "password";
        togglePasswordButton.textContent = languageData[lang].showPassword;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".language-switcher button").forEach(button => {
        button.addEventListener('click', () => switchLanguage(button.getAttribute('data-lang')));
    });
    const loginForm = document.getElementById("loginForm"); 
    console.log("SEM TADYSS");
    console.log(loginForm);
    loginForm.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    console.log("TRYING MY BEST HERE");
    login(username, password);
}

function login(username, password) {
    const credentials = { username, password };
    fetch('https://node95.webte.fei.stuba.sk/webte_final/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = 'question_admin.html';
        } else {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

/*function handleFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Проверка введенных учетных данных для администратора
    if (username === 'admin@admin1.com' && password === '111') {
        window.location.href = 'question_admin.html'; // do stranky admina
    } else {
        // Вывод сообщения об ошибке
        const errorElement = document.createElement('p');
        errorElement.textContent = 'Incorrect credentials. Try again.';
        errorElement.style.color = 'red';

        const form = document.getElementById('loginForm');
        form.appendChild(errorElement);
    }
}*/


// !!!!!!!Tento kód som zmenilа, pretože pri aktualizácii prestal pracovať preklad stránky do slovenčiny!!!!!!!

// // Event listener for form submission 
// document.addEventListener("DOMContentLoaded", function() {
//     const loginForm = document.getElementById("loginForm");

//     loginForm.addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the default form submission behavior

//         // Example validation: Ensure both fields are not empty
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
//         const credentials = {
//             username: username,
//             password: password
//         };
        
       
//         fetch('https://node95.webte.fei.stuba.sk/webte_final/auth/login', { // URL of your API endpoint
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(credentials)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Success:', data);
//         if (data.status === 'success') {
//             console.log('Session initialized:', data.session);
//             window.location.href = 'mainPage.html'; 
//         } else {
//             console.error('Login failed:', data.message);
//         }
//     })
//     .catch(error => {
//         console.error('There was a problem with your fetch operation:', error);
//     });

//     const savedLanguage = localStorage.getItem("selectedLanguage") || 'en'; // Default to English
//     switchLanguage(savedLanguage);

//     // Set up event listeners for language switch buttons
//     document.querySelectorAll(".language-switcher button").forEach(button => {
//         button.addEventListener('click', () => switchLanguage(button.getAttribute('data-lang')));
//     });
// })});
