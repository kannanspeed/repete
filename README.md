# Repetee - Voice Pronunciation Practice App

A free, simple AI-powered voice pronunciation application. Repetee displays words for users to repeat, then uses the Web Speech API to evaluate pronunciation and provide feedback.

## Features

- Display of words for pronunciation practice
- Voice recognition using browser's built-in SpeechRecognition API
- Pronunciation evaluation based on similarity
- Visual feedback on pronunciation accuracy
- Responsive design for mobile and desktop

## Technologies Used

- React
- TypeScript
- Web Speech API
- Vite

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```
npm install
```

### Running the Development Server

```
npm run dev
```

This will start the development server at http://localhost:5173

### Building for Production

```
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. Open the app in your browser
2. A random word will be displayed on the screen
3. Click "Start Speaking" and say the word
4. The app will evaluate your pronunciation and provide feedback
5. Click "Next Word" to practice with a different word

## Browser Compatibility

The app works best in browsers that support the Web Speech API:
- Chrome
- Edge
- Safari (partial support)
- Firefox (partial support)

## License

ISC

## Notes

This app uses your device's microphone but processes all voice data locally in the browser. No data is sent to any server. 