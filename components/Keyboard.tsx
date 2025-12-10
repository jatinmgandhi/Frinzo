import React from 'react';

interface KeyboardProps {
  activeLetters: Set<string>;
  inactiveLetters: Set<string>;
  addGuessedLetter: (letter: string) => void;
  disabled?: boolean;
}

const KEYS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

export const Keyboard: React.FC<KeyboardProps> = ({ 
  activeLetters, 
  inactiveLetters, 
  addGuessedLetter,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(45px,1fr))] gap-2 w-full max-w-2xl mx-auto p-4">
      {KEYS.map((key) => {
        const isActive = activeLetters.has(key);
        const isInactive = inactiveLetters.has(key);
        return (
          <button
            key={key}
            onClick={() => addGuessedLetter(key)}
            className={`
              aspect-square rounded-lg text-lg font-bold transition-all shadow-sm
              ${isActive ? 'bg-primary text-white scale-95 opacity-50 cursor-not-allowed' : ''}
              ${isInactive ? 'bg-slate-200 text-slate-400 opacity-30 cursor-not-allowed' : ''}
              ${!isActive && !isInactive ? 'bg-white text-slate-700 hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-95 border border-slate-200' : ''}
            `}
            disabled={isInactive || isActive || disabled}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};