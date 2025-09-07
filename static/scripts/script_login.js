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
    if (currentPage === 'role') showPage('university');
    else if (currentPage === 'login') showPage('role');
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
            if (this.classList.contains('coming-soon')) return;
            selectedUniversity = this.dataset.university;
            if (selectedUniversity === 'srm') showPage('role');
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
    const registerBtn = document.getElementById('register-btn');
    if (!registerBtn) return;

    // Toggle login/register mode UI
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    // NO validation blocking for company — Flask handles it
}

// Update login page based on selected role
function updateLoginPage() {
    const loginTitle = document.getElementById('login-title');
    const studentFields = document.querySelector('.student-fields');
    const companyFields = document.querySelector('.company-fields');

    if (!loginTitle || !studentFields || !companyFields) return;

    if (selectedRole === 'student') {
        loginTitle.textContent = 'Student Portal';
        studentFields.style.display = 'block';
        companyFields.style.display = 'none';
    } else if (selectedRole === 'company') {
        loginTitle.textContent = 'Company Portal';
        studentFields.style.display = 'none';
        companyFields.style.display = 'block';
    }

    isLoginMode = true;
    updateFormMode();
}

// Toggle between login and register mode (UI only)
function updateFormMode() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const companyRegisterFields = document.querySelector('.company-register-fields');
    if (!loginBtn || !registerBtn) return;

    if (isLoginMode) {
        loginBtn.textContent = 'Login';
        loginBtn.name = 'login-btn';
        registerBtn.textContent = 'Create Account';
        if (companyRegisterFields) companyRegisterFields.style.display = 'none';
    } else {
        loginBtn.textContent = 'Create Account';
        loginBtn.name = 'register-btn';
        registerBtn.textContent = 'Back to Login';
        if (selectedRole === 'company' && companyRegisterFields) {
            companyRegisterFields.style.display = 'block';
        }
    }
}

// Add visual feedback effects
function addVisualEffects() {
    const clickableElements = document.querySelectorAll('.university-card:not(.coming-soon), .role-card');
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => element.style.transform = 'scale(1.02)');
        element.addEventListener('mouseleave', () => element.style.transform = 'scale(1)');
    });

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type !== 'submit') createRipple(e, this);
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

    setTimeout(() => { ripple.remove(); }, 600);
}

// Inject ripple CSS
const rippleCSS = `
@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}`;
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
