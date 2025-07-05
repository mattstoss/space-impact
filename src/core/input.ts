export class InputHandler {
  private keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key] = false;
  };

  private isPressed(key: string): boolean {
    return this.keys[key];
  }

  isArrowUpPressed(): boolean {
    return this.isPressed("ArrowUp");
  }

  isArrowDownPressed(): boolean {
    return this.isPressed("ArrowDown");
  }

  isSpacePressed(): boolean {
    return this.isPressed(" ");
  }
}
