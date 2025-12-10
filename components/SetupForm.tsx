import React, { useState } from 'react';
import { MIN_WORDS, MAX_WORDS } from '../types';
import { generateWordList } from '../services/geminiService';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SetupFormProps {
  onStartGame: (words: string[]) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onStartGame }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');

  const validateAndStart = (rawText: string) => {
    // Split by newlines or commas
    const words = rawText
      .split(/[\n,]+/)
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0 && /^[A-Z]+$/.test(w));

    const uniqueWords = Array.from(new Set(words));

    if (uniqueWords.length < MIN_WORDS) {
      setError(`Please provide at least ${MIN_WORDS} valid words. You have ${uniqueWords.length}.`);
      return;
    }
    if (uniqueWords.length > MAX_WORDS) {
      setError(`Please provide no more than ${MAX_WORDS} words. You have ${uniqueWords.length}.`);
      return;
    }

    setError(null);
    onStartGame(uniqueWords);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndStart(inputText);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate words.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const generatedWords = await generateWordList(topic, 15);
      onStartGame(generatedWords);
    } catch (err) {
      setError("Failed to generate words via Gemini. Please try manual entry.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-primary p-6 text-white text-center">
        <h1 className="text-3xl font-bold tracking-tight">Gemini Hangman</h1>
        <p className="opacity-90 mt-2">Create your game list or let AI do it for you.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Option 1: AI Generation */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-800">Generate with AI</h2>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="E.g., Fruits, 80s Rock Bands, Physics Terms..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="bg-secondary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : 'Generate'}
                </button>
            </div>
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">OR</span>
            </div>
        </div>

        {/* Option 2: Manual Entry */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-800">Manual Entry</h2>
                <span className="text-xs text-slate-500">{MIN_WORDS} - {MAX_WORDS} words required</span>
            </div>
            <textarea
              className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono text-sm resize-none"
              placeholder={`APPLE\nBANANA\nCHERRY\n...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">Separate words with commas or new lines. Only letters allowed.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-slate-900/10"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};