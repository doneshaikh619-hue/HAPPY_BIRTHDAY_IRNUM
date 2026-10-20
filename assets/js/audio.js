/**
 * Audio Engine with Dedicated Birthday and Celebration Tracks
 * Plus Web Audio tactile and explosive firework sound effects.
 */

export class AmbientAudioEngine {
  constructor() {
    this.birthdayAudio = new Audio("assets/audio/happy-birthday-instrumental.mp3");
    this.birthdayAudio.loop = true;
    this.birthdayAudio.volume = 0.6;

    this.congratsAudio = new Audio("assets/audio/congratulations-celebration.mp3");
    this.congratsAudio.loop = false;
    this.congratsAudio.volume = 0.7;

    this.currentTrack = null;
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

    if (this.isPlaying && this.currentTrack === "birthday") {
      this.pauseAll();
    } else {
      this.playBirthday();
    }
    return this.isPlaying;
  }

  playBirthday() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();

    this.congratsAudio.pause();
    this.congratsAudio.currentTime = 0;

    this.birthdayAudio.play().then(() => {
      this.isPlaying = true;
      this.currentTrack = "birthday";
    }).catch((err) => {
      console.warn("Audio play prevented:", err);
    });
  }

  playCongrats() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();

    this.birthdayAudio.pause();

    this.congratsAudio.currentTime = 0;
    this.congratsAudio.play().then(() => {
      this.isPlaying = true;
      this.currentTrack = "congrats";
    }).catch((err) => {
      console.warn("Congrats audio play prevented:", err);
    });
  }

  pauseAll() {
    this.birthdayAudio.pause();
    this.congratsAudio.pause();
    this.isPlaying = false;
    this.currentTrack = null;
  }

  playKnifeCut() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    // Crisp metal slice whoosh
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

    // 1. Initial rocket whistle
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

    // 2. Heavy boom explosion
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Low frequency sub boom
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = "triangle";
      boom.frequency.setValueAtTime(120, t);
      boom.frequency.exponentialRampToValueAtTime(35, t + 0.9);

      boomGain.gain.setValueAtTime(0.28, t);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(t);
      boom.stop(t + 1.3);

      // Sparkling crackle
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
