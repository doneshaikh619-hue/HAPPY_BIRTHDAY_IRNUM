/**
 * Date Lock & High-Precision Countdown Controller
 * Restricts access until October 21st, 2026.
 * Includes VIP / Creator Preview bypass with elegant unlock animation.
 */

// Target date: October 21, 2026 00:00:00 Local Time
export const TARGET_DATE = new Date(2026, 9, 21, 0, 0, 0); // Month is 0-indexed: 9 = October

export class Gatekeeper {
  constructor(options = {}) {
    this.targetDate = options.targetDate || TARGET_DATE;
    this.passcode = "2110"; // Default VIP pass
    this.storageKey = "irnum_tribute_unlocked";
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
    
    // Check if previously unlocked in this session or if date has passed
    const storedUnlock = sessionStorage.getItem(this.storageKey);
    const now = new Date();

    if (storedUnlock === "true" || now >= this.targetDate) {
      this.instantUnlock();
      return;
    }

    // Otherwise, start countdown and wire up lock interactions
    this.startCountdown();
    this.setupBypassControls();
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
      this.triggerUnlockAnimation(true);
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

  setupBypassControls() {
    const bypassBtn = document.getElementById("btn-vip-bypass");
    const bypassModal = document.getElementById("vip-passcode-modal");
    const closeBypassBtn = document.getElementById("btn-close-vip");
    const submitPassBtn = document.getElementById("btn-submit-passcode");
    const passInput = document.getElementById("vip-passcode-input");
    const passError = document.getElementById("vip-pass-error");
    const quickUnlockBtn = document.getElementById("btn-quick-preview");

    if (bypassBtn && bypassModal) {
      bypassBtn.addEventListener("click", () => {
        bypassModal.classList.remove("hidden");
        bypassModal.classList.add("flex");
        if (passInput) passInput.focus();
      });
    }

    if (closeBypassBtn && bypassModal) {
      closeBypassBtn.addEventListener("click", () => {
        bypassModal.classList.add("hidden");
        bypassModal.classList.remove("flex");
        if (passError) passError.classList.add("hidden");
      });
    }

    const attemptUnlock = (code) => {
      if (code === this.passcode || code === "admin" || code === "irnum") {
        sessionStorage.setItem(this.storageKey, "true");
        if (bypassModal) {
          bypassModal.classList.add("hidden");
          bypassModal.classList.remove("flex");
        }
        this.triggerUnlockAnimation(false);
      } else {
        if (passError) {
          passError.classList.remove("hidden");
          passError.textContent = "Invalid passcode. Hint: Use 2110 or click Quick Preview.";
        }
      }
    };

    if (submitPassBtn && passInput) {
      submitPassBtn.addEventListener("click", () => {
        attemptUnlock(passInput.value.trim());
      });
      passInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptUnlock(passInput.value.trim());
      });
    }

    if (quickUnlockBtn) {
      quickUnlockBtn.addEventListener("click", () => {
        attemptUnlock(this.passcode);
      });
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

  triggerUnlockAnimation(isAutomatic = false) {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    sessionStorage.setItem(this.storageKey, "true");

    const lockIcon = document.getElementById("lock-shackle");
    const unlockStatus = document.getElementById("unlock-status-badge");

    if (lockIcon) {
      lockIcon.classList.add("unlocked");
    }

    if (unlockStatus) {
      unlockStatus.textContent = isAutomatic ? "Time Reached · Portal Open" : "Passcode Verified · Welcome Irnum";
      unlockStatus.classList.add("text-emerald-400", "border-emerald-500/40");
    }

    // Trigger celebration stardust
    if (window.triggerGoldenBurst) {
      window.triggerGoldenBurst();
    }

    // Smooth cinematic dissolve
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
