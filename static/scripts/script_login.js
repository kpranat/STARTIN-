// Navigation state management
let currentPage = 'university';
let selectedUniversity = '';
let selectedRole = '';
let isLoginMode = true;

// Page navigation functions
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    currentPage = pageId;
}

function goBack() {
    if (currentPage === 'role') {
        showPage('university');
    } else if (currentPage === 'login') {
        showPage('role');
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeUniversitySelection();
    initializeRoleSelection();
    initializeLoginForm();
    addVisualEffects();
});

// University selection handler
function initializeUniversitySelection() {
    const universityCards = document.querySelectorAll('.university-card');

    universityCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('coming-soon')) {
                return;
            }

            selectedUniversity = this.dataset.university;
            if (selectedUniversity === 'srm') {
                showPage('role');
            }
        });
    });
}

// Role selection handler
function initializeRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');

    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            selectedRole = this.dataset.role;
            updateLoginPage();
            showPage('login');
        });
    });
}

// Login form initialization
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (!loginForm || !loginBtn || !registerBtn) {
        console.error('Required form elements not found!');
        return;
    }

    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted for role:', selectedRole);

        // Prevent multiple submissions
        if (loginBtn.disabled) {
            return;
        }

        // Handle based on role
        if (selectedRole === 'student') {
            handleStudentSubmission();
        } else if (selectedRole === 'company') {
            handleCompanySubmission();
        }
    });
}

// Update login page based on selected role
function updateLoginPage() {
    console.log('Updating login page for role:', selectedRole);

    const loginTitle = document.getElementById('login-title');
    const studentFields = document.querySelector('.student-fields');
    const companyFields = document.querySelector('.company-fields');

    if (!loginTitle || !studentFields || !companyFields) {
        console.error('Required page elements not found');
        return;
    }

    // Clear all required attributes first
    clearAllRequired();

    if (selectedRole === 'student') {
        loginTitle.textContent = 'Student Portal';
        studentFields.style.display = 'block';
        companyFields.style.display = 'none';

        // Set required for visible student fields
        setRequired(['email', 'password']);

    } else if (selectedRole === 'company') {
        loginTitle.textContent = 'Company Portal';
        studentFields.style.display = 'none';
        companyFields.style.display = 'block';

        // Set required for visible company fields
        setRequired(['company-name', 'company-password']);
    }

    // Reset form mode when switching roles
    isLoginMode = true;
    updateFormMode();
}

// Helper function to clear all required attributes
function clearAllRequired() {
    const allInputs = document.querySelectorAll('#login-form input, #login-form textarea');
    allInputs.forEach(input => {
        input.removeAttribute('required');
    });
}

// Helper function to set required attributes
function setRequired(fieldIds) {
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('required', '');
        }
    });
}

// Toggle between login and register mode
function updateFormMode() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const companyRegisterFields = document.querySelector('.company-register-fields');

    if (!loginBtn || !registerBtn) {
        return;
    }

    if (isLoginMode) {
        loginBtn.textContent = 'Login';
        registerBtn.textContent = 'Create Account';
        if (companyRegisterFields) {
            companyRegisterFields.style.display = 'none';
        }

        // Set required fields for login mode only
        if (selectedRole === 'student') {
            setRequired(['email', 'password']);
        } else if (selectedRole === 'company') {
            setRequired(['company-name', 'company-password']);
        }

    } else {
        loginBtn.textContent = 'Create Account';
        registerBtn.textContent = 'Back to Login';

        if (selectedRole === 'company' && companyRegisterFields) {
            companyRegisterFields.style.display = 'block';
            // Add required for additional company fields
            setRequired(['company-name', 'company-password', 'company-description']);
        } else if (selectedRole === 'student') {
            setRequired(['email', 'password']);
        }
    }
}

// Simplified student submission handler
function handleStudentSubmission() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!email || !password) {
        console.error('Student form fields not found');
        return;
    }

    if (validateStudentForm(email.value, password.value)) {
        if (isLoginMode) {
            performLogin('student', { email: email.value, password: password.value });
        } else {
            performRegistration('student', { email: email.value, password: password.value });
        }
    }
}

// Simplified company submission handler
function handleCompanySubmission() {
    const companyName = document.getElementById('company-name');
    const companyPassword = document.getElementById('company-password');
    const companyDescription = document.getElementById('company-description');
    const companyWebsite = document.getElementById('company-website');

    if (!companyName || !companyPassword) {
        console.error('Company form fields not found');
        return;
    }

    const data = {
        companyName: companyName.value,
        companyPassword: companyPassword.value,
        companyDescription: companyDescription?.value || '',
        companyWebsite: companyWebsite?.value || ''
    };

    if (validateCompanyForm(data.companyName, data.companyPassword, data.companyDescription, data.companyWebsite)) {
        if (isLoginMode) {
            performLogin('company', data);
        } else {
            performRegistration('company', data);
        }
    }
}

// Unified login/registration performer
function performLogin(role, data) {
    console.log('Performing login for:', role);
    const loginBtn = document.getElementById('login-btn');

    if (!loginBtn) {
        console.error('Login button not found!');
        return;
    }

    // Set loading state
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        console.log('Login successful, redirecting...');

        // Reset button state
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        // Redirect based on role
        if (role === 'student') {
            window.location.href = 'index_student.html';
        } else if (role === 'company') {
            window.location.href = 'index_startup.html';
        }
    }, 1500);
}

function performRegistration(role, data) {
    console.log('Performing registration for:', role);
    const loginBtn = document.getElementById('login-btn');

    if (!loginBtn) {
        console.error('Login button not found!');
        return;
    }

    // Set loading state
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Creating Account...';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        console.log('Registration successful');

        // Reset button state
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        alert(`${role === 'student' ? 'Student' : 'Company'} account created successfully! (This is a demo)`);

        // Switch back to login mode
        isLoginMode = true;
        updateFormMode();
        clearForm();
    }, 1500);
}

// Clear form fields
function clearForm() {
    // Clear student fields
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (email) email.value = '';
    if (password) password.value = '';

    // Clear company fields
    const companyName = document.getElementById('company-name');
    const companyPassword = document.getElementById('company-password');
    const companyDescription = document.getElementById('company-description');
    const companyWebsite = document.getElementById('company-website');

    if (companyName) companyName.value = '';
    if (companyPassword) companyPassword.value = '';
    if (companyDescription) companyDescription.value = '';
    if (companyWebsite) companyWebsite.value = '';
}

// Student form validation
function validateStudentForm(email, password) {
    let isValid = true;

    // Email validation
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        if (emailError) emailError.style.display = 'block';
        isValid = false;
    } else {
        if (emailError) emailError.style.display = 'none';
    }

    // Password validation
    const passwordError = document.getElementById('password-error');

    if (!password || password.length < 6) {
        if (passwordError) passwordError.style.display = 'block';
        isValid = false;
    } else {
        if (passwordError) passwordError.style.display = 'none';
    }

    return isValid;
}

// Company form validation
function validateCompanyForm(companyName, companyPassword, companyDescription, companyWebsite) {
    let isValid = true;

    // Company name validation
    const companyNameError = document.getElementById('company-name-error');
    if (!companyName || companyName.trim().length < 2) {
        if (companyNameError) companyNameError.style.display = 'block';
        isValid = false;
    } else {
        if (companyNameError) companyNameError.style.display = 'none';
    }

    // Company password validation
    const companyPasswordError = document.getElementById('company-password-error');
    if (!companyPassword || companyPassword.length < 6) {
        if (companyPasswordError) companyPasswordError.style.display = 'block';
        isValid = false;
    } else {
        if (companyPasswordError) companyPasswordError.style.display = 'none';
    }

    // Only validate additional fields in register mode
    if (!isLoginMode) {
        // Company description validation
        const companyDescriptionError = document.getElementById('company-description-error');
        if (!companyDescription || companyDescription.trim().length < 10) {
            if (companyDescriptionError) companyDescriptionError.style.display = 'block';
            isValid = false;
        } else {
            if (companyDescriptionError) companyDescriptionError.style.display = 'none';
        }

        // Company website validation (optional but if provided, must be valid)
        const companyWebsiteError = document.getElementById('company-website-error');
        if (companyWebsite && companyWebsite.trim()) {
            const urlRegex = /^https?:\/\/.+\..+/;
            if (!urlRegex.test(companyWebsite)) {
                if (companyWebsiteError) companyWebsiteError.style.display = 'block';
                isValid = false;
            } else {
                if (companyWebsiteError) companyWebsiteError.style.display = 'none';
            }
        } else {
            if (companyWebsiteError) companyWebsiteError.style.display = 'none';
        }
    }

    return isValid;
}

// Add visual feedback effects
function addVisualEffects() {
    const clickableElements = document.querySelectorAll('.university-card:not(.coming-soon), .role-card');

    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add ripple if it's not the form submit button
            if (this.type !== 'submit') {
                createRipple(e, this);
            }
        });
    });
}

// Create ripple effect
function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Add CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);