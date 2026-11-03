/**
 * Sistema de Áudio Sintetizado — Web Audio API
 * Sem dependências externas nem arquivos de áudio quebrados.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const SoundSystem = {
  isMuted(): boolean {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('senar_sound_muted');
      if (stored !== null) isMuted = stored === 'true';
    }
    return isMuted;
  },

  setMuted(muted: boolean) {
    isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('senar_sound_muted', muted ? 'true' : 'false');
    }
  },

  toggleMute(): boolean {
    this.setMuted(!this.isMuted());
    return isMuted;
  },

  // Efeito de clique e seleção
  playClick() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  },

  // Resposta correta / aprovação
  playSuccess() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Acorde Maior)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
    });
  },

  // Resposta incorreta / reprovação
  playError() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(146.83, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },

  // Encaixe correto da peça do quebra-cabeça (Snap magnético)
  playSnap() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Duplo clique suave e ressonante
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  },

  // Tique-taque de contagem regressiva
  playTick() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  },

  // Desbloqueio triunfal de Lote
  playLotUnlocked() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Fanfarra triunfal: F4, A4, C5, F5
    const fanfareNotes = [349.23, 440.0, 523.25, 698.46, 880.0];
    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
    });
  },

  // Vitória Final / Conclusão do Mapa Estratégico
  playVictory() {
    if (this.isMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const melody = [
      { freq: 523.25, dur: 0.15 }, // C5
      { freq: 523.25, dur: 0.15 }, // C5
      { freq: 523.25, dur: 0.15 }, // C5
      { freq: 659.25, dur: 0.4 },  // E5
      { freq: 587.33, dur: 0.2 },  // D5
      { freq: 659.25, dur: 0.2 },  // E5
      { freq: 783.99, dur: 0.6 },  // G5
      { freq: 1046.5, dur: 1.0 }   // C6!
    ];

    let t = ctx.currentTime;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + note.dur + 0.05);
      t += note.dur + 0.05;
    });
  }
};
