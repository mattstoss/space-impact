import { Bullet } from "./bullet";
import type { InputHandler } from "./input";
import {
  drawBoundingBox,
  imageAtYLimit,
  imageCenterY,
  imageRect,
  type HasBoundingBox,
  type Rect,
} from "./physics";

const SPEED = 8;
const RECOIL_SPEED = 10;

export class Player implements HasBoundingBox {
  playerImage: HTMLImageElement;
  bulletImage: HTMLImageElement;
  bullets: Bullet[] = [];
  currentRecoil: number = 0;
  x: number = 10; // Fixed x position
  y: number;
  isDebug: boolean;

  constructor(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    bulletImg: HTMLImageElement,
    isDebug: boolean
  ) {
    this.playerImage = img;
    this.bulletImage = bulletImg;
    this.y = imageCenterY(ctx, img);
    this.isDebug = isDebug;
  }

  update(ctx: CanvasRenderingContext2D, input: InputHandler) {
    if (input.isSpacePressed() && this.currentRecoil <= 0) {
      const bullet = new Bullet(
        this.bulletImage,
        0,
        this.x + this.playerImage.width,
        this.y + this.playerImage.height / 2 - this.bulletImage.height / 2,
        this.isDebug
      );
      this.bullets.push(bullet);
      this.currentRecoil = RECOIL_SPEED;
    }
    this.currentRecoil--;

    for (const bullet of this.bullets) {
      bullet.update("right");
    }

    let newY = this.y;

    if (input.isArrowUpPressed()) {
      newY -= SPEED;
    }
    if (input.isArrowDownPressed()) {
      newY += SPEED;
    }

    if (!imageAtYLimit(ctx, this.playerImage, newY, 10)) {
      this.y = newY;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const bullet of this.bullets) {
      bullet.draw(ctx);
    }

    ctx.drawImage(this.playerImage, this.x, this.y);

    if (this.isDebug) {
      drawBoundingBox(ctx, this);
    }
  }

  getBoundingBox(): Rect {
    return imageRect(this.x, this.y, this.playerImage);
  }
}
