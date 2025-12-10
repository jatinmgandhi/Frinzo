import React from 'react';
import { MAX_ERRORS } from '../types';

interface HangmanDrawingProps {
  wrongGuesses: number;
}

export const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ wrongGuesses }) => {
  return (
    <div className="relative h-64 w-64 mx-auto flex justify-center">
      {/* Structure */}
      <div className="absolute bottom-0 w-40 h-1 bg-slate-800" /> {/* Base */}
      <div className="absolute bottom-0 left-12 w-1 h-64 bg-slate-800" /> {/* Pole */}
      <div className="absolute top-0 left-12 w-32 h-1 bg-slate-800" /> {/* Top Bar */}
      <div className="absolute top-0 right-20 w-1 h-8 bg-slate-800" /> {/* Rope */}

      {/* Head */}
      {wrongGuesses >= 1 && (
        <div className="absolute top-8 right-[4.25rem] w-12 h-12 rounded-full border-4 border-slate-800" />
      )}

      {/* Body */}
      {wrongGuesses >= 2 && (
        <div className="absolute top-20 right-[5.5rem] w-1 h-24 bg-slate-800" />
      )}

      {/* Left Arm */}
      {wrongGuesses >= 3 && (
        <div className="absolute top-24 right-[5.5rem] w-12 h-1 bg-slate-800 -rotate-45 origin-right" />
      )}

      {/* Right Arm */}
      {wrongGuesses >= 4 && (
        <div className="absolute top-24 right-[2.5rem] w-12 h-1 bg-slate-800 rotate-45 origin-left" />
      )}

      {/* Left Leg */}
      {wrongGuesses >= 5 && (
        <div className="absolute top-40 right-[5.5rem] w-12 h-1 bg-slate-800 -rotate-[60deg] origin-right" />
      )}

      {/* Right Leg */}
      {wrongGuesses >= 6 && (
        <div className="absolute top-40 right-[2.3rem] w-12 h-1 bg-slate-800 rotate-[60deg] origin-left" />
      )}
    </div>
  );
};