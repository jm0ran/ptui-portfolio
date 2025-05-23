import React from 'react';
import './App.css';
import './Lines.css';
import InputLine from './InputLine';
import {DisplayLine, DisplayLineProps} from './DisplayLine';
import { useState } from 'react';

function App() {
  const [displayLines, setDisplayLines] = useState<DisplayLineProps[]>([]);

  const handleNewLine = (text: string) => {
    setDisplayLines((prevLines) => [...prevLines, { text }]);
  };

  return (
    <div>
      {displayLines.map((line) => (
      <DisplayLine key={crypto.randomUUID()} text={line.text} />
      ))}
      <InputLine handleNewLine={handleNewLine}/>
    </div>
  );
}

export default App;
