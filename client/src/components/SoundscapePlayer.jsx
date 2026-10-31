import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Waves, CloudRain, Wind } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { createSoundscape } from '../utils/soundscapeEngine';

export default function SoundscapePlayer() {
  const { theme, selectedPalette } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState('brown');
  const [volume, setVolume] = useState(35);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const soundscapeHandleRef = useRef(null);

  const startSound = (type = soundType) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop any existing soundscape
      if (soundscapeHandleRef.current) {
        soundscapeHandleRef.current.stop();
        soundscapeHandleRef.current = null;
      }

      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(volume / 100, ctx.currentTime);

      // Launch high-fidelity acoustic + harmonic soundscape
      soundscapeHandleRef.current = createSoundscape(ctx, type, gainNodeRef.current);
      setIsPlaying(true);
    } catch (e) {
      console.error('Web Audio error:', e);
    }
  };

  const stopSound = () => {
    if (soundscapeHandleRef.current) {
      soundscapeHandleRef.current.stop();
      soundscapeHandleRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  const changeType = (newType) => {
    setSoundType(newType);
    if (isPlaying) {
      stopSound();
      setTimeout(() => startSound(newType), 50);
    }
  };

  const handleVolume = (e) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol / 100, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 border transition-all duration-700"
      style={{
        backgroundColor: theme.cardGlass,
        borderColor: theme.border,
      }}
    >
      {/* Top row: Header & Play Button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: theme.accentMuted,
              borderColor: theme.border,
              color: theme.accentPrimary,
            }}
          >
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Sleep Soundscapes
            </h3>
            <p className="text-[11px] text-slate-400">
              Pure Web-Audio synthesized acoustic masking
            </p>
          </div>
        </div>

        {/* Play/Pause Round Button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          style={{
            backgroundColor: theme.accentPrimary,
            color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
            boxShadow: `0 4px 18px ${theme.glowColor}`,
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Preset Pills */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { id: 'brown', label: 'Brown Noise', icon: Wind },
          { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
          { id: 'waves', label: 'Ocean Waves', icon: Waves },
        ].map((item) => {
          const isSelected = soundType === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => changeType(item.id)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                isSelected ? 'shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isSelected ? theme.accentMuted : 'rgba(255, 255, 255, 0.02)',
                borderColor: isSelected ? theme.accentPrimary : 'rgba(255, 255, 255, 0.06)',
                color: isSelected ? theme.accentPrimary : '#94A3B8',
                boxShadow: isSelected ? `0 0 14px ${theme.glowColor}` : 'none',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Slider bar */}
      <div className="flex items-center gap-3 pt-1">
        <Volume2 className="w-4 h-4 text-slate-400" />
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolume}
            className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
            style={{ accentColor: theme.accentPrimary }}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 min-w-[32px] text-right">
          {volume}%
        </span>
      </div>
    </div>
  );
}
