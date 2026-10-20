/**
 * High-Luxury Three.js WebGL 3D Birthday Cake Ceremony
 * Seamless full two-tier chocolate mirror glaze patisserie cake,
 * 7 glowing taper candles with dynamic flickering PointLights,
 * interactive candle blow out with rising smoke puffs,
 * fully transparent background without box or border frames,
 * and mouse/touch drag orbit controls.
 * Strictly zero emojis.
 */

export class ThreeCakeCeremony {
  constructor(containerId, audioEngine) {
    this.container = document.getElementById(containerId);
    this.audio = audioEngine;
    if (!this.container) return;

    const THREE_REF = window.THREE;
    if (!THREE_REF) {
      console.warn("Three.js not found on window. Retrying in 150ms...");
      setTimeout(() => new ThreeCakeCeremony(containerId, audioEngine), 150);
      return;
    }
    this.THREE = THREE_REF;

    this.isBlown = false;
    this.candles = [];
    this.smokeParticles = [];

    // Drag Orbit State
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0 };
    this.targetRotation = { x: 0.16, y: -0.2 };
    this.autoRotate = true;

    this.initScene();
    this.createMaterials();
    this.createStand();
    this.createCake();
    this.createMultipleCandles();
    this.createDecorations();
    this.setupLighting();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    const THREE = this.THREE;
    this.width = this.container.clientWidth || 640;
    this.height = this.container.clientHeight || 540;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 4.8, 11.5);
    this.camera.lookAt(0, 0.7, 0);

    // Completely transparent WebGL renderer (no background box, seamless integration)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // 100% transparent
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // Root group for all 3D cake ceremony objects
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.rotation.x = this.targetRotation.x;
    this.cakeGroup.rotation.y = this.targetRotation.y;
    this.scene.add(this.cakeGroup);

    this.raycaster = new THREE.Raycaster();
    this.mouseCoords = new THREE.Vector2();
  }

  createMaterials() {
    const THREE = this.THREE;

    // 1. Valrhona Dark Belgian Chocolate Mirror Glaze (High Gloss Physical Clearcoat)
    this.chocolateGlazeMat = new THREE.MeshPhysicalMaterial({
      color: 0x160c07,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.96
    });

    // 2. Chantilly Vanilla Cream (Piping & Rosettes)
    this.vanillaCreamMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdf8ee,
      roughness: 0.38,
      metalness: 0.03,
      clearcoat: 0.35
    });

    // 3. 24k Polished Gold Accents (Trim, Pearls, Plaque, Ribbon)
    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xe5b838,
      roughness: 0.16,
      metalness: 0.94
    });

    // 4. Carrara White Marble for Pedestal
    this.marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f6,
      roughness: 0.28,
      metalness: 0.08
    });

    // 5. Ruby Raspberries
    this.berryMat = new THREE.MeshPhysicalMaterial({
      color: 0x7a0c1e,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.92,
      clearcoatRoughness: 0.08
    });

    // 6. Fluted Candle Wax (Ivory Taper)
    this.candleWaxMat = new THREE.MeshStandardMaterial({
      color: 0xfcf9f2,
      roughness: 0.22,
      metalness: 0.08
    });

    // 7. Dark Wick Material
    this.wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  }

  generateMonogramTexture() {
    const THREE = this.THREE;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    // Luxury Dark Bronze-Gold Plaque
    ctx.fillStyle = "#0c0a08";
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 112);

    ctx.strokeStyle = "#f5e6c8";
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 480, 96);

    ctx.fillStyle = "#f5e6c8";
    ctx.font = "bold 44px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IRNUM · 21 OCTOBER", 256, 64);

    return new THREE.CanvasTexture(canvas);
  }

  setupLighting() {
    const THREE = this.THREE;

    // Ambient Warm Base Fill
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.95);
    this.scene.add(ambientLight);

    // Key Studio Light (Directional highlights)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(7, 12, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Golden Specular Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.35);
    rimLight.position.set(-8, 7, -6);
    this.scene.add(rimLight);

    // Warm Under-fill
    const underLight = new THREE.DirectionalLight(0x403020, 0.4);
    underLight.position.set(0, -5, 4);
    this.scene.add(underLight);

    // Central Candle Flame PointLight
    this.centralLight = new THREE.PointLight(0xffaa33, 2.8, 14, 1.8);
    this.centralLight.position.set(0, 4.3, 0);
    this.centralLight.castShadow = true;
    this.centralLight.shadow.bias = -0.002;
    this.scene.add(this.centralLight);
  }

  createStand() {
    const THREE = this.THREE;

    // Pedestal Base (Carrara White Marble)
    const baseGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.35, 64);
    const standBase = new THREE.Mesh(baseGeo, this.marbleMat);
    standBase.position.y = -1.6;
    standBase.receiveShadow = true;
    this.cakeGroup.add(standBase);

    // Pedestal Gold Rim Trim
    const baseTrim = new THREE.Mesh(new THREE.TorusGeometry(3.92, 0.06, 16, 64), this.goldMat);
    baseTrim.rotation.x = Math.PI / 2;
    baseTrim.position.y = -1.75;
    this.cakeGroup.add(baseTrim);

    // Fluted Gold Stem
    const stemGeo = new THREE.CylinderGeometry(0.75, 1.25, 1.2, 32);
    const standStem = new THREE.Mesh(stemGeo, this.goldMat);
    standStem.position.y = -0.9;
    standStem.castShadow = true;
    this.cakeGroup.add(standStem);

    // Mirror Finish Gold Cake Tray
    const plateGeo = new THREE.CylinderGeometry(4.35, 4.15, 0.22, 64);
    const standPlate = new THREE.Mesh(plateGeo, this.goldMat);
    standPlate.position.y = -0.25;
    standPlate.receiveShadow = true;
    this.cakeGroup.add(standPlate);
  }

  createCake() {
    const THREE = this.THREE;

    // --- BASE TIER (Full, unbroken 360-degree cylinder) ---
    // Radius: 3.4, Height: 1.4
    const baseTierGeo = new THREE.CylinderGeometry(3.4, 3.4, 1.4, 64);
    const baseTier = new THREE.Mesh(baseTierGeo, this.chocolateGlazeMat);
    baseTier.position.y = 0.55;
    baseTier.castShadow = true;
    baseTier.receiveShadow = true;
    this.cakeGroup.add(baseTier);

    // Gold Pearl Border on Base Tier (Bottom)
    const basePearlCount = 36;
    for (let i = 0; i < basePearlCount; i++) {
      const angle = (i / basePearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), this.goldMat);
      pearl.position.set(Math.cos(angle) * 3.42, -0.12, Math.sin(angle) * 3.42);
      this.cakeGroup.add(pearl);
    }

    // Whipped Cream Swirls along the Base Tier Top Rim
    const creamSwirlCount = 28;
    for (let i = 0; i < creamSwirlCount; i++) {
      const angle = (i / creamSwirlCount) * Math.PI * 2;
      const swirl = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.24, 16), this.vanillaCreamMat);
      swirl.position.set(Math.cos(angle) * 3.25, 1.28, Math.sin(angle) * 3.25);
      swirl.rotation.y = angle;
      this.cakeGroup.add(swirl);
    }

    // Commemorative Monogram Plaque on Base Tier Front
    const plaqueMat = new THREE.MeshBasicMaterial({ map: this.generateMonogramTexture() });
    const plaqueGeo = new THREE.CylinderGeometry(3.43, 3.43, 0.55, 32, 1, true, -0.5, 1.0);
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.y = 0.55;
    this.cakeGroup.add(plaque);

    // --- TOP TIER (Full, unbroken 360-degree cylinder) ---
    // Radius: 2.35, Height: 1.25
    const topTierGeo = new THREE.CylinderGeometry(2.35, 2.35, 1.25, 64);
    this.topTier = new THREE.Mesh(topTierGeo, this.chocolateGlazeMat);
    this.topTier.position.y = 1.85;
    this.topTier.castShadow = true;
    this.topTier.receiveShadow = true;
    this.cakeGroup.add(this.topTier);

    // Gold Pearl Border on Top Tier (Seam)
    const topPearlCount = 26;
    for (let i = 0; i < topPearlCount; i++) {
      const angle = (i / topPearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), this.goldMat);
      pearl.position.set(Math.cos(angle) * 2.37, 1.25, Math.sin(angle) * 2.37);
      this.cakeGroup.add(pearl);
    }

    // Whipped Vanilla Cream Rosettes along the Top Tier Perimeter
    const topRosetteCount = 20;
    for (let i = 0; i < topRosetteCount; i++) {
      const angle = (i / topRosetteCount) * Math.PI * 2;
      const rosette = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 16), this.vanillaCreamMat);
      rosette.position.set(Math.cos(angle) * 2.22, 2.5, Math.sin(angle) * 2.22);
      rosette.rotation.y = angle;
      this.cakeGroup.add(rosette);
    }
  }

  createMultipleCandles() {
    const THREE = this.THREE;
    this.candles = [];

    // Arrangement: 1 Central Tall Candle + 6 Surrounding Hexagonal Candles
    // Central Candle (Tall, Grand Taper)
    this.addCandleInstance(0, 0, 1.5, 0.11, true);

    // 6 Surrounding Taper Candles on Top Tier
    const candleRadius = 1.35;
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * candleRadius;
      const z = Math.sin(angle) * candleRadius;
      this.addCandleInstance(x, z, 1.25, 0.085, false, i);
    }
  }

  addCandleInstance(x, z, height, radius, isCenter = false, index = 0) {
    const THREE = this.THREE;
    const candleGroup = new THREE.Group();
    const baseY = 2.47; // Top surface of top tier
    candleGroup.position.set(x, baseY, z);

    // 1. Fluted Ivory Candle Body
    const bodyGeo = new THREE.CylinderGeometry(radius, radius * 1.05, height, 24);
    const body = new THREE.Mesh(bodyGeo, this.candleWaxMat);
    body.position.y = height / 2;
    body.castShadow = true;
    candleGroup.add(body);

    // 2. Gold Spiral Trim Ribbon
    const ribbonCount = isCenter ? 2 : 1;
    for (let r = 0; r < ribbonCount; r++) {
      const ribbon = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.08, 0.018, 12, 24), this.goldMat);
      ribbon.rotation.x = Math.PI / 2 + 0.25;
      ribbon.position.y = (height * (r + 1)) / (ribbonCount + 1);
      candleGroup.add(ribbon);
    }

    // 3. Candle Wick
    const wickGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8);
    const wick = new THREE.Mesh(wickGeo, this.wickMat);
    wick.position.y = height + 0.09;
    candleGroup.add(wick);

    // 4. Glowing 3D Teardrop Flame (Inner Cone)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.95
    });
    const flameGeo = new THREE.ConeGeometry(radius * 1.15, 0.38, 16);
    flameGeo.translate(0, 0.19, 0);
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = height + 0.14;
    candleGroup.add(flameMesh);

    // 5. Outer Radiant Glow Halo
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(radius * 2.2, 16, 16), haloMat);
    halo.position.y = height + 0.26;
    candleGroup.add(halo);

    this.cakeGroup.add(candleGroup);

    this.candles.push({
      group: candleGroup,
      flameMesh: flameMesh,
      halo: halo,
      wickY: baseY + height + 0.18,
      worldX: x,
      worldZ: z,
      phaseOffset: index * 1.05 + (isCenter ? 0 : 0.5)
    });
  }

  createDecorations() {
    const THREE = this.THREE;
    const topY = 2.47;

    // 8 Fresh Ruby Raspberries nestled on top tier
    const berryCount = 8;
    for (let i = 0; i < berryCount; i++) {
      const angle = (i / berryCount) * Math.PI * 2 + 0.25;
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), this.berryMat);
      berry.position.set(Math.cos(angle) * 1.85, topY + 0.14, Math.sin(angle) * 1.85);
      berry.castShadow = true;
      this.cakeGroup.add(berry);

      // Edible 24k gold leaf flakes near berries
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.12), this.goldMat);
      leaf.position.set(Math.cos(angle) * 1.7, topY + 0.015, Math.sin(angle) * 1.7);
      leaf.rotation.y = angle;
      this.cakeGroup.add(leaf);
    }
  }

  bindEvents() {
    const blowBtn = document.getElementById("btn-blow-candle");
    const releaseBtn = document.getElementById("btn-release-candles");

    if (blowBtn) blowBtn.addEventListener("click", () => this.blowCandles());
    if (releaseBtn) releaseBtn.addEventListener("click", () => this.triggerFloatingCandles());

    // Mouse Drag Orbit
    const canvas = this.renderer.domElement;

    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
      setTimeout(() => {
        if (!this.isDragging) this.autoRotate = true;
      }, 3000);
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) {
        this.checkHover(e);
        return;
      }

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.rotationVelocity.y = deltaX * 0.005;
      this.rotationVelocity.x = deltaY * 0.005;

      this.cakeGroup.rotation.y += this.rotationVelocity.y;
      this.cakeGroup.rotation.x += this.rotationVelocity.x;
      this.cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.65, this.cakeGroup.rotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Drag Orbit for Mobile
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.isDragging = false;
      setTimeout(() => {
        if (!this.isDragging) this.autoRotate = true;
      }, 3000);
    });

    window.addEventListener("touchmove", (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.cakeGroup.rotation.y += deltaX * 0.005;
      this.cakeGroup.rotation.x += deltaY * 0.005;
      this.cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.65, this.cakeGroup.rotation.x));

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Click anywhere on canvas / candles to blow
    canvas.addEventListener("click", () => {
      if (!this.isBlown) {
        this.blowCandles();
      }
    });

    // Window Resize
    window.addEventListener("resize", () => {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  checkHover(e) {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseCoords, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cakeGroup.children, true);

    if (intersects.length > 0) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "grab";
    }
  }

  triggerFloatingCandles() {
    const statusText = document.getElementById("cake-ceremony-status");
    const blowBtn = document.getElementById("btn-blow-candle");

    if (window.spawnFloatingCandles) {
      window.spawnFloatingCandles(25);
    }
    this.audio.playChime();

    if (statusText) {
      statusText.innerHTML = "Floating candles ascending into the night sky! <span class='text-amber-300 font-medium'>Now make a wish and blow out the birthday candles!</span>";
    }

    if (blowBtn) {
      blowBtn.classList.add("animate-pulse");
    }
  }

  blowCandles() {
    if (this.isBlown) return;
    this.isBlown = true;

    const blowBtn = document.getElementById("btn-blow-candle");
    const statusText = document.getElementById("cake-ceremony-status");

    // Audio: start music and blow sound synchronously inside direct user gesture!
    this.audio.playWindBlow();
    this.audio.playBirthday();
    setTimeout(() => this.audio.playChime(), 350);

    // Animate all 7 flames scaling down to zero simultaneously
    let shrink = 1.0;
    const shrinkInterval = setInterval(() => {
      shrink -= 0.07;
      if (shrink > 0) {
        this.candles.forEach((c) => {
          c.flameMesh.scale.set(shrink, shrink, shrink);
          c.halo.scale.set(shrink, shrink, shrink);
        });
        if (this.centralLight) {
          this.centralLight.intensity = Math.max(0.1, shrink * 2.8);
        }
      } else {
        clearInterval(shrinkInterval);
        this.candles.forEach((c) => {
          c.flameMesh.visible = false;
          c.halo.visible = false;
        });
        if (this.centralLight) this.centralLight.intensity = 0.12;

        // Spawn delicate smoke puffs from all 7 candle wicks
        this.spawnMultiSmokePuffs();

        // Start continuous background Happy Birthday grand piano track!
        this.audio.playBirthday();

        // Trigger celebratory stardust bursts
        if (window.triggerGoldenBurst) {
          window.triggerGoldenBurst();
          setTimeout(() => window.triggerGoldenBurst(), 300);
        }

        // Also trigger floating candles rising into sky if not already released!
        if (window.spawnFloatingCandles) {
          window.spawnFloatingCandles(21);
        }

        if (statusText) {
          statusText.innerHTML = "Twenty-one blessings sealed for <span class='text-amber-400 font-medium gold-shimmer'>Irnum</span>. Happy Birthday!";
        }

        if (blowBtn) {
          blowBtn.classList.remove("animate-pulse");
          blowBtn.textContent = "Candles Blown · Wishes Sealed";
          blowBtn.classList.add("opacity-60", "pointer-events-none");
        }
      }
    }, 16);
  }

  spawnMultiSmokePuffs() {
    const THREE = this.THREE;
    this.candles.forEach((c) => {
      for (let i = 0; i < 6; i++) {
        const smokeGeo = new THREE.SphereGeometry(0.03 + Math.random() * 0.025, 8, 8);
        const smokeMat = new THREE.MeshBasicMaterial({
          color: 0xd8d8d8,
          transparent: true,
          opacity: 0.65
        });
        const puff = new THREE.Mesh(smokeGeo, smokeMat);
        puff.position.set(
          c.worldX + (Math.random() - 0.5) * 0.08,
          c.wickY + Math.random() * 0.08,
          c.worldZ + (Math.random() - 0.5) * 0.08
        );
        this.cakeGroup.add(puff);
        this.smokeParticles.push({
          mesh: puff,
          velY: 0.018 + Math.random() * 0.016,
          velX: (Math.random() - 0.5) * 0.007,
          velZ: (Math.random() - 0.5) * 0.007,
          life: 1.0
        });
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = performance.now() * 0.001;

    // 1. Dynamic Flame Flickering across all 7 candles
    if (!this.isBlown) {
      this.candles.forEach((c) => {
        const flicker = 1.0 + Math.sin(t * 14 + c.phaseOffset) * 0.09 + Math.cos(t * 22 + c.phaseOffset) * 0.06;
        c.flameMesh.scale.set(flicker, flicker * 1.04, flicker);
        c.halo.scale.set(flicker, flicker, flicker);
      });

      if (this.centralLight) {
        this.centralLight.intensity = 2.8 + Math.sin(t * 16) * 0.35 + Math.cos(t * 26) * 0.2;
      }
    }

    // 2. Smoke Particles drift & fade
    for (let i = 0; i < this.smokeParticles.length; i++) {
      const s = this.smokeParticles[i];
      s.mesh.position.y += s.velY;
      s.mesh.position.x += s.velX;
      s.mesh.position.z += s.velZ;
      s.mesh.scale.multiplyScalar(1.02);
      s.life -= 0.016;
      s.mesh.material.opacity = Math.max(0, s.life * 0.65);

      if (s.life <= 0) {
        this.cakeGroup.remove(s.mesh);
        this.smokeParticles.splice(i, 1);
        i--;
      }
    }

    // 3. Smooth Idle Turntable Orbit
    if (this.autoRotate && !this.isDragging) {
      this.cakeGroup.rotation.y += 0.0022;
    }

    // Damped inertia
    if (!this.isDragging) {
      this.rotationVelocity.x *= 0.92;
      this.rotationVelocity.y *= 0.92;
      this.cakeGroup.rotation.y += this.rotationVelocity.y;
      this.cakeGroup.rotation.x += this.rotationVelocity.x;
      this.cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.65, this.cakeGroup.rotation.x));
    }

    this.renderer.render(this.scene, this.camera);
  }
}
