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
        hidePassword: "Hide",
        loginAsAdmin: "Login as administrator",
        instructions: "Instructions"
    },
    sk: {
        loginTitle: "Prihláste sa na váš učet",
        usernamePlaceholder: "E-mail alebo používateľské meno",
        passwordPlaceholder: "Heslo",
        loginButton: "Prihlásiť sa",
        forgotPassword: "Zabudli ste heslo?",
        registerNow: "Registrovať sa",
        showPassword: "Zobraziť",
        hidePassword: "Skryť",
        loginAsAdmin: "Prihlásiť sa ako administrátor",
        instructions: "Návod"
    }
};

// Function to switch language and update the page content
function switchLanguage(lang) {
    document.querySelector("h1.center-text").textContent = languageData[lang].loginTitle;
    document.getElementById("username").placeholder = languageData[lang].usernamePlaceholder;
    document.getElementById("password").placeholder = languageData[lang].passwordPlaceholder;
    document.querySelector(".login-button").textContent = languageData[lang].loginButton;
    document.querySelector(".forgot-password").textContent = languageData[lang].forgotPassword;
    document.querySelector(".register-link[data-translate='registerNow']").textContent = languageData[lang].registerNow;
    document.querySelector(".register-link[data-translate='instructions']").textContent = languageData[lang].instructions;
    document.querySelector(".admin-button").textContent = languageData[lang].loginAsAdmin;
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
    const savedLanguage = localStorage.getItem("selectedLanguage") || 'en'; // Default to English
    switchLanguage(savedLanguage);

    // Set up event listeners for language switch buttons
    document.querySelectorAll(".language-switcher button").forEach(button => {
        button.addEventListener('click', () => switchLanguage(button.getAttribute('data-lang')));
    });

    // Set up event listener for form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
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
            window.location.href = 'question.html';
        } else {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}


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
