export enum GameScreen {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER', // Round over
  VICTORY = 'VICTORY' // All words completed
}

export interface GameState {
  wordList: string[];
  currentWordIndex: number;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  screen: GameScreen;
  score: number;
}

export const MAX_ERRORS = 6;
export const MIN_WORDS = 10;
export const MAX_WORDS = 25;