/* ============================================= */
/* SERVICES.JS - Services page ke specific functions */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== SERVICE FILTER - Category wise filter karo =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-detail-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pehle sab buttons se active class hatao
            filterBtns.forEach(b => b.classList.remove('active'));
            // Click kiye hue button pe active class lagao
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    // Card dikhao with animation
                    card.classList.remove('hidden');
                    card.classList.add('showing');
                    card.style.animationDelay = (index * 0.1) + 's';
                } else {
                    // Card chupao
                    card.classList.add('hidden');
                    card.classList.remove('showing');
                }
            });
        });
    });


    // ===== FAQ ACCORDION - Click pe answer show/hide =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Pehle sab FAQ items band karo
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Current item toggle karo
            item.classList.toggle('active');
        });
    });


    // ===== OVERVIEW COUNTER - Stats count animation =====
    const overviewNumbers = document.querySelectorAll('.overview-number');

    const overviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateOverviewCounter(target, count);
                overviewObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    overviewNumbers.forEach(num => overviewObserver.observe(num));

    // Counter animation function
    function animateOverviewCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 25);
    }


    // ===== SERVICE CARDS 3D TILT EFFECT =====
    const detailCards = document.querySelectorAll('.service-detail-card');

    detailCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Halka sa tilt effect
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // Glow effect mouse position pe
            const glow = card.querySelector('.sdc-glow');
            if (glow) {
                glow.style.top = (y - 100) + 'px';
                glow.style.left = (x - 100) + 'px';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // ===== SERVICES HERO 3D SCENE =====
    const servicesCanvas = document.getElementById('servicesHeroCanvas');

    if (servicesCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: servicesCanvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const goldColor = 0xD4A017;
        const purpleColor = 0x8B5CF6;

        // Grid of floating service icons (3D cubes represent services)
        const cubes = [];

        // Service grid pattern banao
        for (let i = 0; i < 25; i++) {
            const size = Math.random() * 0.3 + 0.15;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.6 ? goldColor : purpleColor,
                wireframe: true,
                transparent: true,
                opacity: 0.15 + Math.random() * 0.2
            });
            const cube = new THREE.Mesh(geometry, material);

            // Grid pattern mein spread karo
            cube.position.set(
                (Math.random() - 0.5) * 16,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );

            cube.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.01,
                floatSpeed: Math.random() * 0.4 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: cube.position.y
            };

            scene.add(cube);
            cubes.push(cube);
        }

        // Connection lines between cubes
        const lineMaterial = new THREE.LineBasicMaterial({
            color: goldColor,
            transparent: true,
            opacity: 0.04
        });

        // Kuch random cubes ko connect karo
        for (let i = 0; i < 15; i++) {
            const idx1 = Math.floor(Math.random() * cubes.length);
            const idx2 = Math.floor(Math.random() * cubes.length);

            if (idx1 !== idx2) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array([
                    cubes[idx1].position.x, cubes[idx1].position.y, cubes[idx1].position.z,
                    cubes[idx2].position.x, cubes[idx2].position.y, cubes[idx2].position.z
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const line = new THREE.Line(geometry, lineMaterial);
                scene.add(line);
            }
        }

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(800 * 3);
        for (let i = 0; i < 800 * 3; i++) {
            particlePositions[i] = (Math.random() - 0.5) * 20;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({
            size: 0.02,
            color: goldColor,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        }));
        scene.add(particles);

        camera.position.z = 6;

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animateServices() {
            requestAnimationFrame(animateServices);
            const time = Date.now() * 0.001;

            cubes.forEach(cube => {
                cube.rotation.x += cube.userData.rotSpeed;
                cube.rotation.y += cube.userData.rotSpeed * 0.8;
                cube.position.y = cube.userData.originalY +
                    Math.sin(time * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.3;
            });

            particles.rotation.y += 0.0002;

            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animateServices();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        });
    }


    // ===== SERVICES PARTICLES =====
    const servicesParticles = document.getElementById('servicesParticles');

    if (servicesParticles) {
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
            servicesParticles.appendChild(particle);
        }
    }


    // ===== PROCESS STEPS ANIMATION - Scroll pe ek ek step aaye =====
    const processSteps = document.querySelectorAll('.process-step');

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = `all 0.6s ease ${index * 0.2}s`;
        processObserver.observe(step);
    });


    // ===== SERVICE CARDS SCROLL ANIMATION =====
    const scrollCards = document.querySelectorAll('.service-detail-card');

    const cardScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardScrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `all 0.6s ease ${(index % 2) * 0.15}s`;
        cardScrollObserver.observe(card);
    });

});