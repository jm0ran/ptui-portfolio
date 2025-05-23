interface DisplayLineProps {
    text: string;
}

const DisplayLine = ({ text }: DisplayLineProps) => {
    return (
        <div className="generic-line">
            {text}
        </div>
    );
}

export { DisplayLine };
export type { DisplayLineProps };