let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (sharedContext?.state === "closed") sharedContext = null;
  if (sharedContext) return sharedContext;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    sharedContext = new Ctx();
    return sharedContext;
  } catch {
    return null;
  }
}

/**
 * Call this on a user gesture (e.g. when user clicks "Confirm" to purchase).
 * Unlocks the AudioContext so playSuccessChime() can play later after async work.
 */
export function prepareSuccessChime(): void {
  const ctx = getAudioContext();
  if (ctx?.state === "suspended") void ctx.resume();
}

/**
 * Play a short "earned reward" sound: ascending major arpeggio (C → E → G) so it
 * feels like the user gained something. For sound to work, call prepareSuccessChime()
 * on a user gesture (e.g. purchase button click) first.
 * @returns Cleanup function, or undefined if not supported
 */
export function playSuccessChime(): (() => void) | undefined {
  const ctx = getAudioContext();
  if (!ctx) return undefined;

  try {
    const playTone = (
      freq: number,
      startTime: number,
      duration: number,
      peakGain = 0.28
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "triangle";
      const attack = 0.025;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.linearRampToValueAtTime(0.008, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const t = ctx.currentTime + 0.02;
    // Ascending C major arpeggio – "you earned it" resolution on the top note
    playTone(523.25, t, 0.14); // C5
    playTone(659.25, t + 0.12, 0.14); // E5
    playTone(783.99, t + 0.24, 0.22, 0.32); // G5 – slightly louder, longer for payoff

    return () => {
      /* keep shared context for future plays */
    };
  } catch {
    return undefined;
  }
}

/**
 * Play a short "sell success" sound when the user's photo is listed in a market.
 * Different from playSuccessChime (purchase): softer two-note "listed" tone (B4 → E5).
 * Call prepareSuccessChime() on the sell/submit button click first so audio can play.
 */
export function playSellSuccessChime(): (() => void) | undefined {
  const ctx = getAudioContext();
  if (!ctx) return undefined;

  try {
    const playTone = (
      freq: number,
      startTime: number,
      duration: number,
      peakGain = 0.22
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine"; // Softer than triangle for a calmer "listed" feel
      const attack = 0.03;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.linearRampToValueAtTime(0.006, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const t = ctx.currentTime + 0.02;
    playTone(493.88, t, 0.14); // B4
    playTone(659.25, t + 0.16, 0.18); // E5 – gentle rise, "your photo is listed"
    return () => {
      /* keep shared context */
    };
  } catch {
    return undefined;
  }
}

/**
 * Play a happy celebration / claps-like tone for fusion success.
 * Short ascending fanfare (C5 → E5 → G5 → C6) with a bright, bouncy feel.
 * Call prepareSuccessChime() on the Fuse button click first so audio can play.
 */
export function playFusionSuccessChime(): (() => void) | undefined {
  const ctx = getAudioContext();
  if (!ctx) return undefined;

  try {
    const playTone = (
      freq: number,
      startTime: number,
      duration: number,
      peakGain = 0.3
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const attack = 0.02;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.linearRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const t = ctx.currentTime + 0.02;
    // Happy ascending fanfare
    playTone(523.25, t, 0.12); // C5
    playTone(659.25, t + 0.1, 0.12); // E5
    playTone(783.99, t + 0.2, 0.12); // G5
    playTone(1046.5, t + 0.3, 0.2, 0.35); // C6 – payoff

    return () => {
      /* keep shared context */
    };
  } catch {
    return undefined;
  }
}

/**
 * Play a crowd clapping + hooray celebration (synthetic).
 * Claps: several sharp noise bursts at staggered times (like many people clapping).
 * Hooray: filtered noise swell + bright chord for a crowd cheer.
 * Call prepareSuccessChime() from a user gesture first so audio can play.
 */
export function playCrowdHoorayAndClap(): (() => void) | undefined {
  const ctx = getAudioContext();
  if (!ctx) return undefined;

  const nodes: Array<
    OscillatorNode | AudioBufferSourceNode | GainNode | StereoPannerNode
  > = [];

  try {
    const now = ctx.currentTime + 0.02;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    nodes.push(master);

    const createNoiseBuffer = (duration: number) => {
      const length = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      return buffer;
    };

    const clapBuffer = createNoiseBuffer(0.12);

    const scheduleClap = (
      time: number,
      volume = 0.12,
      pan = 0,
      playbackRate = 1
    ) => {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const panner = ctx.createStereoPanner();

      src.buffer = clapBuffer;
      src.playbackRate.value = playbackRate;

      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.8;

      panner.pan.value = pan;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(master);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(volume, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

      src.start(time);
      src.stop(time + 0.12);

      nodes.push(src, gain, filter as unknown as GainNode, panner);
    };

    const shoutVoices = [
      {
        freq: 520,
        pan: -0.55,
        gain: 0.035,
        type: "sawtooth" as OscillatorType,
      },
      { freq: 610, pan: -0.2, gain: 0.03, type: "triangle" as OscillatorType },
      { freq: 720, pan: 0.15, gain: 0.03, type: "sawtooth" as OscillatorType },
      { freq: 840, pan: 0.5, gain: 0.025, type: "triangle" as OscillatorType },
      { freq: 960, pan: 0.75, gain: 0.02, type: "sine" as OscillatorType },
    ];

    const scheduleVoice = (
      start: number,
      baseFreq: number,
      pan: number,
      peakGain: number,
      type: OscillatorType
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const panner = ctx.createStereoPanner();

      osc.type = type;
      osc.frequency.setValueAtTime(baseFreq * 0.9, start);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.08, start + 0.12);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.96, start + 0.42);

      filter.type = "bandpass";
      filter.frequency.value = 1100;
      filter.Q.value = 1.2;

      panner.pan.value = pan;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(master);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(peakGain * 0.55, start + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.48);

      osc.start(start);
      osc.stop(start + 0.5);

      nodes.push(osc, gain, filter as unknown as GainNode, panner);
    };

    // Crowd claps: several offset hits to feel like multiple people
    for (let wave = 0; wave < 4; wave++) {
      const waveStart = now + wave * 0.16;

      for (let i = 0; i < 7; i++) {
        scheduleClap(
          waveStart + Math.random() * 0.06,
          0.07 + Math.random() * 0.06,
          -0.9 + Math.random() * 1.8,
          0.9 + Math.random() * 0.25
        );
      }
    }

    // Hooray voices: staggered crowd cheer
    const cheerStart = now + 0.08;
    shoutVoices.forEach((voice, i) => {
      scheduleVoice(
        cheerStart + i * 0.045,
        voice.freq + (Math.random() * 30 - 15),
        voice.pan,
        voice.gain,
        voice.type
      );
    });

    // Extra bright celebratory chord underneath
    const chordFreqs = [523.25, 659.25, 783.99, 1046.5];
    chordFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      osc.type = "sine";
      osc.frequency.value = freq;
      panner.pan.value = -0.4 + i * 0.27;

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(master);

      const start = cheerStart + 0.03 + i * 0.02;
      const duration = 0.42;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.035, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.016, start + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.start(start);
      osc.stop(start + duration);

      nodes.push(osc, gain, panner);
    });

    return () => {
      for (const node of nodes) {
        try {
          if ("stop" in node && typeof node.stop === "function") {
            node.stop();
          }
        } catch {}
        try {
          node.disconnect();
        } catch {}
      }
    };
  } catch {
    return undefined;
  }
}
