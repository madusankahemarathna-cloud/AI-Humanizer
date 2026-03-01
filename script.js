document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 11, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 11, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    /* --- Typing Effect --- */
    const typeTarget = document.querySelector('.type-effect');
    if (typeTarget) {
        const textToType = typeTarget.textContent;
        typeTarget.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < textToType.length) {
                typeTarget.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    /* --- Intersection Observer for Fade-in Animations --- */
    const fadeElements = document.querySelectorAll('.feature-card, .step, .section-title, .cta-box, .pricing-card');

    // Set initial state
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    /* --- Mobile Menu Toggle --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        // Toggle mobile menu visibility (Simple inline implementation for now)
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(10, 10, 11, 0.95)';
            navLinks.style.padding = '20px 0';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        }
    });
});
