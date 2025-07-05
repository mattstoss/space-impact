import { drawBoundingBox, imageRect, type HasBoundingBox } from "./physics";

export class Bullet implements HasBoundingBox {
  image: HTMLImageElement;
  id: number;
  x: number;
  y: number;
  isDebug: boolean;

  constructor(
    image: HTMLImageElement,
    id: number,
    x: number,
    y: number,
    isDebug: boolean
  ) {
    this.image = image;
    this.id = id;
    this.x = x;
    this.y = y;
    this.isDebug = isDebug;
  }

  update(direction: "left" | "right") {
    if (direction === "right") {
      this.x += 5;
      return;
    }
    this.x -= 5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y);

    if (this.isDebug) {
      drawBoundingBox(ctx, this);
    }
  }

  getBoundingBox() {
    return imageRect(this.x, this.y, this.image);
  }
}

let lastSpawn = 0;
let nextID = 1;
const minInterval = 500;
const maxInterval = 1500;

export function maybeSpawnBullet(
  ctx: CanvasRenderingContext2D,
  bulletImage: HTMLImageElement,
  isDebug: boolean
): Bullet | undefined {
  const now = performance.now();

  if (
    now - lastSpawn >
    Math.random() * (maxInterval - minInterval) + minInterval
  ) {
    lastSpawn = now;
    const x = ctx.canvas.width;
    const y = Math.random() * (ctx.canvas.height - bulletImage.height);
    return new Bullet(bulletImage, nextID++, x, y, isDebug);
  }

  return undefined;
}
