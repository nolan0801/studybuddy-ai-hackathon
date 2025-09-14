import React from 'react';
import { StudyProvider } from './context/StudyContext';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  return (
    <StudyProvider>
      <div className="app">
        <MainApp />
      </div>
    </StudyProvider>
  );
}

export default App;