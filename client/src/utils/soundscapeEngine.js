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
  const createSmoothNoiseBuffer = (seconds = 5) => {
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

  // Helper to generate authentic organic stereo rain with stochastic droplet impacts
  const createOrganicRainBuffer = (seconds = 6) => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // 1. Soft diffuse rainfall bed (dual-channel pink noise)
    let b0L=0,b1L=0,b2L=0,b3L=0,b4L=0,b5L=0,b6L=0;
    let b0R=0,b1R=0,b2R=0,b3R=0,b4R=0,b5R=0,b6R=0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      b0L = 0.99886 * b0L + whiteL * 0.0555179;
      b1L = 0.99332 * b1L + whiteL * 0.0750759;
      b2L = 0.96900 * b2L + whiteL * 0.1538520;
      b3L = 0.86650 * b3L + whiteL * 0.3104856;
      b4L = 0.55000 * b4L + whiteL * 0.5329522;
      b5L = -0.7616 * b5L - whiteL * 0.0168980;
      left[i] = (b0L + b1L + b2L + b3L + b4L + b5L + b6L + whiteL * 0.12) * 0.045;
      b6L = whiteL * 0.115926;

      b0R = 0.99886 * b0R + whiteR * 0.0555179;
      b1R = 0.99332 * b1R + whiteR * 0.0750759;
      b2R = 0.96900 * b2R + whiteR * 0.1538520;
      b3R = 0.86650 * b3R + whiteR * 0.3104856;
      b4R = 0.55000 * b4R + whiteR * 0.5329522;
      b5R = -0.7616 * b5R - whiteR * 0.0168980;
      right[i] = (b0R + b1R + b2R + b3R + b4R + b5R + b6R + whiteR * 0.12) * 0.045;
      b6R = whiteR * 0.115926;
    }

    // 2. Thousands of randomized micro-droplet impacts (sounds like gentle rain on a window/leaf)
    for (let i = 0; i < bufferSize - 1200; i++) {
      if (Math.random() < 0.0055) {
        const dropDuration = Math.floor(ctx.sampleRate * (0.003 + Math.random() * 0.006));
        const dropFreq = 700 + Math.random() * 1200;
        const amp = (0.12 + Math.random() * 0.45) * 0.22;
        const pan = Math.random(); // stereo position
        const decay = 550 + Math.random() * 300;

        for (let j = 0; j < dropDuration && i + j < bufferSize; j++) {
          const t = j / ctx.sampleRate;
          const env = Math.exp(-t * decay);
          const val = Math.sin(2 * Math.PI * dropFreq * t) * env * amp;
          left[i + j] += val * (1 - pan);
          right[i + j] += val * pan;
        }
      }
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
    // 2. AUTHENTIC COZY GENTLE RAIN (Pure Nature Acoustic)
    // ==========================================

    const rainSource = track(ctx.createBufferSource());
    rainSource.buffer = createOrganicRainBuffer(6);
    rainSource.loop = true;

    // Highpass removes muddy sub-rumble below 120Hz
    const rainHp = track(ctx.createBiquadFilter());
    rainHp.type = 'highpass';
    rainHp.frequency.setValueAtTime(130, ctx.currentTime);

    // Lowpass cuts all harsh high-frequency sizzle above 1800Hz
    const rainLp = track(ctx.createBiquadFilter());
    rainLp.type = 'lowpass';
    rainLp.frequency.setValueAtTime(1700, ctx.currentTime);
    rainLp.Q.setValueAtTime(0.5, ctx.currentTime);

    // Gentle breeze variation LFO (~0.1Hz) to emulate natural outdoor wind/rainfall swells
    const rainLfo = track(ctx.createOscillator());
    rainLfo.frequency.setValueAtTime(0.09, ctx.currentTime);
    const rainLfoGain = track(ctx.createGain());
    rainLfoGain.gain.setValueAtTime(0.12, ctx.currentTime);

    const rainGain = track(ctx.createGain());
    rainGain.gain.setValueAtTime(1.1, ctx.currentTime);

    rainLfo.connect(rainLfoGain);
    rainLfoGain.connect(rainGain.gain);

    rainSource.connect(rainHp);
    rainHp.connect(rainLp);
    rainLp.connect(rainGain);
    rainGain.connect(masterGain);

    rainLfo.start();
    rainSource.start();

    // Subtle indoor cozy roof resonance (gentle 60Hz hum, creates warm bedroom feel)
    const roofDrone = track(ctx.createOscillator());
    roofDrone.type = 'sine';
    roofDrone.frequency.setValueAtTime(65, ctx.currentTime);
    const roofDroneGain = track(ctx.createGain());
    roofDroneGain.gain.setValueAtTime(0.035, ctx.currentTime);
    roofDrone.connect(roofDroneGain);
    roofDroneGain.connect(masterGain);
    roofDrone.start();

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
