"use client";

import { useEffect, useRef, useState } from "react";
import type * as PhaserNamespace from "phaser";

const PLAYER_ASSET_SRC = "/images/gabey-bird.png";
const PLAYER_TEXTURE_KEY = "gabe-newell";
const PIPE_SPAWN_DELAY_MS = 1450;
const PIPE_CAP_HEIGHT = 24;
const PLAYER_FLAP_VELOCITY = -370;

type PhaserGame = PhaserNamespace.Game;
type ArcadeBody = PhaserNamespace.Physics.Arcade.Body;
type ArcadeGroup = PhaserNamespace.Physics.Arcade.Group;
type ArcadeImage = PhaserNamespace.Physics.Arcade.Image;
type GraphicsObject = PhaserNamespace.GameObjects.Graphics;
type TextObject = PhaserNamespace.GameObjects.Text;
type TimerEvent = PhaserNamespace.Time.TimerEvent;
type PipeObject = PhaserNamespace.GameObjects.Rectangle & { body: ArcadeBody };
type PipePair = {
  hitboxes: PipeObject[];
  pipeWidth: number;
  scored: boolean;
  visual: GraphicsObject;
  x: number;
};

export function GabeyBirdApp() {
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
      class GabeyBirdScene extends Phaser.Scene {
        private background!: GraphicsObject;
        private ground!: GraphicsObject;
        private player!: ArcadeImage;
        private pipes!: ArcadeGroup;
        private scoreText!: TextObject;
        private overlayTitle!: TextObject;
        private overlayScore!: TextObject;
        private actionButton!: TextObject;
        private pipeTimer?: TimerEvent;
        private pipePairs: PipePair[] = [];
        private isRunning = false;
        private isGameOver = false;
        private score = 0;

        constructor() {
          super("GabeyBirdScene");
        }

        preload() {
          this.load.image(PLAYER_TEXTURE_KEY, PLAYER_ASSET_SRC);
        }

        create() {
          this.background = this.add.graphics().setDepth(0);
          this.ground = this.add.graphics().setDepth(8);
          this.pipes = this.physics.add.group({
            allowGravity: false,
            immovable: true,
          });

          this.player = this.physics.add
            .image(this.getPlayerX(), this.getPlayerStartY(), PLAYER_TEXTURE_KEY)
            .setDepth(10);

          this.scoreText = this.add
            .text(18, 14, "0", {
              color: "#ffffff",
              fontFamily: "var(--font-chrome), system-ui, sans-serif",
              fontSize: "34px",
              fontStyle: "700",
              stroke: "#1f3445",
              strokeThickness: 5,
            })
            .setDepth(20);

          this.overlayTitle = this.add
            .text(0, 0, "Gabey Bird", {
              align: "center",
              color: "#ffffff",
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "42px",
              fontStyle: "700",
              stroke: "#20303a",
              strokeThickness: 6,
            })
            .setOrigin(0.5)
            .setDepth(25);

          this.overlayScore = this.add
            .text(0, 0, "", {
              align: "center",
              color: "#ffffff",
              fontFamily: "var(--font-chrome), system-ui, sans-serif",
              fontSize: "16px",
              fontStyle: "700",
              stroke: "#20303a",
              strokeThickness: 3,
            })
            .setOrigin(0.5)
            .setDepth(25);

          this.actionButton = this.add
            .text(0, 0, "Start", {
              align: "center",
              color: "#ffffff",
              fontFamily: "var(--font-chrome), system-ui, sans-serif",
              fontSize: "15px",
              fontStyle: "800",
            })
            .setOrigin(0.5)
            .setPadding(18, 9, 18, 9)
            .setBackgroundColor("#1f3445")
            .setDepth(25)
            .setInteractive({ useHandCursor: true });

          this.actionButton.on("pointerdown", () => this.startGame());
          this.input.on("pointerdown", this.handleInput, this);
          this.input.keyboard?.on("keydown-SPACE", this.handleInput, this);
          this.input.keyboard?.on("keydown-UP", this.handleInput, this);
          this.physics.add.overlap(this.player, this.pipes, this.handleCrash, undefined, this);
          this.scale.on("resize", this.handleResize, this);
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off("resize", this.handleResize, this);
          });

          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
          this.drawWorld();
          this.resetPlayer(false);
          this.showStartOverlay();
        }

        update(_time: number, delta: number) {
          if (!this.isRunning) {
            return;
          }

          const body = this.player.body as ArcadeBody;
          this.player.setAngle(Phaser.Math.Clamp(body.velocity.y / 15, -18, 28));

          if (this.player.y < -36 || this.player.y > this.getGroundTop() - 12) {
            this.endGame();
            return;
          }

          this.updatePipes(delta);
        }

        private handleInput() {
          if (!this.isRunning) {
            this.startGame();
            return;
          }

          this.flap();
        }

        private startGame() {
          if (this.isRunning) {
            return;
          }

          this.clearPipes();
          this.score = 0;
          this.scoreText.setText("0");
          this.isRunning = true;
          this.isGameOver = false;
          this.setOverlayVisible(false);
          this.resetPlayer(true);
          this.flap();
          this.spawnPipePair();
          this.pipeTimer = this.time.addEvent({
            delay: PIPE_SPAWN_DELAY_MS,
            loop: true,
            callback: this.spawnPipePair,
            callbackScope: this,
          });
        }

        private flap() {
          const body = this.player.body as ArcadeBody;
          body.setVelocityY(PLAYER_FLAP_VELOCITY);
          this.tweens.add({
            targets: this.player,
            angle: -16,
            duration: 80,
            ease: "Sine.easeOut",
          });
        }

        private handleCrash() {
          this.endGame();
        }

        private endGame() {
          if (!this.isRunning || this.isGameOver) {
            return;
          }

          this.isRunning = false;
          this.isGameOver = true;
          this.pipeTimer?.remove(false);
          this.pipeTimer = undefined;

          const body = this.player.body as ArcadeBody;
          body.setAllowGravity(false);
          body.setVelocity(0, 0);
          this.stopPipes();
          this.showGameOverOverlay();
        }

        private spawnPipePair() {
          const width = this.scale.width;
          const groundTop = this.getGroundTop();
          const pipeWidth = Phaser.Math.Clamp(Math.round(width * 0.08), 54, 76);
          const gap = Phaser.Math.Clamp(Math.round(this.scale.height * 0.27), 138, 178);
          const minCenterY = Math.round(64 + gap / 2);
          const maxCenterY = Math.round(groundTop - 78 - gap / 2);
          const centerY = Phaser.Math.Between(minCenterY, Math.max(minCenterY, maxCenterY));
          const gapTop = Math.round(centerY - gap / 2);
          const gapBottom = Math.round(centerY + gap / 2);
          const x = width + pipeWidth;
          const topHeight = Math.max(42, gapTop);
          const bottomHeight = Math.max(42, groundTop - gapBottom);

          this.addPipePair(x, pipeWidth, topHeight, gapBottom, bottomHeight);
        }

        private addPipePair(
          x: number,
          pipeWidth: number,
          topHeight: number,
          gapBottom: number,
          bottomHeight: number,
        ) {
          const capWidth = pipeWidth + 18;
          const visual = this.add.graphics().setPosition(x, 0).setDepth(5);

          this.drawPipeSegment(visual, 0, pipeWidth, topHeight, false);
          this.drawPipeSegment(visual, gapBottom, pipeWidth, bottomHeight, false);
          this.drawPipeSegment(
            visual,
            topHeight - PIPE_CAP_HEIGHT,
            capWidth,
            PIPE_CAP_HEIGHT,
            true,
          );
          this.drawPipeSegment(visual, gapBottom, capWidth, PIPE_CAP_HEIGHT, true);

          const hitboxes = [
            this.addPipeHitbox(x, topHeight / 2, pipeWidth, topHeight),
            this.addPipeHitbox(
              x,
              topHeight - PIPE_CAP_HEIGHT / 2,
              capWidth,
              PIPE_CAP_HEIGHT,
            ),
            this.addPipeHitbox(x, gapBottom + PIPE_CAP_HEIGHT / 2, capWidth, PIPE_CAP_HEIGHT),
            this.addPipeHitbox(x, gapBottom + bottomHeight / 2, pipeWidth, bottomHeight),
          ];

          this.pipePairs.push({
            hitboxes,
            pipeWidth: capWidth,
            scored: false,
            visual,
            x,
          });
        }

        private drawPipeSegment(
          visual: GraphicsObject,
          top: number,
          width: number,
          height: number,
          isCap: boolean,
        ) {
          visual.fillStyle(isCap ? 0x5f8c4f : 0x406b3b, 1);
          visual.fillRect(-width / 2, top, width, height);
          visual.lineStyle(3, 0x254627, 0.74);
          visual.strokeRect(-width / 2, top, width, height);
        }

        private addPipeHitbox(x: number, y: number, width: number, height: number) {
          const hitbox = this.add
            .rectangle(x, y, width, height, 0x000000, 0)
            .setVisible(false) as PipeObject;

          this.physics.add.existing(hitbox);
          hitbox.body.setAllowGravity(false);
          hitbox.body.setImmovable(true);
          hitbox.body.setSize(width, height, true);
          this.pipes.add(hitbox);

          return hitbox;
        }

        private updatePipes(delta: number) {
          const movement = (this.getPipeSpeed() * delta) / 1000;
          const activePairs: PipePair[] = [];

          for (const pair of this.pipePairs) {
            pair.x -= movement;
            pair.visual.x = pair.x;

            for (const hitbox of pair.hitboxes) {
              hitbox.x = pair.x;
              hitbox.body.updateFromGameObject();
            }

            if (
              !pair.scored &&
              pair.x + pair.pipeWidth / 2 < this.player.x
            ) {
              pair.scored = true;
              this.score += 1;
              this.scoreText.setText(String(this.score));
              this.tweens.add({
                targets: this.scoreText,
                scale: 1.12,
                yoyo: true,
                duration: 95,
                ease: "Sine.easeOut",
              });
            }

            if (pair.x < -pair.pipeWidth) {
              this.destroyPipePair(pair);
            } else {
              activePairs.push(pair);
            }
          }

          this.pipePairs = activePairs;
        }

        private stopPipes() {
          for (const pair of this.pipePairs) {
            for (const hitbox of pair.hitboxes) {
              hitbox.body.setVelocityX(0);
            }
          }
        }

        private clearPipes() {
          this.pipeTimer?.remove(false);
          this.pipeTimer = undefined;
          for (const pair of this.pipePairs) {
            this.destroyPipePair(pair);
          }
          this.pipePairs = [];
          this.pipes.clear(false, false);
        }

        private destroyPipePair(pair: PipePair) {
          pair.visual.destroy();
          for (const hitbox of pair.hitboxes) {
            hitbox.destroy();
          }
        }

        private resetPlayer(enableGravity: boolean) {
          const { width, height } = this.getPlayerDisplaySize();
          this.player.setDisplaySize(width, height);
          this.player.setPosition(this.getPlayerX(), this.getPlayerStartY());
          this.player.setAngle(0);
          this.player.setVelocity(0, 0);

          const body = this.player.body as ArcadeBody;
          body.enable = true;
          body.setAllowGravity(enableGravity);
          body.setCollideWorldBounds(false);
          body.setSize(430, 430, true);
          body.setOffset(68, 68);
        }

        private drawWorld() {
          const width = this.scale.width;
          const height = this.scale.height;
          const groundTop = this.getGroundTop();

          this.background.clear();
          this.background.fillStyle(0x8dd7e9, 1);
          this.background.fillRect(0, 0, width, height);
          this.background.fillStyle(0xd9f4f6, 0.68);
          this.background.fillRoundedRect(width * 0.12, 72, 100, 26, 13);
          this.background.fillRoundedRect(width * 0.34, 126, 132, 28, 14);
          this.background.fillRoundedRect(width * 0.68, 82, 116, 24, 12);
          this.background.fillStyle(0xb6e3d0, 0.38);
          this.background.fillRect(0, groundTop - 34, width, 34);

          this.ground.clear();
          this.ground.fillStyle(0x7fae5c, 1);
          this.ground.fillRect(0, groundTop, width, 18);
          this.ground.fillStyle(0xc29353, 1);
          this.ground.fillRect(0, groundTop + 18, width, height - groundTop - 18);
          this.ground.lineStyle(2, 0x7a5735, 0.3);

          for (let x = -20; x < width + 40; x += 34) {
            this.ground.lineBetween(x, groundTop + 31, x + 18, groundTop + 18);
          }
        }

        private handleResize() {
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
          this.drawWorld();
          this.layoutHud();

          if (!this.isRunning) {
            this.resetPlayer(false);
          } else {
            const { width, height } = this.getPlayerDisplaySize();
            this.player.setDisplaySize(width, height);
          }
        }

        private layoutHud() {
          const centerX = this.scale.width / 2;
          const centerY = this.scale.height * 0.38;

          this.scoreText.setPosition(18, 14);
          this.overlayTitle.setPosition(centerX, centerY);
          this.overlayScore.setPosition(centerX, centerY + 48);
          this.actionButton.setPosition(centerX, centerY + 100);
        }

        private showStartOverlay() {
          this.overlayTitle.setText("Gabey Bird");
          this.overlayScore.setText("");
          this.actionButton.setText("Start");
          this.layoutHud();
          this.setOverlayVisible(true);
        }

        private showGameOverOverlay() {
          this.overlayTitle.setText("Game Over");
          this.overlayScore.setText(`Score ${this.score}`);
          this.actionButton.setText("Retry");
          this.layoutHud();
          this.setOverlayVisible(true);
        }

        private setOverlayVisible(isVisible: boolean) {
          this.overlayTitle.setVisible(isVisible);
          this.overlayScore.setVisible(isVisible);
          this.actionButton.setVisible(isVisible);
        }

        private getPlayerX() {
          return Phaser.Math.Clamp(Math.round(this.scale.width * 0.24), 92, 164);
        }

        private getPlayerStartY() {
          return Math.round(this.getGroundTop() * 0.45);
        }

        private getPlayerDisplaySize() {
          const width = Phaser.Math.Clamp(Math.round(this.scale.width * 0.11), 62, 78);
          return {
            width,
            height: width,
          };
        }

        private getPipeSpeed() {
          return Phaser.Math.Clamp(Math.round(this.scale.width * 0.33), 190, 250);
        }

        private getGroundTop() {
          const groundHeight = Phaser.Math.Clamp(
            Math.round(this.scale.height * 0.15),
            58,
            88,
          );

          return this.scale.height - groundHeight;
        }
      }

      const config = {
        type: Phaser.AUTO,
        parent: gameHostRef.current,
        backgroundColor: "#8dd7e9",
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: gameHostRef.current.clientWidth,
          height: gameHostRef.current.clientHeight,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 950 },
            debug: false,
          },
        },
        scene: GabeyBirdScene,
        audio: {
          noAudio: true,
        },
      } satisfies PhaserNamespace.Types.Core.GameConfig;

      gameRef.current = new Phaser.Game(config);
      setIsLoading(false);
    }

    mountGame().catch((error: unknown) => {
      console.error("Unable to load Gabey Bird.", error);

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
    <div className="relative h-full w-full overflow-hidden bg-[#8dd7e9]">
      <div ref={gameHostRef} className="h-full w-full" />

      {isLoading || hasLoadError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#8dd7e9] font-[var(--font-chrome)] text-sm font-semibold text-[#20303a]">
          {hasLoadError ? "Gabey Bird could not start." : "Loading Gabey Bird"}
        </div>
      ) : null}
    </div>
  );
}
