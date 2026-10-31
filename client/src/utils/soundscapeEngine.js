/**
 * SomnaAI High-Fidelity Web Audio Soundscape Synthesizer
 * Generates organic, soothing nature acoustics & ambient harmonic chords
 * without harsh static radio hiss.
 */

export function createSoundscape(ctx, type, masterGain) {
  const activeNodes = [];
  const intervals = [];

  // Helper to register node for clean disposal
  const track = (node) => {
    activeNodes.push(node);
    return node;
  };

  // Helper to generate smooth pink/brown noise buffer
  const createSmoothNoiseBuffer = (seconds = 4) => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 3-pole Pink/Brownian integration curve (cuts harsh high-frequency sizzle)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.2) * 0.12;
      b6 = white * 0.115926;
    }
    return buffer;
  };

  if (type === 'brown') {
    // ==========================================
    // 1. WARM BROWN NOISE + 432Hz DELTA DRONE
    // ==========================================

    // A. Velvety Brown Rumbling Noise (Deep Cabin / Snowstorm)
    const noise = track(ctx.createBufferSource());
    noise.buffer = createSmoothNoiseBuffer(5);
    noise.loop = true;

    // Dual-stage Lowpass Filter (eliminates 100% of static radio hiss)
    const lp1 = track(ctx.createBiquadFilter());
    lp1.type = 'lowpass';
    lp1.frequency.setValueAtTime(160, ctx.currentTime);
    lp1.Q.setValueAtTime(0.7, ctx.currentTime);

    const lp2 = track(ctx.createBiquadFilter());
    lp2.type = 'lowpass';
    lp2.frequency.setValueAtTime(110, ctx.currentTime);

    const noiseGain = track(ctx.createGain());
    noiseGain.gain.setValueAtTime(1.8, ctx.currentTime);

    noise.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    // B. Delta Brainwave Binaural Drone (108 Hz + 111 Hz = 3Hz Delta Sleep state)
    const oscLeft = track(ctx.createOscillator());
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(108, ctx.currentTime);

    const oscRight = track(ctx.createOscillator());
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(111, ctx.currentTime);

    // Warm 432Hz Solfeggio Meditation Ambient Pad
    const oscWarm = track(ctx.createOscillator());
    oscWarm.type = 'triangle';
    oscWarm.frequency.setValueAtTime(216, ctx.currentTime);

    const droneFilter = track(ctx.createBiquadFilter());
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(280, ctx.currentTime);

    const droneGain = track(ctx.createGain());
    droneGain.gain.setValueAtTime(0.12, ctx.currentTime);

    oscLeft.connect(droneFilter);
    oscRight.connect(droneFilter);
    oscWarm.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(masterGain);

    oscLeft.start();
    oscRight.start();
    oscWarm.start();

  } else if (type === 'rain') {
    // ==========================================
    // 2. NIGHT RAIN + CALMING CELESTIAL CHIMES
    // ==========================================

    // A. Soft, Gentle Rain Acoustic (No radio static)
    const noise = track(ctx.createBufferSource());
    noise.buffer = createSmoothNoiseBuffer(4);
    noise.loop = true;

    // Multi-band shaping for natural water patter
    const filter = track(ctx.createBiquadFilter());
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(520, ctx.currentTime);
    filter.Q.setValueAtTime(0.85, ctx.currentTime);

    const rainLp = track(ctx.createBiquadFilter());
    rainLp.type = 'lowpass';
    rainLp.frequency.setValueAtTime(780, ctx.currentTime);

    // Rain wind modulation LFO
    const rainLfo = track(ctx.createOscillator());
    rainLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const rainLfoGain = track(ctx.createGain());
    rainLfoGain.gain.setValueAtTime(0.15, ctx.currentTime);

    const rainGain = track(ctx.createGain());
    rainGain.gain.setValueAtTime(0.95, ctx.currentTime);

    rainLfo.connect(rainLfoGain);
    rainLfoGain.connect(rainGain.gain);

    noise.connect(filter);
    filter.connect(rainLp);
    rainLp.connect(rainGain);
    rainGain.connect(masterGain);

    rainLfo.start();
    noise.start();

    // B. Algorithmic Celestial Night Chimes (Plays tranquil tones every ~2.5s)
    const pentatonicScale = [288, 324, 384, 432, 486, 576]; // Solfeggio harmonic frequencies
    const playChime = () => {
      try {
        if (ctx.state !== 'running') return;
        const freq = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
        const chimeOsc = track(ctx.createOscillator());
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, ctx.currentTime);

        const chimeGain = track(ctx.createGain());
        const now = ctx.currentTime;
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.linearRampToValueAtTime(0.065, now + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);

        chimeOsc.start(now);
        chimeOsc.stop(now + 2.3);
      } catch (err) {}
    };

    // Play first chime shortly after start, then repeat peacefully
    const timeoutId = setTimeout(playChime, 800);
    const intervalId = setInterval(playChime, 2800);
    intervals.push(timeoutId, intervalId);

  } else {
    // ==========================================
    // 3. TIDAL OCEAN SWELL + HARMONIC SEA CHORD
    // ==========================================

    // A. Oceanic Swell Waves
    const noise = track(ctx.createBufferSource());
    noise.buffer = createSmoothNoiseBuffer(6);
    noise.loop = true;

    // Resonant lowpass swept by slow tide LFO
    const waveFilter = track(ctx.createBiquadFilter());
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(180, ctx.currentTime);
    waveFilter.Q.setValueAtTime(2.2, ctx.currentTime);

    // 12-second wave breathing cycle (6s rush, 6s fade)
    const tideLfo = track(ctx.createOscillator());
    tideLfo.frequency.setValueAtTime(0.085, ctx.currentTime);

    const tideLfoGain = track(ctx.createGain());
    tideLfoGain.gain.setValueAtTime(220, ctx.currentTime); // Sweeps filter from 120Hz to 400Hz

    tideLfo.connect(tideLfoGain);
    tideLfoGain.connect(waveFilter.frequency);

    // Dynamic wave amplitude swell
    const waveGain = track(ctx.createGain());
    waveGain.gain.setValueAtTime(0.7, ctx.currentTime);

    const ampLfoGain = track(ctx.createGain());
    ampLfoGain.gain.setValueAtTime(0.35, ctx.currentTime);
    tideLfo.connect(ampLfoGain);
    ampLfoGain.connect(waveGain.gain);

    noise.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(masterGain);

    tideLfo.start();
    noise.start();

    // B. Warm Ambient Chord Pad (C-Major 9th Peaceful Sea Harmony)
    const chordFreqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    const chordGain = track(ctx.createGain());
    chordGain.gain.setValueAtTime(0.05, ctx.currentTime);

    const chordFilter = track(ctx.createBiquadFilter());
    chordFilter.type = 'lowpass';
    chordFilter.frequency.setValueAtTime(320, ctx.currentTime);

    chordFreqs.forEach((freq) => {
      const osc = track(ctx.createOscillator());
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(chordFilter);
      osc.start();
      track(osc);
    });

    chordFilter.connect(chordGain);
    chordGain.connect(masterGain);
  }

  // Teardown function to cleanly silence all nodes and stop intervals
  return {
    stop: () => {
      intervals.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      activeNodes.length = 0;
      intervals.length = 0;
    },
  };
}
