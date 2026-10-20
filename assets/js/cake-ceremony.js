/**
 * High-End 3D Cake Ceremony & Floating Candles Engine
 * Bridges Three.js WebGL 3D Cake with Floating Candles Canvas and Mustafa Fireworks.
 * Background Happy Birthday song plays continuously without interruption.
 * Strictly zero emojis.
 */

import { ThreeCakeCeremony } from "./three-cake.js?v=20261020_4";

export class CakeCeremony {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.candles = [];
    this.fireworkParticles = [];
    
    this.candleCanvas = document.getElementById("lantern-canvas");
    this.cCtx = this.candleCanvas ? this.candleCanvas.getContext("2d") : null;
    
    this.fwCanvas = document.getElementById("fireworks-canvas");
    this.fwCtx = this.fwCanvas ? this.fwCanvas.getContext("2d") : null;

    this.init();
  }

  init() {
    // Expose floating candles globally
    window.spawnFloatingCandles = (count) => this.spawnFloatingCandles(count);
    window.spawnSkyLanterns = (count) => this.spawnFloatingCandles(count);

    // Initialize the Three.js WebGL 3D Cake (full seamless cake, no cuts, transparent background)
    this.threeCake = new ThreeCakeCeremony("three-cake-container", this.audio);

    this.bindEvents();

    if (this.candleCanvas) {
      this.resizeCandleCanvas();
      window.addEventListener("resize", () => this.resizeCandleCanvas());
      this.animateFloatingCandles();
    }
    if (this.fwCanvas) {
      this.resizeFwCanvas();
      window.addEventListener("resize", () => this.resizeFwCanvas());
      this.animateFireworks();
    }
  }

  resizeCandleCanvas() {
    if (!this.candleCanvas) return;
    this.candleCanvas.width = this.candleCanvas.parentElement.clientWidth;
    this.candleCanvas.height = this.candleCanvas.parentElement.clientHeight;
  }

  resizeFwCanvas() {
    if (!this.fwCanvas) return;
    this.fwCanvas.width = this.fwCanvas.parentElement.clientWidth;
    this.fwCanvas.height = this.fwCanvas.parentElement.clientHeight;
  }

  bindEvents() {
    // Partner Verification Form (Mustafa)
    const partnerForm = document.getElementById("partner-verify-form");
    const partnerInput = document.getElementById("partner-name-input");
    const partnerError = document.getElementById("partner-verify-error");
    const partnerSuccess = document.getElementById("partner-celebration-card");

    if (partnerForm && partnerInput) {
      partnerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredName = partnerInput.value.trim().toLowerCase();

        if (enteredName === "mustafa") {
          if (partnerError) partnerError.classList.add("hidden");
          partnerForm.classList.add("hidden");
          if (partnerSuccess) {
            partnerSuccess.classList.remove("hidden");
            partnerSuccess.classList.add("animate-unfold");
          }

          // Trigger massive firework explosion (pataka phatega)
          this.launchGrandFireworks();
          this.audio.playFireworkBoom();
          
          // Keep background Happy Birthday song playing continuously!
          this.audio.playBirthday();

          if (window.triggerGoldenBurst) {
            window.triggerGoldenBurst();
            setTimeout(() => window.triggerGoldenBurst(), 350);
          }
        } else {
          if (partnerError) {
            partnerError.classList.remove("hidden");
            partnerError.textContent = "You have chosen an incorrect partner name. Please try again.";
          }
          partnerInput.classList.add("border-red-500");
          setTimeout(() => partnerInput.classList.remove("border-red-500"), 1000);
        }
      });
    }
  }

  // Spawns floating taper candles ascending from below the screen
  spawnFloatingCandles(count = 25) {
    if (!this.candleCanvas) return;
    const w = this.candleCanvas.width;
    const h = this.candleCanvas.height;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.candles.push({
          x: w * 0.1 + Math.random() * (w * 0.8),
          y: h + 50,
          size: Math.random() * 8 + 24, // Candle length scale
          speedY: Math.random() * 1.1 + 0.85,
          swaySpeed: Math.random() * 0.025 + 0.012,
          swayAmount: Math.random() * 20 + 10,
          phase: Math.random() * Math.PI * 2,
          alpha: 0,
          maxAlpha: Math.random() * 0.65 + 0.35
        });
      }, i * 140);
    }
  }

  animateFloatingCandles() {
    if (!this.cCtx || !this.candleCanvas) return;
    this.cCtx.clearRect(0, 0, this.candleCanvas.width, this.candleCanvas.height);

    for (let i = 0; i < this.candles.length; i++) {
      const c = this.candles[i];
      c.y -= c.speedY;
      c.phase += c.swaySpeed;
      const curX = c.x + Math.sin(c.phase) * c.swayAmount;

      // Fade in as it leaves the bottom edge
      if (c.y > this.candleCanvas.height * 0.85) {
        c.alpha = Math.min(c.maxAlpha, c.alpha + 0.02);
      } else if (c.y < 90) {
        c.alpha = Math.max(0, c.alpha - 0.015);
      }

      if (c.y < -60 || c.alpha <= 0) {
        this.candles.splice(i, 1);
        i--;
        continue;
      }

      const ctx = this.cCtx;
      ctx.save();
      ctx.globalAlpha = c.alpha;

      const candleWidth = c.size * 0.28;
      const candleHeight = c.size * 1.1;

      // 1. Outer Radial Warm Halo around the Flame
      const glowGrad = ctx.createRadialGradient(
        curX, c.y - candleHeight / 2 - 8, 2,
        curX, c.y - candleHeight / 2 - 8, c.size * 1.7
      );
      glowGrad.addColorStop(0, "rgba(255, 235, 150, 0.95)");
      glowGrad.addColorStop(0.3, "rgba(245, 175, 55, 0.45)");
      glowGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.15)");
      glowGrad.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(curX, c.y - candleHeight / 2 - 8, c.size * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ivory Wax Cylinder Body
      const waxGrad = ctx.createLinearGradient(curX - candleWidth / 2, c.y, curX + candleWidth / 2, c.y);
      waxGrad.addColorStop(0, "#e8e0ce");
      waxGrad.addColorStop(0.4, "#fffef9");
      waxGrad.addColorStop(1, "#dcd2be");
      ctx.fillStyle = waxGrad;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(curX - candleWidth / 2, c.y - candleHeight / 2, candleWidth, candleHeight, 3);
      } else {
        ctx.rect(curX - candleWidth / 2, c.y - candleHeight / 2, candleWidth, candleHeight);
      }
      ctx.fill();

      // Gold spiral trim line on candle wax
      ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(curX - candleWidth / 2, c.y - candleHeight / 6);
      ctx.lineTo(curX + candleWidth / 2, c.y - candleHeight / 6 + 3);
      ctx.stroke();

      // 3. Dark Wick
      ctx.fillStyle = "#111111";
      ctx.fillRect(curX - 0.75, c.y - candleHeight / 2 - 4, 1.5, 4);

      // 4. Luminous Teardrop Flame
      const flameGrad = ctx.createLinearGradient(
        curX, c.y - candleHeight / 2 - 13,
        curX, c.y - candleHeight / 2 - 4
      );
      flameGrad.addColorStop(0, "#fff5cc");
      flameGrad.addColorStop(0.4, "#f5a623");
      flameGrad.addColorStop(1, "#d0021b");
      ctx.fillStyle = flameGrad;

      ctx.beginPath();
      ctx.moveTo(curX, c.y - candleHeight / 2 - 13);
      ctx.quadraticCurveTo(curX + 3.5, c.y - candleHeight / 2 - 7, curX, c.y - candleHeight / 2 - 4);
      ctx.quadraticCurveTo(curX - 3.5, c.y - candleHeight / 2 - 7, curX, c.y - candleHeight / 2 - 13);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(() => this.animateFloatingCandles());
  }

  // Grand Fireworks Simulation (Pataka Explosion)
  launchGrandFireworks() {
    if (!this.fwCanvas) return;
    const w = this.fwCanvas.width;
    const h = this.fwCanvas.height;

    const colors = [
      "255, 215, 0",   // Gold
      "255, 240, 200", // Champagne
      "239, 68, 68",   // Crimson
      "16, 185, 129",  // Emerald
      "245, 158, 11"   // Amber
    ];

    for (let r = 0; r < 6; r++) {
      setTimeout(() => {
        const targetX = w * 0.2 + Math.random() * (w * 0.6);
        const targetY = h * 0.15 + Math.random() * (h * 0.35);
        this.explodeRocket(targetX, targetY, colors[r % colors.length]);
      }, r * 240);
    }
  }

  explodeRocket(x, y, color) {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7.5 + 2.5;
      this.fireworkParticles.push({
        x: x,
        y: y,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012,
        color: color
      });
    }
  }

  animateFireworks() {
    if (!this.fwCtx || !this.fwCanvas) return;
    this.fwCtx.clearRect(0, 0, this.fwCanvas.width, this.fwCanvas.height);

    for (let i = 0; i < this.fireworkParticles.length; i++) {
      const p = this.fireworkParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedX *= 0.97;
      p.speedY = p.speedY * 0.97 + 0.08;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.fireworkParticles.splice(i, 1);
        i--;
        continue;
      }

      this.fwCtx.beginPath();
      this.fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.fwCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.fwCtx.shadowBlur = 8;
      this.fwCtx.shadowColor = `rgba(${p.color}, 0.9)`;
      this.fwCtx.fill();
    }

    requestAnimationFrame(() => this.animateFireworks());
  }
}
