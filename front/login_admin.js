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
            if (data.role === 1) {
                console.log(data.role);
                window.location.href = 'mainPage.html';
            } else {
                window.location.href = 'mainPage.html';
            }
        } else {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

