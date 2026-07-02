/* ============================================= */
/* THREE-SCENE.JS - 3D Background Scene */
/* Hero section mein 3D animated background */
/* ============================================= */

// ===== HERO 3D SCENE =====
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Scene, Camera, Renderer banao
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // Transparent background
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ===== Colors define karo =====
    const goldColor = 0xD4A017;
    const goldLightColor = 0xF2C94C;
    const purpleColor = 0x8B5CF6;

    // ===== Particle System - Floating dots =====
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Har particle ki random position aur color set karo
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;     // X position
        positions[i + 1] = (Math.random() - 0.5) * 20; // Y position
        positions[i + 2] = (Math.random() - 0.5) * 20; // Z position

        // Random gold ya white color
        if (Math.random() > 0.7) {
            // Gold color particles
            colors[i] = 0.83;     // R
            colors[i + 1] = 0.63; // G
            colors[i + 2] = 0.09; // B
        } else {
            // White/grey particles
            colors[i] = 0.5 + Math.random() * 0.5;
            colors[i + 1] = 0.5 + Math.random() * 0.5;
            colors[i + 2] = 0.5 + Math.random() * 0.5;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle material - choti si dots
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // ===== Wireframe Sphere - Center mein ghumta hua globe =====
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: goldColor,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // ===== Inner Sphere - Andar ek aur sphere =====
    const innerSphereGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const innerSphereMaterial = new THREE.MeshBasicMaterial({
        color: goldLightColor,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    scene.add(innerSphere);

    // ===== Ring - Sphere ke around ek ring =====
    const ringGeometry = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: goldColor,
        transparent: true,
        opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // ===== Second Ring =====
    const ring2Geometry = new THREE.TorusGeometry(3.5, 0.015, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
        color: purpleColor,
        transparent: true,
        opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ===== Connecting Lines - Random lines jo particles ko connect karain =====
    const linesMaterial = new THREE.LineBasicMaterial({
        color: goldColor,
        transparent: true,
        opacity: 0.05
    });

    for (let i = 0; i < 20; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(6);
        linePositions[0] = (Math.random() - 0.5) * 10;
        linePositions[1] = (Math.random() - 0.5) * 10;
        linePositions[2] = (Math.random() - 0.5) * 10;
        linePositions[3] = (Math.random() - 0.5) * 10;
        linePositions[4] = (Math.random() - 0.5) * 10;
        linePositions[5] = (Math.random() - 0.5) * 10;
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const line = new THREE.Line(lineGeometry, linesMaterial);
        scene.add(line);
    }

    // Camera position
    camera.position.z = 5;

    // ===== Mouse movement se scene move karo =====
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ===== ANIMATION LOOP - Har frame pe scene update karo =====
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Particles ko slowly rotate karo
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x += 0.0002;

        // Sphere ko ghumao
        sphere.rotation.y += 0.003;
        sphere.rotation.x += 0.001;

        // Inner sphere ulta ghumao
        innerSphere.rotation.y -= 0.002;
        innerSphere.rotation.z += 0.001;

        // Rings ko ghumao
        ring.rotation.z += 0.002;
        ring2.rotation.z -= 0.001;
        ring2.rotation.x += 0.001;

        // Mouse se camera thoda move karo
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Sphere ko breathe (grow/shrink) karo
        const breathe = Math.sin(time) * 0.05 + 1;
        sphere.scale.set(breathe, breathe, breathe);

        renderer.render(scene, camera);
    }

    animate();

    // ===== Window resize pe canvas size update karo =====
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // ===== ABOUT SECTION 3D SCENE =====
    const aboutCanvas = document.getElementById('aboutCanvas');
    if (aboutCanvas) {
        const aboutScene = new THREE.Scene();
        const aboutCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const aboutRenderer = new THREE.WebGLRenderer({
            canvas: aboutCanvas,
            antialias: true,
            alpha: true
        });

        // About canvas ki size parent ke hisaab se set karo
        const aboutContainer = aboutCanvas.parentElement;
        aboutRenderer.setSize(aboutContainer.offsetWidth, aboutContainer.offsetHeight);

        // Floating cubes banao about section mein
        const cubes = [];
        for (let i = 0; i < 15; i++) {
            const size = Math.random() * 0.5 + 0.2;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? goldColor : purpleColor,
                wireframe: true,
                transparent: true,
                opacity: 0.3 + Math.random() * 0.3
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 5
            );
            cube.userData = {
                rotSpeed: Math.random() * 0.02,
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatOffset: Math.random() * Math.PI * 2
            };
            aboutScene.add(cube);
            cubes.push(cube);
        }

        // About scene mein bhi particles
        const aboutParticlesGeometry = new THREE.BufferGeometry();
        const aboutPositions = new Float32Array(500 * 3);
        for (let i = 0; i < 500 * 3; i++) {
            aboutPositions[i] = (Math.random() - 0.5) * 15;
        }
        aboutParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(aboutPositions, 3));
        const aboutParticles = new THREE.Points(aboutParticlesGeometry, new THREE.PointsMaterial({
            size: 0.03,
            color: goldColor,
            transparent: true,
            opacity: 0.5
        }));
        aboutScene.add(aboutParticles);

        aboutCamera.position.z = 5;

        function animateAbout() {
            requestAnimationFrame(animateAbout);
            const time = Date.now() * 0.001;

            cubes.forEach(cube => {
                cube.rotation.x += cube.userData.rotSpeed;
                cube.rotation.y += cube.userData.rotSpeed;
                cube.position.y += Math.sin(time * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.003;
            });

            aboutParticles.rotation.y += 0.0003;
            aboutRenderer.render(aboutScene, aboutCamera);
        }

        animateAbout();

        // About canvas resize
        window.addEventListener('resize', () => {
            aboutRenderer.setSize(aboutContainer.offsetWidth, aboutContainer.offsetHeight);
        });
    }

})();