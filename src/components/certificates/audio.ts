// ─────────────────────────────────────────────────────────────────────────────
//  🍬 COLLECTION AUDIO ENGINE — Completely Silenced / Zero Audio No-Op Engine
//  Ensures absolute silence across all browsers, interactions, and devices.
// ─────────────────────────────────────────────────────────────────────────────

class CollectionAudioEngine {
  constructor() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("collection_sound_enabled");
      } catch { }
    }
  }

  public isMuted(): boolean {
    return true;
  }

  public setMuted(_val: boolean) {
    // Always muted
  }

  public toggleMute(): boolean {
    return true;
  }

  public playPop() {
    // No-op: zero audio
  }

  public playTear() {
    // No-op: zero audio
  }

  public playDing() {
    // No-op: zero audio
  }

  public playCheer() {
    // No-op: zero audio
  }
}

export const collectionAudio = new CollectionAudioEngine();
