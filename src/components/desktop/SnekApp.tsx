"use client";

import { useEffect, useRef, useState } from "react";
import type * as PhaserNamespace from "phaser";

const GRID_COLUMNS = 24;
const GRID_ROWS = 18;
const HUD_HEIGHT = 70;
const BOARD_MARGIN = 24;
const INITIAL_STEP_DELAY_MS = 155;
const MIN_STEP_DELAY_MS = 82;
const SPEEDUP_PER_APPLE_MS = 5;
const SNEK_STORAGE_KEY = "snek.best-score";
const UI_FONT_FAMILY = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const DISPLAY_FONT_FAMILY = "Georgia, 'Times New Roman', serif";
const SNAKE_HEAD_FILL = { r: 188, g: 241, b: 82 };
const SNAKE_TAIL_FILL = { r: 46, g: 87, b: 48 };
const SNAKE_HEAD_STROKE = { r: 229, g: 255, b: 157 };
const SNAKE_TAIL_STROKE = { r: 39, g: 70, b: 42 };

type PhaserGame = PhaserNamespace.Game;
type GraphicsObject = PhaserNamespace.GameObjects.Graphics;
type TextObject = PhaserNamespace.GameObjects.Text;
type InputPointer = PhaserNamespace.Input.Pointer;
type Direction = "up" | "right" | "down" | "left";

interface GridPoint {
  x: number;
  y: number;
}

interface BoardMetrics {
  cellSize: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const DIRECTION_DELTAS: Record<Direction, GridPoint> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

function areCellsEqual(left: GridPoint, right: GridPoint) {
  return left.x === right.x && left.y === right.y;
}

function isOppositeDirection(left: Direction, right: Direction) {
  const leftDelta = DIRECTION_DELTAS[left];
  const rightDelta = DIRECTION_DELTAS[right];

  return leftDelta.x + rightDelta.x === 0 && leftDelta.y + rightDelta.y === 0;
}

function interpolateColor(start: RgbColor, end: RgbColor, ratio: number) {
  const easedRatio = Math.min(1, Math.max(0, ratio));
  const r = Math.round(start.r + (end.r - start.r) * easedRatio);
  const g = Math.round(start.g + (end.g - start.g) * easedRatio);
  const b = Math.round(start.b + (end.b - start.b) * easedRatio);

  return (r << 16) + (g << 8) + b;
}

export function SnekApp() {
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function mountGame() {
      const Phaser = await import("phaser");

      if (isCancelled || !gameHostRef.current) {
        return;
      }

      // Phaser needs this scene class after the browser-only dynamic import.
      // eslint-disable-next-line react-hooks/unsupported-syntax
      class SnekScene extends Phaser.Scene {
        private world!: GraphicsObject;
        private foodLayer!: GraphicsObject;
        private snakeLayer!: GraphicsObject;
        private overlayPanel!: GraphicsObject;
        private scoreText!: TextObject;
        private bestText!: TextObject;
        private overlayTitle!: TextObject;
        private overlayScore!: TextObject;
        private actionButton!: TextObject;
        private snake: GridPoint[] = [];
        private food: GridPoint | null = null;
        private currentDirection: Direction = "right";
        private pendingDirection: Direction = "right";
        private pointerStart: GridPoint | null = null;
        private status: "idle" | "running" | "gameover" | "won" = "idle";
        private stepAccumulator = 0;
        private elapsedMs = 0;
        private score = 0;
        private bestScore = 0;

        constructor() {
          super("SnekScene");
        }

        create() {
          this.bestScore = this.readBestScore();
          this.world = this.add.graphics().setDepth(0);
          this.foodLayer = this.add.graphics().setDepth(5);
          this.snakeLayer = this.add.graphics().setDepth(10);
          this.overlayPanel = this.add.graphics().setDepth(20);

          this.scoreText = this.add
            .text(0, 0, "Score 0", {
              color: "#17302e",
              fontFamily: UI_FONT_FAMILY,
              fontSize: "18px",
              fontStyle: "bold",
            })
            .setDepth(15);

          this.bestText = this.add
            .text(0, 0, "Best 0", {
              color: "#17302e",
              fontFamily: UI_FONT_FAMILY,
              fontSize: "14px",
              fontStyle: "bold",
            })
            .setOrigin(1, 0)
            .setDepth(15);

          this.overlayTitle = this.add
            .text(0, 0, "Snek", {
              align: "center",
              color: "#fff8e8",
              fontFamily: DISPLAY_FONT_FAMILY,
              fontSize: "44px",
              fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setDepth(25);

          this.overlayScore = this.add
            .text(0, 0, "", {
              align: "center",
              color: "#e4efdc",
              fontFamily: UI_FONT_FAMILY,
              fontSize: "15px",
              fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setDepth(25);

          this.actionButton = this.add
            .text(0, 0, "Start", {
              align: "center",
              color: "#fff8e8",
              fontFamily: UI_FONT_FAMILY,
              fontSize: "15px",
              fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setPadding(20, 9, 20, 9)
            .setBackgroundColor("#c64d3b")
            .setDepth(25)
            .setInteractive({ useHandCursor: true });

          this.actionButton.on("pointerdown", () => this.startGame());
          this.input.on("pointerdown", this.handlePointerDown, this);
          this.input.on("pointerup", this.handlePointerUp, this);
          this.registerKeyboardControls();
          this.scale.on("resize", this.handleResize, this);
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off("resize", this.handleResize, this);
          });

          this.resetGame("right");
          this.showStartOverlay();
        }

        update(_time: number, delta: number) {
          this.elapsedMs += delta;

          if (this.status === "running") {
            this.stepAccumulator += delta;

            while (this.stepAccumulator >= this.getStepDelay()) {
              this.stepAccumulator -= this.getStepDelay();
              this.advanceSnake();

              if (this.status !== "running") {
                break;
              }
            }
          }

          this.drawFrame();
        }

        private registerKeyboardControls() {
          this.input.keyboard?.on("keydown-UP", () => this.handleDirectionInput("up"));
          this.input.keyboard?.on("keydown-W", () => this.handleDirectionInput("up"));
          this.input.keyboard?.on("keydown-RIGHT", () => this.handleDirectionInput("right"));
          this.input.keyboard?.on("keydown-D", () => this.handleDirectionInput("right"));
          this.input.keyboard?.on("keydown-DOWN", () => this.handleDirectionInput("down"));
          this.input.keyboard?.on("keydown-S", () => this.handleDirectionInput("down"));
          this.input.keyboard?.on("keydown-LEFT", () => this.handleDirectionInput("left"));
          this.input.keyboard?.on("keydown-A", () => this.handleDirectionInput("left"));
          this.input.keyboard?.on("keydown-SPACE", () => {
            if (this.status !== "running") {
              this.startGame();
            }
          });
        }

        private handlePointerDown(pointer: InputPointer) {
          this.pointerStart = { x: pointer.x, y: pointer.y };

          if (this.status !== "running") {
            this.startGame();
          }
        }

        private handlePointerUp(pointer: InputPointer) {
          if (!this.pointerStart) {
            return;
          }

          const deltaX = pointer.x - this.pointerStart.x;
          const deltaY = pointer.y - this.pointerStart.y;
          this.pointerStart = null;

          if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 18) {
            return;
          }

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.queueDirection(deltaX > 0 ? "right" : "left");
          } else {
            this.queueDirection(deltaY > 0 ? "down" : "up");
          }
        }

        private handleDirectionInput(direction: Direction) {
          if (this.status !== "running") {
            this.startGame(direction);
            return;
          }

          this.queueDirection(direction);
        }

        private queueDirection(direction: Direction) {
          if (
            isOppositeDirection(direction, this.currentDirection) ||
            isOppositeDirection(direction, this.pendingDirection)
          ) {
            return;
          }

          this.pendingDirection = direction;
        }

        private startGame(initialDirection: Direction = "right") {
          if (this.status === "running") {
            return;
          }

          this.resetGame(initialDirection);
          this.status = "running";
          this.stepAccumulator = 0;
          this.setOverlayVisible(false);
        }

        private resetGame(initialDirection: Direction) {
          this.score = 0;
          this.currentDirection = initialDirection;
          this.pendingDirection = initialDirection;
          this.snake = this.createInitialSnake(initialDirection);
          this.food = this.createFood();
          this.updateScoreText();
          this.drawFrame();
        }

        private createInitialSnake(direction: Direction) {
          const delta = DIRECTION_DELTAS[direction];
          const head = {
            x: Math.floor(GRID_COLUMNS / 2),
            y: Math.floor(GRID_ROWS / 2),
          };

          return [0, 1, 2, 3].map((index) => ({
            x: head.x - delta.x * index,
            y: head.y - delta.y * index,
          }));
        }

        private advanceSnake() {
          this.currentDirection = this.pendingDirection;

          const delta = DIRECTION_DELTAS[this.currentDirection];
          const head = this.snake[0];
          const nextHead = this.wrapCell({
            x: head.x + delta.x,
            y: head.y + delta.y,
          });

          const willEat = Boolean(this.food && areCellsEqual(nextHead, this.food));
          const collisionCells = willEat ? this.snake : this.snake.slice(0, -1);

          if (collisionCells.some((segment) => areCellsEqual(segment, nextHead))) {
            this.endGame(false);
            return;
          }

          this.snake.unshift(nextHead);

          if (willEat) {
            this.score += 1;
            this.updateScoreText();
            this.tweens.add({
              targets: this.scoreText,
              scale: 1.08,
              yoyo: true,
              duration: 90,
              ease: "Sine.easeOut",
            });
            this.food = this.createFood();

            if (!this.food) {
              this.endGame(true);
            }
          } else {
            this.snake.pop();
          }
        }

        private endGame(isWin: boolean) {
          if (this.status !== "running") {
            return;
          }

          this.status = isWin ? "won" : "gameover";

          if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.writeBestScore(this.bestScore);
          }

          this.updateScoreText();
          this.showEndOverlay();
        }

        private createFood() {
          const availableCells: GridPoint[] = [];

          for (let y = 0; y < GRID_ROWS; y += 1) {
            for (let x = 0; x < GRID_COLUMNS; x += 1) {
              const candidate = { x, y };

              if (!this.snake.some((segment) => areCellsEqual(segment, candidate))) {
                availableCells.push(candidate);
              }
            }
          }

          if (availableCells.length === 0) {
            return null;
          }

          return availableCells[Phaser.Math.Between(0, availableCells.length - 1)];
        }

        private drawFrame() {
          this.drawWorld();
          this.drawFood();
          this.drawSnake();
          this.layoutHud();
          this.layoutOverlay();
        }

        private drawWorld() {
          const width = this.scale.width;
          const height = this.scale.height;
          const metrics = this.getBoardMetrics();

          this.world.clear();
          this.world.fillStyle(0xe7eedc, 1);
          this.world.fillRect(0, 0, width, height);
          this.world.fillStyle(0xf1d894, 0.65);
          this.world.fillRect(0, 0, width, Math.max(56, metrics.originY - 16));
          this.world.fillStyle(0xc64d3b, 0.78);
          this.world.fillRect(0, metrics.originY + metrics.height + 12, width, height);
          this.world.fillStyle(0x17302e, 1);
          this.world.fillRoundedRect(
            metrics.originX - 8,
            metrics.originY - 8,
            metrics.width + 16,
            metrics.height + 16,
            8,
          );
          this.world.fillStyle(0x102622, 1);
          this.world.fillRoundedRect(
            metrics.originX,
            metrics.originY,
            metrics.width,
            metrics.height,
            6,
          );
          this.world.lineStyle(1, 0x31554b, 0.4);

          for (let column = 1; column < GRID_COLUMNS; column += 1) {
            const x = metrics.originX + column * metrics.cellSize;
            this.world.lineBetween(x, metrics.originY, x, metrics.originY + metrics.height);
          }

          for (let row = 1; row < GRID_ROWS; row += 1) {
            const y = metrics.originY + row * metrics.cellSize;
            this.world.lineBetween(metrics.originX, y, metrics.originX + metrics.width, y);
          }
        }

        private drawFood() {
          this.foodLayer.clear();

          if (!this.food) {
            return;
          }

          const metrics = this.getBoardMetrics();
          const center = this.getCellCenter(this.food, metrics);
          const pulse = 1 + Math.sin(this.elapsedMs / 150) * 0.06;
          const radius = metrics.cellSize * 0.31 * pulse;

          this.foodLayer.fillStyle(0xe65b45, 1);
          this.foodLayer.fillCircle(center.x, center.y + metrics.cellSize * 0.03, radius);
          this.foodLayer.lineStyle(2, 0x8f2e2a, 0.7);
          this.foodLayer.strokeCircle(center.x, center.y + metrics.cellSize * 0.03, radius);
          this.foodLayer.lineStyle(3, 0x6d4d2a, 1);
          this.foodLayer.lineBetween(
            center.x,
            center.y - radius * 0.8,
            center.x + radius * 0.18,
            center.y - radius * 1.25,
          );
          this.foodLayer.fillStyle(0x8fc15c, 1);
          this.foodLayer.fillEllipse(
            center.x + radius * 0.48,
            center.y - radius * 1.08,
            radius * 0.7,
            radius * 0.34,
          );
        }

        private drawSnake() {
          const metrics = this.getBoardMetrics();

          this.snakeLayer.clear();

          for (let index = this.snake.length - 1; index >= 0; index -= 1) {
            const segment = this.snake[index];
            const isHead = index === 0;
            const inset = Math.max(2, Math.floor(metrics.cellSize * 0.11));
            const x = metrics.originX + segment.x * metrics.cellSize + inset;
            const y = metrics.originY + segment.y * metrics.cellSize + inset;
            const size = metrics.cellSize - inset * 2;
            const gradientRatio = this.getSnakeGradientRatio(index);
            const fillColor = interpolateColor(
              SNAKE_HEAD_FILL,
              SNAKE_TAIL_FILL,
              gradientRatio,
            );
            const strokeColor = interpolateColor(
              SNAKE_HEAD_STROKE,
              SNAKE_TAIL_STROKE,
              gradientRatio,
            );

            this.snakeLayer.fillStyle(fillColor, 1);
            this.snakeLayer.fillRoundedRect(x, y, size, size, Math.max(4, size * 0.28));
            this.snakeLayer.lineStyle(2, strokeColor, isHead ? 0.62 : 0.45);
            this.snakeLayer.strokeRoundedRect(x, y, size, size, Math.max(4, size * 0.28));
          }

          this.drawSnakeFace(metrics);
        }

        private drawSnakeFace(metrics: BoardMetrics) {
          const head = this.snake[0];

          if (!head) {
            return;
          }

          const center = this.getCellCenter(head, metrics);
          const delta = DIRECTION_DELTAS[this.currentDirection];
          const perpendicular = { x: -delta.y, y: delta.x };
          const forwardOffset = metrics.cellSize * 0.18;
          const sideOffset = metrics.cellSize * 0.18;
          const eyeRadius = Math.max(2, metrics.cellSize * 0.08);

          const eyeCenters = [-1, 1].map((side) => ({
            x: center.x + delta.x * forwardOffset + perpendicular.x * sideOffset * side,
            y: center.y + delta.y * forwardOffset + perpendicular.y * sideOffset * side,
          }));

          this.snakeLayer.fillStyle(0xfff8e8, 1);
          for (const eye of eyeCenters) {
            this.snakeLayer.fillCircle(eye.x, eye.y, eyeRadius);
          }

          this.snakeLayer.fillStyle(0x17302e, 1);
          for (const eye of eyeCenters) {
            this.snakeLayer.fillCircle(
              eye.x + delta.x * eyeRadius * 0.35,
              eye.y + delta.y * eyeRadius * 0.35,
              Math.max(1.2, eyeRadius * 0.48),
            );
          }
        }

        private layoutHud() {
          const metrics = this.getBoardMetrics();
          const hudY = Math.max(18, metrics.originY - 50);

          this.scoreText.setPosition(metrics.originX, hudY);
          this.bestText.setPosition(metrics.originX + metrics.width, hudY + 3);
        }

        private layoutOverlay() {
          if (!this.overlayPanel.visible) {
            return;
          }

          const metrics = this.getBoardMetrics();
          const centerX = metrics.originX + metrics.width / 2;
          const centerY = metrics.originY + metrics.height / 2;
          const panelWidth = Phaser.Math.Clamp(metrics.width * 0.58, 230, 340);
          const panelHeight = 176;

          this.overlayPanel.clear();
          this.overlayPanel.fillStyle(0x102622, 0.96);
          this.overlayPanel.fillRoundedRect(
            centerX - panelWidth / 2,
            centerY - panelHeight / 2,
            panelWidth,
            panelHeight,
            8,
          );
          this.overlayPanel.lineStyle(2, 0xfff8e8, 0.2);
          this.overlayPanel.strokeRoundedRect(
            centerX - panelWidth / 2,
            centerY - panelHeight / 2,
            panelWidth,
            panelHeight,
            8,
          );
          this.overlayTitle.setPosition(centerX, centerY - 42);
          this.overlayScore.setPosition(centerX, centerY + 9);
          this.actionButton.setPosition(centerX, centerY + 56);
        }

        private showStartOverlay() {
          this.status = "idle";
          this.overlayTitle.setText("Snek");
          this.overlayScore.setText(`Best ${this.bestScore}`);
          this.actionButton.setText("Start");
          this.actionButton.setBackgroundColor("#c64d3b");
          this.setOverlayVisible(true);
        }

        private showEndOverlay() {
          this.overlayTitle.setText(this.status === "won" ? "You Win" : "Game Over");
          this.overlayScore.setText(`Score ${this.score}  Best ${this.bestScore}`);
          this.actionButton.setText("Retry");
          this.actionButton.setBackgroundColor("#c64d3b");
          this.setOverlayVisible(true);
        }

        private setOverlayVisible(isVisible: boolean) {
          this.overlayPanel.setVisible(isVisible);
          this.overlayTitle.setVisible(isVisible);
          this.overlayScore.setVisible(isVisible);
          this.actionButton.setVisible(isVisible);

          if (!isVisible) {
            this.overlayPanel.clear();
          }
        }

        private updateScoreText() {
          this.scoreText.setText(`Score ${this.score}`);
          this.bestText.setText(`Best ${Math.max(this.score, this.bestScore)}`);
        }

        private wrapCell(cell: GridPoint) {
          return {
            x: (cell.x + GRID_COLUMNS) % GRID_COLUMNS,
            y: (cell.y + GRID_ROWS) % GRID_ROWS,
          };
        }

        private getSnakeGradientRatio(index: number) {
          if (this.snake.length <= 1) {
            return 0;
          }

          return index / (this.snake.length - 1);
        }

        private getBoardMetrics(): BoardMetrics {
          const maxCellWidth = Math.floor((this.scale.width - BOARD_MARGIN * 2) / GRID_COLUMNS);
          const maxCellHeight = Math.floor(
            (this.scale.height - HUD_HEIGHT - BOARD_MARGIN) / GRID_ROWS,
          );
          const cellSize = Phaser.Math.Clamp(
            Math.min(maxCellWidth, maxCellHeight),
            10,
            30,
          );
          const width = cellSize * GRID_COLUMNS;
          const height = cellSize * GRID_ROWS;
          const originX = Math.round((this.scale.width - width) / 2);
          const originY = Math.round(
            HUD_HEIGHT + Math.max(0, (this.scale.height - HUD_HEIGHT - height) / 2),
          );

          return {
            cellSize,
            originX,
            originY,
            width,
            height,
          };
        }

        private getCellCenter(cell: GridPoint, metrics: BoardMetrics) {
          return {
            x: metrics.originX + cell.x * metrics.cellSize + metrics.cellSize / 2,
            y: metrics.originY + cell.y * metrics.cellSize + metrics.cellSize / 2,
          };
        }

        private getStepDelay() {
          return Math.max(
            MIN_STEP_DELAY_MS,
            INITIAL_STEP_DELAY_MS - this.score * SPEEDUP_PER_APPLE_MS,
          );
        }

        private handleResize() {
          this.drawFrame();
        }

        private readBestScore() {
          try {
            const storedValue = window.localStorage.getItem(SNEK_STORAGE_KEY);
            const parsedValue = Number(storedValue);

            return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
          } catch {
            return 0;
          }
        }

        private writeBestScore(score: number) {
          try {
            window.localStorage.setItem(SNEK_STORAGE_KEY, String(score));
          } catch {
            return;
          }
        }
      }

      const config = {
        type: Phaser.AUTO,
        parent: gameHostRef.current,
        backgroundColor: "#e7eedc",
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: gameHostRef.current.clientWidth,
          height: gameHostRef.current.clientHeight,
        },
        scene: SnekScene,
        audio: {
          noAudio: true,
        },
      } satisfies PhaserNamespace.Types.Core.GameConfig;

      gameRef.current = new Phaser.Game(config);
      setIsLoading(false);
    }

    mountGame().catch((error: unknown) => {
      console.error("Unable to load Snek.", error);

      if (!isCancelled) {
        setHasLoadError(true);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e7eedc]">
      <div ref={gameHostRef} className="h-full w-full" />

      {isLoading || hasLoadError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e7eedc] font-[var(--font-chrome)] text-sm font-semibold text-[#17302e]">
          {hasLoadError ? "Snek could not start." : "Loading Snek"}
        </div>
      ) : null}
    </div>
  );
}
