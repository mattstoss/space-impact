import { Enemy, maybeSpawnEnemy } from "./enemy";
import { InputHandler } from "./input";
import { runGameOverSequence, runMenuSequence } from "./menu";
import { isCollision } from "./physics";
import { Player } from "./player";

export async function runGameSequence(ctx: CanvasRenderingContext2D) {
  const input = new InputHandler();
  let options = await runMenuSequence(ctx, input);

  while (!options.shouldExit) {
    await runSingleGame(ctx, options.isDebug);
    options = await runGameOverSequence(ctx, input, options.isDebug);
  }
}

async function runSingleGame(
  ctx: CanvasRenderingContext2D,
  isDebug: boolean = false
) {
  const bulletImage = await loadImage("src/assets/bullet.png");
  const input = new InputHandler();
  const playerImage = await loadImage("src/assets/ship.png");
  const player = new Player(ctx, playerImage, bulletImage, isDebug);
  const enemyImage = await loadImage("src/assets/enemy.png");
  const enemies: Enemy[] = [];
  const heartImage = await loadImage("src/assets/heart.png");

  let enemyToRemove: number | null = null;

  let lives = 3;
  function handlePlayerHurt() {
    lives--;
  }

  return new Promise<void>((resolve) => {
    function loop() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Spawn a new enemy at random intervals
      const newEnemy = maybeSpawnEnemy(ctx, enemyImage, bulletImage, isDebug);
      if (newEnemy) {
        enemies.push(newEnemy);
      }

      // Update player
      player.update(ctx, input);

      // Update all enemies
      for (const enemy of enemies) {
        enemy.update(ctx);
      }

      if (lives <= 0) {
        resolve();
        return;
      }

      // Check if player hurt
      for (const enemy of enemies) {
        if (isCollision(player, enemy)) {
          enemyToRemove = enemy.id;
          handlePlayerHurt();
        }
        for (const bullet of enemy.bullets) {
          if (isCollision(player, bullet)) {
            enemy.removeBullet(bullet.id);
            handlePlayerHurt();
          }
        }
      }

      // Check if enemy is hurt
      for (const bullet of player.bullets) {
        for (const enemy of enemies) {
          if (isCollision(bullet, enemy)) {
            enemyToRemove = enemy.id;
          }
        }
      }

      // Remove enemies that collided with the player
      if (enemyToRemove !== null) {
        const index = enemies.findIndex((e) => e.id === enemyToRemove);
        if (index !== -1) {
          // Remove enemy's bullets
          const enemy = enemies[index];
          for (const bullet of enemy.bullets) {
            enemy.removeBullet(bullet.id);
          }
          enemies.splice(index, 1);
        }
        enemyToRemove = null;
      }

      // Draw player
      player.draw(ctx);

      // Draw enemies
      for (const enemy of enemies) {
        enemy.draw(ctx);
      }

      // Draw hearts
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, 10 + i * (heartImage.width + 5), 10);
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`)); // ← your line
    img.src = url;
  });
}
