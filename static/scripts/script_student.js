let sampleProjects = [];
let sampleInternships = [];

// Fetch jobs from Flask API
async function fetchJobs() {
    try {
        const response = await fetch('/api/jobs');
        const jobs = await response.json();

        sampleProjects = jobs.filter(job => job.job_type === "Project");
        sampleInternships = jobs.filter(job => job.job_type === "Internship");

        populateProjects();
        populateInternships();
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

// Populate project cards
function populateProjects() {
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        sampleProjects.forEach(project => {
            projectsGrid.appendChild(createProjectCard(project));
        });
    }
}

// Populate internship cards
function populateInternships() {
    if (internshipsGrid) {
        internshipsGrid.innerHTML = '';
        sampleInternships.forEach(internship => {
            internshipsGrid.appendChild(createInternshipCard(internship));
        });
    }
}

// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const projectsGrid = document.getElementById('projects-grid');
const internshipsGrid = document.getElementById('internships-grid');
const projectDetail = document.getElementById('project-detail');
const internshipDetail = document.getElementById('internship-detail');
const searchBars = document.querySelectorAll('.search-bar');

// Navigation - Handle internal section navigation only
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only handle internal section links (starting with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);

            // Handle special case for home link
            const actualTargetId = targetId === '' ? 'dashboard' : targetId;

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === actualTargetId) {
                    section.classList.add('active');
                }
            });
        }
        // For external links (like profile_student.html), let the browser handle normally
    });
});

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${project.company}</h3>
        <h4>${project.title}</h4>
    `;
    card.addEventListener('click', () => showProjectDetail(project));
    return card;
}

// Create Internship Card
function createInternshipCard(internship) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${internship.company}</h3>
        <h4>${internship.title}</h4>
        <p>${internship.stipend}</p>
    `;
    card.addEventListener('click', () => showInternshipDetail(internship));
    return card;
}

// Show Project Detail
function showProjectDetail(project) {
    projectDetail.innerHTML = `
        <h2>${project.title}</h2>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Requirements:</strong> ${project.requirements || "Not specified"}</p>
        <button class="btn-primary" onclick="handleApply('project', ${project.id})">Apply Now</button>
    `;
    projectDetail.classList.add('active');
}


function showInternshipDetail(internship) {
    internshipDetail.innerHTML = `
        <h2>${internship.title || internship.role}</h2>
        <p><strong>Stipend:</strong> ${internship.stipend || "N/A"}</p>
        <p><strong>Description:</strong> ${internship.description}</p>
        <p><strong>Requirements:</strong> ${internship.requirements || "Not specified"}</p>
        <button class="btn-primary" onclick="handleApply('internship', ${internship.id})">Apply Now</button>
    `;
    internshipDetail.classList.add('active');
}


// Handle Apply Button Click
function handleApply(type, id) {
    alert(`Application submitted successfully for ${type} #${id}!`);
}

// Search Functionality
function setupSearch(searchBar, items, createCard, gridElement) {
    if (searchBar && gridElement) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = items.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                )
            );

            gridElement.innerHTML = '';
            filteredItems.forEach(item => {
                gridElement.appendChild(createCard(item));
            });
        });
    }
}

// Initialize skill progress bars with animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        // Store the original width
        const width = bar.classList.contains('skill-90') ? '90%' :
            bar.classList.contains('skill-85') ? '85%' :
                bar.classList.contains('skill-75') ? '75%' : '0%';

        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Initialize function
function init() {
    // Show initial section based on URL hash or default to dashboard
    const hash = window.location.hash;
    let initialSection = 'dashboard';

    if (hash && hash.length > 1) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            initialSection = targetId;
        }
    }

    // Set initial active states
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === initialSection) {
            section.classList.add('active');
        }
    });

    // Set initial nav active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if ((initialSection === 'dashboard' && href === '#') ||
            href === '#' + initialSection) {
            link.classList.add('active');
        }
    });

    // Initialize skill progress bars with animation
    initializeSkillBars();

    // Populate Projects
    if (projectsGrid) {
        sampleProjects.forEach(project => {
            projectsGrid.appendChild(createProjectCard(project));
        });
    }

    // Populate Internships
    if (internshipsGrid) {
        sampleInternships.forEach(internship => {
            internshipsGrid.appendChild(createInternshipCard(internship));
        });
    }

    // Setup Search
    if (searchBars.length >= 2 && projectsGrid && internshipsGrid) {
        setupSearch(searchBars[0], sampleProjects, createProjectCard, projectsGrid);
        setupSearch(searchBars[1], sampleInternships, createInternshipCard, internshipsGrid);
    }

    fetchJobs();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);