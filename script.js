function togglePasswordVisibility() {
    let passwordInput = document.getElementById('password');
    let toggleButton = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = 'Show';
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

// Event listener for form submission
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Example validation: Ensure both fields are not empty
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) { // Simplified check
            // Redirect to the mainPage.html
            window.location.href = 'mainPage.html';
        } else {
            // Optionally handle invalid input
            alert('Please enter both username and password.');
        }
    });

    const savedLanguage = localStorage.getItem("selectedLanguage") || 'en'; // Default to English
    switchLanguage(savedLanguage);

    // Set up event listeners for language switch buttons
    document.querySelectorAll(".language-switcher button").forEach(button => {
        button.addEventListener('click', () => switchLanguage(button.getAttribute('data-lang')));
    });
});
