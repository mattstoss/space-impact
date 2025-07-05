export function atYLimit(
  ctx: CanvasRenderingContext2D,
  top: number,
  bottom: number,
  margin: number = 0
): boolean {
  const height = ctx.canvas.height;
  return top < margin || bottom > height - margin;
}

export function imageAtYLimit(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  y: number,
  margin: number = 0
): boolean {
  const top = y;
  const bottom = y + image.height;
  return atYLimit(ctx, top, bottom, margin);
}

export function imageCenterY(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
): number {
  return (ctx.canvas.height - image.height) / 2;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function imageRect(x: number, y: number, img: HTMLImageElement): Rect {
  return {
    x,
    y,
    width: img.width,
    height: img.height,
  };
}

export interface HasBoundingBox {
  getBoundingBox(): Rect;
}

export function isCollision(
  first: HasBoundingBox,
  second: HasBoundingBox
): boolean {
  const a = first.getBoundingBox();
  const b = second.getBoundingBox();

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function drawBoundingBox(
  ctx: CanvasRenderingContext2D,
  obj: HasBoundingBox
) {
  const box = obj.getBoundingBox();
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.restore();
}
