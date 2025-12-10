import React, { useState, useEffect, useCallback } from 'react';
import { SetupForm } from './components/SetupForm';
import { HangmanDrawing } from './components/HangmanDrawing';
import { Keyboard } from './components/Keyboard';
import { GameScreen, GameState, MAX_ERRORS } from './types';
import { RotateCcw, ArrowRight, Trophy, Skull } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    wordList: [],
    currentWordIndex: 0,
    guessedLetters: new Set(),
    wrongGuesses: 0,
    screen: GameScreen.SETUP,
    score: 0,
  });

  const currentWord = gameState.wordList[gameState.currentWordIndex] || '';

  const addGuessedLetter = useCallback((letter: string) => {
    if (gameState.screen !== GameScreen.PLAYING || gameState.guessedLetters.has(letter)) return;

    setGameState(prev => {
      const newGuessedLetters = new Set(prev.guessedLetters).add(letter);
      const isCorrect = currentWord.includes(letter);
      const newWrongGuesses = isCorrect ? prev.wrongGuesses : prev.wrongGuesses + 1;
      
      let nextScreen = prev.screen;
      let newScore = prev.score;

      // Check for lose condition (word round over)
      if (newWrongGuesses >= MAX_ERRORS) {
        nextScreen = GameScreen.GAME_OVER;
      }
      
      // Check for win condition (word completed)
      const isWordComplete = currentWord.split('').every(char => newGuessedLetters.has(char));
      if (isWordComplete) {
         nextScreen = GameScreen.GAME_OVER;
         newScore += 1; // Increment score for winning the word
      }

      return {
        ...prev,
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
        screen: nextScreen,
        score: newScore
      };
    });
  }, [currentWord, gameState.screen, gameState.guessedLetters]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (!key.match(/^[A-Z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [addGuessedLetter]);

  const handleStartGame = (words: string[]) => {
    setGameState({
      wordList: words,
      currentWordIndex: 0,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      screen: GameScreen.PLAYING,
      score: 0
    });
  };

  const handleNextWord = () => {
    const nextIndex = gameState.currentWordIndex + 1;
    if (nextIndex >= gameState.wordList.length) {
      setGameState(prev => ({ ...prev, screen: GameScreen.VICTORY }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentWordIndex: nextIndex,
        guessedLetters: new Set(),
        wrongGuesses: 0,
        screen: GameScreen.PLAYING
      }));
    }
  };

  const handleRestart = () => {
    setGameState({
      wordList: [],
      currentWordIndex: 0,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      screen: GameScreen.SETUP,
      score: 0,
    });
  };

  // Helper to check if player won the current word
  const isWordWon = currentWord.split('').every(char => gameState.guessedLetters.has(char));
  const isWordLost = gameState.wrongGuesses >= MAX_ERRORS;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
      
      {gameState.screen === GameScreen.SETUP && (
        <SetupForm onStartGame={handleStartGame} />
      )}

      {(gameState.screen === GameScreen.PLAYING || gameState.screen === GameScreen.GAME_OVER) && (
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
            <div className="text-slate-500 font-mono text-sm">
              Word {gameState.currentWordIndex + 1} / {gameState.wordList.length}
            </div>
            <div className="text-xl font-bold text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Score: {gameState.score}
            </div>
            <button onClick={handleRestart} className="text-slate-400 hover:text-slate-600 transition-colors">
                <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center w-full">
            {/* Visuals */}
            <div className="flex-shrink-0">
               <HangmanDrawing wrongGuesses={gameState.wrongGuesses} />
            </div>

            {/* Word Display */}
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {currentWord.split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`
                        w-10 h-12 md:w-12 md:h-16 border-b-4 
                        flex items-center justify-center text-3xl md:text-4xl font-mono font-bold
                        ${gameState.guessedLetters.has(letter) || isWordLost 
                            ? 'border-slate-800 text-slate-800' 
                            : 'border-slate-300 text-transparent'}
                        ${isWordLost && !gameState.guessedLetters.has(letter) ? 'text-red-500' : ''}
                    `}
                  >
                    {gameState.guessedLetters.has(letter) || isWordLost ? letter : "_"}
                  </span>
                ))}
              </div>
              
              {/* Messages & Actions */}
              {gameState.screen === GameScreen.GAME_OVER && (
                 <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className={`text-xl font-bold ${isWordWon ? 'text-green-600' : 'text-red-600'}`}>
                        {isWordWon ? 'Nice Job!' : `Oops! The word was ${currentWord}`}
                    </div>
                    <button 
                        onClick={handleNextWord}
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20"
                    >
                        {gameState.currentWordIndex + 1 >= gameState.wordList.length ? 'See Final Score' : 'Next Word'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              )}

              {gameState.screen === GameScreen.PLAYING && (
                  <p className="text-slate-400 text-sm animate-pulse">Use your keyboard or click below</p>
              )}
            </div>
          </div>

          <Keyboard
            disabled={gameState.screen !== GameScreen.PLAYING}
            activeLetters={gameState.guessedLetters.keys().filter(l => currentWord.includes(l as string)) as unknown as Set<string>} // Type casting for Set iteration compat
            inactiveLetters={gameState.guessedLetters.keys().filter(l => !currentWord.includes(l as string)) as unknown as Set<string>}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      )}

      {gameState.screen === GameScreen.VICTORY && (
        <div className="bg-white p-12 rounded-2xl shadow-2xl text-center space-y-6 max-w-lg w-full">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600">
                <Trophy className="w-10 h-10" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Game Complete!</h2>
                <p className="text-slate-500 mt-2">You finished the word list.</p>
            </div>
            
            <div className="py-6 border-y border-slate-100">
                <div className="text-4xl font-black text-primary">{gameState.score} / {gameState.wordList.length}</div>
                <div className="text-sm text-slate-400 mt-1">Total Score</div>
            </div>

            <button 
                onClick={handleRestart}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                Play Again
            </button>
        </div>
      )}
    </div>
  );
}

export default App;