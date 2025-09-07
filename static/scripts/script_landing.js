// =============================
// Landing Page Navigation Script
// =============================

let currentPage = 'university';

// Show page function
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.add('active');
    currentPage = pageId;
}

// Back button function
function goBack() {
    if (currentPage === 'role') showPage('university');
}

// Initialize DOM elements and event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeUniversitySelection();
    initializeRoleSelection();
    addVisualEffects();
});

// =============================
// University Selection Handler
// =============================
function initializeUniversitySelection() {
    const universityCards = document.querySelectorAll('.university-card');
    universityCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('coming-soon')) return; // Ignore coming soon
            showPage('role');
        });
    });
}

// =============================
// Role Selection Handler
// =============================
function initializeRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.dataset.role;
            if (role === 'student') {
                window.location.href = "/login/student";
            } else if (role === 'company') {
                window.location.href = "/login/company";
            }
        });
    });
}

// =============================
// Visual Feedback (Hover Effects)
// =============================
function addVisualEffects() {
    const clickableElements = document.querySelectorAll('.university-card:not(.coming-soon), .role-card');
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => element.style.transform = 'scale(1.02)');
        element.addEventListener('mouseleave', () => element.style.transform = 'scale(1)');
    });
}

// =============================
// Ripple Effect for Buttons
// =============================
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
const rippleCSS = `
@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}`;
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Add ripple effect to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type !== 'submit') createRipple(e, this);
        });
    });
});
