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
  const inputRef = useRef<InputLineRef>(null);
  const commandProcessor = useRef(new CommandProcessor(currentDirectory, setCurrentDirectory));

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
    // Focus input field on page load
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Update command processor when current directory changes
    commandProcessor.current.updateCurrentDirectory(currentDirectory);
  }, [currentDirectory]);

  useEffect(() => {
    // Scroll to bottom when new output is added
    window.scrollTo(0, document.body.scrollHeight);
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
      {displayLines.map((line, index) => (
      <DisplayLine key={index} text={line.text} graphic={line.graphic} />
      ))}
      <InputLine ref={inputRef} handleNewLine={handleNewLine} currentPath={currentDirectory.getPath()} commandHistory={commandHistory} currentDirectory={currentDirectory}/>
    </div>
  );
}

export default App;
