/* ============================================= */
/* MAIN.JS - Website ki sari functionality */
/* ============================================= */

// ===== DOM Load hone ka wait karo =====
document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER - Page load hone tak dikhao =====
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercent = document.querySelector('.loader-percent');
    let progress = 0;

    // Progress bar animation - 0 se 100 tak
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // 500ms baad preloader hide karo
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 500);
        }

        if (loaderProgress) loaderProgress.style.width = progress + '%';
        if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';
    }, 200);


    // ===== CUSTOM CURSOR - Mouse ke saath move karo =====
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        // Mouse move event - cursor ko mouse ke saath le jao
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 6 + 'px';
            cursor.style.top = e.clientY - 6 + 'px';

            // Follower thoda delay se aayega
            setTimeout(() => {
                follower.style.left = e.clientX - 20 + 'px';
                follower.style.top = e.clientY - 20 + 'px';
            }, 100);
        });

        // Jab kisi link ya button pe hover karo to cursor bada ho
        const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .hamburger');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }


    // ===== NAVBAR SCROLL EFFECT - Scroll pe navbar ka background change =====
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ===== HAMBURGER MENU - Mobile menu open/close =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Body scroll band karo jab menu open ho
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Jab koi mobile link click ho to menu band ho
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== STATS COUNTER - Numbers animate karna =====
    const statNumbers = document.querySelectorAll('.stat-number');

    // IntersectionObserver - jab stat section screen pe aaye to count karo
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, count);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    // Counter animation function
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50; // 50 steps mein complete
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }


    // ===== SCROLL ANIMATIONS - Elements fade in on scroll =====
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .about-content, .about-visual, .section-header, .cta-content, .footer-col'
    );

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Sab elements ko initially hidden karo
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(el);
    });


    // ===== 3D TILT EFFECT - Service cards pe tilt effect =====
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt angle calculate karo
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        // Jab mouse card se hat jaye to reset karo
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // ===== PARTICLES EFFECT - Hero section mein floating particles =====
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        // 50 particles banao
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${Math.random() > 0.5 ? 'var(--gold)' : 'rgba(255,255,255,0.3)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        particlesContainer.appendChild(particle);
    }


    // ===== SMOOTH PAGE TRANSITIONS =====
    // Links pe click hone pe smooth transition
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Agar same page ka link hai to kuch mat karo
            if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
                return;
            }
        });
    });


    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    // Current page ka nav link gold karo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});