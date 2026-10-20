/**
 * Date Lock & High-Precision Countdown Controller
 * Strict time lock: Restricts access until 21 October 2026 at 00:00:00.
 * Automatically unlocks when the countdown reaches zero.
 * Strictly zero emojis.
 */

export const TARGET_DATE = new Date(2026, 9, 21, 0, 0, 0); // 21 October 2026 · 00:00:00 Local Time

export class Gatekeeper {
  constructor(options = {}) {
    this.targetDate = options.targetDate || TARGET_DATE;
    this.onUnlockCallback = options.onUnlock || (() => {});
    this.isUnlocked = false;
    this.timerInterval = null;
    
    this.init();
  }

  init() {
    this.lockOverlay = document.getElementById("lock-screen");
    this.mainExperience = document.getElementById("main-experience");
    this.daysEl = document.getElementById("cd-days");
    this.hoursEl = document.getElementById("cd-hours");
    this.minutesEl = document.getElementById("cd-minutes");
    this.secondsEl = document.getElementById("cd-seconds");
    
    const now = new Date();

    if (now >= this.targetDate) {
      this.instantUnlock();
      return;
    }

    this.startCountdown();
  }

  startCountdown() {
    this.updateClock();
    this.timerInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  updateClock() {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      clearInterval(this.timerInterval);
      this.triggerUnlockAnimation();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.updateDigit(this.daysEl, days);
    this.updateDigit(this.hoursEl, hours);
    this.updateDigit(this.minutesEl, minutes);
    this.updateDigit(this.secondsEl, seconds);
  }

  updateDigit(el, value) {
    if (!el) return;
    const formatted = String(value).padStart(2, "0");
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.add("digit-tick");
      setTimeout(() => el.classList.remove("digit-tick"), 300);
    }
  }

  instantUnlock() {
    this.isUnlocked = true;
    if (this.lockOverlay) {
      this.lockOverlay.style.display = "none";
    }
    if (this.mainExperience) {
      this.mainExperience.classList.remove("opacity-0", "pointer-events-none");
      this.mainExperience.classList.add("opacity-100");
    }
    document.body.classList.remove("overflow-hidden");
    this.onUnlockCallback();
  }

  triggerUnlockAnimation() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    const lockIcon = document.getElementById("lock-shackle");
    const unlockStatus = document.getElementById("unlock-status-badge");

    if (lockIcon) {
      lockIcon.classList.add("unlocked");
    }

    if (unlockStatus) {
      unlockStatus.textContent = "21 October Reached · Portal Open";
      unlockStatus.classList.add("text-emerald-400", "border-emerald-500/40");
    }

    if (window.triggerGoldenBurst) {
      window.triggerGoldenBurst();
    }

    setTimeout(() => {
      if (this.lockOverlay) {
        this.lockOverlay.classList.add("gate-dissolve");
        setTimeout(() => {
          this.lockOverlay.style.display = "none";
          document.body.classList.remove("overflow-hidden");
        }, 1200);
      }

      if (this.mainExperience) {
        this.mainExperience.classList.remove("opacity-0", "pointer-events-none");
        this.mainExperience.classList.add("opacity-100");
      }

      this.onUnlockCallback();
    }, 800);
  }
}
