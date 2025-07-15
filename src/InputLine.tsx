import React, { useRef, useImperativeHandle, forwardRef } from "react";

interface InputLineProps {
    handleNewLine: (text: string) => void;
}

export interface InputLineRef {
    focus: () => void;
}

enum InputLineState {
    RECEIVING,
    PROCESSING,
    DISABLED
}

const InputLine = forwardRef<InputLineRef, InputLineProps>(({ handleNewLine }, ref) => {
    const [inputState, setInputState] = React.useState(InputLineState.RECEIVING);
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

    const handleSubmit = (event: React.FormEvent, handleNewLine: (text: string) => void) => {
        event.preventDefault(); // Prevents default form submission behavior
        const input = event.currentTarget.querySelector('input') as HTMLInputElement;
        if (input) {
            const value = input.value;
            input.value = ''; // Clear the input field
            handleNewLine(value); // Call the function passed from the parent component
            setInputState(InputLineState.PROCESSING); // Change the state to PROCESSING
            setInputState(InputLineState.RECEIVING); // Temporarily set back to receiving as we aren't doing any processing on the line yet 
        }
    }

    return (
        <form className="generic-line" onSubmit={(event => handleSubmit(event, handleNewLine))}>
            <span>jm0ran&gt;&nbsp;</span>
            <input ref={inputRef} autoComplete="off" id="input-field" type="text" onBeforeInput={handleInput}/>
        </form>
    )
});








export default InputLine;