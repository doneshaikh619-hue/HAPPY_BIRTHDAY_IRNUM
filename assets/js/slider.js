/**
 * 3D Coverflow Memoir Slider
 * Inspired by 21st.dev Coverflow Carousel patterns.
 * Supports drag, touch swipe, 3D perspective rotation, and depth-of-field.
 */

export class CoverflowSlider {
  constructor(containerId, items, onCardClick = () => {}) {
    this.container = document.getElementById(containerId);
    this.items = items;
    this.onCardClick = onCardClick;
    this.currentIndex = 0;
    this.startX = 0;
    this.isDragging = false;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.setupEvents();
    this.updateClasses();
  }

  render() {
    this.container.innerHTML = `
      <div class="relative w-full overflow-hidden py-10 px-4 select-none perspective-1200">
        <!-- Cards Track -->
        <div id="coverflow-track" class="relative h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center">
          ${this.items.map((item, index) => `
            <div class="coverflow-card absolute w-[260px] sm:w-[320px] md:w-[360px] h-[400px] sm:h-[460px] md:h-[510px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                 data-index="${index}" style="will-change: transform, opacity, filter;">
              <div class="relative w-full h-full bg-[#121217] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl group">
                <!-- Image -->
                <img src="assets/media/${item.file}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                
                <!-- Subtle Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                <!-- Gold Specular Sheen -->
                <div class="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10 pointer-events-none"></div>

                <!-- Chapter Tag -->
                <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono tracking-widest text-amber-200/90 uppercase">
                  Chapter ${item.chapter}
                </div>

                <!-- Content Info -->
                <div class="absolute bottom-0 inset-x-0 p-6 text-left">
                  <span class="text-[11px] font-mono tracking-[0.2em] text-amber-400 uppercase block mb-1">${item.subtitle}</span>
                  <h3 class="font-serif text-xl sm:text-2xl text-white font-medium tracking-wide mb-2">${item.title}</h3>
                  <p class="text-xs sm:text-sm text-neutral-300 font-light line-clamp-2 leading-relaxed">${item.caption}</p>
                  
                  <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-200/70 font-mono tracking-wider">
                    <span>TAP TO ENLARGE</span>
                    <svg class="w-4 h-4 stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Controls Bar -->
        <div class="flex items-center justify-between max-w-md mx-auto mt-6 px-4">
          <button id="cf-prev-btn" class="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-amber-200/80 hover:text-amber-300 transition-colors">
            <svg class="w-5 h-5 stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <!-- Counter & Indicators -->
          <div class="flex flex-col items-center gap-2">
            <span id="cf-counter" class="text-xs font-mono tracking-[0.25em] text-amber-300/80">01 / ${String(this.items.length).padStart(2, "0")}</span>
            <div id="cf-dots" class="flex gap-1.5">
              ${this.items.map((_, i) => `
                <button class="w-2 h-1 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-6' : 'bg-white/20'}" data-dot-index="${i}"></button>
              `).join("")}
            </div>
          </div>

          <button id="cf-next-btn" class="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-amber-200/80 hover:text-amber-300 transition-colors">
            <svg class="w-5 h-5 stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    `;

    this.cards = this.container.querySelectorAll(".coverflow-card");
    this.counter = this.container.querySelector("#cf-counter");
    this.dots = this.container.querySelectorAll("[data-dot-index]");
  }

  setupEvents() {
    const prevBtn = this.container.querySelector("#cf-prev-btn");
    const nextBtn = this.container.querySelector("#cf-next-btn");

    if (prevBtn) prevBtn.addEventListener("click", () => this.prev());
    if (nextBtn) nextBtn.addEventListener("click", () => this.next());

    this.dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => this.goTo(idx));
    });

    this.cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (this.currentIndex === index) {
          this.onCardClick(this.items[index], index);
        } else {
          this.goTo(index);
        }
      });
    });

    // Touch & Drag Support
    const track = this.container.querySelector("#coverflow-track");
    if (track) {
      track.addEventListener("touchstart", (e) => {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
      }, { passive: true });

      track.addEventListener("touchend", (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const diff = e.changedTouches[0].clientX - this.startX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) this.prev();
          else this.next();
        }
      });

      track.addEventListener("mousedown", (e) => {
        this.startX = e.clientX;
        this.isDragging = true;
      });

      window.addEventListener("mouseup", (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const diff = e.clientX - this.startX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) this.prev();
          else this.next();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateClasses();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateClasses();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updateClasses();
  }

  updateClasses() {
    const total = this.items.length;
    
    this.cards.forEach((card, idx) => {
      let offset = idx - this.currentIndex;

      // Wrap around logic for smooth infinite-like carousel
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOffset = Math.abs(offset);
      
      if (offset === 0) {
        // Active center card
        card.style.transform = `translateX(0px) translateZ(120px) rotateY(0deg) scale(1.08)`;
        card.style.opacity = "1";
        card.style.zIndex = "30";
        card.style.filter = "blur(0px) brightness(1.05)";
        card.style.boxShadow = "0 25px 60px -15px rgba(212, 175, 55, 0.25)";
        card.style.pointerEvents = "auto";
      } else if (absOffset <= 3) {
        // Visible side cards
        const sign = Math.sign(offset);
        const distance = 160 + (absOffset - 1) * 90;
        const rotate = sign * -32;
        const scale = 0.88 - (absOffset - 1) * 0.08;
        const opacity = 0.65 - (absOffset - 1) * 0.25;

        card.style.transform = `translateX(${sign * distance}px) translateZ(${-(absOffset * 80)}px) rotateY(${rotate}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(20 - absOffset);
        card.style.filter = "blur(1.5px) brightness(0.85)";
        card.style.boxShadow = "none";
        card.style.pointerEvents = "auto";
      } else {
        // Hidden distant cards
        card.style.transform = `translateX(${Math.sign(offset) * 450}px) translateZ(-300px) scale(0.6)`;
        card.style.opacity = "0";
        card.style.zIndex = "0";
        card.style.filter = "blur(4px)";
        card.style.pointerEvents = "none";
      }
    });

    if (this.counter) {
      this.counter.textContent = `${String(this.currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }

    if (this.dots) {
      this.dots.forEach((dot, i) => {
        if (i === this.currentIndex) {
          dot.className = "w-6 h-1 rounded-full bg-amber-400 transition-all duration-300";
        } else {
          dot.className = "w-2 h-1 rounded-full bg-white/20 transition-all duration-300";
        }
      });
    }
  }
}
