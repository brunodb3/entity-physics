import { Entity } from "@classes";

export class Physics {
  public entities: Entity[];
  public lastTickTime: number;

  private fps: number;

  constructor(options?: { fps?: number }) {
    this.entities = [];
    this.fps = options?.fps || 60;
    this.lastTickTime = Date.now();
  }

  public start(): void {
    setInterval(() => {
      const currentTime = Date.now();
      const lastTickTime = this.lastTickTime || currentTime;
      this.lastTickTime = currentTime;

      // ? deltaTime is in seconds (ms / 1000)
      const deltaTime = (currentTime - lastTickTime) / 1000;

      this.entities.forEach((entity) => {
        entity.tick(deltaTime);
      });
    }, 1000 / this.fps);
  }
}
