export interface ColoredSegment {
  text: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string;
}

export interface CommandResult {
  text: string | ColoredSegment[];
  graphic?: string[];
}