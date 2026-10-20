/**
 * Audio Engine with Dedicated Continuous Birthday Track
 * Plus Web Audio tactile and explosive firework sound effects.
 * Congratulations audio removed per user request so Birthday track never stops.
 */

export class AmbientAudioEngine {
  constructor() {
    this.birthdayAudio = new Audio("assets/audio/happy-birthday-instrumental.mp3");
    this.birthdayAudio.loop = true;
    this.birthdayAudio.volume = 0.65;

    this.isPlaying = false;
    this.ctx = null;
  }

  initCtx() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  toggleBirthday() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();

    if (this.isPlaying) {
      this.pauseBirthday();
    } else {
      this.playBirthday();
    }
    return this.isPlaying;
  }

  playBirthday() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();

    this.birthdayAudio.play().then(() => {
      this.isPlaying = true;
    }).catch((err) => {
      console.warn("Audio play prevented:", err);
    });
  }

  pauseBirthday() {
    this.birthdayAudio.pause();
    this.isPlaying = false;
  }

  playKnifeCut() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playFireworkBoom() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Rocket whistle
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = "sine";
    whistle.frequency.setValueAtTime(450, now);
    whistle.frequency.exponentialRampToValueAtTime(1200, now + 0.28);
    whistleGain.gain.setValueAtTime(0.04, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistle.start(now);
    whistle.stop(now + 0.32);

    // 2. Heavy explosion
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = "triangle";
      boom.frequency.setValueAtTime(120, t);
      boom.frequency.exponentialRampToValueAtTime(35, t + 0.9);

      boomGain.gain.setValueAtTime(0.3, t);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(t);
      boom.stop(t + 1.3);

      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!this.ctx) return;
          const ct = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(1800 + Math.random() * 800, ct);
          g.gain.setValueAtTime(0.04, ct);
          g.gain.exponentialRampToValueAtTime(0.0001, ct + 0.08);
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.start(ct);
          osc.stop(ct + 0.1);
        }, 120 + i * 90);
      }
    }, 280);
  }

  playClick() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playChime() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.07);

      gain.gain.setValueAtTime(0.04, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 1.0);
    });
  }

  playWindBlow() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}
