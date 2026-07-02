/* ============================================= */
/* ABOUT.JS - About page ke specific functions */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== TYPING EFFECT - Roles type hote hain ek ek karke =====
    const typingElement = document.getElementById('typingRole');

    if (typingElement) {
        // Ye roles ek ek karke type honge
        const roles = [
            'AR Pioneer',
            'Web Developer',
            'Digital Menu Designer',
            '3D Experience Creator',
            'Brand Strategist',
            'Shopify Expert',
            'Metaverse Builder',
            'Tech Entrepreneur',
            'Future of AR'
        ];

        let roleIndex = 0;     // Konsa role abhi type ho raha hai
        let charIndex = 0;     // Konsa character abhi type ho raha hai
        let isDeleting = false; // Kya abhi delete ho raha hai
        let typingSpeed = 100;  // Kitni tez type ho

        function typeRole() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                // Characters delete karo
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Delete tez hota hai
            } else {
                // Characters type karo
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            // Jab pura word type ho jaye
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000; // 2 second ruko phir delete karo
            }

            // Jab pura word delete ho jaye
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length; // Next role pe jao
                typingSpeed = 500; // Thoda ruko phir next type karo
            }

            setTimeout(typeRole, typingSpeed);
        }

        // Typing start karo 1 second delay se
        setTimeout(typeRole, 1000);
    }


    // ===== SKILL BARS ANIMATION - Scroll pe fill hongi =====
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                // Thoda delay se fill karo
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillProgressBars.forEach(bar => {
        skillObserver.observe(bar);
    });


    // ===== TIMELINE PROGRESS - Scroll ke saath timeline fill ho =====
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineSection = document.getElementById('journey-section');

    if (timelineProgress && timelineSection) {
        window.addEventListener('scroll', () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionHeight = timelineSection.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate karo kitna scroll hua hai timeline section mein
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrolled = (windowHeight - rect.top) / (sectionHeight + windowHeight);
                const progressHeight = Math.min(scrolled * 100, 100);
                timelineProgress.style.height = progressHeight + '%';
            }
        });
    }


    // ===== TIMELINE ITEMS ANIMATION - Scroll pe fade in =====
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Initially hide karo sab timeline items
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';

        // Left items left se aayein, right items right se
        if (item.classList.contains('left')) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }

        item.style.transition = `all 0.6s ease ${index * 0.15}s`;
        timelineObserver.observe(item);
    });

    // Visible class add hone pe animation
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item.visible {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(style);


    // ===== ABOUT HERO 3D SCENE =====
    const aboutHeroCanvas = document.getElementById('aboutHeroCanvas');

    if (aboutHeroCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: aboutHeroCanvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Gold aur purple colors
        const goldColor = 0xD4A017;
        const purpleColor = 0x8B5CF6;

        // Floating geometric shapes banao
        const shapes = [];

        // Octahedrons (diamond shapes)
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.2);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? goldColor : purpleColor,
                wireframe: true,
                transparent: true,
                opacity: 0.2 + Math.random() * 0.3
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 10
            );
            mesh.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.02,
                floatSpeed: Math.random() * 0.5 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Tetrahedrons (pyramids)
        for (let i = 0; i < 6; i++) {
            const geometry = new THREE.TetrahedronGeometry(Math.random() * 0.4 + 0.1);
            const material = new THREE.MeshBasicMaterial({
                color: goldColor,
                wireframe: true,
                transparent: true,
                opacity: 0.15 + Math.random() * 0.2
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 8
            );
            mesh.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.015,
                floatSpeed: Math.random() * 0.3 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: goldColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        camera.position.z = 6;

        // Mouse movement tracking
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop
        function animateAboutHero() {
            requestAnimationFrame(animateAboutHero);
            const time = Date.now() * 0.001;

            // Shapes ko rotate aur float karo
            shapes.forEach(shape => {
                shape.rotation.x += shape.userData.rotSpeed;
                shape.rotation.y += shape.userData.rotSpeed * 0.7;
                shape.position.y = shape.userData.originalY +
                    Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.5;
            });

            // Particles rotate
            particles.rotation.y += 0.0003;

            // Mouse se camera move
            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animateAboutHero();

        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        });
    }


    // ===== PROFILE 3D SCENE - Profile ke around 3D effect =====
    const profileCanvas = document.getElementById('profileCanvas');

    if (profileCanvas && typeof THREE !== 'undefined') {
        const container = profileCanvas.parentElement;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: profileCanvas,
            antialias: true,
            alpha: true
        });

        const size = Math.min(container.offsetWidth + 40, 500);
        renderer.setSize(size, size);

        // Orbital rings around profile
        const ringCount = 3;
        const rings = [];

        for (let i = 0; i < ringCount; i++) {
            const radius = 2 + i * 0.5;
            const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0xD4A017 : 0x8B5CF6,
                transparent: true,
                opacity: 0.2 - i * 0.05
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 3 + i * 0.3;
            ring.rotation.y = i * 0.5;
            scene.add(ring);
            rings.push(ring);
        }

        // Small orbiting dots
        const dots = [];
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.SphereGeometry(0.05);
            const material = new THREE.MeshBasicMaterial({
                color: 0xD4A017,
                transparent: true,
                opacity: 0.6
            });
            const dot = new THREE.Mesh(geometry, material);
            dot.userData = {
                radius: 2 + Math.random() * 1.5,
                speed: 0.3 + Math.random() * 0.5,
                offset: Math.random() * Math.PI * 2,
                tilt: Math.random() * Math.PI
            };
            scene.add(dot);
            dots.push(dot);
        }

        camera.position.z = 5;

        function animateProfile() {
            requestAnimationFrame(animateProfile);
            const time = Date.now() * 0.001;

            rings.forEach((ring, i) => {
                ring.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1);
            });

            dots.forEach(dot => {
                const { radius, speed, offset, tilt } = dot.userData;
                dot.position.x = Math.cos(time * speed + offset) * radius;
                dot.position.y = Math.sin(time * speed + offset) * radius * Math.cos(tilt);
                dot.position.z = Math.sin(time * speed + offset) * radius * Math.sin(tilt);
            });

            renderer.render(scene, camera);
        }

        animateProfile();

        window.addEventListener('resize', () => {
            const newSize = Math.min(container.offsetWidth + 40, 500);
            renderer.setSize(newSize, newSize);
        });
    }


    // ===== ABOUT PARTICLES - Hero section mein particles =====
    const aboutParticles = document.getElementById('aboutParticles');

    if (aboutParticles) {
        for (let i = 0; i < 30; i++) {
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
            aboutParticles.appendChild(particle);
        }
    }


    // ===== WHY CARDS HOVER EFFECT =====
    const whyCards = document.querySelectorAll('.why-card');

    whyCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Glow effect mouse ki position pe
            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(212, 160, 23, 0.05) 0%,
                    var(--bg-card) 70%
                )
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--bg-card)';
        });
    });


    // ===== MISSION CARDS PARALLAX =====
    const missionCards = document.querySelectorAll('.mission-card');

    missionCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 5;
            const tiltY = (x - 0.5) * -5;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

});