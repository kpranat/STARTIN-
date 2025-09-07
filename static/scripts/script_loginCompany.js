document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const loginBtn = document.getElementById('submitBtn');      
    const registerBtn = document.getElementById('register-btn'); 
    const companyRegisterFields = document.querySelector('.company-register-fields');
    const registerInput = document.getElementById('registerInput');

    let isLoginMode = true;

    // Update form mode (login/register)
    function updateFormMode() {
        if (isLoginMode) {
            loginBtn.textContent = 'Login';
            registerBtn.textContent = 'Create Account';
            if (companyRegisterFields) companyRegisterFields.style.display = 'none';
            registerInput.value = "0";  // login mode
        } else {
            loginBtn.textContent = 'Create Account';
            registerBtn.textContent = 'Back to Login';
            if (companyRegisterFields) companyRegisterFields.style.display = 'block';
            registerInput.value = "1";  // register mode
        }
    }

    // Toggle form mode when user clicks "Create Account" / "Back to Login"
    registerBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    // Initialize the form mode
    updateFormMode();

    // ================================
    // Ripple effect for buttons
    // ================================
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

    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type !== 'submit') createRipple(e, this);
        });
    });

    // Inject ripple CSS
    const rippleCSS = `
        @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
        }`;
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);
});
