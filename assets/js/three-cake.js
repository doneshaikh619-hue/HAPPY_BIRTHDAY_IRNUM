/**
 * High-Luxury Three.js WebGL 3D Birthday Cake Ceremony
 * Photorealistic PBR chocolate mirror glaze, procedural layered sponge cross-section,
 * dynamic flickering candle flame with PointLight, Damascus steel chef knife,
 * realistic cutting animation with physical wedge slice extraction onto porcelain plate,
 * and mouse drag orbit controls.
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
    this.isCut = false;
    this.isCutting = false;
    this.smokeParticles = [];

    // Drag Orbit State
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0 };
    this.targetRotation = { x: 0.15, y: -0.3 };
    this.autoRotate = true;

    this.initScene();
    this.createMaterials();
    this.createStand();
    this.createCake();
    this.createDecorations();
    this.createCandle();
    this.createKnife();
    this.setupLighting();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    const THREE = this.THREE;
    this.width = this.container.clientWidth || 640;
    this.height = this.container.clientHeight || 520;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 4.6, 11.2);
    this.camera.lookAt(0, 0.6, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // Root group for all 3D cake ceremony objects
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.rotation.x = this.targetRotation.x;
    this.cakeGroup.rotation.y = this.targetRotation.y;
    this.scene.add(this.cakeGroup);

    // Raycaster for click/hover
    this.raycaster = new THREE.Raycaster();
    this.mouseCoords = new THREE.Vector2();
  }

  createMaterials() {
    const THREE = this.THREE;

    // 1. Procedural Layered Cake Sponge Texture for cut faces
    this.spongeTexture = this.generateLayeredSpongeTexture();

    // 2. Interior Sponge Cut Material
    this.spongeInteriorMat = new THREE.MeshStandardMaterial({
      map: this.spongeTexture,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // 3. Valrhona Dark Chocolate Mirror Glaze (High Gloss Physical Clearcoat)
    this.chocolateGlazeMat = new THREE.MeshPhysicalMaterial({
      color: 0x180d07,
      roughness: 0.14,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95
    });

    // 4. Creamy Ivory Vanilla Frosting (Base Tier Accent & Piping)
    this.vanillaCreamMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdf7eb,
      roughness: 0.35,
      metalness: 0.04,
      clearcoat: 0.4
    });

    // 5. 24k Polished Gold Accents (Trim, Pearls, Plaque)
    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xe5b838,
      roughness: 0.18,
      metalness: 0.92
    });

    // 6. Carrara White Marble for Pedestal
    this.marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f7,
      roughness: 0.28,
      metalness: 0.08
    });

    // 7. Polished White Porcelain for Dessert Serving Plate
    this.porcelainMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 0.85
    });

    // 8. Ruby Raspberry Toppings
    this.berryMat = new THREE.MeshPhysicalMaterial({
      color: 0x7a0c1e,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.92,
      clearcoatRoughness: 0.08
    });

    // 9. Damascus Polished Steel Blade
    this.bladeMat = new THREE.MeshStandardMaterial({
      color: 0xedf2f7,
      roughness: 0.12,
      metalness: 0.96
    });

    // 10. Dark Walnut Wood for Knife Handle
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0x221108,
      roughness: 0.45,
      metalness: 0.05
    });
  }

  generateLayeredSpongeTexture() {
    const THREE = this.THREE;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Base background
    ctx.fillStyle = "#2c170b";
    ctx.fillRect(0, 0, 512, 512);

    // Layer 1: Dark chocolate mirror glaze on top (0 - 32px)
    const glazeGrad = ctx.createLinearGradient(0, 0, 0, 32);
    glazeGrad.addColorStop(0, "#100804");
    glazeGrad.addColorStop(1, "#221108");
    ctx.fillStyle = glazeGrad;
    ctx.fillRect(0, 0, 512, 32);

    // Gold leaf hairline
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(0, 32, 512, 4);

    // Layer 2: Chantilly Vanilla Cream (36 - 80px)
    ctx.fillStyle = "#fcf6ec";
    ctx.fillRect(0, 36, 512, 44);

    // Layer 3: Fluffy Golden Chiffon Sponge (80 - 210px)
    const spongeGrad = ctx.createLinearGradient(0, 80, 0, 210);
    spongeGrad.addColorStop(0, "#c6934c");
    spongeGrad.addColorStop(1, "#aa7734");
    ctx.fillStyle = spongeGrad;
    ctx.fillRect(0, 80, 512, 130);

    // Sponge crumb speckles
    for (let i = 0; i < 450; i++) {
      const sx = Math.random() * 512;
      const sy = 82 + Math.random() * 125;
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(60, 30, 10, 0.45)" : "rgba(255, 235, 180, 0.5)";
      ctx.fillRect(sx, sy, Math.random() * 2.5 + 1, Math.random() * 2 + 1);
    }

    // Layer 4: Ruby Raspberry Coulis Jelly (210 - 245px)
    const berryGrad = ctx.createLinearGradient(0, 210, 0, 245);
    berryGrad.addColorStop(0, "#800e22");
    berryGrad.addColorStop(0.5, "#a31830");
    berryGrad.addColorStop(1, "#660717");
    ctx.fillStyle = berryGrad;
    ctx.fillRect(0, 210, 512, 35);

    // Layer 5: Dark Belgian Fudge Ganache (245 - 380px)
    const fudgeGrad = ctx.createLinearGradient(0, 245, 0, 380);
    fudgeGrad.addColorStop(0, "#281409");
    fudgeGrad.addColorStop(1, "#1c0d06");
    ctx.fillStyle = fudgeGrad;
    ctx.fillRect(0, 245, 512, 135);

    for (let i = 0; i < 350; i++) {
      const fx = Math.random() * 512;
      const fy = 248 + Math.random() * 130;
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(10, 5, 2, 0.6)" : "rgba(140, 75, 35, 0.35)";
      ctx.fillRect(fx, fy, Math.random() * 2 + 1, Math.random() * 1.5 + 1);
    }

    // Layer 6: Mascarpone Cream (380 - 415px)
    ctx.fillStyle = "#f5ebd9";
    ctx.fillRect(0, 380, 512, 35);

    // Layer 7: Cocoa Hazelnut Biscuit Crust (415 - 512px)
    const crustGrad = ctx.createLinearGradient(0, 415, 0, 512);
    crustGrad.addColorStop(0, "#3a1e0f");
    crustGrad.addColorStop(1, "#1d0e07");
    ctx.fillStyle = crustGrad;
    ctx.fillRect(0, 415, 512, 97);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  generateMonogramTexture() {
    const THREE = this.THREE;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    // Luxury Black Gold Badge
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

    // Ambient Warm Fill
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.95);
    this.scene.add(ambientLight);

    // Key Studio Light (Casts soft directional shadow)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(7, 12, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Golden Specular Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.3);
    rimLight.position.set(-8, 7, -6);
    this.scene.add(rimLight);

    // Under-glow Soft Fill
    const underLight = new THREE.DirectionalLight(0x403020, 0.4);
    underLight.position.set(0, -5, 4);
    this.scene.add(underLight);

    // Dynamic Candle Point Light (Casts flickering warm glow across the chocolate glaze)
    this.candleLight = new THREE.PointLight(0xffaa33, 2.8, 14, 1.8);
    this.candleLight.position.set(0, 4.3, 0);
    this.candleLight.castShadow = true;
    this.candleLight.shadow.bias = -0.002;
    this.scene.add(this.candleLight);
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

    // --- BASE TIER (Bottom Layer) ---
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
    const creamSwirlCount = 24;
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

    // --- TOP TIER & THE CELEBRATORY SLICE ---
    // Top Tier Radius: 2.35, Height: 1.25
    // Slice Angle: 40 degrees (approx 0.70 radians)
    this.sliceAngle = (40 * Math.PI) / 180;
    const startAngle = -this.sliceAngle / 2;
    const endAngle = this.sliceAngle / 2;
    const topRadius = 2.35;
    const topHeight = 1.25;
    const topY = 1.85;

    // 1. MAIN CAKE BODY (Remainder of circle: from endAngle to 2*PI + startAngle)
    const mainBodyGeo = new THREE.CylinderGeometry(
      topRadius, topRadius, topHeight, 64, 1, false,
      endAngle, Math.PI * 2 - this.sliceAngle
    );
    this.topTierMain = new THREE.Mesh(mainBodyGeo, this.chocolateGlazeMat);
    this.topTierMain.position.y = topY;
    this.topTierMain.castShadow = true;
    this.topTierMain.receiveShadow = true;
    this.cakeGroup.add(this.topTierMain);

    // Solid Cut Radial Wall 1 for Main Cake Body (at endAngle)
    const cutWall1 = this.createCutWallPlane(topRadius, topHeight, endAngle);
    cutWall1.position.y = topY;
    this.cakeGroup.add(cutWall1);

    // Solid Cut Radial Wall 2 for Main Cake Body (at startAngle)
    const cutWall2 = this.createCutWallPlane(topRadius, topHeight, startAngle);
    cutWall2.position.y = topY;
    this.cakeGroup.add(cutWall2);

    // 2. THE CELEBRATORY WEDGE SLICE (Group so it can animate seamlessly)
    this.sliceGroup = new THREE.Group();
    this.sliceGroup.position.set(0, topY, 0);

    // Slice Curved Body & Top/Bottom Cap
    const sliceBodyGeo = new THREE.CylinderGeometry(
      topRadius, topRadius, topHeight, 32, 1, false,
      startAngle, this.sliceAngle
    );
    this.sliceBody = new THREE.Mesh(sliceBodyGeo, this.chocolateGlazeMat);
    this.sliceBody.castShadow = true;
    this.sliceGroup.add(this.sliceBody);

    // Slice Radial Cut Wall 1 (at startAngle)
    const sliceWall1 = this.createCutWallPlane(topRadius, topHeight, startAngle);
    this.sliceGroup.add(sliceWall1);

    // Slice Radial Cut Wall 2 (at endAngle)
    const sliceWall2 = this.createCutWallPlane(topRadius, topHeight, endAngle);
    this.sliceGroup.add(sliceWall2);

    // Slice Topping: Whipped Cream Rosette & Fresh Raspberry
    const sliceCream = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 16), this.vanillaCreamMat);
    sliceCream.position.set(1.5, topHeight / 2 + 0.14, 0);
    this.sliceGroup.add(sliceCream);

    const sliceBerry = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), this.berryMat);
    sliceBerry.position.set(1.5, topHeight / 2 + 0.32, 0);
    this.sliceGroup.add(sliceBerry);

    // Gold leaf flake on slice
    const sliceGold = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), this.goldMat);
    sliceGold.position.set(1.2, topHeight / 2 + 0.02, 0.15);
    this.sliceGroup.add(sliceGold);

    this.cakeGroup.add(this.sliceGroup);

    // 3. Gold-Rimmed Porcelain Dessert Plate (For the extracted slice)
    this.dessertPlate = new THREE.Group();
    this.dessertPlate.position.set(2.4, 0.55, 2.4);

    const plateBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 0.08, 48), this.porcelainMat);
    plateBase.receiveShadow = true;
    this.dessertPlate.add(plateBase);

    const plateRim = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.04, 16, 48), this.goldMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.y = 0.04;
    this.dessertPlate.add(plateRim);

    this.dessertPlate.visible = true;
    this.cakeGroup.add(this.dessertPlate);
  }

  createCutWallPlane(radius, height, angle) {
    const THREE = this.THREE;
    // Creates a vertical rectangular plane that seals the radial cut from center (0,0) to outer radius (R*cosA, R*sinA)
    const geom = new THREE.PlaneGeometry(radius, height);
    // Shift geometry so left edge sits at (0, 0)
    geom.translate(radius / 2, 0, 0);

    const mesh = new THREE.Mesh(geom, this.spongeInteriorMat);
    mesh.rotation.y = -angle;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  createDecorations() {
    const THREE = this.THREE;
    const topRadius = 2.35;
    const topY = 1.85 + 1.25 / 2;

    // Fresh Ruby Raspberries crowning the top tier (outside the slice sector)
    const berryCount = 8;
    this.topBerries = [];
    for (let i = 0; i < berryCount; i++) {
      const angle = (i / berryCount) * Math.PI * 2;
      // Skip the slice sector so berries don't sit on the cut boundary
      if (Math.abs(angle) < this.sliceAngle * 0.8) continue;

      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), this.berryMat);
      berry.position.set(Math.cos(angle) * (topRadius - 0.45), topY + 0.16, Math.sin(angle) * (topRadius - 0.45));
      berry.castShadow = true;
      this.cakeGroup.add(berry);
      this.topBerries.push(berry);

      // Gold leaf petal next to each berry
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.15), this.goldMat);
      leaf.position.set(Math.cos(angle) * (topRadius - 0.25), topY + 0.02, Math.sin(angle) * (topRadius - 0.25));
      leaf.rotation.y = angle;
      this.cakeGroup.add(leaf);
    }
  }

  createCandle() {
    const THREE = this.THREE;
    this.candleGroup = new THREE.Group();
    this.candleGroup.position.set(0, 2.5, 0);

    // Fluted Ivory Taper Candle Body
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8ef,
      roughness: 0.25,
      metalness: 0.1
    });
    const candleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 1.4, 32), candleMat);
    candleBody.position.y = 0.7;
    candleBody.castShadow = true;
    this.candleGroup.add(candleBody);

    // Gold Spiral Ribbon winding up the candle
    const ribbonMat = this.goldMat;
    const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.02, 16, 32), ribbonMat);
    ribbon.rotation.x = Math.PI / 2 + 0.3;
    ribbon.position.y = 0.5;
    this.candleGroup.add(ribbon);

    const ribbon2 = ribbon.clone();
    ribbon2.position.y = 0.9;
    this.candleGroup.add(ribbon2);

    // Candle Wick with Burnt Tip
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), wickMat);
    wick.position.y = 1.48;
    this.candleGroup.add(wick);

    // Glowing 3D Teardrop Flame (Primary inner cone)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.95
    });
    const flameGeo = new THREE.ConeGeometry(0.14, 0.45, 16);
    flameGeo.translate(0, 0.225, 0);
    this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.flameMesh.position.y = 1.55;
    this.candleGroup.add(this.flameMesh);

    // Outer Radiant Glow Halo
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.flameHalo = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), haloMat);
    this.flameHalo.position.y = 1.7;
    this.candleGroup.add(this.flameHalo);

    this.cakeGroup.add(this.candleGroup);
  }

  createKnife() {
    const THREE = this.THREE;
    this.knifeGroup = new THREE.Group();
    this.knifeGroup.position.set(3.8, 3.2, 1.2);
    this.knifeGroup.rotation.set(0.35, -0.65, -0.45);

    // Damascus Steel Blade
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.52, 3.4);
    const blade = new THREE.Mesh(bladeGeo, this.bladeMat);
    blade.position.z = -1.7;
    blade.castShadow = true;
    this.knifeGroup.add(blade);

    // Polished Brass Bolster
    const bolsterGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 16);
    const bolster = new THREE.Mesh(bolsterGeo, this.goldMat);
    bolster.rotation.x = Math.PI / 2;
    bolster.position.z = 0.08;
    this.knifeGroup.add(bolster);

    // Dark Rosewood Sculpted Handle
    const handleGeo = new THREE.CylinderGeometry(0.2, 0.16, 1.7, 16);
    const handle = new THREE.Mesh(handleGeo, this.woodMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 1.05;
    handle.castShadow = true;
    this.knifeGroup.add(handle);

    // Golden Handle Rivet Pins
    for (let i = 0; i < 3; i++) {
      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), this.goldMat);
      pin.position.set(0.18, 0, 0.5 + i * 0.45);
      this.knifeGroup.add(pin);
    }

    this.cakeGroup.add(this.knifeGroup);
  }

  bindEvents() {
    const blowBtn = document.getElementById("btn-blow-candle");
    const cutBtn = document.getElementById("btn-cut-cake");

    if (blowBtn) blowBtn.addEventListener("click", () => this.blowCandle());
    if (cutBtn) cutBtn.addEventListener("click", () => this.cutCake());

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

      // Constrain vertical tilt to keep cake upright
      this.cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.65, this.cakeGroup.rotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Support for Mobile
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

    // Click to blow or cut directly on 3D elements
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cakeGroup.children, true);

      if (intersects.length > 0) {
        if (!this.isBlown) {
          this.blowCandle();
        } else if (!this.isCut && !this.isCutting) {
          this.cutCake();
        }
      }
    });

    // Resize
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

  blowCandle() {
    if (this.isBlown) return;
    this.isBlown = true;

    const blowBtn = document.getElementById("btn-blow-candle");
    const cutBtn = document.getElementById("btn-cut-cake");
    const statusText = document.getElementById("cake-ceremony-status");

    this.audio.playWindBlow();
    setTimeout(() => this.audio.playChime(), 350);

    // Animate flame shrinking down to zero
    let shrink = 1;
    const shrinkInterval = setInterval(() => {
      shrink -= 0.08;
      if (shrink > 0) {
        if (this.flameMesh) this.flameMesh.scale.set(shrink, shrink, shrink);
        if (this.flameHalo) this.flameHalo.scale.set(shrink, shrink, shrink);
        if (this.candleLight) this.candleLight.intensity = Math.max(0.15, shrink * 2.8);
      } else {
        clearInterval(shrinkInterval);
        if (this.flameMesh) this.flameMesh.visible = false;
        if (this.flameHalo) this.flameHalo.visible = false;
        if (this.candleLight) this.candleLight.intensity = 0.15;
        this.spawnSmokePuff();
      }
    }, 16);

    // Launch 21 Sky Lanterns into the night sky
    if (window.spawnSkyLanterns) {
      window.spawnSkyLanterns(21);
    }

    if (statusText) {
      statusText.innerHTML = "Wishes released into the night sky. <span class='text-amber-300 font-medium'>Click knife or button to cut the cake!</span>";
    }

    if (blowBtn) blowBtn.classList.add("opacity-40", "pointer-events-none");
    if (cutBtn) {
      cutBtn.classList.remove("opacity-40", "pointer-events-none");
      cutBtn.classList.add("animate-pulse");
    }
  }

  spawnSmokePuff() {
    const THREE = this.THREE;
    for (let i = 0; i < 16; i++) {
      const smokeGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 8, 8);
      const smokeMat = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.6
      });
      const puff = new THREE.Mesh(smokeGeo, smokeMat);
      puff.position.set(
        (Math.random() - 0.5) * 0.1,
        3.95 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.1
      );
      this.cakeGroup.add(puff);
      this.smokeParticles.push({
        mesh: puff,
        velY: 0.02 + Math.random() * 0.015,
        velX: (Math.random() - 0.5) * 0.008,
        velZ: (Math.random() - 0.5) * 0.008,
        life: 1.0
      });
    }
  }

  cutCake() {
    if (this.isCut || this.isCutting) return;
    this.isCutting = true;
    this.autoRotate = false;

    const cutBtn = document.getElementById("btn-cut-cake");
    const statusText = document.getElementById("cake-ceremony-status");

    // Align cake rotation so the slice faces camera directly for maximum visual drama
    this.cakeGroup.rotation.x = 0.2;
    this.cakeGroup.rotation.y = 0;

    // Phase 1: Lift Knife up and align above the cake slice seam
    const startPos = this.knifeGroup.position.clone();
    const startRot = this.knifeGroup.rotation.clone();

    const hoverPos = new this.THREE.Vector3(1.2, 3.8, 0.4);
    const hoverRot = new this.THREE.Euler(0, 0.2, -0.1);

    let p1 = 0;
    const liftInterval = setInterval(() => {
      p1 += 0.04;
      if (p1 <= 1) {
        this.knifeGroup.position.lerpVectors(startPos, hoverPos, p1);
        this.knifeGroup.rotation.x = this.THREE.MathUtils.lerp(startRot.x, hoverRot.x, p1);
        this.knifeGroup.rotation.y = this.THREE.MathUtils.lerp(startRot.y, hoverRot.y, p1);
        this.knifeGroup.rotation.z = this.THREE.MathUtils.lerp(startRot.z, hoverRot.z, p1);
      } else {
        clearInterval(liftInterval);
        this.executeCutStroke();
      }
    }, 16);
  }

  executeCutStroke() {
    const cutBtn = document.getElementById("btn-cut-cake");
    const statusText = document.getElementById("cake-ceremony-status");

    // Phase 2: Knife slices smoothly DOWN through the cake
    this.audio.playKnifeCut();

    const topPos = this.knifeGroup.position.clone();
    const downPos = new this.THREE.Vector3(1.2, 1.45, 0.4);

    let p2 = 0;
    const cutInterval = setInterval(() => {
      p2 += 0.06;
      if (p2 <= 1) {
        this.knifeGroup.position.lerpVectors(topPos, downPos, p2);
      } else {
        clearInterval(cutInterval);

        // Sound & Particle Burst at the moment the cut finishes
        this.audio.playChime();
        if (window.triggerGoldenBurst) {
          window.triggerGoldenBurst();
          setTimeout(() => window.triggerGoldenBurst(), 300);
        }

        // Start continuous background Happy Birthday grand piano song!
        this.audio.playBirthday();

        // Phase 3: Knife retracts to rest beside the cake plate
        const retractPos = new this.THREE.Vector3(4.2, 0.8, 2.5);
        const retractRot = new this.THREE.Euler(0, -0.4, 0);
        this.knifeGroup.position.copy(retractPos);
        this.knifeGroup.rotation.copy(retractRot);

        // Phase 4: Celebratory Wedge Slice Slides Forward onto the Porcelain Plate!
        let extractProgress = 0;
        const targetSliceX = 2.4;
        const targetSliceZ = 2.4;
        const targetSliceY = 0.65; // On top of the dessert plate

        const sliceInterval = setInterval(() => {
          extractProgress += 0.035;
          if (extractProgress <= 1) {
            // Smooth ease-out curve
            const ease = 1 - Math.pow(1 - extractProgress, 3);
            this.sliceGroup.position.x = this.THREE.MathUtils.lerp(0, targetSliceX, ease);
            this.sliceGroup.position.z = this.THREE.MathUtils.lerp(0, targetSliceZ, ease);
            this.sliceGroup.position.y = this.THREE.MathUtils.lerp(1.85, targetSliceY, ease);
            this.sliceGroup.rotation.y = this.THREE.MathUtils.lerp(0, -0.3, ease);
          } else {
            clearInterval(sliceInterval);
            this.isCut = true;
            this.isCutting = false;
            this.autoRotate = true;

            if (statusText) {
              statusText.innerHTML = "Cake slice served for <span class='text-amber-400 font-medium gold-shimmer'>Irnum</span>. Happy Birthday!";
            }

            if (cutBtn) {
              cutBtn.classList.remove("animate-pulse");
              cutBtn.textContent = "Celebration Complete";
              cutBtn.classList.add("opacity-60", "pointer-events-none");
            }
          }
        }, 16);
      }
    }, 16);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = performance.now() * 0.001;

    // 1. Dynamic Candle Flame Flicker & Light Oscillation
    if (!this.isBlown && this.flameMesh) {
      const flicker = 1.0 + Math.sin(t * 14) * 0.09 + Math.cos(t * 23) * 0.06;
      this.flameMesh.scale.set(flicker, flicker * 1.04, flicker);
      if (this.flameHalo) {
        this.flameHalo.scale.set(flicker, flicker, flicker);
      }
      if (this.candleLight) {
        this.candleLight.intensity = 2.8 + Math.sin(t * 16) * 0.35 + Math.cos(t * 27) * 0.2;
      }
    }

    // 2. Smoke Particles drift & fade
    for (let i = 0; i < this.smokeParticles.length; i++) {
      const s = this.smokeParticles[i];
      s.mesh.position.y += s.velY;
      s.mesh.position.x += s.velX;
      s.mesh.position.z += s.velZ;
      s.mesh.scale.multiplyScalar(1.02);
      s.life -= 0.015;
      s.mesh.material.opacity = Math.max(0, s.life * 0.6);

      if (s.life <= 0) {
        this.cakeGroup.remove(s.mesh);
        this.smokeParticles.splice(i, 1);
        i--;
      }
    }

    // 3. Gentle Knife Hover Invitation before cut
    if (this.isBlown && !this.isCut && !this.isCutting && this.knifeGroup) {
      this.knifeGroup.position.y = 3.2 + Math.sin(t * 3.5) * 0.12;
    }

    // 4. Smooth Idle Turntable Orbit
    if (this.autoRotate && !this.isDragging) {
      this.cakeGroup.rotation.y += 0.0025;
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
