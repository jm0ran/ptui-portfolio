import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { ColoredSegment } from './types';

interface InputLineProps {
    handleNewLine: (text: string) => void;
    currentPath: string;
    commandHistory: string[];
}

export interface InputLineRef {
    focus: () => void;
}

enum InputLineState {
    RECEIVING,
    PROCESSING,
    DISABLED
}

const InputLine = forwardRef<InputLineRef, InputLineProps>(({ handleNewLine, currentPath, commandHistory }, ref) => {
    const [inputState, setInputState] = React.useState(InputLineState.RECEIVING);
    const [historyIndex, setHistoryIndex] = React.useState(-1);
    const [currentInput, setCurrentInput] = React.useState('');
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

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (inputState !== InputLineState.RECEIVING) {
            event.preventDefault();
            return;
        }

        const input = inputRef.current;
        if (!input) return;

        if (event.key === 'ArrowUp') {
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
            <input ref={inputRef} autoComplete="off" id="input-field" type="text" onBeforeInput={handleInput} onKeyDown={handleKeyDown}/>
        </form>
    )
});








export default InputLine;