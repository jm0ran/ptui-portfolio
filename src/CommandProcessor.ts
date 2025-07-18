import { Folder, File } from './FileSystem';
import { ColoredSegment, CommandResult } from './types';

export class CommandProcessor {
  private currentDirectory: Folder;
  private setCurrentDirectory: (dir: Folder) => void;
  private locationData: any;

  constructor(currentDirectory: Folder, setCurrentDirectory: (dir: Folder) => void, locationData: any = null) {
    this.currentDirectory = currentDirectory;
    this.setCurrentDirectory = setCurrentDirectory;
    this.locationData = locationData;
  }

  updateCurrentDirectory(dir: Folder): void {
    this.currentDirectory = dir;
  }

  updateLocationData(data: any): void {
    this.locationData = data;
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

  // File structure visualization
  private tree(): CommandResult {
    const treeSegments: ColoredSegment[] = [];
    
    // Start with current directory name
    treeSegments.push({ text: this.currentDirectory.getName() === '/' ? '.' : this.currentDirectory.getName(), color: '#61dafb', bold: true });
    treeSegments.push({ text: '\n', color: '#ffffff' });
    
    // Build tree recursively
    this.buildTreeRecursive(this.currentDirectory, '', true, treeSegments);
    
    return { text: treeSegments };
  }

  private buildTreeRecursive(folder: Folder, prefix: string, isLast: boolean, segments: ColoredSegment[]): void {
    const children = folder.getChildren();
    
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1;
      const currentPrefix = prefix + (isLast ? '    ' : '│   ');
      const connector = isLastChild ? '└── ' : '├── ';
      
      // Add the tree connector
      segments.push({ text: prefix + connector, color: '#888888' });
      
      // Add the file/folder name with appropriate styling
      if (child.isDirectory()) {
        segments.push({ text: child.getName() + '/', color: '#61dafb', bold: true });
      } else {
        segments.push({ text: child.getName(), color: '#ffffff' });
      }
      
      segments.push({ text: '\n', color: '#ffffff' });
      
      // Recursively process subdirectories
      if (child.isDirectory()) {
        this.buildTreeRecursive(child as Folder, currentPrefix, isLastChild, segments);
      }
    });
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
        { text: 'Navigation Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'pwd                   ', color: '#ffff00', bold: true },
        { text: 'Print working directory', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'ls                    ', color: '#ffff00', bold: true },
        { text: 'List directory contents', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'tree                  ', color: '#ffff00', bold: true },
        { text: 'Display directory tree structure', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cd <directory>        ', color: '#ffff00', bold: true },
        { text: 'Change to specified directory', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cd ..                 ', color: '#ffff00', bold: true },
        { text: 'Go to parent directory', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'File Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'cat <filename>        ', color: '#ffff00', bold: true },
        { text: 'Display file contents', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'System Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'clear                 ', color: '#ffff00', bold: true },
        { text: 'Clear the terminal screen', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'help                  ', color: '#ffff00', bold: true },
        { text: 'Show this help message', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'status                ', color: '#ffff00', bold: true },
        { text: 'Display system status and user information', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'exit                  ', color: '#ffff00', bold: true },
        { text: 'Close the browser tab', color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Personal Commands:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'whoami                ', color: '#ffff00', bold: true },
        { text: 'Display personal information', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'skills                ', color: '#ffff00', bold: true },
        { text: 'Display technical skills and expertise', color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'open <target>         ', color: '#ffff00', bold: true },
        { text: 'Open LinkedIn or GitHub profile', color: '#ffffff' },
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
        '   /$$$$$ /$$$$$$$  /$$      /$$',
        '   |__  $$| $$__  $$| $$$    /$$$',
        '      | $$| $$  \\ $$| $$$$  /$$$$',
        '      | $$| $$  | $$| $$ $$/$$ $$',
        ' /$$  | $$| $$  | $$| $$  $$$| $$',
        '| $$  | $$| $$  | $$| $$\\  $ | $$',
        '|  $$$$$$/| $$$$$$$/| $$ \\/  | $$',
        ' \\______/ |_______/ |__/     |__/'
      ]
    };
  }

  private open(target: string): CommandResult {
    if (!target) {
      return {
        text: [
          { text: 'Usage: ', color: '#ffffff' },
          { text: 'open <target>', color: '#ffff00', bold: true },
          { text: '\n\nAvailable targets:', color: '#ffffff' },
          { text: '\n  ', color: '#ffffff' },
          { text: 'linkedin', color: '#0077b5', bold: true },
          { text: '    Open LinkedIn profile', color: '#ffffff' },
          { text: '\n  ', color: '#ffffff' },
          { text: 'github', color: '#32cd32', bold: true },
          { text: '      Open GitHub profile', color: '#ffffff' }
        ]
      };
    }

    switch (target.toLowerCase()) {
      case 'linkedin':
        window.open('https://linkedin.com/in/joedmoran', '_blank');
        return {
          text: [
            { text: 'Opening LinkedIn profile...', color: '#0077b5', bold: true }
          ]
        };
      case 'github':
        window.open('https://github.com/jm0ran', '_blank');
        return {
          text: [
            { text: 'Opening GitHub profile...', color: '#32cd32', bold: true }
          ]
        };
      default:
        return {
          text: [
            { text: `Unknown target: ${target}`, color: '#ff6b6b' },
            { text: '\nUse ', color: '#ffffff' },
            { text: 'open', color: '#ffff00', bold: true },
            { text: ' without arguments to see available targets.', color: '#ffffff' }
          ]
        };
    }
  }

  private skills(): CommandResult {
    return {
      text: [
        { text: 'Languages & Frameworks:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Java', color: '#ffff00', bold: true },
        { text: ' (Spring Boot), ', color: '#ffffff' },
        { text: 'Python', color: '#ffff00', bold: true },
        { text: ' (Robot Framework), ', color: '#ffffff' },
        { text: 'C++', color: '#ffff00', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Rust', color: '#ffff00', bold: true },
        { text: ',\n  ', color: '#ffffff' },
        { text: 'JavaScript', color: '#ffff00', bold: true },
        { text: ' (Angular, Express), ', color: '#ffffff' },
        { text: 'PowerShell', color: '#ffff00', bold: true },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Tools & Technologies:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Linux', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Ansible', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Git', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Unit Testing', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'UML', color: '#32cd32', bold: true },
        { text: ',\n  ', color: '#ffffff' },
        { text: 'Atlassian Suite', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Microsoft Office Suite', color: '#32cd32', bold: true },
        { text: ',\n  ', color: '#ffffff' },
        { text: 'MongoDB', color: '#32cd32', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'PostgreSQL', color: '#32cd32', bold: true },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Specialized Skills:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Embedded Systems', color: '#ff69b4', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Web Development', color: '#ff69b4', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'Network Protocols', color: '#ff69b4', bold: true },
        { text: ',\n  ', color: '#ffffff' },
        { text: 'Distributed Systems', color: '#ff69b4', bold: true },
        { text: ', ', color: '#ffffff' },
        { text: 'AI-Driven Testing', color: '#ff69b4', bold: true }
      ]
    };
  }

  private status(): CommandResult {
    const now = new Date();
    const uptime = now.getTime() - (window as any).startTime;
    const uptimeSeconds = Math.floor(uptime / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    
    // Use stored location data or show N/A
    const userInfo = this.locationData 
      ? `${this.locationData.ip} (${this.locationData.city}, ${this.locationData.region}, ${this.locationData.country_name})`
      : 'N/A';

    return {
      text: [
        { text: 'Session Information:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Current Time:     ', color: '#ffff00', bold: true },
        { text: now.toLocaleString(), color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Session Uptime:   ', color: '#ffff00', bold: true },
        { text: `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`, color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'User Location:    ', color: '#ffff00', bold: true },
        { text: userInfo, color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Browser Information:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'User Agent:       ', color: '#ffff00', bold: true },
        { text: navigator.userAgent, color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Language:         ', color: '#ffff00', bold: true },
        { text: navigator.language, color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Platform:         ', color: '#ffff00', bold: true },
        { text: navigator.platform, color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Screen Resolution:', color: '#ffff00', bold: true },
        { text: `${window.screen.width}x${window.screen.height}`, color: '#ffffff' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Viewport Size:    ', color: '#ffff00', bold: true },
        { text: `${window.innerWidth}x${window.innerHeight}`, color: '#ffffff' },
        { text: '\n\n', color: '#ffffff' },
        { text: 'Connection Information:', color: '#61dafb', bold: true },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Online Status:    ', color: '#ffff00', bold: true },
        { text: navigator.onLine ? 'Connected' : 'Offline', color: navigator.onLine ? '#32cd32' : '#ff6b6b' },
        { text: '\n  ', color: '#ffffff' },
        { text: 'Cookies Enabled:  ', color: '#ffff00', bold: true },
        { text: navigator.cookieEnabled ? 'Yes' : 'No', color: navigator.cookieEnabled ? '#32cd32' : '#ff6b6b' }
      ]
    };
  }

  private exit(): CommandResult {
    window.close();
    return {
      text: [
        { text: 'Closing tab...', color: '#ff6b6b', bold: true }
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
      case 'tree':
        return this.tree();
      case 'help':
        return this.help();
      case 'whoami':
        return this.whoami();
      case 'skills':
        return this.skills();
      case 'status':
        return this.status();
      case 'open':
        return this.open(parts[1]);
      case 'exit':
        return this.exit();
      default:
        return { text: `Command not found: ${command}` };
    }
  }
}