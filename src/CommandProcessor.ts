import { Folder, File } from './FileSystem';
import { ColoredSegment, CommandResult } from './types';

export class CommandProcessor {
  private currentDirectory: Folder;
  private setCurrentDirectory: (dir: Folder) => void;

  constructor(currentDirectory: Folder, setCurrentDirectory: (dir: Folder) => void) {
    this.currentDirectory = currentDirectory;
    this.setCurrentDirectory = setCurrentDirectory;
  }

  updateCurrentDirectory(dir: Folder): void {
    this.currentDirectory = dir;
  }

  // System commands
  private clear(): CommandResult {
    return { text: '' };
  }

  // Navigation commands
  private pwd(): CommandResult {
    return { text: this.currentDirectory.getPath() };
  }

  private ls(): CommandResult {
    const children = this.currentDirectory.getChildren();
    if (children.length === 0) {
      return { text: '' };
    }
    const childSegments: ColoredSegment[] = [];
    children.forEach((child, index) => {
      const name = child.getName();
      if (child.isDirectory()) {
        childSegments.push({ text: name + '/', color: '#61dafb', bold: true });
      } else {
        childSegments.push({ text: name, color: '#ffffff' });
      }
      if (index < children.length - 1) {
        childSegments.push({ text: '\n', color: '#ffffff' });
      }
    });
    return { text: childSegments };
  }

  private cd(path: string): CommandResult {
    if (!path) {
      return { text: 'cd: missing directory argument' };
    }
    
    if (path === '..') {
      const parent = this.currentDirectory.getParent();
      if (parent) {
        this.setCurrentDirectory(parent);
        return { text: '' };
      } else {
        return { text: 'cd: already at root directory' };
      }
    }
    
    const target = this.currentDirectory.getChild(path);
    if (!target) {
      return { text: `cd: ${path}: No such file or directory` };
    }
    
    if (!target.isDirectory()) {
      return { text: `cd: ${path}: Not a directory` };
    }
    
    this.setCurrentDirectory(target as Folder);
    return { text: '' };
  }

  // File operations
  private cat(filename: string): CommandResult {
    if (!filename) {
      return { text: 'cat: missing file argument' };
    }
    
    const file = this.currentDirectory.getChild(filename);
    if (!file) {
      return { text: `cat: ${filename}: No such file or directory` };
    }
    
    if (file.isDirectory()) {
      return { text: `cat: ${filename}: Is a directory` };
    }
    
    const fileContent = (file as File).getContent();
    // Convert newlines to proper segments for multiline display
    const lines = fileContent.split('\n');
    const segments: ColoredSegment[] = [];
    
    lines.forEach((line, index) => {
      segments.push({ text: line, color: '#ffffff' });
      if (index < lines.length - 1) {
        segments.push({ text: '\n', color: '#ffffff' });
      }
    });
    
    return { text: segments };
  }

  // Information commands
  private help(): CommandResult {
    return {
      text: [
        { text: 'Available Commands:', color: '#00ff00', bold: true },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Navigation Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'pwd', color: '#ffff00', bold: true },
        { text: '                    Print working directory', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'ls', color: '#ffff00', bold: true },
        { text: '                     List directory contents', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cd <directory>', color: '#ffff00', bold: true },
        { text: '         Change to specified directory', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cd ..', color: '#ffff00', bold: true },
        { text: '                 Go to parent directory', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'File Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cat <filename>', color: '#ffff00', bold: true },
        { text: '         Display file contents', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'System Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'clear', color: '#ffff00', bold: true },
        { text: '                 Clear the terminal screen', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'help', color: '#ffff00', bold: true },
        { text: '                  Show this help message', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Personal Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'whoami', color: '#ffff00', bold: true },
        { text: '               Display personal information', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Tips:', color: '#ff6b35', bold: true },
        { text: '\n• Use ', color: '#ffffff' },
        { text: 'up/down arrows', color: '#32cd32', bold: true },
        { text: ' to navigate command history', color: '#ffffff' },
        { text: '\n• Try ', color: '#ffffff' },
        { text: 'cd jobs', color: '#32cd32', bold: true },
        { text: ' to explore work experience files', color: '#ffffff' }
      ]
    };
  }

  private whoami(): CommandResult {
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
  }

  executeCommand(command: string): CommandResult {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    
    switch (cmd) {
      case 'clear':
        return this.clear();
      case 'pwd':
        return this.pwd();
      case 'ls':
        return this.ls();
      case 'cd':
        return this.cd(parts[1]);
      case 'cat':
        return this.cat(parts[1]);
      case 'help':
        return this.help();
      case 'whoami':
        return this.whoami();
      default:
        return { text: `Command not found: ${command}` };
    }
  }
}