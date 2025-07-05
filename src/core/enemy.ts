import { Bullet } from "./bullet";
import {
  drawBoundingBox,
  imageRect,
  imageAtYLimit,
  type HasBoundingBox,
  type Rect,
} from "./physics";

const SPEED = 2;
const VERTICAL_SPEED = 0.7; // Adjust for faster/slower vertical movement
const enemyBulletMinInterval = 2000;
const enemyBulletMaxInterval = 10000;

export class Enemy implements HasBoundingBox {
  enemyImage: HTMLImageElement;
  bulletImage: HTMLImageElement;
  bullets: Bullet[] = [];
  currentRecoil: number = 0;
  x: number;
  y: number;
  vy: number;
  id: number;
  isDebug: boolean;
  private lastBulletSpawn: number = 0;

  constructor(
    enemyImage: HTMLImageElement,
    bulletImg: HTMLImageElement,
    isDebug: boolean,
    x: number,
    y: number,
    id: number
  ) {
    this.enemyImage = enemyImage;
    this.bulletImage = bulletImg;
    this.x = x;
    this.y = y;
    this.vy = Math.random() < 0.5 ? VERTICAL_SPEED : -VERTICAL_SPEED; // random initial direction
    this.id = id;
    this.isDebug = isDebug;
  }

  removeBullet(bulletId: number) {
    const index = this.bullets.findIndex((b) => b.id === bulletId);
    if (index !== -1) {
      this.bullets.splice(index, 1);
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    // Vertical movement
    this.y += this.vy;
    if (imageAtYLimit(ctx, this.enemyImage, this.y, 0)) {
      this.vy *= -1; // bounce off top/bottom
      // Clamp to stay in bounds
      if (this.y < 0) this.y = 0;
      if (this.y + this.enemyImage.height > ctx.canvas.height) {
        this.y = ctx.canvas.height - this.enemyImage.height;
      }
    }

    // Try to spawn a bullet from the enemy's position (each enemy manages its own timer)
    const now = performance.now();
    if (
      now - this.lastBulletSpawn >
      Math.random() * (enemyBulletMaxInterval - enemyBulletMinInterval) +
        enemyBulletMinInterval
    ) {
      this.lastBulletSpawn = now;
      const bulletX = this.x;
      const bulletY =
        this.y + this.enemyImage.height / 2 - this.bulletImage.height / 2;
      this.bullets.push(
        new Bullet(
          this.bulletImage,
          Math.floor(Math.random() * 1e9), // unique-ish id
          bulletX,
          bulletY,
          this.isDebug
        )
      );
    }

    // Update bullets
    for (const bullet of this.bullets) {
      bullet.update("left");
    }

    this.x -= SPEED;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.enemyImage, this.x, this.y);

    // Draw all enemy bullets
    for (const bullet of this.bullets) {
      bullet.draw(ctx);
    }

    if (this.isDebug) {
      drawBoundingBox(ctx, this);
    }
  }

  getBoundingBox(): Rect {
    return imageRect(this.x, this.y, this.enemyImage);
  }
}

let lastEnemySpawn = 0;
let nextEnemyID = 1;
const enemyMinInterval = 3000;
const enemyMaxInterval = 10000;
const ENEMY_STAGING_OFFSET = 200;

export function maybeSpawnEnemy(
  ctx: CanvasRenderingContext2D,
  enemyImage: HTMLImageElement,
  bulletImage: HTMLImageElement,
  isDebug: boolean
): Enemy | undefined {
  const now = performance.now();

  if (
    now - lastEnemySpawn >
    Math.random() * (enemyMaxInterval - enemyMinInterval) + enemyMinInterval
  ) {
    lastEnemySpawn = now;
    const x = ctx.canvas.width + ENEMY_STAGING_OFFSET;
    const y = Math.random() * (ctx.canvas.height - enemyImage.height);
    return new Enemy(enemyImage, bulletImage, isDebug, x, y, nextEnemyID++);
  }

  return undefined;
}
