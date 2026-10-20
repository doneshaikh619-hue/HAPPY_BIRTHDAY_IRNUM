/**
 * Luxury Ambient Soundscape Engine
 * Powered by the Web Audio API (Zero external MP3 dependencies).
 * Generates warm, subtle celestial chords and soft tactile interaction tones.
 */

export class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.ambientInterval = null;
    this.masterGain = null;
    this.chords = [
      // Frequencies in Hz for warm pentatonic ambient chords (Db / Ab / Eb serene luxury tuning)
      [138.59, 207.65, 277.18, 329.63, 415.30], // DbMaj9
      [155.56, 233.08, 277.18, 349.23, 466.16], // Ebm9
      [174.61, 261.63, 329.63, 392.00, 523.25], // F minor 7
      [116.54, 174.61, 233.08, 277.18, 349.23]  // Bbm7
    ];
    this.currentChordIndex = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start() {
    if (!this.ctx) this.init();
    this.isPlaying = true;
    this.playAmbientCycle();
    this.ambientInterval = setInterval(() => {
      this.playAmbientCycle();
    }, 4200);
  }

  stop() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  playAmbientCycle() {
    if (!this.ctx || !this.isPlaying) return;
    const chord = this.chords[this.currentChordIndex % this.chords.length];
    this.currentChordIndex++;

    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + 4.0);
    filter.connect(this.masterGain);

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Micro detune for celestial warmth
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      const delay = idx * 0.12;
      const startTime = now + delay;
      const duration = 3.8;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  // Micro haptic interaction clicks
  playClick() {
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
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const now = this.ctx.currentTime;
    [1046.50, 1318.51, 1567.98].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.03, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.9);
    });
  }
}
