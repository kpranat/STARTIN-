// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const modal = document.getElementById('applicant-modal');
const closeModal = document.querySelector('.close');

// ======================
// Navigation
// ======================
function showPage(pageId) {
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId + '-page').style.display = 'block';

    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
            if (link.classList.contains('logout')){
                return;
            }
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
    });
});

// ======================
// Applicant Modal
// ======================
function showApplicantDetails(studentId) {
    document.querySelectorAll('.student-detail').forEach(el => el.style.display = 'none');
    const studentDetail = document.getElementById(`student-${studentId}`);
    if (studentDetail) studentDetail.style.display = 'block';
    modal.style.display = 'block';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// ======================
// Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
    showPage('profile'); // default page
});
