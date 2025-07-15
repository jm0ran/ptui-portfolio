interface ColoredSegment {
    text: string;
    color?: string;
    backgroundColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    link?: string;
}

interface DisplayLineProps {
    text: string | ColoredSegment[];
    graphic?: string[];
}

const DisplayLine = ({ text, graphic }: DisplayLineProps) => {
    if (typeof text === 'string') {
        return (
            <div className="generic-line">
                {text}
            </div>
        );
    }

    if (graphic) {
        return (
            <div className="two-column-line">
                <div className="text-column">
                    {text.map((segment, index) => {
                        if (segment.link) {
                            return (
                                <a
                                    key={index}
                                    href={segment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="terminal-link"
                                    style={{
                                        color: segment.color,
                                        backgroundColor: segment.backgroundColor,
                                        fontWeight: segment.bold ? 'bold' : 'normal',
                                        fontStyle: segment.italic ? 'italic' : 'normal',
                                        textDecoration: segment.underline ? 'underline' : 'none',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {segment.text}
                                </a>
                            );
                        }
                        return (
                            <span
                                key={index}
                                style={{
                                    color: segment.color,
                                    backgroundColor: segment.backgroundColor,
                                    fontWeight: segment.bold ? 'bold' : 'normal',
                                    fontStyle: segment.italic ? 'italic' : 'normal',
                                    textDecoration: segment.underline ? 'underline' : 'none',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {segment.text}
                            </span>
                        );
                    })}
                </div>
                <div className="graphic-column">
                    {graphic.map((line, index) => (
                        <div key={index} className="graphic-line">
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="generic-line">
            {text.map((segment, index) => {
                if (segment.link) {
                    return (
                        <a
                            key={index}
                            href={segment.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="terminal-link"
                            style={{
                                color: segment.color,
                                backgroundColor: segment.backgroundColor,
                                fontWeight: segment.bold ? 'bold' : 'normal',
                                fontStyle: segment.italic ? 'italic' : 'normal',
                                textDecoration: segment.underline ? 'underline' : 'none',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {segment.text}
                        </a>
                    );
                }
                return (
                    <span
                        key={index}
                        style={{
                            color: segment.color,
                            backgroundColor: segment.backgroundColor,
                            fontWeight: segment.bold ? 'bold' : 'normal',
                            fontStyle: segment.italic ? 'italic' : 'normal',
                            textDecoration: segment.underline ? 'underline' : 'none',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {segment.text}
                    </span>
                );
            })}
        </div>
    );
}

export { DisplayLine };
export type { DisplayLineProps };