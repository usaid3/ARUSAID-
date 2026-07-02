/* ============================================= */
/* AR-DEMO.JS - AR Demo page ke sab functions */
/* 3D Model Viewer + Camera AR + Showcase */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // SECTION 1: 3D MODEL VIEWER
    // =============================================

    const modelCanvas = document.getElementById('modelViewerCanvas');

    if (modelCanvas && typeof THREE !== 'undefined') {

        // Scene, Camera, Renderer setup
        const scene = new THREE.Scene();
        const container = modelCanvas.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: modelCanvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        // OrbitControls - mouse se model ghumao
        const controls = new THREE.OrbitControls(camera, modelCanvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.enableZoom = true;
        controls.minDistance = 2;
        controls.maxDistance = 10;

        // Lights add karo - model ko roshan karo
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0xD4A017, 0.5, 20);
        pointLight1.position.set(-3, 3, 3);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8B5CF6, 0.3, 20);
        pointLight2.position.set(3, -3, -3);
        scene.add(pointLight2);

        // Grid floor - neeche grid dikhao
        const gridHelper = new THREE.GridHelper(10, 20, 0x333333, 0x222222);
        scene.add(gridHelper);

        // Camera position
        camera.position.set(3, 2, 3);
        controls.update();

        // ===== Current model reference =====
        let currentModel = null;
        let currentModelColor = 0xD4A017;
        let isWireframe = false;

        // ===== Model creation functions =====

        // Purana model hatao
        function removeCurrentModel() {
            if (currentModel) {
                scene.remove(currentModel);
                if (currentModel.geometry) currentModel.geometry.dispose();
                if (currentModel.material) currentModel.material.dispose();
                currentModel = null;
            }
        }

        // Naya model banao
        function createModel(type) {
            removeCurrentModel();

            let geometry;
            switch (type) {
                case 'cube':
                    geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(1, 32, 32);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                    break;
                case 'diamond':
                    geometry = new THREE.OctahedronGeometry(1.2);
                    break;
                case 'pyramid':
                    geometry = new THREE.TetrahedronGeometry(1.3);
                    break;
                case 'knot':
                    geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            }

            const material = new THREE.MeshPhongMaterial({
                color: currentModelColor,
                wireframe: isWireframe,
                shininess: 100,
                specular: 0x444444,
                transparent: true,
                opacity: isWireframe ? 0.8 : 1
            });

            currentModel = new THREE.Mesh(geometry, material);
            currentModel.position.y = 1;
            currentModel.castShadow = true;
            scene.add(currentModel);
        }

        // Pehla model banao - cube
        createModel('cube');

        // ===== Model Selection Buttons =====
        const modelOptions = document.querySelectorAll('.model-option');
        modelOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                modelOptions.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const modelType = btn.getAttribute('data-model');
                createModel(modelType);
            });
        });

        // ===== Auto Rotate Toggle =====
        const autoRotateToggle = document.getElementById('autoRotateToggle');
        if (autoRotateToggle) {
            autoRotateToggle.addEventListener('change', () => {
                controls.autoRotate = autoRotateToggle.checked;
            });
        }

        // ===== Wireframe Toggle =====
        const wireframeToggle = document.getElementById('wireframeToggle');
        if (wireframeToggle) {
            wireframeToggle.addEventListener('change', () => {
                isWireframe = wireframeToggle.checked;
                if (currentModel && currentModel.material) {
                    currentModel.material.wireframe = isWireframe;
                    currentModel.material.opacity = isWireframe ? 0.8 : 1;
                }
            });
        }

        // ===== Color Selection =====
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const color = btn.getAttribute('data-color');
                currentModelColor = parseInt(color.replace('#', '0x'));
                if (currentModel && currentModel.material) {
                    currentModel.material.color.set(currentModelColor);
                }
            });
        });

        // ===== Background Toggle =====
        const bgToggle = document.getElementById('bgToggle');
        if (bgToggle) {
            bgToggle.addEventListener('change', () => {
                if (bgToggle.checked) {
                    scene.background = null;
                    renderer.setClearColor(0x000000, 0);
                } else {
                    scene.background = new THREE.Color(0x1a1a2e);
                }
            });
        }

        // ===== Fullscreen Button =====
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            });
        }

        // ===== Custom GLB Model Upload =====
        const modelUpload = document.getElementById('modelUpload');
        const uploadStatus = document.getElementById('uploadStatus');
        const modelLoading = document.getElementById('modelLoading');

        if (modelUpload) {
            modelUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // File type check karo
                if (!file.name.match(/\.(glb|gltf)$/i)) {
                    uploadStatus.textContent = '❌ Only .GLB or .GLTF files allowed';
                    uploadStatus.className = 'upload-status error';
                    return;
                }

                // Loading dikhao
                modelLoading.classList.add('active');
                uploadStatus.textContent = 'Loading model...';
                uploadStatus.className = 'upload-status';

                // File read karo aur load karo
                const reader = new FileReader();
                reader.onload = (event) => {
                    const loader = new THREE.GLTFLoader();
                    loader.parse(event.target.result, '', (gltf) => {
                        // Purana model hatao
                        removeCurrentModel();

                        // Naya model add karo
                        currentModel = gltf.scene;

                        // Model ko center mein lao
                        const box = new THREE.Box3().setFromObject(currentModel);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 2 / maxDim;

                        currentModel.scale.multiplyScalar(scale);
                        currentModel.position.sub(center.multiplyScalar(scale));
                        currentModel.position.y = 1;

                        scene.add(currentModel);

                        modelLoading.classList.remove('active');
                        uploadStatus.textContent = '✅ Model loaded successfully!';
                        uploadStatus.className = 'upload-status success';

                        // Active model option reset karo
                        modelOptions.forEach(b => b.classList.remove('active'));

                    }, (error) => {
                        modelLoading.classList.remove('active');
                        uploadStatus.textContent = '❌ Error loading model';
                        uploadStatus.className = 'upload-status error';
                        console.error('GLB Load Error:', error);
                    });
                };
                reader.readAsArrayBuffer(file);
            });
        }

        // ===== URL se Model Load karo =====
        const loadUrlBtn = document.getElementById('loadUrlBtn');
        const modelUrlInput = document.getElementById('modelUrlInput');

        if (loadUrlBtn && modelUrlInput) {
            loadUrlBtn.addEventListener('click', () => {
                const url = modelUrlInput.value.trim();
                if (!url) {
                    uploadStatus.textContent = '❌ Please enter a URL';
                    uploadStatus.className = 'upload-status error';
                    return;
                }

                modelLoading.classList.add('active');
                uploadStatus.textContent = 'Loading from URL...';
                uploadStatus.className = 'upload-status';

                const loader = new THREE.GLTFLoader();
                loader.load(url, (gltf) => {
                    removeCurrentModel();
                    currentModel = gltf.scene;

                    const box = new THREE.Box3().setFromObject(currentModel);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 2 / maxDim;

                    currentModel.scale.multiplyScalar(scale);
                    currentModel.position.sub(center.multiplyScalar(scale));
                    currentModel.position.y = 1;

                    scene.add(currentModel);
                    modelLoading.classList.remove('active');
                    uploadStatus.textContent = '✅ Model loaded from URL!';
                    uploadStatus.className = 'upload-status success';
                    modelOptions.forEach(b => b.classList.remove('active'));

                }, undefined, (error) => {
                    modelLoading.classList.remove('active');
                    uploadStatus.textContent = '❌ Failed to load from URL';
                    uploadStatus.className = 'upload-status error';
                });
            });
        }

        // ===== Animation Loop =====
        function animateModelViewer() {
            requestAnimationFrame(animateModelViewer);
            controls.update();

            // Model ko halka sa float karo
            if (currentModel && currentModel.userData && !currentModel.userData.isGLTF) {
                currentModel.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        }

        animateModelViewer();

        // Resize
        window.addEventListener('resize', () => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }


    // =============================================
    // SECTION 2: CAMERA AR MODE
    // =============================================

    const arStartBtn = document.getElementById('arStartBtn');
    const arCloseBtn = document.getElementById('arCloseBtn');
    const arVideo = document.getElementById('arVideo');
    const arPlaceholder = document.getElementById('arPlaceholder');
    const arUIControls = document.getElementById('arUIControls');
    const arObjectOverlay = document.getElementById('arObjectOverlay');
    const arObjectCanvas = document.getElementById('arObjectCanvas');
    const arCaptureBtn = document.getElementById('arCaptureBtn');

    let arStream = null;
    let arScene, arCamera, arRenderer, arObject;
    let arColor = 0xD4A017;
    let arShape = 'cube';
    let arSize = 1;

    // AR Object shape select karo
    const arObjBtns = document.querySelectorAll('.ar-obj-btn');
    arObjBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            arObjBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            arShape = btn.getAttribute('data-shape');
            if (arObject) updateARObject();
        });
    });

    // AR Color select karo
    const arColorBtns = document.querySelectorAll('.ar-color-btn');
    arColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            arColorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            arColor = parseInt(btn.getAttribute('data-arcolor').replace('#', '0x'));
            if (arObject && arObject.material) {
                arObject.material.color.set(arColor);
            }
        });
    });

    // AR Size slider
    const arSizeSlider = document.getElementById('arSizeSlider');
    if (arSizeSlider) {
        arSizeSlider.addEventListener('input', () => {
            arSize = parseFloat(arSizeSlider.value);
            if (arObject) {
                arObject.scale.set(arSize, arSize, arSize);
            }
        });
    }

    // AR Object update karo
    function updateARObject() {
        if (!arScene) return;

        // Purana object hatao
        if (arObject) {
            arScene.remove(arObject);
            if (arObject.geometry) arObject.geometry.dispose();
            if (arObject.material) arObject.material.dispose();
        }

        let geometry;
        switch (arShape) {
            case 'cube':
                geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.35, 32, 32);
                break;
            case 'diamond':
                geometry = new THREE.OctahedronGeometry(0.4);
                break;
            case 'ring':
                geometry = new THREE.TorusGeometry(0.3, 0.12, 16, 100);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(0.35, 0.7, 32);
                break;
            default:
                geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        }

        const material = new THREE.MeshPhongMaterial({
            color: arColor,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });

        arObject = new THREE.Mesh(geometry, material);
        arObject.scale.set(arSize, arSize, arSize);
        arScene.add(arObject);
    }

    // ===== START AR - Camera kholo =====
    if (arStartBtn) {
        arStartBtn.addEventListener('click', async () => {
            try {
                // Camera permission lo
                arStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                // Video mein camera feed dikhao
                arVideo.srcObject = arStream;
                arVideo.classList.add('active');
                arPlaceholder.style.display = 'none';
                arUIControls.style.display = 'flex';
                arObjectOverlay.classList.add('active');

                // 3D overlay scene banao
                initAROverlay();

            } catch (error) {
                console.error('Camera error:', error);
                alert('Camera access denied. Please allow camera permission to use AR.');
            }
        });
    }

    // AR Overlay 3D scene initialize karo
    function initAROverlay() {
        if (!arObjectCanvas || typeof THREE === 'undefined') return;

        const container = arObjectCanvas.parentElement;
        arScene = new THREE.Scene();
        arCamera = new THREE.PerspectiveCamera(50,
            container.offsetWidth / container.offsetHeight, 0.1, 100);
        arRenderer = new THREE.WebGLRenderer({
            canvas: arObjectCanvas,
            antialias: true,
            alpha: true
        });

        arRenderer.setSize(container.offsetWidth, container.offsetHeight);
        arRenderer.setClearColor(0x000000, 0);

        // Lights
        const light1 = new THREE.AmbientLight(0xffffff, 0.6);
        arScene.add(light1);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
        light2.position.set(2, 3, 2);
        arScene.add(light2);

        arCamera.position.set(0, 0, 2);

        // AR object banao
        updateARObject();

        // AR animation loop
        function animateAR() {
            if (!arStream) return;
            requestAnimationFrame(animateAR);

            if (arObject) {
                arObject.rotation.y += 0.02;
                arObject.rotation.x += 0.005;
                arObject.position.y = Math.sin(Date.now() * 0.002) * 0.1;
            }

            arRenderer.render(arScene, arCamera);
        }

        animateAR();
    }

    // ===== CLOSE AR - Camera band karo =====
    if (arCloseBtn) {
        arCloseBtn.addEventListener('click', () => {
            if (arStream) {
                arStream.getTracks().forEach(track => track.stop());
                arStream = null;
            }
            arVideo.classList.remove('active');
            arVideo.srcObject = null;
            arPlaceholder.style.display = 'flex';
            arUIControls.style.display = 'none';
            arObjectOverlay.classList.remove('active');
        });
    }

    // ===== CAPTURE - Screenshot lo =====
    if (arCaptureBtn) {
        arCaptureBtn.addEventListener('click', () => {
            // Canvas banao screenshot ke liye
            const captureCanvas = document.createElement('canvas');
            const container = arVideo.parentElement;
            captureCanvas.width = container.offsetWidth;
            captureCanvas.height = container.offsetHeight;
            const ctx = captureCanvas.getContext('2d');

            // Video frame draw karo
            ctx.drawImage(arVideo, 0, 0, captureCanvas.width, captureCanvas.height);

            // 3D overlay draw karo
            if (arObjectCanvas) {
                ctx.drawImage(arObjectCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
            }

            // Download karo
            const link = document.createElement('a');
            link.download = 'ARUSAID-AR-Capture.png';
            link.href = captureCanvas.toDataURL();
            link.click();
        });
    }


    // =============================================
    // SECTION 3: 3D SHOWCASE ITEMS
    // =============================================

    const showcaseCanvases = document.querySelectorAll('.showcase-canvas');

    showcaseCanvases.forEach(canvas => {
        const shape = canvas.getAttribute('data-shape');
        const container = canvas.parentElement;
        initShowcaseScene(canvas, container, shape);
    });

    function initShowcaseScene(canvas, container, shapeType) {
        if (typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50,
            container.offsetWidth / container.offsetHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Light
        const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(3, 3, 3);
        scene.add(dirLight);

        camera.position.z = 3;

        let mesh;
        const goldColor = 0xD4A017;
        const purpleColor = 0x8B5CF6;

        switch (shapeType) {
            case 'rotating-cube':
                const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
                const cubeMat = new THREE.MeshPhongMaterial({
                    color: goldColor, wireframe: false, shininess: 80
                });
                mesh = new THREE.Mesh(cubeGeo, cubeMat);

                // Wireframe edges add karo
                const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
                const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
                const cubeLines = new THREE.LineSegments(cubeEdges, edgeMat);
                mesh.add(cubeLines);
                scene.add(mesh);
                break;

            case 'floating-sphere':
                const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
                const sphereMat = new THREE.MeshPhongMaterial({
                    color: purpleColor, shininess: 100, transparent: true, opacity: 0.8
                });
                mesh = new THREE.Mesh(sphereGeo, sphereMat);

                // Wireframe sphere
                const wireGeo = new THREE.SphereGeometry(1, 16, 16);
                const wireMat = new THREE.MeshBasicMaterial({
                    color: goldColor, wireframe: true, transparent: true, opacity: 0.2
                });
                const wireMesh = new THREE.Mesh(wireGeo, wireMat);
                mesh.add(wireMesh);
                scene.add(mesh);
                break;

            case 'morphing-torus':
                const torusGeo = new THREE.TorusGeometry(0.7, 0.25, 16, 100);
                const torusMat = new THREE.MeshPhongMaterial({
                    color: goldColor, shininess: 80
                });
                mesh = new THREE.Mesh(torusGeo, torusMat);
                scene.add(mesh);
                break;

            case 'particle-sphere':
                // Particle sphere banao
                const pGeo = new THREE.BufferGeometry();
                const pCount = 500;
                const pPositions = new Float32Array(pCount * 3);

                for (let i = 0; i < pCount; i++) {
                    // Sphere surface pe points
                    const phi = Math.acos(-1 + (2 * i) / pCount);
                    const theta = Math.sqrt(pCount * Math.PI) * phi;
                    pPositions[i * 3] = Math.cos(theta) * Math.sin(phi) * 0.8;
                    pPositions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 0.8;
                    pPositions[i * 3 + 2] = Math.cos(phi) * 0.8;
                }

                pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
                const pMat = new THREE.PointsMaterial({
                    size: 0.03, color: goldColor,
                    blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8
                });
                mesh = new THREE.Points(pGeo, pMat);
                scene.add(mesh);
                break;
        }

        // Animation
        function animateShowcase() {
            requestAnimationFrame(animateShowcase);
            const time = Date.now() * 0.001;

            if (mesh) {
                mesh.rotation.y += 0.01;
                mesh.rotation.x += 0.005;

                // Float effect
                if (shapeType === 'floating-sphere') {
                    mesh.position.y = Math.sin(time) * 0.2;
                }
                if (shapeType === 'morphing-torus') {
                    mesh.rotation.x = Math.sin(time * 0.5) * 0.5;
                }
            }

            renderer.render(scene, camera);
        }

        // Sirf jab visible ho tab animate karo
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateShowcase();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(canvas);

        // Resize
        window.addEventListener('resize', () => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }


    // =============================================
    // SECTION 4: HERO 3D SCENE
    // =============================================

    const arHeroCanvas = document.getElementById('arHeroCanvas');

    if (arHeroCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75,
            window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: arHeroCanvas, antialias: true, alpha: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const goldColor = 0xD4A017;

        // VR Headset shape - simplified
        const shapes = [];

        // Eye frames (VR goggles look)
        for (let i = 0; i < 2; i++) {
            const eyeGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 30);
            const eyeMat = new THREE.MeshBasicMaterial({
                color: goldColor, wireframe: true,
                transparent: true, opacity: 0.3
            });
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.x = i === 0 ? -0.7 : 0.7;
            scene.add(eye);
            shapes.push(eye);
        }

        // Bridge between eyes
        const bridgeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const bridgeMat = new THREE.MeshBasicMaterial({
            color: goldColor, transparent: true, opacity: 0.3
        });
        const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
        bridge.rotation.z = Math.PI / 2;
        scene.add(bridge);

        // Floating data cubes
        for (let i = 0; i < 15; i++) {
            const size = Math.random() * 0.3 + 0.1;
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? goldColor : 0x8B5CF6,
                wireframe: true, transparent: true,
                opacity: 0.1 + Math.random() * 0.15
            });
            const cube = new THREE.Mesh(geo, mat);
            cube.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
            );
            cube.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.01,
                floatSpeed: Math.random() * 0.3 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: cube.position.y
            };
            scene.add(cube);
            shapes.push(cube);
        }

        // Particles
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(800 * 3);
        for (let i = 0; i < 800 * 3; i++) pPos[i] = (Math.random() - 0.5) * 20;
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

        function animateHero() {
            requestAnimationFrame(animateHero);
            const time = Date.now() * 0.001;

            shapes.forEach(shape => {
                if (shape.userData.rotSpeed) {
                    shape.rotation.x += shape.userData.rotSpeed;
                    shape.rotation.y += shape.userData.rotSpeed * 0.7;
                    shape.position.y = shape.userData.originalY +
                        Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.3;
                }
            });

            particles.rotation.y += 0.0002;
            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animateHero();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        });
    }


    // ===== HERO PARTICLES =====
    const heroParticles = document.getElementById('arHeroParticles');
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


    // ===== USE CASES SCROLL ANIMATION =====
    const usecaseCards = document.querySelectorAll('.usecase-card');
    const ucObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                ucObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    usecaseCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${i * 0.1}s`;
        ucObserver.observe(card);
    });

});