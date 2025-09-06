/* ================================
   GLOBAL VARIABLES & DATA
================================ */

// Sample data for previous jobs
const previousJobs = [
    {
        title: "Frontend Developer Intern",
        stipend: "$1800/month",
        description: "Work with our design team to build responsive web applications using modern JavaScript frameworks.",
        requirements: "JavaScript, HTML/CSS, Git experience preferred"
    },
    {
        title: "Data Science Intern",
        stipend: "$2200/month",
        description: "Analyze large datasets and build machine learning models to drive business insights.",
        requirements: "Python, SQL, statistics background, pandas/numpy experience"
    },
    {
        title: "Mobile App Developer",
        stipend: "$2000/month",
        description: "Develop cross-platform mobile applications for iOS and Android using React Native.",
        requirements: "React Native, JavaScript, mobile development experience"
    }
];

// Sample applicant data
const applicants = [
    {
        name: "Alex Chen",
        email: "alex.chen@university.edu",
        school: "Stanford University",
        major: "Computer Science",
        year: "Junior",
        gpa: "3.8",
        skills: ["JavaScript", "Python", "React", "Node.js"]
    },
    {
        name: "Sarah Johnson",
        email: "sarah.j@college.edu",
        school: "MIT",
        major: "Data Science",
        year: "Senior",
        gpa: "3.9",
        skills: ["Python", "R", "Machine Learning", "SQL"]
    },
    {
        name: "Marcus Rodriguez",
        email: "marcus.r@tech.edu",
        school: "Georgia Tech",
        major: "Software Engineering",
        year: "Sophomore",
        gpa: "3.7",
        skills: ["Java", "C++", "Algorithms", "System Design"]
    },
    {
        name: "Emily Watson",
        email: "emily.watson@uni.edu",
        school: "UC Berkeley",
        major: "Computer Science",
        year: "Junior",
        gpa: "3.85",
        skills: ["React", "Vue.js", "TypeScript", "AWS"]
    },
    {
        name: "David Kim",
        email: "david.kim@college.edu",
        school: "Carnegie Mellon",
        major: "Artificial Intelligence",
        year: "Senior",
        gpa: "3.9",
        skills: ["TensorFlow", "PyTorch", "Deep Learning", "NLP"]
    },
    {
        name: "Lisa Park",
        email: "lisa.park@university.edu",
        school: "Harvard University",
        major: "Applied Mathematics",
        year: "Junior",
        gpa: "3.8",
        skills: ["MATLAB", "Python", "Statistics", "Data Analysis"]
    }
];

/* ================================
   DOM ELEMENTS
================================ */
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const jobForm = document.getElementById('job-form');
const modal = document.getElementById('applicant-modal');
const closeModal = document.querySelector('.close');

/* ================================
   NAVIGATION FUNCTIONALITY
================================ */
function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => page.style.display = 'none');

    // Show selected page
    document.getElementById(pageId + '-page').style.display = 'block';

    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

// Add click listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
    });
});

/* ================================
   PREVIOUS JOBS DISPLAY
================================ */
function displayPreviousJobs() {
    const container = document.getElementById('previous-jobs');
    container.innerHTML = '';

    previousJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'card';
        jobCard.innerHTML = `
            <div class="card-inner">
                <h3>${job.title}</h3>
                <div class="job-meta">
                    <span class="stipend">${job.stipend}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                    ${job.description}
                </p>
                <p style="color: var(--silver-light); font-size: 0.9rem;">
                    <strong>Requirements:</strong> ${job.requirements}
                </p>
            </div>
        `;
        container.appendChild(jobCard);
    });
}

/* ================================
   FORM VALIDATION
================================ */
function validateForm() {
    let isValid = true;
    const fields = ['job-type', 'stipend', 'description', 'requirements'];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + '-error');

        if (!field.value.trim()) {
            error.style.display = 'block';
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            error.style.display = 'none';
            field.style.borderColor = 'var(--silver-dark)';
        }
    });

    return isValid;
}

// Form submission handler
jobForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Simulate form submission
        const formData = new FormData(jobForm);
        const jobData = Object.fromEntries(formData);

        // Add to previous jobs (in real app, this would be sent to backend)
        previousJobs.unshift({
            title: jobData.jobType,
            stipend: jobData.stipend,
            description: jobData.description,
            requirements: jobData.requirements
        });

        // Show success message
        alert('Job posted successfully! ðŸŽ‰');

        // Reset form
        jobForm.reset();

        // Refresh previous jobs display
        displayPreviousJobs();

        // Switch to profile page to see the new job
        showPage('profile');
    }
});

// Real-time validation
['job-type', 'stipend', 'description', 'requirements'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('input', () => {
        const error = document.getElementById(fieldId + '-error');
        if (field.value.trim()) {
            error.style.display = 'none';
            field.style.borderColor = 'var(--silver-dark)';
        }
    });
});

/* ================================
   APPLICANTS DISPLAY
================================ */
function displayApplicants() {
    const container = document.getElementById('applicants-list');
    container.innerHTML = '';

    applicants.forEach((applicant, index) => {
        const applicantCard = document.createElement('div');
        applicantCard.className = 'applicant-card';
        applicantCard.onclick = () => showApplicantProfile(index);

        applicantCard.innerHTML = `
            <div class="applicant-name">${applicant.name}</div>
            <div class="applicant-info">
                ${applicant.school}<br>
                ${applicant.major} â€¢ ${applicant.year}<br>
                GPA: ${applicant.gpa}
            </div>
        `;

        container.appendChild(applicantCard);
    });
}

/* ================================
   APPLICANT PROFILE MODAL
================================ */
function showApplicantProfile(index) {
    const applicant = applicants[index];
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>${applicant.name}</h2>
        <div style="margin: 1.5rem 0;">
            <p><strong>Email:</strong> ${applicant.email}</p>
            <p><strong>School:</strong> ${applicant.school}</p>
            <p><strong>Major:</strong> ${applicant.major}</p>
            <p><strong>Year:</strong> ${applicant.year}</p>
            <p><strong>GPA:</strong> ${applicant.gpa}</p>
            <p><strong>Skills:</strong></p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                ${applicant.skills.map(skill =>
        `<span style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a); border: 1px solid #cccccc; padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.9rem; color: var(--text-primary);">${skill}</span>`
    ).join('')}
            </div>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn" onclick="contactApplicant('${applicant.email}')">Contact</button>
            <button class="btn" onclick="scheduleInterview('${applicant.name}')">Schedule Interview</button>
        </div>
    `;

    modal.style.display = 'block';
}

function contactApplicant(email) {
    alert(`Opening email to ${email}... ðŸ"§`);
    // In real app, this would open the default email client
}

function scheduleInterview(name) {
    alert(`Interview scheduling system for ${name} would open here! ðŸ"…`);
    // In real app, this would open a calendar/scheduling interface
}

// Modal close functionality
closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

/* ================================
   INITIALIZATION
================================ */
document.addEventListener('DOMContentLoaded', () => {
    displayPreviousJobs();
    displayApplicants();
});

/* ================================
   SMOOTH ANIMATIONS & INTERACTIONS
================================ */

// Add entrance animations for cards
function addEntranceAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add subtle parallax effect to cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
        const intensity = (index % 2 === 0) ? 5 : -5;
        const xOffset = (mouseX - 0.5) * intensity;
        const yOffset = (mouseY - 0.5) * intensity;

        card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    setTimeout(addEntranceAnimations, 300);
});