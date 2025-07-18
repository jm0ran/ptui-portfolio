import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { ColoredSegment } from './types';
import { Folder } from './FileSystem';

interface InputLineProps {
    handleNewLine: (text: string) => void;
    currentPath: string;
    commandHistory: string[];
    currentDirectory: Folder;
}

export interface InputLineRef {
    focus: () => void;
}

enum InputLineState {
    RECEIVING,
    PROCESSING,
    DISABLED
}

const InputLine = forwardRef<InputLineRef, InputLineProps>(({ handleNewLine, currentPath, commandHistory, currentDirectory }, ref) => {
    const [inputState, setInputState] = React.useState(InputLineState.RECEIVING);
    const [historyIndex, setHistoryIndex] = React.useState(-1);
    const [currentInput, setCurrentInput] = React.useState('');
    const [tabCompletions, setTabCompletions] = React.useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
    }));

    const handleInput = (event: React.FormEvent) => {
        if(inputState !== InputLineState.RECEIVING) {
            event.preventDefault();
        };
    }

    const handleTabCompletion = (inputValue: string): string => {
        // Don't complete on empty input
        if (!inputValue.trim()) {
            return inputValue;
        }

        // Parse the input to find the part we want to complete
        const words = inputValue.split(' ');
        const lastWord = words[words.length - 1];
        
        // Check if we're continuing an existing completion session
        const isCurrentWordACompletion = tabCompletions.includes(lastWord);
        
        if (tabCompletions.length === 0 || !isCurrentWordACompletion) {
            const availableFiles = currentDirectory.getChildNames();
            const matches = availableFiles.filter(name => 
                name.toLowerCase().startsWith(lastWord.toLowerCase())
            ).sort();

            if (matches.length === 0) {
                return inputValue;
            }

            setTabCompletions(matches);
            
            // Replace the last word with the first match
            const beforeLastWord = words.slice(0, -1).join(' ');
            return beforeLastWord + (beforeLastWord ? ' ' : '') + matches[0];
        } else {
            // Find current position in completions and cycle to next
            const currentIndex = tabCompletions.indexOf(lastWord);
            const nextIndex = (currentIndex + 1) % tabCompletions.length;
            
            // Replace the last word with the next match
            const beforeLastWord = words.slice(0, -1).join(' ');
            return beforeLastWord + (beforeLastWord ? ' ' : '') + tabCompletions[nextIndex];
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (inputState !== InputLineState.RECEIVING) {
            event.preventDefault();
            return;
        }

        const input = inputRef.current;
        if (!input) return;

        if (event.key === 'Tab') {
            event.preventDefault();
            const completedValue = handleTabCompletion(input.value);
            input.value = completedValue;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (commandHistory.length === 0) return;

            if (historyIndex === -1) {
                // Save current input when starting to navigate history
                setCurrentInput(input.value);
                setHistoryIndex(commandHistory.length - 1);
                input.value = commandHistory[commandHistory.length - 1];
            } else if (historyIndex > 0) {
                setHistoryIndex(historyIndex - 1);
                input.value = commandHistory[historyIndex - 1];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIndex === -1) return;

            if (historyIndex < commandHistory.length - 1) {
                setHistoryIndex(historyIndex + 1);
                input.value = commandHistory[historyIndex + 1];
            } else {
                // Return to current input
                setHistoryIndex(-1);
                input.value = currentInput;
            }
        } else {
            // Reset tab completion on typing keys (but not special keys like Shift, Ctrl, etc.)
            if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
                setTabCompletions([]);
            }
        }
    }

    const handleSubmit = (event: React.FormEvent, handleNewLine: (text: string) => void) => {
        event.preventDefault(); // Prevents default form submission behavior
        const input = event.currentTarget.querySelector('input') as HTMLInputElement;
        if (input) {
            const value = input.value;
            input.value = ''; // Clear the input field
            // Reset history navigation state
            setHistoryIndex(-1);
            setCurrentInput('');
            handleNewLine(value); // Call the function passed from the parent component
            setInputState(InputLineState.PROCESSING); // Change the state to PROCESSING
            setInputState(InputLineState.RECEIVING); // Temporarily set back to receiving as we aren't doing any processing on the line yet 
        }
    }

    const renderColoredText = (segments: ColoredSegment[]) => {
        return segments.map((segment, index) => {
            const style: React.CSSProperties = {
                color: segment.color || '#ffffff',
                backgroundColor: segment.backgroundColor || 'transparent',
                fontWeight: segment.bold ? 'bold' : 'normal',
                fontStyle: segment.italic ? 'italic' : 'normal',
                textDecoration: segment.underline ? 'underline' : 'none'
            };

            return (
                <span key={index} style={style}>
                    {segment.text}
                </span>
            );
        });
    };

    const promptSegments: ColoredSegment[] = [
        { text: 'jm0ran', color: '#00ff00', bold: true },
        { text: ':', color: '#ffffff' },
        { text: currentPath, color: '#61dafb', bold: true },
        { text: '$ ', color: '#00ff00', bold: true }
    ];

    return (
        <form className="input-line" onSubmit={(event => handleSubmit(event, handleNewLine))}>
            <span>{renderColoredText(promptSegments)}</span>
            <input ref={inputRef} autoComplete="off" id="input-field" type="text" onBeforeInput={handleInput} onKeyDown={handleKeyDown} placeholder="​"/>
        </form>
    )
});








export default InputLine;