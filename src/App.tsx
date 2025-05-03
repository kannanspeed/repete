import { useState, useEffect, useRef } from 'react'
import './App.css'

// Define interfaces for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      }
    }
  }
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

// Sample word list to test pronunciation
const WORD_LIST = [
  'apple', 'banana', 'chocolate', 'dinosaur', 'elephant',
  'fantastic', 'guitar', 'happiness', 'important', 'journey'
];

function App() {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize with a random word
  useEffect(() => {
    getNextWord();
  }, []);

  const getNextWord = () => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setCurrentWord(WORD_LIST[randomIndex]);
    setFeedback('');
  };

  const startListening = () => {
    setErrorMessage('');
    setFeedback('');
    
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    // Initialize recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      setFeedback('Listening...');
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript.toLowerCase().trim();
      
      // Compare with the current word
      const isCorrect = speechResult === currentWord.toLowerCase();
      
      if (isCorrect) {
        setFeedback('Correct! 🎉');
      } else {
        // For incorrect words, measure similarity
        const similarity = calculateSimilarity(speechResult, currentWord.toLowerCase());
        
        if (similarity > 0.8) {
          setFeedback('Very close! Try again');
        } else if (similarity > 0.5) {
          setFeedback('Getting there. Keep practicing!');
        } else {
          setFeedback('Try again. Focus on pronunciation');
        }
      }
      
      setIsListening(false);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      setErrorMessage(`Error: ${event.error}`);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Simple string similarity function (Levenshtein distance based)
  const calculateSimilarity = (a: string, b: string): number => {
    if (a.length === 0) return 0;
    if (b.length === 0) return 0;
    
    // Calculate Levenshtein distance
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) {
      matrix[i][0] = i;
    }
    
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    // Convert to similarity score (0-1)
    const maxLength = Math.max(a.length, b.length);
    return (maxLength - matrix[a.length][b.length]) / maxLength;
  };

  return (
    <div className="app-container">
      <h1>Repetee</h1>
      <h2>Voice Pronunciation Practice</h2>
      
      <div className="word-display">
        <p>Say this word:</p>
        <h3>{currentWord}</h3>
      </div>
      
      <div className="controls">
        {!isListening ? (
          <button 
            className="listen-btn"
            onClick={startListening}
            disabled={isListening}
          >
            Start Speaking
          </button>
        ) : (
          <button 
            className="stop-btn"
            onClick={stopListening}
          >
            Stop Listening
          </button>
        )}
        
        <button 
          className="next-btn"
          onClick={getNextWord}
        >
          Next Word
        </button>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {feedback && (
        <div className="feedback">
          {feedback}
        </div>
      )}
    </div>
  )
}

export default App

// TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
} 