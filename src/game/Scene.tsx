import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Suitor, HEROINE, BG_HOME, BG_TOWN } from './data';

interface Props {
  suitor: Suitor | null;
  text: string;
  location: 'home' | 'town';
}

export default function Scene({ suitor, text, location }: Props) {
  const bg = location === 'home' ? BG_HOME : BG_TOWN;
  return (
    <div className="relative w-full h-[42vh] sm:h-[48vh] rounded-2xl overflow-hidden border border-border shadow-2xl">
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 magic-grain opacity-60" />

      {/* Suitor — по пояс, по центру/справа */}
      {suitor && (
        <img
          src={suitor.portrait}
          alt={suitor.name}
          className="absolute bottom-0 right-2 sm:right-16 h-[78%] object-contain object-bottom animate-fade-in drop-shadow-2xl"
          style={{ filter: `drop-shadow(0 0 30px ${suitor.glow})` }}
        />
      )}

      {/* Героиня — слева */}
      <img
        src={HEROINE}
        alt="Ведьма"
        className="absolute bottom-0 left-0 sm:left-4 h-[92%] object-contain object-bottom animate-fade-in drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 26px rgba(199,125,255,0.45))' }}
      />

      {/* Текстовый блок снизу */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6">
        <div className="rounded-xl border border-border bg-card/85 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 shadow-xl animate-slide-up">
          {suitor && (
            <span className="font-display text-lg sm:text-xl font-bold text-glow" style={{ color: suitor.accent }}>
              {suitor.name} · {suitor.role}
            </span>
          )}
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}
