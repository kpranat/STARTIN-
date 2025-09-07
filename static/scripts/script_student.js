let sampleProjects = [];
let sampleInternships = [];
let applicationsCount = 0;

// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const projectsGrid = document.getElementById('projects-grid');
const internshipsGrid = document.getElementById('internships-grid');
const searchBars = document.querySelectorAll('.search-bar');
const activeProjectsCount = document.getElementById('active-projects-count');
const openInternshipsCount = document.getElementById('open-internships-count');
const applicationsCounter = document.getElementById('applications-count');

// Fetch jobs from Flask API
async function fetchJobs() {
    try {
        const response = await fetch('/api/jobs');
        const jobs = await response.json();

        // Normalize job_type for consistent filtering
        sampleProjects = jobs.filter(job => job.job_type.toLowerCase() === "project");
        sampleInternships = jobs.filter(job => job.job_type.toLowerCase() === "internship");

        populateProjects();
        populateInternships();

        // Update dashboard counters
        if (activeProjectsCount) activeProjectsCount.textContent = sampleProjects.length;
        if (openInternshipsCount) openInternshipsCount.textContent = sampleInternships.length;

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

// Populate Project Cards
function populateProjects() {
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        sampleProjects.forEach(project => {
            projectsGrid.appendChild(createProjectCard(project));
        });
    }
}

// Populate Internship Cards
function populateInternships() {
    if (internshipsGrid) {
        internshipsGrid.innerHTML = '';
        sampleInternships.forEach(internship => {
            internshipsGrid.appendChild(createInternshipCard(internship));
        });
    }
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1) || 'dashboard';
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${project.company_name || 'Unknown Company'}</h3>
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <button id="apply-btn-${project.id}" class="btn-primary" onclick="handleApply(${project.id})">Apply Now</button>
    `;
    return card;
}

// Create Internship Card
function createInternshipCard(internship) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${internship.company_name || 'Unknown Company'}</h3>
        <h4>${internship.title}</h4>
        <p><strong>Stipend:</strong> ${internship.stipend || 'N/A'}</p>
        <p>${internship.description}</p>
        <button id="apply-btn-${internship.id}" class="btn-primary" onclick="handleApply(${internship.id})">Apply Now</button>
    `;
    return card;
}

// Handle Apply Button Click
async function handleApply(jobId) {
    try {
        const response = await fetch('/api/apply', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_id: jobId })
        });

        const result = await response.json();

        if (result.success) {
            applicationsCount++;
            if (applicationsCounter) applicationsCounter.textContent = applicationsCount;

            const button = document.getElementById(`apply-btn-${jobId}`);
            if (button) {
                button.textContent = "Applied";
                button.disabled = true;
                button.classList.add("disabled-btn");
            }

            alert(result.message);
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error applying:", error);
        alert("Something went wrong while applying.");
    }
}

// Search Functionality
function setupSearch(searchBar, items, createCard, gridElement) {
    if (searchBar && gridElement) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = items.filter(item =>
                Object.values(item).some(val =>
                    typeof val === 'string' && val.toLowerCase().includes(term)
                )
            );
            gridElement.innerHTML = '';
            filtered.forEach(item => gridElement.appendChild(createCard(item)));
        });
    }
}

// Initialize
function init() {
    // Set initial active section
    const hash = window.location.hash.substring(1) || 'dashboard';
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(hash).classList.add('active');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + hash || (hash === 'dashboard' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
        }
    });

    // Setup search bars
    if (searchBars.length >= 2 && projectsGrid && internshipsGrid) {
        setupSearch(searchBars[0], sampleProjects, createProjectCard, projectsGrid);
        setupSearch(searchBars[1], sampleInternships, createInternshipCard, internshipsGrid);
    }

    // Fetch jobs from backend API
    fetchJobs();
}

document.addEventListener('DOMContentLoaded', init);
