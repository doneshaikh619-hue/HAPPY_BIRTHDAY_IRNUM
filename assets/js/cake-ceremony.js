/**
 * High-End 3D Cake Ceremony & Partner Verification Engine
 * Bridges Three.js WebGL 3D Cake with Lantern Canvas and Fireworks.
 * Background Happy Birthday song plays continuously without interruption.
 */

import { ThreeCakeCeremony } from "./three-cake.js";

export class CakeCeremony {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.lanterns = [];
    this.fireworkParticles = [];
    
    this.lanternCanvas = document.getElementById("lantern-canvas");
    this.lCtx = this.lanternCanvas ? this.lanternCanvas.getContext("2d") : null;
    
    this.fwCanvas = document.getElementById("fireworks-canvas");
    this.fwCtx = this.fwCanvas ? this.fwCanvas.getContext("2d") : null;

    this.init();
  }

  init() {
    // Expose spawnSkyLanterns globally for Three.js cake to trigger on candle blow
    window.spawnSkyLanterns = (count) => this.spawnLanterns(count);

    // Initialize the Three.js WebGL 3D Cake
    this.threeCake = new ThreeCakeCeremony("three-cake-container", this.audio);

    this.bindEvents();

    if (this.lanternCanvas) {
      this.resizeLanternCanvas();
      window.addEventListener("resize", () => this.resizeLanternCanvas());
      this.animateLanterns();
    }
    if (this.fwCanvas) {
      this.resizeFwCanvas();
      window.addEventListener("resize", () => this.resizeFwCanvas());
      this.animateFireworks();
    }
  }

  resizeLanternCanvas() {
    if (!this.lanternCanvas) return;
    this.lanternCanvas.width = this.lanternCanvas.parentElement.clientWidth;
    this.lanternCanvas.height = this.lanternCanvas.parentElement.clientHeight;
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
            partnerError.textContent = "Companion name not recognized. Enter Mustafa";
          }
          partnerInput.classList.add("border-red-500");
          setTimeout(() => partnerInput.classList.remove("border-red-500"), 1000);
        }
      });
    }
  }

  spawnLanterns(count = 21) {
    if (!this.lanternCanvas) return;
    const w = this.lanternCanvas.width;
    const h = this.lanternCanvas.height;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.lanterns.push({
          x: w * 0.15 + Math.random() * (w * 0.7),
          y: h + 40,
          size: Math.random() * 14 + 18,
          speedY: Math.random() * 1.1 + 0.85,
          swaySpeed: Math.random() * 0.025 + 0.015,
          swayAmount: Math.random() * 22 + 12,
          phase: Math.random() * Math.PI * 2,
          alpha: 0,
          maxAlpha: Math.random() * 0.7 + 0.3
        });
      }, i * 160);
    }
  }

  animateLanterns() {
    if (!this.lCtx || !this.lanternCanvas) return;
    this.lCtx.clearRect(0, 0, this.lanternCanvas.width, this.lanternCanvas.height);

    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      l.y -= l.speedY;
      l.phase += l.swaySpeed;
      const curX = l.x + Math.sin(l.phase) * l.swayAmount;

      if (l.y > this.lanternCanvas.height * 0.85) {
        l.alpha = Math.min(l.maxAlpha, l.alpha + 0.02);
      } else if (l.y < 90) {
        l.alpha = Math.max(0, l.alpha - 0.012);
      }

      if (l.y < -60 || l.alpha <= 0) {
        this.lanterns.splice(i, 1);
        i--;
        continue;
      }

      const ctx = this.lCtx;
      ctx.save();
      ctx.globalAlpha = l.alpha;

      // Outer radial warm glow
      const grad = ctx.createRadialGradient(curX, l.y, 2, curX, l.y, l.size * 2.2);
      grad.addColorStop(0, "rgba(255, 210, 110, 0.9)");
      grad.addColorStop(0.35, "rgba(212, 175, 55, 0.35)");
      grad.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(curX, l.y, l.size * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 3D paper lantern cylinder body
      const w = l.size * 0.7;
      const h = l.size * 0.95;

      const bodyGrad = ctx.createLinearGradient(curX - w, l.y, curX + w, l.y);
      bodyGrad.addColorStop(0, "rgba(230, 160, 60, 0.8)");
      bodyGrad.addColorStop(0.5, "rgba(255, 245, 200, 0.95)");
      bodyGrad.addColorStop(1, "rgba(230, 160, 60, 0.8)");
      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.moveTo(curX - w * 0.8, l.y - h);
      ctx.lineTo(curX + w * 0.8, l.y - h);
      ctx.lineTo(curX + w, l.y + h * 0.7);
      ctx.lineTo(curX - w, l.y + h * 0.7);
      ctx.closePath();
      ctx.fill();

      // Inner flame ember
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(curX, l.y + h * 0.3, l.size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(() => this.animateLanterns());
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
