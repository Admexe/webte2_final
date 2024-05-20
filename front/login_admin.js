// Object containing data for each language
const languageData = {
    en: {
        loginTitle: "Login as Administrator",
        usernamePlaceholder: "Email or Username",
        passwordPlaceholder: "Password",
        loginButton: "Login",
        showPassword: "Show",
        hidePassword: "Hide"
    },
    sk: {
        loginTitle: "Prihláste sa ako administrátor",
        usernamePlaceholder: "E-mail alebo používateľské meno",
        passwordPlaceholder: "Heslo",
        loginButton: "Prihlásiť sa",
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

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
}

// Function to perform login
function login(username, password) {
    const credentials = { username, password };
    
    // Example validation for admin
    if (username === 'admin@admin1.com' && password === '111') {
        window.location.href = 'question_admin.html'; // Redirect to admin page
    } else {
        // Show error message
        const errorElement = document.createElement('p');
        errorElement.textContent = 'Incorrect credentials. Try again.';
        errorElement.style.color = 'red';

        const form = document.getElementById('loginForm');
        form.appendChild(errorElement);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Set up event listeners for language switch buttons
    document.querySelectorAll(".language-switcher button").forEach(button => {
        button.addEventListener('click', () => switchLanguage(button.getAttribute('data-lang')));
    });

    // Set up event listener for form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener('submit', handleFormSubmit);

    // Load the selected language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage") || 'en'; // Default to English
    switchLanguage(savedLanguage);
});
