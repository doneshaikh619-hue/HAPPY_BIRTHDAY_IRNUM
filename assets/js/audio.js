/**
 * Audio Engine with Dedicated Happy Birthday Instrumental MP3
 * And Web Audio tactile sound effects.
 */

export class AmbientAudioEngine {
  constructor() {
    this.audio = new Audio("assets/audio/happy-birthday-instrumental.mp3");
    this.audio.loop = true;
    this.audio.volume = 0.55;
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

  toggle() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.audio.play().then(() => {
      this.isPlaying = true;
    }).catch((err) => {
      console.warn("Audio play prevented until user interaction:", err);
      this.isPlaying = false;
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
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

    // Gentle soft breath / wind whoosh when blowing candle
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
