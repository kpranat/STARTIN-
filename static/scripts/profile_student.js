document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentProfileForm');
    const skillsetInput = document.getElementById('skillset');
    const tagsContainer = document.getElementById('tagsContainer');
    let tags = new Set();

    // Tags Input Functionality
    skillsetInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = skillsetInput.value.trim();
            if (tag && !tags.has(tag)) {
                addTag(tag);
                skillsetInput.value = '';
            }
        }
    });

    function addTag(tag) {
        tags.add(tag);
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" data-tag="${tag}">&times;</span>
        `;
        tagsContainer.appendChild(tagElement);

        // Add remove functionality
        tagElement.querySelector('.tag-remove').addEventListener('click', () => {
            tags.delete(tag);
            tagElement.remove();
        });
    }

    // Real-time validation
    const requiredFields = ['studentName', 'rollNumber', 'stuId'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.style.borderColor = '';
                }
            });
        }
    });

    // Real-time validation for skillset
    skillsetInput.addEventListener('input', () => {
        if (skillsetInput.value.trim() || tags.size > 0) {
            skillsetInput.style.borderColor = '';
        }
    });

    // Real-time URL validation
    const urlFields = ['github', 'linkedin', 'portfolio'];
    urlFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                if (!field.value || isValidURL(field.value)) {
                    field.style.borderColor = '';
                } else {
                    field.style.borderColor = '#ff6b6b';
                }
            });
        }
    });

    // Form Validation and Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const requiredFields = ['studentName', 'rollNumber', 'stuId', 'resume'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            } else {
                input.style.borderColor = '';
            }
        });

        // Validate skills (at least one skill required)
        if (tags.size === 0) {
            isValid = false;
            skillsetInput.style.borderColor = '#ff6b6b';
        } else {
            skillsetInput.style.borderColor = '';
        }

        // URL validation
        const urlFields = ['github', 'linkedin', 'portfolio'];
        urlFields.forEach(field => {
            const input = document.getElementById(field);
            if (input.value && !isValidURL(input.value)) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            } else {
                input.style.borderColor = '';
            }
        });

        if (isValid) {
            // In a real application, you would send this data to a server
            const formData = new FormData(form);
            formData.append('skills', Array.from(tags).join(','));

            // Show success message
            alert('Profile saved successfully!');

            // Log form data for debugging
            console.log('Profile data saved:', {
                studentName: formData.get('studentName'),
                rollNumber: formData.get('rollNumber'),
                stuId: formData.get('stuId'),
                aboutMe: formData.get('aboutMe'),
                skills: Array.from(tags),
                github: formData.get('github'),
                linkedin: formData.get('linkedin'),
                portfolio: formData.get('portfolio'),
                resume: formData.get('resume')?.name || 'No file selected'
            });

            // Optional: Reset form
            // form.reset();
            // tags.clear();
            // tagsContainer.innerHTML = '';
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });

    // URL validation helper
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Reset form handler
    form.addEventListener('reset', () => {
        tags.clear();
        tagsContainer.innerHTML = '';

        // Clear any validation styling
        form.querySelectorAll('input, textarea').forEach(input => {
            input.style.borderColor = '';
        });
    });
});