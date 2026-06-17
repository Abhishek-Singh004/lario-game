export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private soundsToLoad = [
    { key: 'jump', url: '/new assets/Sounds/sfx_jump.ogg' },
    { key: 'coin', url: '/new assets/Sounds/sfx_coin.ogg' },
    { key: 'stomp', url: '/new assets/Sounds/sfx_bump.ogg' },
    { key: 'death', url: '/new assets/Sounds/sfx_hurt.ogg' },
    { key: 'magic', url: '/new assets/Sounds/sfx_magic.ogg' }
  ];

  constructor() {
    // AudioContext must be initialized after a user interaction
  }

  async init() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Load all audio files
    for (const s of this.soundsToLoad) {
      try {
        const response = await fetch((import.meta as any).env.BASE_URL + s.url.substring(1));
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this.buffers.set(s.key, audioBuffer);
      } catch (e) {
        console.error(`Failed to load sound ${s.key}`, e);
      }
    }
  }

  play(key: string) {
    if (!this.audioCtx) return;
    const buffer = this.buffers.get(key);
    if (!buffer) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    
    // Connect to a gain node to control volume
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.3; // 30% volume
    
    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    source.start(0);
  }

  playJump() { this.play('jump'); }
  playCoin() { this.play('coin'); }
  playStomp() { this.play('stomp'); }
  playDeath() { this.play('death'); }
  playMagic() { this.play('magic'); }
}
