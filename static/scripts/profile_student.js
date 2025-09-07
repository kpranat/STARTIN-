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

        // Update hidden input with current tags
        updateSkillsetValue();
    }

    function updateSkillsetValue() {
        // Update the skillset input with comma-separated tags
        skillsetInput.value = Array.from(tags).join(',');
    }

    // Real-time validation
    const requiredFields = ['studentName', 'rollNumber'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                validateField(field);
            });
        }
    });

    // URL validation
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

    // Form Submission
    form.addEventListener('submit', (e) => {
        let isValid = validateForm();
        if (!isValid) {
            e.preventDefault();
        }
        else{
            alert("uploaded");
        }
    });

    // Form Validation
    function validateForm() {
        let isValid = true;

        // Validate required fields
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (input && !validateField(input)) {
                isValid = false;
            }
        });

        // Validate URLs
        urlFields.forEach(field => {
            const input = document.getElementById(field);
            if (input && input.value && !isValidURL(input.value)) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            }
        });

        return isValid;
    }

    function validateField(field) {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            return false;
        }
        field.style.borderColor = '';
        return true;
    }

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
        skillsetInput.value = '';

        // Clear any validation styling
        form.querySelectorAll('input, textarea').forEach(input => {
            input.style.borderColor = '';
        });
    });
});
