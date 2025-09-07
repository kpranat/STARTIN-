// Company page JS
document.addEventListener('DOMContentLoaded', function() {
    initializeCompanyForm();
    addVisualEffects();
});

let isLoginMode = true;

function initializeCompanyForm() {
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.querySelector('.btn-primary');
    const companyRegisterFields = document.querySelector('.company-register-fields');
    if (!registerBtn || !loginBtn) return;

    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    function updateFormMode() {
        if (isLoginMode) {
            // Login Mode
            loginBtn.textContent = 'Login';
            loginBtn.name = 'login-btn';
            registerBtn.textContent = 'Create Account';
            if (companyRegisterFields) companyRegisterFields.style.display = 'none';
        } else {
            // Register Mode
            loginBtn.textContent = 'Create Account';
            loginBtn.name = 'register-btn';
            registerBtn.textContent = 'Back to Login';
            if (companyRegisterFields) companyRegisterFields.style.display = 'block';
        }
    }
}

// Visual feedback effects (ripple)
function addVisualEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type !== 'submit') createRipple(e, this);
        });
    });
}

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

    setTimeout(() => ripple.remove(), 600);
}

// Inject ripple CSS
const rippleCSS = `@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}`;
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
