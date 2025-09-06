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
                return; // Do nothing for coming soon universities
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

// Update login page based on selected role
function updateLoginPage() {
    const loginTitle = document.getElementById('login-title');
    const roleText = selectedRole === 'student' ? 'Student' : 'Company';
    loginTitle.textContent = roleText + (isLoginMode ? ' Login' : ' Registration');

    // Show/hide fields based on role and mode
    document.getElementById('student-login-fields').style.display =
        (selectedRole === 'student' && isLoginMode) ? 'block' : 'none';
    document.getElementById('company-login-fields').style.display =
        (selectedRole === 'company' && isLoginMode) ? 'block' : 'none';
    document.getElementById('company-register-fields').style.display =
        (selectedRole === 'company' && !isLoginMode) ? 'block' : 'none';
}

// Toggle between login and register mode
function updateFormMode() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (isLoginMode) {
        loginBtn.textContent = 'Login';
        registerBtn.textContent = 'Create Account';
    } else {
        loginBtn.textContent = 'Create Account';
        registerBtn.textContent = 'Back to Login';
    }
    updateLoginPage();
}

// Form validation
function validateForm(email, password) {
    let isValid = true;

    if (selectedRole === 'student') {
        // Email validation
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Password validation
        const passwordError = document.getElementById('password-error');

        if (!password || password.length < 6) {
            passwordError.style.display = 'block';
            isValid = false;
        } else {
            passwordError.style.display = 'none';
        }
    } else if (selectedRole === 'company') {
        if (isLoginMode) {
            // Company login validation
            const companyName = document.getElementById('companyName').value;
            const passwordCompany = document.getElementById('password-company').value;
            const companyNameError = document.getElementById('companyName-error');
            const passwordCompanyError = document.getElementById('password-company-error');

            if (!companyName) {
                companyNameError.style.display = 'block';
                isValid = false;
            } else {
                companyNameError.style.display = 'none';
            }
            if (!passwordCompany || passwordCompany.length < 6) {
                passwordCompanyError.style.display = 'block';
                isValid = false;
            } else {
                passwordCompanyError.style.display = 'none';
            }
        } else {
            // Company registration validation
            const companyNameReg = document.getElementById('companyNameReg').value;
            const passwordReg = document.getElementById('passwordReg').value;
            const companyNameRegError = document.getElementById('companyNameReg-error');
            const passwordRegError = document.getElementById('passwordReg-error');

            if (!companyNameReg) {
                companyNameRegError.style.display = 'block';
                isValid = false;
            } else {
                companyNameRegError.style.display = 'none';
            }
            if (!passwordReg || passwordReg.length < 6) {
                passwordRegError.style.display = 'block';
                isValid = false;
            } else {
                passwordRegError.style.display = 'none';
            }
        }
    }
    return isValid;
}

// Login form initialization
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    registerBtn.addEventListener('click', function() {
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (selectedRole === 'student') {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (validateForm(email, password)) {
                if (isLoginMode) {
                    handleLogin(email, password);
                } else {
                    handleRegister(email, password);
                }
            }
        } else if (selectedRole === 'company') {
            if (isLoginMode) {
                const companyName = document.getElementById('companyName').value;
                const passwordCompany = document.getElementById('password-company').value;
                if (validateForm()) {
                    handleCompanyLogin(companyName, passwordCompany);
                }
            } else {
                const companyNameReg = document.getElementById('companyNameReg').value;
                const passwordReg = document.getElementById('passwordReg').value;
                const companyDesc = document.getElementById('companyDesc').value;
                const companyWebsite = document.getElementById('companyWebsite').value;
                if (validateForm()) {
                    handleCompanyRegister(companyNameReg, passwordReg, companyDesc, companyWebsite);
                }
            }
        }
    });
}

// Update login page based on selected role
function updateLoginPage() {
    const loginTitle = document.getElementById('login-title');
    const roleText = selectedRole === 'student' ? 'Student' : 'Company';
    loginTitle.textContent = roleText + (isLoginMode ? ' Login' : ' Registration');

    // Show/hide fields based on role and mode
    document.getElementById('student-login-fields').style.display =
        (selectedRole === 'student' && isLoginMode) ? 'block' : 'none';
    document.getElementById('company-login-fields').style.display =
        (selectedRole === 'company' && isLoginMode) ? 'block' : 'none';
    document.getElementById('company-register-fields').style.display =
        (selectedRole === 'company' && !isLoginMode) ? 'block' : 'none';
}

// Toggle between login and register mode
function updateFormMode() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (isLoginMode) {
        loginBtn.textContent = 'Login';
        registerBtn.textContent = 'Create Account';
    } else {
        loginBtn.textContent = 'Create Account';
        registerBtn.textContent = 'Back to Login';
    }
    updateLoginPage();
}

// Handle login process
function handleLogin(email, password) {
    console.log('Login attempt:', {
        university: selectedUniversity,
        role: selectedRole,
        email: email
    });

    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;

    // Show loading state
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        // Redirect based on role
        if (selectedRole === 'student') {
            window.location.href = 'index_student.html';
        } else if (selectedRole === 'company') {
            window.location.href = 'index_startup.html';
        }
    }, 1500);
}

// Handle registration process
function handleRegister(email, password) {
    console.log('Registration attempt:', {
        university: selectedUniversity,
        role: selectedRole,
        email: email
    });

    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;

    // Show loading state
    loginBtn.textContent = 'Creating Account...';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        alert('Account created successfully! (This is a demo)');

        // Switch back to login mode
        isLoginMode = true;
        updateFormMode();

        // Clear form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }, 1500);
}

// Handle company login process
function handleCompanyLogin(companyName, password) {
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        window.location.href = 'index_startup.html';
    }, 1500);
}

// Handle company registration process
function handleCompanyRegister(companyName, password, desc, website) {
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Creating Account...';
    loginBtn.disabled = true;

    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        alert('Company account created successfully!\n\n' +
            'Company Name: ' + companyName +
            '\nDescription: ' + desc +
            '\nWebsite: ' + website);
        isLoginMode = true;
        updateFormMode();
        document.getElementById('companyNameReg').value = '';
        document.getElementById('passwordReg').value = '';
        document.getElementById('companyDesc').value = '';
        document.getElementById('companyWebsite').value = '';
    }, 1500);
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
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
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

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
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