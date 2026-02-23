/**
 * ===== ROMEO RESTAURANT - JAVASCRIPT INTERACTIONS =====
 * This file handles all JavaScript interactions for the restaurant website
 * including smooth scrolling, form validation, button interactions, and animations
 */

// ===== GLOBAL STATE =====
let currentUser = null;
let users = []; // Database of users (in localStorage)
let cart = [];
let userAddresses = [];
let userOrders = [];
let favoriteOrders = [];

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateActiveNavLink();
});

/**
 * Initialize all event listeners for the website
 */
function initializeEventListeners() {
    // Order Now buttons
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(btn => {
        btn.addEventListener('click', handleOrderClick);
    });

    // Main Order Now button in hero section
    const mainOrderBtn = document.getElementById('orderBtn');
    if (mainOrderBtn) {
        mainOrderBtn.addEventListener('click', handleOrderClick);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Navigation links for smooth scroll
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu when a link is clicked
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const toggleBtn = document.querySelector('.navbar-toggler');
                toggleBtn.click();
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Handle order button clicks
 * Shows an alert confirming the order action
 */
function handleOrderClick(e) {
    e.preventDefault();
    
    // Get the dish name from the button's data attribute
    const dishName = this.getAttribute('data-dish') || 'Your Order';
    
    // Show confirmation alert
    showNotification(`${dishName} has been added to your cart! 🍝`, 'success');
    
    // Optional: Log the action
    console.log(`Order placed for: ${dishName}`);
}

/**
 * Handle contact form submission
 * Validates form data and shows confirmation message
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!validateForm(name, email, message)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show success message
    showNotification(
        `Thank you, ${name}! We've received your message and will contact you soon. 📧`,
        'success'
    );
    
    // Log form data (in a real application, this would be sent to a server)
    console.log({
        name: name,
        email: email,
        phone: phone,
        date: date,
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // Reset form
    this.reset();
    
    // Optional: Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Validate contact form data
 * @param {string} name - Customer name
 * @param {string} email - Customer email
 * @param {string} message - Customer message
 * @returns {boolean} - True if form is valid
 */
function validateForm(name, email, message) {
    // Check if required fields are filled
    if (!name || !email || !message) {
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Check minimum message length
    if (message.length < 10) {
        return false;
    }
    
    return true;
}

/**
 * Show notification message to user
 * Creates a temporary alert that displays at the top of the page
 * @param {string} message - The message to display
 * @param {string} type - Type of notification: 'success', 'error', 'info'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.setAttribute('role', 'alert');
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';
    notification.style.animation = 'slideInRight 0.3s ease';
    
    // Set notification content
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Update active navigation link based on scroll position
 * Highlights the current section in the navigation menu
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Add smooth scroll behavior for anchor links
 * This is handled by CSS scroll-behavior: smooth, but this provides fallback
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just '#'
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Add hover effects to menu cards
 * Enhances visual feedback on interaction
 */
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * Add animation to elements when they come into view
 * Provides scroll animation effects
 */
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize element observations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

/**
 * Add keyboard navigation support
 * Allow users to navigate using keyboard
 */
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const toggleBtn = document.querySelector('.navbar-toggler');
            toggleBtn.click();
        }
    }
});

/**
 * Enhance accessibility
 * Add ARIA labels and roles where needed
 */
function enhanceAccessibility() {
    // Add role to main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (!section.getAttribute('role')) {
            section.setAttribute('role', 'region');
        }
    });
    
    // Add aria-labels to buttons without text
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });
}

// Initialize accessibility features
enhanceAccessibility();

/**
 * Log page analytics (optional)
 * Track user interactions for analytics
 */
function trackEvent(eventName, eventData = {}) {
    console.log(`Event: ${eventName}`, eventData);
    
    // In a real application, this would send data to an analytics service
    // Example: Google Analytics, Mixpanel, etc.
}

// Track page load
trackEvent('page_load', {
    timestamp: new Date().toISOString(),
    url: window.location.href
});

// Track section views
document.querySelectorAll('section[id]').forEach(section => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', {
                    section: entry.target.id,
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
    
    observer.observe(section);
});

/**
 * Add loading animation for images
 * Shows a loading state while images are being loaded
 */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.style.opacity = '0.7';
    img.style.transition = 'opacity 0.3s ease';
});

/**
 * Responsive menu toggle
 * Ensure mobile menu works properly
 */
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
}

/**
 * Add form input validation feedback
 * Provide real-time validation feedback
 */
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateInput(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateInput(this);
        }
    });
});

/**
 * Validate individual form input
 * @param {HTMLElement} input - The input element to validate
 */
function validateInput(input) {
    let isValid = true;
    
    if (input.id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value);
    } else if (input.id === 'name' || input.id === 'message') {
        isValid = input.value.trim().length > 0;
    } else if (input.id === 'phone') {
        // Phone is optional, but if filled, should be valid
        isValid = input.value === '' || /^[\d\s\-\+\(\)]+$/.test(input.value);
    }
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

// Log script initialization
console.log('ROMEO Restaurant website initialized successfully! 🍽️');
