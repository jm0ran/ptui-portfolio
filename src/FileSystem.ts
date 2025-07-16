export abstract class FileSystemItem {
  protected name: string;
  protected parent?: Folder;

  constructor(name: string, parent?: Folder) {
    this.name = name;
    this.parent = parent;
  }

  getName(): string {
    return this.name;
  }

  getParent(): Folder | undefined {
    return this.parent;
  }

  setParent(parent: Folder): void {
    this.parent = parent;
  }

  getPath(): string {
    if (!this.parent) {
      return this.name === '/' ? '/' : `/${this.name}`;
    }
    const parentPath = this.parent.getPath();
    return parentPath === '/' ? `/${this.name}` : `${parentPath}/${this.name}`;
  }

  abstract getSize(): number;
  abstract isDirectory(): boolean;
}

export class File extends FileSystemItem {
  private content: string;

  constructor(name: string, content: string = '', parent?: Folder) {
    super(name, parent);
    this.content = content;
  }

  getContent(): string {
    return this.content;
  }

  setContent(content: string): void {
    this.content = content;
  }

  getSize(): number {
    return this.content.length;
  }

  isDirectory(): boolean {
    return false;
  }
}

export class Folder extends FileSystemItem {
  private children: Map<string, FileSystemItem>;

  constructor(name: string, parent?: Folder) {
    super(name, parent);
    this.children = new Map();
  }

  addChild(item: FileSystemItem): void {
    this.children.set(item.getName(), item);
    item.setParent(this);
  }

  removeChild(name: string): boolean {
    return this.children.delete(name);
  }

  getChild(name: string): FileSystemItem | undefined {
    return this.children.get(name);
  }

  getChildren(): FileSystemItem[] {
    return Array.from(this.children.values());
  }

  getChildNames(): string[] {
    return Array.from(this.children.keys());
  }

  hasChild(name: string): boolean {
    return this.children.has(name);
  }

  getSize(): number {
    let totalSize = 0;
    this.children.forEach(child => {
      totalSize += child.getSize();
    });
    return totalSize;
  }

  isDirectory(): boolean {
    return true;
  }

  findChild(path: string): FileSystemItem | undefined {
    const parts = path.split('/').filter(part => part !== '');
    
    if (parts.length === 0) {
      return this;
    }

    const [firstPart, ...remainingParts] = parts;
    const child = this.getChild(firstPart);

    if (!child) {
      return undefined;
    }

    if (remainingParts.length === 0) {
      return child;
    }

    if (child instanceof Folder) {
      return child.findChild(remainingParts.join('/'));
    }

    return undefined;
  }
}