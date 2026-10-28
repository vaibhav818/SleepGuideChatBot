import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Waves, CloudRain, Disc } from 'lucide-react';

export default function SoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState('brown'); // 'brown', 'rain', 'waves'
  const [volume, setVolume] = useState(0.3);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // Initialize Web Audio API nodes
  const startSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer looped
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (soundType === 'brown') {
        // Brown noise generator (integrated white noise)
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // Gain boost
        }
      } else if (soundType === 'rain') {
        // Pink / Rainfall noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      } else {
        // Ocean waves with periodic low frequency modulation
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const waveMod = Math.sin((i / bufferSize) * Math.PI * 2) * 0.4 + 0.6;
          data[i] = ((lastOut + 0.02 * white) / 1.02) * 3.5 * waveMod;
          lastOut = data[i];
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      noiseSource.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();

      sourceNodeRef.current = noiseSource;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
    } catch (e) {
      console.error('Web Audio error:', e);
    }
  };

  const stopSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  // Switch sound type live
  useEffect(() => {
    if (isPlaying) {
      stopSound();
      startSound();
    }
  }, [soundType]);

  // Adjust volume live
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-indigo-900/50 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Sleep Soundscapes</h3>
            <p className="text-[11px] text-slate-400">Pure Web-Audio synthesized acoustic masking</p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 animate-pulse-slow'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>

      {/* Sound Type Selection */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <button
          onClick={() => setSoundType('brown')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            soundType === 'brown'
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
              : 'bg-sleep-900/60 border-indigo-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Disc className="w-3.5 h-3.5 text-amber-400" />
          Brown Noise
        </button>
        <button
          onClick={() => setSoundType('rain')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            soundType === 'rain'
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
              : 'bg-sleep-900/60 border-indigo-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          Gentle Rain
        </button>
        <button
          onClick={() => setSoundType('waves')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            soundType === 'waves'
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
              : 'bg-sleep-900/60 border-indigo-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-emerald-400" />
          Ocean Waves
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 pt-2 border-t border-indigo-950/60 mt-1">
        {volume === 0 ? (
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
        )}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-indigo-500 h-1 bg-sleep-800 rounded-lg cursor-pointer"
        />
        <span className="text-[10px] text-slate-400 w-8 text-right font-medium">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
