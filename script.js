document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    hamburger.addEventListener('click', function() {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isActive);
        hamburger.setAttribute('aria-expanded', String(isActive));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        alert('Thank you for your message! We will contact you soon.');
        contactForm.reset();
    });

    const animateNumbers = () => {
        const updateNumber = (stat) => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += increment;
                if (current < target) {
                    if (target % 1 !== 0) {
                        stat.textContent = current.toFixed(1);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(tick);
                } else {
                    stat.textContent = target;
                }
            };

            tick();
        };

        if (prefersReducedMotion) {
            statNumbers.forEach(stat => {
                stat.textContent = stat.getAttribute('data-target');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    };

    animateNumbers();

    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    smoothScroll();

    const navbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }, { passive: true });
    };

    navbarScroll();

    const fadeInOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .why-item, .feature-item');

        elements.forEach(el => el.classList.add('reveal'));

        if (prefersReducedMotion) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    fadeInOnScroll();

    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href');
            const confirmMessage = 'Are you sure you want to open the email client?';
            
            if (confirm(confirmMessage)) {
                window.location.href = email;
            }
        });
    }

    const phoneLink = document.getElementById('phoneLink');
    if (phoneLink) {
        phoneLink.addEventListener('click', function(e) {
            e.preventDefault();
            const phone = this.getAttribute('href').replace('tel:', '');
            const confirmMessage = 'How would you like to contact us?\n\n1. Call directly\n2. WhatsApp';
            
            const choice = prompt(confirmMessage, '1');
            
            if (choice === '1') {
                window.location.href = this.getAttribute('href');
            } else if (choice === '2') {
                window.location.href = `https://wa.me/${phone}`;
            }
        });
    }
});
