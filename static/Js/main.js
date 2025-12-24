/**
 * =============================================
 * MAIN NAVIGATION & SCROLL FUNCTIONALITY
 * =============================================
 */

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navMenu.contains(event.target) || mobileToggle.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const mobileToggle = document.getElementById('mobileToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 300);
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}



// Add this to your existing JavaScript file
function initNavigationActiveState() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href && href !== '#') {
            // Remove .html extension if present for comparison
            const linkPage = href.replace('.html', '');
            const currentPage = currentPath.replace('.html', '');
            
            if (currentPath.includes(linkPage) || 
                (currentPath === '/' && (href === 'index.html' || href === '/'))) {
                link.classList.add('active');
            }
        }
    });
}

// Update your initialization
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    setCurrentYear();
    initProjectCatalyst();
    initContactForm();
    initNavigationActiveState(); // Add this line
    
    console.log('JavaScript initialized successfully.');
});



/**
 * =============================================
 * TYPING ANIMATION FOR HERO SECTION
 * =============================================
 */

function initTypingAnimation() {
    const typedText = document.getElementById('typed-text');
    const typedCursor = document.querySelector('.typed-cursor');
    
    if (!typedText || !typedCursor) return;
    
    const professions = [
        "UI/UX Designer",
        "Web Developer", 
        "Brand Strategist",
        "Graphic Designer",
        "Digital Creator"
    ];
    
    let currentProfession = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let cursorVisible = true;
    
    // Cursor blink effect
    function blinkCursor() {
        cursorVisible = !cursorVisible;
        typedCursor.style.opacity = cursorVisible ? '1' : '0';
    }
    
    // Start cursor blinking
    setInterval(blinkCursor, 500);
    
    function typeEffect() {
        const currentText = professions[currentProfession];
        
        if (isDeleting) {
            // Delete character
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
            
            // When deletion is complete
            if (charIndex === 0) {
                isDeleting = false;
                currentProfession = (currentProfession + 1) % professions.length;
                typingSpeed = 500; // Pause before typing next
            }
        } else {
            // Type character
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
            
            // When typing is complete
            if (charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause before deleting
            }
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeEffect, 1000);
}

/**
 * Alternative: Simple rotating text without typing effect
 */
function initSimpleTextRotation() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;
    
    const professions = [
        "UI/UX Designer",
        "Web Developer", 
        "Brand Strategist",
        "Graphic Designer",
        "Digital Creator"
    ];
    
    let currentIndex = 0;
    
    function rotateText() {
        typedText.textContent = professions[currentIndex];
        currentIndex = (currentIndex + 1) % professions.length;
    }
    
    // Initial text
    typedText.textContent = professions[0];
    
    // Rotate every 3 seconds
    setInterval(rotateText, 3000);
}

/**
 * Enhanced typing animation with colors
 */
function initEnhancedTypingAnimation() {
    const typedText = document.getElementById('typed-text');
    const typedCursor = document.querySelector('.typed-cursor');
    
    if (!typedText || !typedCursor) return;
    
    const professions = [
        {text: "UI/UX Designer", color: "#667eea"},
        {text: "Web Developer", color: "#f59e0b"},
        {text: "Brand Strategist", color: "#10b981"},
        {text: "Graphic Designer", color: "#ef4444"},
        {text: "Digital Creator", color: "#8b5cf6"}
    ];
    
    let currentProfession = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const current = professions[currentProfession];
        const currentText = current.text;
        
        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
            
            if (charIndex === 0) {
                isDeleting = false;
                currentProfession = (currentProfession + 1) % professions.length;
                typingSpeed = 500;
            }
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            typedText.style.color = current.color; // Change color for each profession
            charIndex++;
            typingSpeed = 100;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500;
            }
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start animation
    setTimeout(typeEffect, 1000);
}

/**
 * Initialize based on preference
 * Call ONE of these functions in your main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Choose ONE of these:
    initTypingAnimation(); // Standard typing animation
    // initSimpleTextRotation(); // Simple text rotation
    // initEnhancedTypingAnimation(); // Enhanced with colors
});




/**
 * =============================================
 * PROJECT CATALYST FORM
 * =============================================
 */

function initProjectCatalyst() {
    const projectForm = document.querySelector('.creative-wrapper');
    if (!projectForm) return;
    
    let currentStep = 1;
    const totalSteps = 4;
    
    // Initialize progress bar
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.progress-step');
    
    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressFill) progressFill.style.width = progress + '%';
        
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    // Project type selection
    const projectCards = document.querySelectorAll('.inspiration-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            projectCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Enable next button
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.disabled = false;
        });
    });
    
    // Budget slider
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            const value = parseInt(this.value).toLocaleString();
            budgetValue.textContent = `$${value}`;
        });
    }
    
    // Navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sections = document.querySelectorAll('.vision-section');
    
    function showStep(step) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) stepElement.classList.add('active');
        
        // Update navigation buttons
        if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'flex';
        
        if (step === totalSteps) {
            if (nextBtn) {
                nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Project';
                nextBtn.classList.add('btn-submit');
                nextBtn.classList.remove('btn-next');
            }
        } else {
            if (nextBtn) {
                nextBtn.innerHTML = `Next Step <i class="fas fa-arrow-right"></i>`;
                nextBtn.classList.remove('btn-submit');
                nextBtn.classList.add('btn-next');
            }
        }
        
        currentStep = step;
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) showStep(currentStep - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            } else {
                submitProject();
            }
        });
    }
    
    function validateStep(step) {
        const stepElement = document.getElementById(`step${step}`);
        if (!stepElement) return true;
        
        if (step === 1) {
            const selected = document.querySelector('.inspiration-card.selected');
            if (!selected) {
                showMessage('Please select a project type to continue.', 'error');
                return false;
            }
        } else if (step === 2) {
            const requiredInputs = stepElement.querySelectorAll('[required]');
            for (let input of requiredInputs) {
                if (!input.value.trim()) {
                    showMessage('Please fill in all required fields.', 'error');
                    input.focus();
                    return false;
                }
            }
        }
        return true;
    }
    
    async function submitProject() {
        if (!validateStep(currentStep)) return;
        
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn) return;
        
        // Show loading
        const originalText = nextBtn.innerHTML;
        nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        nextBtn.disabled = true;
        
        try {
            const projectData = collectProjectData();
            
            // Send to server
            const response = await fetch('/submit-project/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(projectData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success screen
                document.querySelector('.creative-navigation').style.display = 'none';
                document.getElementById(`step${currentStep}`).classList.remove('active');
                document.getElementById('successScreen').classList.add('active');
            } else {
                showMessage(result.error || 'Submission failed. Please try again.', 'error');
                nextBtn.innerHTML = originalText;
                nextBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            showMessage('Failed to submit project. Please try again.', 'error');
            nextBtn.innerHTML = originalText;
            nextBtn.disabled = false;
        }
    }
    
    function collectProjectData() {
        // Get project type
        const selectedCard = document.querySelector('.inspiration-card.selected');
        
        return {
            project_type: selectedCard ? selectedCard.dataset.type : '',
            client_name: document.querySelector('#step2 input[placeholder*="name"]')?.value || '',
            email: document.querySelector('#step2 input[type="email"]')?.value || '',
            company: document.querySelector('#step2 input[placeholder*="business name"]')?.value || '',
            phone: document.querySelector('#step2 input[type="tel"]')?.value || '',
            project_title: document.querySelector('#step2 input[placeholder*="project a name"]')?.value || '',
            project_description: document.querySelector('#step2 textarea')?.value || '',
            budget: budgetValue?.textContent || '$0',
            timeline: document.querySelector('input[name="timeline"]:checked')?.value || 'standard',
            reference_links: document.querySelector('#step3 textarea')?.value || '',
            heard_from: document.querySelector('.idea-select')?.value || '',
            additional_notes: document.querySelector('#step4 textarea')?.value || ''
        };
    }
    
    // Initialize first step
    updateProgress();
    if (prevBtn) prevBtn.style.display = 'none';
    
    // Add animations to cards
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.5s ease forwards';
            card.style.opacity = '0';
        });
    }, 300);
}

/**
 * =============================================
 * CONTACT FORM - HTML MESSAGES ONLY
 * =============================================
 */

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Create message container if it doesn't exist
        let messageContainer = document.getElementById('formMessage');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'formMessage';
            messageContainer.className = 'form-message';
            contactForm.appendChild(messageContainer);
        }
        
        // Hide previous messages
        messageContainer.style.display = 'none';
        messageContainer.className = 'form-message';
        messageContainer.textContent = '';
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            
            // Send to server
            const response = await fetch('/submit-contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show HTML success message
                showMessage('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Clear form
                this.reset();
            } else {
                // Show HTML error message
                showMessage(`❌ ${result.error || 'Failed to send message. Please try again.'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('❌ An error occurred. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Function to show messages
    function showMessage(text, type) {
        const messageContainer = document.getElementById('formMessage');
        if (!messageContainer) return;
        
        messageContainer.textContent = text;
        messageContainer.className = `form-message form-message-${type}`;
        messageContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds (optional)
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            setTimeout(() => {
                messageContainer.style.display = 'none';
                messageContainer.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

/**
 * =============================================
 * UTILITY FUNCTIONS
 * =============================================
 */

// Get CSRF Token
function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === ('csrftoken=')) {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
}

// Show message (used by both forms)
function showMessage(text, type) {
    // Create message container if it doesn't exist
    let messageContainer = document.getElementById('globalMessage');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'globalMessage';
        messageContainer.className = 'global-message';
        document.body.appendChild(messageContainer);
    }
    
    messageContainer.textContent = text;
    messageContainer.className = `global-message global-message-${type}`;
    messageContainer.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageContainer.style.opacity = '0';
        setTimeout(() => {
            messageContainer.style.display = 'none';
            messageContainer.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * =============================================
 * INITIALIZATION
 * =============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    setCurrentYear();
    
    // Initialize forms
    initProjectCatalyst();
    initContactForm();
    
    console.log('JavaScript initialized successfully.');
});