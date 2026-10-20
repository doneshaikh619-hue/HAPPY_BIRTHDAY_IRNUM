/**
 * Main Application Orchestrator for Irnum's Birthday Tribute
 * High-performance, luxury animated experience.
 * Strictly zero emojis.
 */

import { MEDIA_COLLECTIONS, MEMOIR_TEXTS } from "./gallery-data.js";
import { Gatekeeper } from "./countdown.js";
import { AmbientAudioEngine } from "./audio.js";
import { CoverflowSlider } from "./slider.js";
import { init3DTilt } from "./tilt.js";

// Global Audio Engine Instance
const audioEngine = new AmbientAudioEngine();

// Stardust Canvas Particle System
class StardustGalaxy {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 75;
    this.mouse = { x: -1000, y: -1000, radius: 120 };

    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.6,
        baseX: Math.random() * this.width,
        baseY: Math.random() * this.height,
        density: Math.random() * 20 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? "212, 175, 55" : "245, 230, 200" // Gold and Champagne
      });
    }
  }

  burst(x, y) {
    const burstCount = 60;
    const originX = x || this.width / 2;
    const originY = y || this.height / 2;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: originX,
        y: originY,
        size: Math.random() * 3 + 1,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        color: "212, 175, 55",
        isBurst: true
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.isBurst) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedX *= 0.96;
        p.speedY *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          i--;
          continue;
        }
      } else {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        // Subtle mouse repulsion
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          p.x -= (dx / distance) * force * 3;
          p.y -= (dy / distance) * force * 3;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.shadowBlur = p.size * 3;
      this.ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Lightbox Modal Manager
class LightboxManager {
  constructor() {
    this.modal = document.getElementById("media-lightbox");
    this.imageEl = document.getElementById("lightbox-img");
    this.videoEl = document.getElementById("lightbox-video");
    this.titleEl = document.getElementById("lightbox-title");
    this.descEl = document.getElementById("lightbox-desc");
    this.counterEl = document.getElementById("lightbox-counter");
    this.closeBtn = document.getElementById("lightbox-close");
    this.prevBtn = document.getElementById("lightbox-prev");
    this.nextBtn = document.getElementById("lightbox-next");

    this.currentList = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.closeBtn.addEventListener("click", () => this.close());
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });

    window.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("hidden")) {
        if (e.key === "Escape") this.close();
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      }
    });
  }

  open(list, index) {
    this.currentList = list;
    this.currentIndex = index;
    this.updateContent();

    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    audioEngine.playClick();
  }

  close() {
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.src = "";
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.currentList.length) % this.currentList.length;
    this.updateContent();
    audioEngine.playClick();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.currentList.length;
    this.updateContent();
    audioEngine.playClick();
  }

  updateContent() {
    const item = this.currentList[this.currentIndex];
    if (!item) return;

    const isVideo = item.file.endsWith(".mp4") || item.type === "video";

    if (isVideo) {
      this.imageEl.classList.add("hidden");
      this.videoEl.classList.remove("hidden");
      this.videoEl.src = `assets/media/${item.file}`;
      this.videoEl.play().catch(() => {});
    } else {
      this.videoEl.classList.add("hidden");
      this.videoEl.pause();
      this.imageEl.classList.remove("hidden");
      this.imageEl.src = `assets/media/${item.file}`;
    }

    if (this.titleEl) this.titleEl.textContent = item.title || "Irnum — Archive Frame";
    if (this.descEl) this.descEl.textContent = item.caption || item.note || `Frame archive sequence #${this.currentIndex + 1}`;
    if (this.counterEl) {
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, "0")} / ${String(this.currentList.length).padStart(2, "0")}`;
    }
  }
}

// Main App Initialization
document.addEventListener("DOMContentLoaded", () => {
  const galaxy = new StardustGalaxy("stardust-canvas");
  window.triggerGoldenBurst = () => {
    galaxy.burst();
    audioEngine.playChime();
  };

  const lightbox = new LightboxManager();

  // Initialize Gatekeeper
  const gatekeeper = new Gatekeeper({
    onUnlock: () => {
      initExperience();
    }
  });

  // Setup Audio Button
  const audioBtn = document.getElementById("btn-ambient-audio");
  const audioWaves = document.getElementById("audio-equalizer");
  const audioStatusText = document.getElementById("audio-status-text");

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      const isPlaying = audioEngine.toggle();
      if (isPlaying) {
        audioWaves.classList.remove("opacity-30");
        audioWaves.classList.add("equalizer-active");
        if (audioStatusText) audioStatusText.textContent = "Ambience: Resonant";
      } else {
        audioWaves.classList.add("opacity-30");
        audioWaves.classList.remove("equalizer-active");
        if (audioStatusText) audioStatusText.textContent = "Ambience: Paused";
      }
    });
  }

  function initExperience() {
    renderPillars();
    renderCoverflowSlider();
    renderCinemaReels();
    renderBentoArchive();
    renderArchivalLetter();
    renderGuestbook();
    init3DTilt();
    setupSmoothScroll();
  }

  // 1. Pillars of Tribute
  function renderPillars() {
    const container = document.getElementById("pillars-container");
    if (!container) return;

    container.innerHTML = MEMOIR_TEXTS.pillars.map((p) => `
      <div class="tilt-card relative group p-8 rounded-2xl bg-[#0e0e13]/80 border border-white/[0.06] backdrop-blur-xl overflow-hidden hover:border-amber-500/30 transition-all duration-500">
        <div class="card-glare absolute inset-0 pointer-events-none opacity-0"></div>
        
        <div class="flex items-center justify-between mb-6">
          <span class="font-mono text-2xl font-light text-amber-400/90 tracking-widest">${p.num}</span>
          <div class="w-2 h-2 rounded-full bg-amber-400/60 group-hover:scale-150 transition-transform"></div>
        </div>

        <h3 class="font-serif text-2xl text-white font-medium mb-3 tracking-wide group-hover:text-amber-200 transition-colors">${p.title}</h3>
        <p class="text-sm text-neutral-300 font-light leading-relaxed">${p.desc}</p>

        <div class="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400">
          <span>PILLAR ${p.num}</span>
          <span>IRNUM'S CHARACTER</span>
        </div>
      </div>
    `).join("");
  }

  // 2. 3D Coverflow Memoir Slider
  function renderCoverflowSlider() {
    new CoverflowSlider("coverflow-wrapper", MEDIA_COLLECTIONS.showcaseCards, (item, idx) => {
      lightbox.open(MEDIA_COLLECTIONS.showcaseCards, idx);
    });
  }

  // 3. Cinema Video Reels
  function renderCinemaReels() {
    const container = document.getElementById("cinema-reels-grid");
    if (!container) return;

    container.innerHTML = MEDIA_COLLECTIONS.videoStories.map((reel, idx) => `
      <div class="tilt-card group relative h-[380px] rounded-2xl overflow-hidden bg-[#121217] border border-white/[0.08] hover:border-amber-500/40 cursor-pointer shadow-xl transition-all duration-500" data-reel-index="${idx}">
        <div class="card-glare absolute inset-0 pointer-events-none opacity-0 z-20"></div>

        <video src="assets/media/${reel.file}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loop muted playsinline preload="metadata"></video>
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-10"></div>

        <!-- Reel Tag -->
        <div class="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-amber-300/90 uppercase">
          ${reel.duration}
        </div>

        <!-- Play Glyph Button -->
        <div class="absolute inset-0 z-20 flex items-center justify-center">
          <div class="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-200 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-lg">
            <svg class="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>

        <!-- Meta -->
        <div class="absolute bottom-0 inset-x-0 p-5 z-20 text-left">
          <span class="text-[10px] font-mono tracking-[0.2em] text-amber-400 uppercase block mb-1">${reel.tag}</span>
          <h4 class="font-serif text-lg text-white font-medium mb-1">${reel.title}</h4>
          <p class="text-xs text-neutral-300 line-clamp-1 font-light">${reel.note}</p>
        </div>
      </div>
    `).join("");

    // Video hover play previews
    const videoCards = container.querySelectorAll("[data-reel-index]");
    videoCards.forEach((card) => {
      const video = card.querySelector("video");
      const idx = parseInt(card.dataset.reelIndex, 10);

      card.addEventListener("mouseenter", () => {
        if (video) video.play().catch(() => {});
      });

      card.addEventListener("mouseleave", () => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });

      card.addEventListener("click", () => {
        lightbox.open(MEDIA_COLLECTIONS.videoStories, idx);
      });
    });
  }

  // 4. Museum Bento Grid (All 41 Photos)
  function renderBentoArchive() {
    const grid = document.getElementById("bento-archive-grid");
    const filterBtns = document.querySelectorAll("[data-filter]");
    if (!grid) return;

    let activeFilter = "all";

    const populateGrid = (filter) => {
      const items = filter === "all" 
        ? MEDIA_COLLECTIONS.allPhotos 
        : MEDIA_COLLECTIONS.allPhotos.filter(p => p.category === filter);

      grid.innerHTML = items.map((photo, i) => {
        const isWide = (i % 7 === 0);
        const spanClass = isWide ? "sm:col-span-2 sm:row-span-2" : "col-span-1";

        return `
          <div class="tilt-card group relative ${spanClass} min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-[#121217] border border-white/[0.08] hover:border-amber-500/30 cursor-pointer shadow-lg transition-all duration-500" data-photo-index="${i}">
            <div class="card-glare absolute inset-0 pointer-events-none opacity-0 z-20"></div>
            
            <img src="assets/media/${photo.file}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            <div class="absolute bottom-0 inset-x-0 p-4 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-left">
              <span class="text-[9px] font-mono tracking-widest text-amber-400 uppercase block">${photo.tag} · ${photo.category}</span>
              <h5 class="font-serif text-sm sm:text-base text-white font-medium">${photo.title}</h5>
            </div>
          </div>
        `;
      }).join("");

      // Rebind click to lightbox
      const cards = grid.querySelectorAll("[data-photo-index]");
      cards.forEach((card, idx) => {
        card.addEventListener("click", () => {
          lightbox.open(items, idx);
        });
      });

      init3DTilt("#bento-archive-grid .tilt-card");
    };

    populateGrid(activeFilter);

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => {
          b.classList.remove("bg-amber-400", "text-black", "border-amber-400");
          b.classList.add("bg-white/[0.03]", "text-neutral-300", "border-white/10");
        });
        btn.classList.add("bg-amber-400", "text-black", "border-amber-400");
        btn.classList.remove("bg-white/[0.03]", "text-neutral-300", "border-white/10");

        activeFilter = btn.dataset.filter;
        populateGrid(activeFilter);
        audioEngine.playClick();
      });
    });
  }

  // 5. The Archival Letter with Wax Seal
  function renderArchivalLetter() {
    const sealBtn = document.getElementById("wax-seal-button");
    const letterBody = document.getElementById("archival-letter-body");
    const envelopeCover = document.getElementById("envelope-cover");
    const letterContainer = document.getElementById("letter-text-container");

    if (!sealBtn || !letterContainer) return;

    // Render paragraphs
    letterContainer.innerHTML = `
      <div class="space-y-6 text-neutral-200 font-light leading-relaxed text-sm sm:text-base tracking-wide font-sans">
        <p class="font-serif text-xl sm:text-2xl text-amber-200/90 italic font-normal">${MEMOIR_TEXTS.letter.recipient}</p>
        ${MEMOIR_TEXTS.letter.sections.map(sec => `<p class="indent-4">${sec}</p>`).join("")}
        <div class="pt-8 border-t border-amber-500/20 mt-8 flex flex-col items-end">
          <p class="font-mono text-xs tracking-widest text-amber-400/80 uppercase">${MEMOIR_TEXTS.letter.signoff}</p>
          <p class="font-serif text-2xl text-white italic tracking-wider mt-1">${MEMOIR_TEXTS.letter.signature}</p>
          <span class="font-mono text-[10px] text-neutral-400 mt-1">${MEMOIR_TEXTS.letter.date}</span>
        </div>
      </div>
    `;

    sealBtn.addEventListener("click", () => {
      audioEngine.playChime();
      window.triggerGoldenBurst();

      envelopeCover.classList.add("scale-95", "opacity-0", "pointer-events-none");
      setTimeout(() => {
        envelopeCover.style.display = "none";
        letterBody.classList.remove("hidden");
        letterBody.classList.add("block", "animate-unfold");
      }, 500);
    });
  }

  // 6. Guestbook / Memory Capsule
  function renderGuestbook() {
    const form = document.getElementById("guestbook-form");
    const inputName = document.getElementById("guestbook-name");
    const inputMsg = document.getElementById("guestbook-msg");
    const entriesList = document.getElementById("guestbook-entries");

    const STORAGE_KEY = "irnum_guestbook_notes";

    const loadNotes = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notes = [];
      if (stored) {
        try { notes = JSON.parse(stored); } catch (e) {}
      } else {
        notes = [
          {
            name: "Lifelong Admirer",
            date: "October 21, 2026",
            message: "Irnum, you represent the highest standard of loyalty and composure. Honored to celebrate your day."
          },
          {
            name: "A True Friend",
            date: "October 21, 2026",
            message: "May every path you step onto this year lead to brilliance and enduring peace."
          }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      }

      if (entriesList) {
        entriesList.innerHTML = notes.map(n => `
          <div class="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/20 transition-all text-left">
            <div class="flex items-center justify-between mb-2">
              <span class="font-serif text-amber-200 text-sm font-medium tracking-wide">${n.name}</span>
              <span class="font-mono text-[10px] text-neutral-400">${n.date}</span>
            </div>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">${n.message}</p>
          </div>
        `).join("");
      }
    };

    loadNotes();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = inputName.value.trim() || "Cherished Friend";
        const message = inputMsg.value.trim();

        if (!message) return;

        const stored = localStorage.getItem(STORAGE_KEY);
        let notes = [];
        try { notes = JSON.parse(stored) || []; } catch (err) {}

        const now = new Date();
        const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        notes.unshift({ name, message, date: dateStr });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

        inputMsg.value = "";
        loadNotes();
        audioEngine.playClick();
        window.triggerGoldenBurst();
      });
    }
  }

  // Smooth scroll anchors
  function setupSmoothScroll() {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          audioEngine.playClick();
        }
      });
    });
  }
});
