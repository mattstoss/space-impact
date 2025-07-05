import { runGame } from "./core/game";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="game-canvas" width="800" height="600"></canvas>
`;

await main().catch((err) => {
  console.error(err);
});

async function main() {
  let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = true;

  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }

  runGame(ctx);
}
