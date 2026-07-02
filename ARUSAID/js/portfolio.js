/* ============================================= */
/* PORTFOLIO.JS - Portfolio page ke functions */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PROJECTS DATA - Har project ki detail yahan hai =====
    // YAHAN APNE PROJECTS KI DETAILS UPDATE KARO
    const projectsData = [
        {
            title: "Restaurant Menu System 1",
            category: "Digital Menu",
            desc: "A complete QR-based digital menu system for a restaurant. Features include category browsing, food images, prices, and responsive design. Customers scan QR code and see beautiful menu on phone.",
            client: "Restaurant Client 1", // YAHAN CLIENT KA NAAM
            duration: "5 Days",
            year: "2024",
            tech: ["HTML5", "CSS3", "JavaScript", "QR Code"],
            image: "assets/images/project1.jpg",
            liveLink: "#", // YAHAN LIVE LINK PASTE KARO
            githubLink: "#" // YAHAN GITHUB LINK PASTE KARO
        },
        {
            title: "Restaurant Menu System 2",
            category: "Digital Menu",
            desc: "Interactive digital menu with advanced category filtering, search functionality, and stunning food photography. Optimized for fast loading on mobile networks.",
            client: "Restaurant Client 2",
            duration: "4 Days",
            year: "2024",
            tech: ["HTML5", "CSS3", "JavaScript", "QR System"],
            image: "assets/images/project2.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Premium Restaurant Site",
            category: "Restaurant",
            desc: "Full restaurant website with hero section, about page, menu section, gallery, contact form, and Google Maps integration. Designed to increase online visibility and attract customers.",
            client: "Restaurant Client 3",
            duration: "2 Weeks",
            year: "2023",
            tech: ["HTML5", "CSS3", "JavaScript", "Google Maps", "SEO"],
            image: "assets/images/project3.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Cafe Digital Menu",
            category: "Digital Menu",
            desc: "Minimalist and trendy digital menu designed for a modern cafe. Features coffee categories, desserts section, and a clean aesthetic that matches the cafe's brand.",
            client: "Cafe Client",
            duration: "3 Days",
            year: "2024",
            tech: ["HTML5", "CSS3", "JavaScript"],
            image: "assets/images/project4.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Fast Food Chain Website",
            category: "Restaurant",
            desc: "Multi-branch restaurant website with branch locator, online menu, and franchise information. Designed to serve multiple locations with a unified brand experience.",
            client: "Fast Food Client",
            duration: "2 Weeks",
            year: "2023",
            tech: ["HTML5", "CSS3", "JavaScript", "Multi-page"],
            image: "assets/images/project5.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Business Landing Page",
            category: "Web Design",
            desc: "Modern business landing page with smooth animations, parallax effects, and conversion-optimized design. Built for a startup looking to establish online presence.",
            client: "Startup Client",
            duration: "1 Week",
            year: "2024",
            tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
            image: "assets/images/project6.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Fine Dining Website",
            category: "Restaurant",
            desc: "Elegant website for a fine dining restaurant. Dark theme with gold accents, reservation system, chef profiles, and an immersive gallery showcasing their dishes.",
            client: "Fine Dining Client",
            duration: "2 Weeks",
            year: "2023",
            tech: ["HTML5", "CSS3", "JavaScript", "Reservation"],
            image: "assets/images/project7.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Brand Identity Design",
            category: "Branding",
            desc: "Complete brand identity created from scratch. Includes logo design, color palette, typography system, business cards, letterhead, and social media templates.",
            client: "Brand Client 1",
            duration: "1 Week",
            year: "2024",
            tech: ["Figma", "Illustrator", "Brand Strategy"],
            image: "assets/images/project8.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "BBQ Restaurant Menu",
            category: "Digital Menu",
            desc: "Themed digital menu for a BBQ restaurant. Features fire/grill visual elements, combo deals section, and a warm color scheme that matches the restaurant's atmosphere.",
            client: "BBQ Client",
            duration: "4 Days",
            year: "2024",
            tech: ["HTML5", "CSS3", "JavaScript", "QR Code"],
            image: "assets/images/project9.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "E-Commerce Concept",
            category: "Web Design",
            desc: "Shopify store concept with custom theme, product categories, cart functionality, and checkout flow. Designed for a clothing brand entering online retail.",
            client: "E-Commerce Client",
            duration: "2 Weeks",
            year: "2024",
            tech: ["Shopify", "Liquid", "CSS3", "JavaScript"],
            image: "assets/images/project10.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Desi Restaurant Website",
            category: "Restaurant",
            desc: "Traditional restaurant website with cultural design elements. Menu showcase, catering services section, and contact with WhatsApp integration.",
            client: "Desi Restaurant Client",
            duration: "1 Week",
            year: "2023",
            tech: ["HTML5", "CSS3", "JavaScript", "WhatsApp API"],
            image: "assets/images/project11.jpg",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Logo & Identity Package",
            category: "Branding",
            desc: "Full branding package including logo variations, brand guidelines document, social media kit, packaging design concepts, and marketing collateral.",
            client: "Brand Client 2",
            duration: "10 Days",
            year: "2024",
            tech: ["Figma", "Photoshop", "Brand Guide"],
            image: "assets/images/project12.jpg",
            liveLink: "#",
            githubLink: "#"
        }
    ];


    // ===== PORTFOLIO FILTER - Category wise filter =====
    const filterBtns = document.querySelectorAll('.pf-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active class toggle karo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('showing');
                    card.style.animationDelay = (index * 0.08) + 's';
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('showing');
                }
            });
        });
    });


    // ===== PROJECT MODAL - Click pe detail popup dikhao =====
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const viewBtns = document.querySelectorAll('.pc-view');

    // Modal elements
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalClient = document.getElementById('modalClient');
    const modalDuration = document.getElementById('modalDuration');
    const modalYear = document.getElementById('modalYear');
    const modalTech = document.getElementById('modalTech');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalGithubLink = document.getElementById('modalGithubLink');

    // View button pe click = modal kholo
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            const project = projectsData[index];

            if (project) {
                // Modal mein data fill karo
                modalImage.src = project.image;
                modalImage.alt = project.title;
                modalCategory.textContent = project.category;
                modalTitle.textContent = project.title;
                modalDesc.textContent = project.desc;
                modalClient.textContent = project.client;
                modalDuration.textContent = project.duration;
                modalYear.textContent = project.year;
                modalLiveLink.href = project.liveLink;
                modalGithubLink.href = project.githubLink;

                // Tech tags fill karo
                modalTech.innerHTML = '';
                project.tech.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    modalTech.appendChild(span);
                });

                // Modal dikhao
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Modal band karo - close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Modal band karo - backdrop click
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Modal band karo - Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }


    // ===== PORTFOLIO STATS COUNTER =====
    const portStatNums = document.querySelectorAll('.port-stat-num');

    const portStatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animatePortCounter(target, count);
                portStatObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    portStatNums.forEach(num => portStatObserver.observe(num));

    function animatePortCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }


    // ===== PROJECT CARDS SCROLL ANIMATION =====
    const scrollProjectCards = document.querySelectorAll('.project-card');

    const projectScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                projectScrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollProjectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${(index % 3) * 0.1}s`;
        projectScrollObserver.observe(card);
    });


    // ===== FEATURED PROJECTS ANIMATION =====
    const featuredProjects = document.querySelectorAll('.featured-project');

    const featuredObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                featuredObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    featuredProjects.forEach((fp, index) => {
        fp.style.opacity = '0';
        fp.style.transform = 'translateY(40px)';
        fp.style.transition = `all 0.7s ease ${index * 0.2}s`;
        featuredObserver.observe(fp);
    });


    // ===== TESTIMONIAL CARDS ANIMATION =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                testimonialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.15}s`;
        testimonialObserver.observe(card);
    });


    // ===== PROJECT CARDS 3D TILT =====
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 8;
            const tiltY = (x - 0.5) * -8;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // ===== TESTIMONIAL CARDS TILT =====
    testimonialCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * 5}deg) rotateY(${(x - 0.5) * -5}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ===== PORTFOLIO HERO 3D SCENE =====
    const portfolioCanvas = document.getElementById('portfolioHeroCanvas');

    if (portfolioCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: portfolioCanvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const goldColor = 0xD4A017;

        // Photo frame shapes - portfolio ke liye
        const frames = [];
        for (let i = 0; i < 12; i++) {
            const width = Math.random() * 0.8 + 0.4;
            const height = Math.random() * 0.6 + 0.3;
            const geometry = new THREE.PlaneGeometry(width, height);
            const edges = new THREE.EdgesGeometry(geometry);
            const material = new THREE.LineBasicMaterial({
                color: goldColor,
                transparent: true,
                opacity: 0.1 + Math.random() * 0.15
            });
            const frame = new THREE.LineSegments(edges, material);

            frame.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );

            frame.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            );

            frame.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.005,
                floatSpeed: Math.random() * 0.3 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: frame.position.y
            };

            scene.add(frame);
            frames.push(frame);
        }

        // Particles
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(600 * 3);
        for (let i = 0; i < 600 * 3; i++) pPos[i] = (Math.random() - 0.5) * 20;
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.02, color: goldColor, transparent: true,
            opacity: 0.4, blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        camera.position.z = 6;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animatePortfolio() {
            requestAnimationFrame(animatePortfolio);
            const time = Date.now() * 0.001;

            frames.forEach(frame => {
                frame.rotation.y += frame.userData.rotSpeed;
                frame.position.y = frame.userData.originalY +
                    Math.sin(time * frame.userData.floatSpeed + frame.userData.floatOffset) * 0.3;
            });

            particles.rotation.y += 0.0002;
            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animatePortfolio();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        });
    }


    // ===== PORTFOLIO PARTICLES =====
    const portParticles = document.getElementById('portfolioParticles');

    if (portParticles) {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? '#D4A017' : 'rgba(255,255,255,0.3)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: float ${Math.random() * 5 + 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            portParticles.appendChild(particle);
        }
    }

});