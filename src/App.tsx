import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './Lines.css';
import InputLine, { InputLineRef } from './InputLine';
import {DisplayLine, DisplayLineProps} from './DisplayLine';

interface ColoredSegment {
  text: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string;
}

interface CommandResult {
  text: string | ColoredSegment[];
  graphic?: string[];
}

function App() {
  const [displayLines, setDisplayLines] = useState<DisplayLineProps[]>([]);
  const inputRef = useRef<InputLineRef>(null);

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

  const executeCommand = (command: string): CommandResult => {
    switch (command.trim().toLowerCase()) {
      case 'clear':
        return { text: '' };
      case 'whoami':
        return {
          text: [
            { text: 'Joseph D. Moran', color: '#00ff00', bold: true },
            { text: ' - ', color: '#ffffff' },
            { text: 'Software Engineering Student', color: '#00bfff', bold: true },
            { text: '\n\n', color: '#ffffff' },
            { text: '• ', color: '#ffff00' },
            { text: 'Fourth-year Software Engineering student at ', color: '#ffffff' },
            { text: 'RIT', color: '#ff6b35', bold: true },
            { text: ' (GPA: 3.96/4.0)', color: '#ffffff' },
            { text: '\n• ', color: '#ffff00' },
            { text: 'Prior internships at ', color: '#ffffff' },
            { text: 'Lockheed Martin', color: '#61dafb', bold: true },
            { text: ' and ', color: '#ffffff' },
            { text: 'Bayer Radiology', color: '#61dafb', bold: true },
            { text: '\n• ', color: '#ffff00' },
            { text: 'Skilled in ', color: '#ffffff' },
            { text: 'Java, Python, C++, Rust, JavaScript', color: '#ff9500', bold: true },
            { text: '\n• ', color: '#ffff00' },
            { text: 'Experience with ', color: '#ffffff' },
            { text: 'embedded systems', color: '#32cd32', bold: true },
            { text: ' and ', color: '#ffffff' },
            { text: 'web development', color: '#ff69b4', bold: true },
            { text: '\n• ', color: '#ffff00' },
            { text: 'Seeking ', color: '#ffffff' },
            { text: 'backend/full-stack developer roles', color: '#00ff7f', bold: true },
            { text: ' - Graduating May 2026', color: '#ffffff' },
            { text: '\n\nContact: ', color: '#ffffff' },
            { text: 'josephdeargmoran@protonmail.com', color: '#87ceeb', underline: true, link: 'mailto:josephdeargmoran@protonmail.com' },
            { text: ' | LinkedIn: ', color: '#ffffff' },
            { text: '/in/joedmoran', color: '#0077b5', underline: true, link: 'https://linkedin.com/in/joedmoran' },
            { text: ' | GitHub: ', color: '#ffffff' },
            { text: 'jm0ran', color: '#32cd32', underline: true, link: 'https://github.com/jm0ran' }
          ],
          graphic: [
            '        ╭─────────────╮',
            '        │  ┌─────────┐ │',
            '        │  │ >_      │ │',
            '        │  │         │ │',
            '        │  │  ●   ●  │ │',
            '        │  │    ○    │ │',
            '        │  │  \\___/  │ │',
            '        │  │         │ │',
            '        │  └─────────┘ │',
            '        │      ___     │',
            '        │     /   \\    │',
            '        │    │  ●  │   │',
            '        │     \\___/    │',
            '        ╰─────────────╯',
            '            ████████',
            '          ██████████████'
          ]
        };
      default:
        return { text: `Command not found: ${command}` };
    }
  };

  const handleNewLine = (text: string) => {
    // Add the command input
    setDisplayLines((prevLines) => [...prevLines, { text: `jm0ran> ${text}` }]);
    
    // Execute command and add output
    const output = executeCommand(text);
    
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
      <InputLine ref={inputRef} handleNewLine={handleNewLine}/>
    </div>
  );
}

export default App;
