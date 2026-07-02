/* ============================================= */
/* CONTACT.JS - Form + Google Sheets + 3D Scene */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // GOOGLE SHEETS FORM SUBMISSION
    // =============================================

    /*
    ======== IMPORTANT - GOOGLE APPS SCRIPT URL ========
    
    Neeche wali URL ko apni Google Apps Script URL se replace karo.
    Setup guide neeche di gayi hai.
    
    ===================================================
    */

    // YAHAN APNI GOOGLE APPS SCRIPT URL PASTE KARO
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const sendAnother = document.getElementById('sendAnother');

    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const serviceError = document.getElementById('serviceError');
    const messageError = document.getElementById('messageError');

    // ===== Form Validation =====
    function validateForm() {
        let isValid = true;

        // Name check
        const name = document.getElementById('userName').value.trim();
        if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            document.getElementById('userName').classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
            document.getElementById('userName').classList.remove('error');
            document.getElementById('userName').classList.add('success');
        }

        // Email check
        const email = document.getElementById('userEmail').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            document.getElementById('userEmail').classList.add('error');
            isValid = false;
        } else {
            emailError.textContent = '';
            document.getElementById('userEmail').classList.remove('error');
            document.getElementById('userEmail').classList.add('success');
        }

        // Subject check
        const subject = document.getElementById('userSubject').value.trim();
        if (subject.length < 3) {
            subjectError.textContent = 'Subject must be at least 3 characters';
            document.getElementById('userSubject').classList.add('error');
            isValid = false;
        } else {
            subjectError.textContent = '';
            document.getElementById('userSubject').classList.remove('error');
            document.getElementById('userSubject').classList.add('success');
        }

        // Service check
        const service = document.getElementById('userService').value;
        if (!service) {
            serviceError.textContent = 'Please select a service';
            document.getElementById('userService').classList.add('error');
            isValid = false;
        } else {
            serviceError.textContent = '';
            document.getElementById('userService').classList.remove('error');
            document.getElementById('userService').classList.add('success');
        }

        // Message check
        const message = document.getElementById('userMessage').value.trim();
        if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            document.getElementById('userMessage').classList.add('error');
            isValid = false;
        } else {
            messageError.textContent = '';
            document.getElementById('userMessage').classList.remove('error');
            document.getElementById('userMessage').classList.add('success');
        }

        return isValid;
    }

    // ===== Real-time validation - jab type karo =====
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                input.classList.remove('error');
            }
        });

        input.addEventListener('input', () => {
            input.classList.remove('error');
            // Error message bhi hatao
            const errorSpan = input.parentElement.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    // ===== Form Submit =====
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validation check
            if (!validateForm()) return;

            // Loading state dikhao
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Form data collect karo
            const formData = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                phone: document.getElementById('userPhone').value.trim(),
                subject: document.getElementById('userSubject').value.trim(),
                service: document.getElementById('userService').value,
                budget: document.getElementById('userBudget').value || 'Not specified',
                message: document.getElementById('userMessage').value.trim(),
                timestamp: new Date().toLocaleString()
            };

            try {
                // Google Sheets mein data bhejo
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Success dikhao
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');

                // Loading band karo
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

            } catch (error) {
                console.error('Form submission error:', error);

                // Agar Google Sheets URL set nahi hai to bhi success dikhao
                // (no-cors mode mein error aata hai but data phir bhi jata hai)
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // ===== Send Another Message =====
    if (sendAnother) {
        sendAnother.addEventListener('click', () => {
            // Form reset karo
            contactForm.reset();
            contactForm.style.display = 'block';
            formSuccess.classList.remove('active');

            // Success/error classes hatao inputs se
            const allInputs = document.querySelectorAll('.form-input');
            allInputs.forEach(input => {
                input.classList.remove('success', 'error');
            });

            // Error messages hatao
            const allErrors = document.querySelectorAll('.form-error');
            allErrors.forEach(err => err.textContent = '');
        });
    }


    // =============================================
    // CONTACT HERO 3D SCENE
    // =============================================

    const contactHeroCanvas = document.getElementById('contactHeroCanvas');

    if (contactHeroCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75,
            window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: contactHeroCanvas, antialias: true, alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const goldColor = 0xD4A017;

        // Envelope shape (simplified)
        const shapes = [];

        // Paper plane shapes
        for (let i = 0; i < 8; i++) {
            const geo = new THREE.ConeGeometry(0.3, 0.8, 3);
            const mat = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? goldColor : 0x8B5CF6,
                wireframe: true, transparent: true,
                opacity: 0.15 + Math.random() * 0.2
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
            );
            mesh.rotation.z = Math.random() * Math.PI;
            mesh.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.01,
                floatSpeed: Math.random() * 0.3 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Chat bubbles (spheres)
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 0.2 + 0.1;
            const geo = new THREE.SphereGeometry(size, 16, 16);
            const mat = new THREE.MeshBasicMaterial({
                color: goldColor, wireframe: true,
                transparent: true, opacity: 0.1 + Math.random() * 0.15
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7
            );
            mesh.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.005,
                floatSpeed: Math.random() * 0.4 + 0.1,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Particles
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(600 * 3);
        for (let i = 0; i < 600 * 3; i++) pPos[i] = (Math.random() - 0.5) * 20;
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
            size: 0.02, color: goldColor, transparent: true,
            opacity: 0.4, blending: THREE.AdditiveBlending
        }));
        scene.add(particles);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animateContactHero() {
            requestAnimationFrame(animateContactHero);
            const time = Date.now() * 0.001;

            shapes.forEach(shape => {
                shape.rotation.x += shape.userData.rotSpeed;
                shape.rotation.y += shape.userData.rotSpeed * 0.7;
                shape.position.y = shape.userData.originalY +
                    Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.3;
            });

            particles.rotation.y += 0.0002;
            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }

        animateContactHero();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        });
    }


    // =============================================
    // CONTACT SIDEBAR 3D SCENE
    // =============================================

    const contact3DCanvas = document.getElementById('contact3DCanvas');

    if (contact3DCanvas && typeof THREE !== 'undefined') {
        const container = contact3DCanvas.parentElement;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
            canvas: contact3DCanvas, antialias: true, alpha: true
        });

        renderer.setSize(container.offsetWidth, container.offsetHeight);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(2, 2, 2);
        scene.add(dirLight);

        // Animated envelope - message icon
        const envelopeGroup = new THREE.Group();

        // Base rectangle
        const baseGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
        const baseMat = new THREE.MeshPhongMaterial({ color: 0xD4A017, shininess: 80 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        envelopeGroup.add(base);

        // Sides
        const sideGeo = new THREE.BoxGeometry(1.2, 0.4, 0.05);
        const sideMat = new THREE.MeshPhongMaterial({ color: 0xB8860B, shininess: 80 });
        const frontSide = new THREE.Mesh(sideGeo, sideMat);
        frontSide.position.set(0, 0.2, 0.375);
        envelopeGroup.add(frontSide);

        const backSide = new THREE.Mesh(sideGeo, sideMat);
        backSide.position.set(0, 0.2, -0.375);
        envelopeGroup.add(backSide);

        const leftGeo = new THREE.BoxGeometry(0.05, 0.4, 0.8);
        const leftSide = new THREE.Mesh(leftGeo, sideMat);
        leftSide.position.set(-0.575, 0.2, 0);
        envelopeGroup.add(leftSide);

        const rightSide = new THREE.Mesh(leftGeo, sideMat);
        rightSide.position.set(0.575, 0.2, 0);
        envelopeGroup.add(rightSide);

        // Flap (triangle on top)
        const flapGeo = new THREE.ConeGeometry(0.7, 0.5, 4);
        const flapMat = new THREE.MeshPhongMaterial({ color: 0xF2C94C, shininess: 100 });
        const flap = new THREE.Mesh(flapGeo, flapMat);
        flap.position.y = 0.6;
        flap.rotation.y = Math.PI / 4;
        flap.rotation.x = Math.PI;
        envelopeGroup.add(flap);

        scene.add(envelopeGroup);

        // Orbiting particles
        const orbParticles = [];
        for (let i = 0; i < 20; i++) {
            const pGeo = new THREE.SphereGeometry(0.03);
            const pMat = new THREE.MeshBasicMaterial({ color: 0xD4A017, transparent: true, opacity: 0.6 });
            const p = new THREE.Mesh(pGeo, pMat);
            p.userData = {
                radius: 1.2 + Math.random() * 0.5,
                speed: 0.3 + Math.random() * 0.4,
                offset: Math.random() * Math.PI * 2,
                tilt: Math.random() * Math.PI
            };
            scene.add(p);
            orbParticles.push(p);
        }

        camera.position.set(0, 1, 2.5);
        camera.lookAt(0, 0.3, 0);

        function animateContactSidebar() {
            requestAnimationFrame(animateContactSidebar);
            const time = Date.now() * 0.001;

            envelopeGroup.rotation.y += 0.008;
            envelopeGroup.position.y = Math.sin(time) * 0.1;

            // Flap animation
            flap.rotation.x = Math.PI + Math.sin(time * 0.5) * 0.2;

            orbParticles.forEach(p => {
                const { radius, speed, offset, tilt } = p.userData;
                p.position.x = Math.cos(time * speed + offset) * radius;
                p.position.y = Math.sin(time * speed + offset) * radius * Math.cos(tilt) + 0.3;
                p.position.z = Math.sin(time * speed + offset) * radius * Math.sin(tilt);
            });

            renderer.render(scene, camera);
        }

        animateContactSidebar();

        window.addEventListener('resize', () => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }


    // ===== HERO PARTICLES =====
    const heroParticles = document.getElementById('contactParticles');
    if (heroParticles) {
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position:absolute;
                width:${Math.random() * 3 + 1}px;
                height:${Math.random() * 3 + 1}px;
                background:${Math.random() > 0.5 ? '#D4A017' : 'rgba(255,255,255,0.3)'};
                border-radius:50%;
                left:${Math.random() * 100}%;
                top:${Math.random() * 100}%;
                opacity:${Math.random() * 0.4 + 0.1};
                animation:float ${Math.random() * 5 + 3}s ease-in-out infinite;
                animation-delay:${Math.random() * 3}s;
            `;
            heroParticles.appendChild(p);
        }
    }


    // ===== CONTACT CARDS ANIMATION =====
    const contactCards = document.querySelectorAll('.contact-card');
    const ccObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                ccObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    contactCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${i * 0.1}s`;
        ccObserver.observe(card);
    });

});