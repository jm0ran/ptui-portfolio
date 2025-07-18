import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './Lines.css';
import InputLine, { InputLineRef } from './InputLine';
import {DisplayLine, DisplayLineProps} from './DisplayLine';
import { fileSystemRoot } from './FileSystemSetup';
import { Folder } from './FileSystem';
import { CommandProcessor } from './CommandProcessor';
import { ColoredSegment } from './types';

function App() {
  const [displayLines, setDisplayLines] = useState<DisplayLineProps[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<Folder>(fileSystemRoot);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const inputRef = useRef<InputLineRef>(null);
  const commandProcessor = useRef(new CommandProcessor(currentDirectory, setCurrentDirectory, locationData));

  // Detect mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Don't focus if clicking on a link
      if ((event.target as HTMLElement)?.tagName === 'A') {
        return;
      }
      inputRef.current?.focus();
    };

    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    // Store start time for uptime calculation
    (window as any).startTime = Date.now();
    
    // Fetch location data asynchronously
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => setLocationData(data))
      .catch(error => {
        console.log('Failed to fetch location data:', error);
        setLocationData(null);
      });
    
    // Show welcome message
    const welcomeMessage: DisplayLineProps = {
      text: [
        { text: 'Welcome to Joseph D. Moran\'s Portfolio Terminal!', color: '#00ff00', bold: true },
        { text: '\n\nQuick Start:', color: '#61dafb', bold: true },
        { text: '\n• Type ', color: '#ffffff' },
        { text: 'help', color: '#ffff00', bold: true },
        { text: ' to see all available commands', color: '#ffffff' },
        { text: '\n• Type ', color: '#ffffff' },
        { text: 'whoami', color: '#ffff00', bold: true },
        { text: ' for personal information', color: '#ffffff' },
        { text: '\n• Type ', color: '#ffffff' },
        { text: 'ls', color: '#ffff00', bold: true },
        { text: ' to see directories, then ', color: '#ffffff' },
        { text: 'cd <directory>', color: '#ffff00', bold: true },
        { text: ' to explore', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' }
      ]
    };
    setDisplayLines([welcomeMessage]);
    
    // Show mobile popup if on mobile device
    if (isMobile()) {
      setShowMobilePopup(true);
    }
    
    // Focus input field on page load
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Update command processor when current directory changes
    commandProcessor.current.updateCurrentDirectory(currentDirectory);
  }, [currentDirectory]);

  useEffect(() => {
    // Update command processor when location data changes
    if (locationData) {
      commandProcessor.current.updateLocationData(locationData);
    }
  }, [locationData]);

  useEffect(() => {
    // Scroll to bottom when new output is added - Safari-safe calculation
    const getMaxScroll = () => {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;
    };
    
    const maxScroll = getMaxScroll();
    window.scrollTo(0, Math.min(maxScroll, document.body.scrollHeight));
  }, [displayLines]);

  const handleNewLine = (text: string) => {
    // Add command to history if it's not empty and not the same as the last command
    if (text.trim() && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== text.trim())) {
      setCommandHistory(prev => [...prev, text.trim()]);
    }

    // Add the command input with current path
    const prompt = [
      { text: 'jm0ran', color: '#00ff00', bold: true },
      { text: ':', color: '#ffffff' },
      { text: currentDirectory.getPath(), color: '#61dafb', bold: true },
      { text: '$ ', color: '#00ff00', bold: true },
      { text: text, color: '#ffffff' }
    ];
    setDisplayLines((prevLines) => [...prevLines, { text: prompt }]);
    
    // Execute command and add output
    const output = commandProcessor.current.executeCommand(text);
    
    // Handle clear command specially
    if (text.trim().toLowerCase() === 'clear') {
      setDisplayLines([]);
      return;
    }
    
    setDisplayLines((prevLines) => [...prevLines, { text: output.text, graphic: output.graphic }]);
  };

  return (
    <div>
      {showMobilePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #61dafb',
            borderRadius: '8px',
            padding: '15px',
            width: '90%',
            maxWidth: 'none',
            textAlign: 'center',
            color: '#ffffff',
            boxSizing: 'border-box',
            margin: '0 auto'
          }}>
            <h3 style={{ color: '#61dafb', marginTop: 0 }}>ℹ️ Mobile Device Detected</h3>
            <p>This terminal experience is designed for desktop browsers.</p>
            <p>For the best experience, consider visiting on a desktop computer.</p>
            <button 
              onClick={() => setShowMobilePopup(false)}
              style={{
                backgroundColor: '#61dafb',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      {displayLines.map((line, index) => (
      <DisplayLine key={index} text={line.text} graphic={line.graphic} />
      ))}
      <InputLine ref={inputRef} handleNewLine={handleNewLine} currentPath={currentDirectory.getPath()} commandHistory={commandHistory} currentDirectory={currentDirectory}/>
    </div>
  );
}

export default App;
