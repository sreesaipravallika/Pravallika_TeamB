/**
 * ============================================
 * PASSWORD VALIDATION SYSTEM
 * QuickServ Login & Registration Module
 * ============================================
 * 
 * This script handles:
 * 1. Form switching (Login/Register)
 * 2. Password show/hide toggle
 * 3. Real-time password validation
 * 4. Password strength indicator
 * 5. Form submission with validation
 * 6. Local storage for user data
 */

// ============================================
// GLOBAL VARIABLES & INITIALIZATION
// ============================================

// Get all DOM elements
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginFormContainer = document.getElementById('loginForm');
const registerFormContainer = document.getElementById('registerForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Login form elements
const loginFormElement = document.getElementById('loginFormElement');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const loginSuccess = document.getElementById('loginSuccess');

// Register form elements
const registerFormElement = document.getElementById('registerFormElement');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const registerPhone = document.getElementById('registerPhone');
const registerLocation = document.getElementById('registerLocation');

// Password toggle buttons
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Error message elements
const registerNameError = document.getElementById('registerNameError');
const registerEmailError = document.getElementById('registerEmailError');
const registerPasswordError = document.getElementById('registerPasswordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const registerPhoneError = document.getElementById('registerPhoneError');
const registerLocationError = document.getElementById('registerLocationError');
const registerSuccess = document.getElementById('registerSuccess');

// Password strength elements
const passwordStrength = document.getElementById('passwordStrength');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const passwordRequirements = document.getElementById('passwordRequirements');

// Password requirement elements
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqLowercase = document.getElementById('req-lowercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');


// ============================================
// FORM SWITCHING FUNCTIONS
// ============================================

/**
 * Switch to Login Form
 */
function showLoginForm() {
    loginFormContainer.classList.add('active');
    registerFormContainer.classList.remove('active');
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    clearAllErrors();
}

/**
 * Switch to Registration Form
 */
function showRegisterForm() {
    registerFormContainer.classList.add('active');
    loginFormContainer.classList.remove('active');
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    clearAllErrors();
}

// Event listeners for form switching
loginToggle.addEventListener('click', showLoginForm);
registerToggle.addEventListener('click', showRegisterForm);
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});


// ============================================
// PASSWORD SHOW/HIDE TOGGLE
// ============================================

/**
 * Toggle password visibility
 * @param {HTMLInputElement} input - Password input field
 * @param {HTMLButtonElement} button - Toggle button
 */
function togglePasswordVisibility(input, button) {
    if (input.type === 'password') {
        input.type = 'text';
        button.querySelector('.eye-icon').textContent = '🙈';
    } else {
        input.type = 'password';
        button.querySelector('.eye-icon').textContent = '👁️';
    }
}

// Event listeners for password toggles
toggleLoginPassword.addEventListener('click', () => {
    togglePasswordVisibility(loginPassword, toggleLoginPassword);
});

toggleRegisterPassword.addEventListener('click', () => {
    togglePasswordVisibility(registerPassword, toggleRegisterPassword);
});

toggleConfirmPassword.addEventListener('click', () => {
    togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
});


// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if password meets minimum length requirement
 * @param {string} password - Password to check
 * @returns {boolean} - True if meets requirement
 */
function hasMinLength(password) {
    return password.length >= 8;
}

/**
 * Check if password contains uppercase letter
 * @param {string} password - Password to check
 * @returns {boolean} - True if contains uppercase
 */
function hasUppercase(password) {
    return /[A-Z]/.test(password);
}

/**
 * Check if password contains lowercase letter
 * @param {string} password - Password to check
 * @returns {boolean} - True if contains lowercase
 */
function hasLowercase(password) {
    return /[a-z]/.test(password);
}

/**
 * Check if password contains number
 * @param {string} password - Password to check
 * @returns {boolean} - True if contains number
 */
function hasNumber(password) {
    return /[0-9]/.test(password);
}

/**
 * Check if password contains special character
 * @param {string} password - Password to check
 * @returns {boolean} - True if contains special character
 */
function hasSpecialChar(password) {
    return /[@#$%&!*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
}

/**
 * Validate if password meets all requirements
 * @param {string} password - Password to validate
 * @returns {object} - Object with validation results
 */
function validatePassword(password) {
    return {
        length: hasMinLength(password),
        uppercase: hasUppercase(password),
        lowercase: hasLowercase(password),
        number: hasNumber(password),
        special: hasSpecialChar(password),
        isValid: hasMinLength(password) && 
                 hasUppercase(password) && 
                 hasLowercase(password) && 
                 hasNumber(password) && 
                 hasSpecialChar(password)
    };
}

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {number} - Strength score (0-4)
 */
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (hasMinLength(password)) score++;
    if (hasUppercase(password)) score++;
    if (hasLowercase(password)) score++;
    if (hasNumber(password)) score++;
    if (hasSpecialChar(password)) score++;
    
    // Bonus for extra length
    if (password.length >= 12) score++;
    
    // Normalize to 0-4 scale
    return Math.min(Math.floor(score / 1.5), 4);
}


// ============================================
// REAL-TIME PASSWORD VALIDATION
// ============================================

/**
 * Update password requirements checklist
 * @param {string} password - Current password value
 */
function updatePasswordRequirements(password) {
    const validation = validatePassword(password);
    
    // Update each requirement
    updateRequirement(reqLength, validation.length);
    updateRequirement(reqUppercase, validation.uppercase);
    updateRequirement(reqLowercase, validation.lowercase);
    updateRequirement(reqNumber, validation.number);
    updateRequirement(reqSpecial, validation.special);
}

/**
 * Update individual requirement status
 * @param {HTMLElement} element - Requirement element
 * @param {boolean} isValid - Whether requirement is met
 */
function updateRequirement(element, isValid) {
    if (isValid) {
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
    }
}

/**
 * Update password strength indicator
 * @param {string} password - Current password value
 */
function updatePasswordStrength(password) {
    if (password.length === 0) {
        passwordStrength.classList.remove('show');
        return;
    }
    
    passwordStrength.classList.add('show');
    
    const strength = calculatePasswordStrength(password);
    const strengthLevels = ['', 'weak', 'fair', 'good', 'strong'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    
    // Remove all strength classes
    strengthFill.className = 'strength-fill';
    strengthText.className = 'strength-text';
    
    // Add current strength class
    if (strength > 0) {
        strengthFill.classList.add(strengthLevels[strength]);
        strengthText.classList.add(strengthLevels[strength]);
        strengthText.textContent = `Password Strength: ${strengthLabels[strength]}`;
    }
}

// Event listener for password input
registerPassword.addEventListener('input', (e) => {
    const password = e.target.value;
    
    // Show requirements checklist when user starts typing
    if (password.length > 0) {
        passwordRequirements.classList.add('show');
    } else {
        passwordRequirements.classList.remove('show');
    }
    
    // Update requirements and strength
    updatePasswordRequirements(password);
    updatePasswordStrength(password);
    
    // Clear error message while typing
    registerPasswordError.textContent = '';
    registerPassword.classList.remove('error', 'success');
});

// Event listener for confirm password
confirmPassword.addEventListener('input', () => {
    confirmPasswordError.textContent = '';
    confirmPassword.classList.remove('error', 'success');
});


// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

/**
 * Show error message for a field
 * @param {HTMLInputElement} input - Input field
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message to display
 */
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
}

/**
 * Show success state for a field
 * @param {HTMLInputElement} input - Input field
 * @param {HTMLElement} errorElement - Error message element
 */
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
}

/**
 * Clear all error messages
 */
function clearAllErrors() {
    // Login errors
    loginEmailError.textContent = '';
    loginPasswordError.textContent = '';
    loginEmail.classList.remove('error', 'success');
    loginPassword.classList.remove('error', 'success');
    loginSuccess.classList.remove('show');
    
    // Register errors
    registerNameError.textContent = '';
    registerEmailError.textContent = '';
    registerPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    registerPhoneError.textContent = '';
    registerLocationError.textContent = '';
    registerName.classList.remove('error', 'success');
    registerEmail.classList.remove('error', 'success');
    registerPassword.classList.remove('error', 'success');
    confirmPassword.classList.remove('error', 'success');
    registerPhone.classList.remove('error', 'success');
    registerLocation.classList.remove('error', 'success');
    registerSuccess.classList.remove('show');
}


// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

/**
 * Get all users from local storage
 * @returns {Array} - Array of user objects
 */
function getUsers() {
    const users = localStorage.getItem('quickserv_users');
    return users ? JSON.parse(users) : [];
}

/**
 * Save user to local storage
 * @param {object} user - User object to save
 */
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('quickserv_users', JSON.stringify(users));
}

/**
 * Check if email already exists
 * @param {string} email - Email to check
 * @returns {boolean} - True if exists
 */
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by email
 * @param {string} email - Email to search for
 * @returns {object|null} - User object or null
 */
function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}


// ============================================
// LOGIN FORM VALIDATION & SUBMISSION
// ============================================

/**
 * Validate login form
 * @returns {boolean} - True if form is valid
 */
function validateLoginForm() {
    let isValid = true;
    
    // Validate email
    if (!loginEmail.value.trim()) {
        showError(loginEmail, loginEmailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(loginEmail.value)) {
        showError(loginEmail, loginEmailError, 'Please enter a valid email');
        isValid = false;
    } else {
        showSuccess(loginEmail, loginEmailError);
    }
    
    // Validate password
    if (!loginPassword.value) {
        showError(loginPassword, loginPasswordError, 'Password is required');
        isValid = false;
    } else {
        showSuccess(loginPassword, loginPasswordError);
    }
    
    return isValid;
}

/**
 * Handle login form submission
 */
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous messages
    loginSuccess.classList.remove('show');
    
    // Validate form
    if (!validateLoginForm()) {
        return;
    }
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    // Check if user exists
    const user = findUserByEmail(email);
    
    if (!user) {
        showError(loginEmail, loginEmailError, 'Invalid email - User not found');
        return;
    }
    
    // Verify password
    if (user.password !== password) {
        showError(loginPassword, loginPasswordError, 'Incorrect password');
        return;
    }
    
    // Login successful
    showSuccess(loginEmail, loginEmailError);
    showSuccess(loginPassword, loginPasswordError);
    loginSuccess.textContent = `✓ Login successful! Welcome back, ${user.name}!`;
    loginSuccess.classList.add('show');
    
    // Clear form
    setTimeout(() => {
        loginFormElement.reset();
        clearAllErrors();
        alert(`Welcome back, ${user.name}! You are now logged in.`);
    }, 2000);
});


// ============================================
// REGISTRATION FORM VALIDATION & SUBMISSION
// ============================================

/**
 * Validate registration form
 * @returns {boolean} - True if form is valid
 */
function validateRegisterForm() {
    let isValid = true;
    
    // Validate name
    if (!registerName.value.trim()) {
        showError(registerName, registerNameError, 'Name is required');
        isValid = false;
    } else if (registerName.value.trim().length < 2) {
        showError(registerName, registerNameError, 'Name must be at least 2 characters');
        isValid = false;
    } else {
        showSuccess(registerName, registerNameError);
    }
    
    // Validate email
    if (!registerEmail.value.trim()) {
        showError(registerEmail, registerEmailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(registerEmail.value)) {
        showError(registerEmail, registerEmailError, 'Please enter a valid email');
        isValid = false;
    } else if (emailExists(registerEmail.value)) {
        showError(registerEmail, registerEmailError, 'Email already registered');
        isValid = false;
    } else {
        showSuccess(registerEmail, registerEmailError);
    }
    
    // Validate password
    const passwordValidation = validatePassword(registerPassword.value);
    if (!registerPassword.value) {
        showError(registerPassword, registerPasswordError, 'Password is required');
        isValid = false;
    } else if (!passwordValidation.isValid) {
        showError(registerPassword, registerPasswordError, 'Password does not meet all requirements');
        isValid = false;
    } else {
        showSuccess(registerPassword, registerPasswordError);
    }
    
    // Validate confirm password
    if (!confirmPassword.value) {
        showError(confirmPassword, confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (confirmPassword.value !== registerPassword.value) {
        showError(confirmPassword, confirmPasswordError, 'Passwords do not match');
        isValid = false;
    } else {
        showSuccess(confirmPassword, confirmPasswordError);
    }
    
    // Validate phone
    if (!registerPhone.value.trim()) {
        showError(registerPhone, registerPhoneError, 'Phone number is required');
        isValid = false;
    } else if (!/^\d{10}$/.test(registerPhone.value.replace(/\D/g, ''))) {
        showError(registerPhone, registerPhoneError, 'Please enter a valid 10-digit phone number');
        isValid = false;
    } else {
        showSuccess(registerPhone, registerPhoneError);
    }
    
    // Validate location
    if (!registerLocation.value.trim()) {
        showError(registerLocation, registerLocationError, 'Location is required');
        isValid = false;
    } else {
        showSuccess(registerLocation, registerLocationError);
    }
    
    return isValid;
}

/**
 * Handle registration form submission
 */
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous messages
    registerSuccess.classList.remove('show');
    
    // Validate form
    if (!validateRegisterForm()) {
        return;
    }
    
    // Create user object
    const newUser = {
        id: Date.now(),
        name: registerName.value.trim(),
        email: registerEmail.value.trim().toLowerCase(),
        password: registerPassword.value,
        phone: registerPhone.value.trim(),
        location: registerLocation.value.trim(),
        createdAt: new Date().toISOString()
    };
    
    // Save user
    saveUser(newUser);
    
    // Show success message
    registerSuccess.textContent = `✓ Registration successful! Welcome, ${newUser.name}!`;
    registerSuccess.classList.add('show');
    
    // Clear form and switch to login after 2 seconds
    setTimeout(() => {
        registerFormElement.reset();
        clearAllErrors();
        passwordRequirements.classList.remove('show');
        passwordStrength.classList.remove('show');
        showLoginForm();
        alert('Registration successful! Please login with your credentials.');
    }, 2000);
});


// ============================================
// INITIALIZATION
// ============================================

console.log('Password Validation System Loaded Successfully!');
console.log('Features:');
console.log('- Real-time password validation');
console.log('- Password strength indicator');
console.log('- Show/hide password toggle');
console.log('- Email validation');
console.log('- Form switching');
console.log('- Local storage for user data');
