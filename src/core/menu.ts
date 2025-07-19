import type { InputHandler } from "./input";
import type { Options } from "./options";

type MenuOptions = {
  title: string;
  subtitle: string;
  debug: boolean;
};

function runMenuBase(
  ctx: CanvasRenderingContext2D,
  input: InputHandler,
  options: MenuOptions
): Promise<Options> {
  return new Promise((resolve) => {
    let debug = options.debug;

    function drawMenu() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw title
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        options.title,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 - 40
      );

      // Draw subtitle
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText(
        options.subtitle,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 + 20
      );

      // Draw debug toggle info
      ctx.fillStyle = debug ? "#0f0" : "#888";
      ctx.fillText(
        `Debug: ${debug ? "ON" : "OFF"} (press D to toggle)`,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 + 50
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "d" || e.key === "D") {
        debug = !debug;
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    function loop() {
      drawMenu();
      if (input.isSpacePressed()) {
        window.removeEventListener("keydown", handleKeyDown);
        resolve({ isDebug: debug, shouldExit: false });
        return;
      }
      requestAnimationFrame(loop);
    }

    loop();
  });
}

export function runMenuSequence(
  ctx: CanvasRenderingContext2D,
  input: InputHandler
): Promise<Options> {
  return runMenuBase(ctx, input, {
    title: "Welcome to Space Impact!",
    subtitle: "Press Space to Start",
    debug: false,
  });
}

export function runGameOverSequence(
  ctx: CanvasRenderingContext2D,
  input: InputHandler,
  isDebug: boolean
): Promise<Options> {
  return runMenuBase(ctx, input, {
    title: "Game Over!",
    subtitle: "Press Space to Play Again",
    debug: isDebug,
  });
}
