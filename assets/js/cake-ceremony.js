/**
 * Interactive Luxury Cake Cutting & Floating Sky Lanterns Ceremony
 * Dedicated to Irnum. Strictly zero emojis.
 */

export class CakeCeremony {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.isBlown = false;
    this.isCut = false;
    this.lanterns = [];
    this.lanternCanvas = document.getElementById("lantern-canvas");
    this.lCtx = this.lanternCanvas ? this.lanternCanvas.getContext("2d") : null;
    
    this.init();
  }

  init() {
    this.bindEvents();
    if (this.lanternCanvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.animateLanterns();
    }
  }

  resizeCanvas() {
    if (!this.lanternCanvas) return;
    this.lanternCanvas.width = this.lanternCanvas.parentElement.clientWidth;
    this.lanternCanvas.height = this.lanternCanvas.parentElement.clientHeight;
  }

  bindEvents() {
    const blowBtn = document.getElementById("btn-blow-candle");
    const cutBtn = document.getElementById("btn-cut-cake");
    const candleFlame = document.getElementById("cake-candle-flame");

    if (blowBtn) {
      blowBtn.addEventListener("click", () => this.blowCandle());
    }
    if (candleFlame) {
      candleFlame.addEventListener("click", () => this.blowCandle());
    }
    if (cutBtn) {
      cutBtn.addEventListener("click", () => this.cutCake());
    }
  }

  blowCandle() {
    if (this.isBlown) return;
    this.isBlown = true;

    const flame = document.getElementById("cake-candle-flame");
    const smoke = document.getElementById("cake-candle-smoke");
    const statusText = document.getElementById("cake-ceremony-status");
    const blowBtn = document.getElementById("btn-blow-candle");
    const cutBtn = document.getElementById("btn-cut-cake");

    if (flame) {
      flame.classList.add("opacity-0", "scale-50");
      setTimeout(() => flame.classList.add("hidden"), 300);
    }

    if (smoke) {
      smoke.classList.remove("hidden");
      smoke.classList.add("animate-smoke");
    }

    this.audio.playWindBlow();
    setTimeout(() => this.audio.playChime(), 300);

    // Release 21 Floating Sky Lanterns
    this.spawnLanterns(21);

    if (statusText) {
      statusText.innerHTML = "A wish whispered to the heavens. <span class='text-amber-300 font-medium'>Proceed to cut the cake.</span>";
    }

    if (blowBtn) {
      blowBtn.classList.add("opacity-40", "pointer-events-none");
    }
    if (cutBtn) {
      cutBtn.classList.remove("opacity-40", "pointer-events-none");
      cutBtn.classList.add("animate-pulse");
    }
  }

  cutCake() {
    if (this.isCut) return;
    this.isCut = true;

    const knife = document.getElementById("cake-knife-graphic");
    const sliceGap = document.getElementById("cake-slice-cut");
    const statusText = document.getElementById("cake-ceremony-status");
    const cutBtn = document.getElementById("btn-cut-cake");

    // Animate knife descending
    if (knife) {
      knife.classList.remove("hidden");
      knife.classList.add("animate-knife-cut");
    }

    setTimeout(() => {
      if (sliceGap) {
        sliceGap.classList.remove("opacity-0");
        sliceGap.classList.add("opacity-100", "scale-x-110");
      }

      this.audio.playChime();
      this.audio.play(); // Auto-start the Happy Birthday acoustic piano song!

      if (window.triggerGoldenBurst) {
        window.triggerGoldenBurst();
        setTimeout(() => window.triggerGoldenBurst(), 400);
      }

      if (statusText) {
        statusText.innerHTML = "Cake Cut in Honor of <span class='text-amber-400 font-medium gold-shimmer'>Irnum</span>. Happy Birthday!";
      }

      if (cutBtn) {
        cutBtn.classList.remove("animate-pulse");
        cutBtn.textContent = "Ceremony Completed";
        cutBtn.classList.add("opacity-60", "pointer-events-none");
      }
    }, 700);
  }

  spawnLanterns(count = 21) {
    if (!this.lanternCanvas) return;
    const w = this.lanternCanvas.width;
    const h = this.lanternCanvas.height;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.lanterns.push({
          x: w * 0.2 + Math.random() * (w * 0.6),
          y: h + 30,
          size: Math.random() * 12 + 16,
          speedY: Math.random() * 1.2 + 0.8,
          swaySpeed: Math.random() * 0.03 + 0.015,
          swayAmount: Math.random() * 20 + 10,
          phase: Math.random() * Math.PI * 2,
          alpha: 0,
          maxAlpha: Math.random() * 0.6 + 0.4
        });
      }, i * 180);
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

      if (l.y > this.lanternCanvas.height * 0.8) {
        l.alpha = Math.min(l.maxAlpha, l.alpha + 0.02);
      } else if (l.y < 80) {
        l.alpha = Math.max(0, l.alpha - 0.01);
      }

      if (l.y < -50 || l.alpha <= 0) {
        this.lanterns.splice(i, 1);
        i--;
        continue;
      }

      // Draw glowing paper sky lantern
      const ctx = this.lCtx;
      ctx.save();
      ctx.globalAlpha = l.alpha;

      // Outer glow
      const grad = ctx.createRadialGradient(curX, l.y, 2, curX, l.y, l.size * 2);
      grad.addColorStop(0, "rgba(255, 200, 100, 0.8)");
      grad.addColorStop(0.4, "rgba(212, 175, 55, 0.3)");
      grad.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(curX, l.y, l.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body (trapezoid-like paper lantern)
      ctx.fillStyle = "rgba(255, 235, 180, 0.9)";
      ctx.beginPath();
      const halfW = l.size * 0.6;
      const hH = l.size * 0.8;
      ctx.moveTo(curX - halfW * 0.8, l.y - hH);
      ctx.lineTo(curX + halfW * 0.8, l.y - hH);
      ctx.lineTo(curX + halfW, l.y + hH * 0.7);
      ctx.lineTo(curX - halfW, l.y + hH * 0.7);
      ctx.closePath();
      ctx.fill();

      // Golden base rim
      ctx.fillStyle = "rgba(180, 120, 30, 0.9)";
      ctx.fillRect(curX - halfW * 0.6, l.y + hH * 0.7, halfW * 1.2, 2.5);

      ctx.restore();
    }

    requestAnimationFrame(() => this.animateLanterns());
  }
}
