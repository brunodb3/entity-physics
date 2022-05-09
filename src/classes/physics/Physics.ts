import { Entity } from "@classes";
import { IEntity } from "@interfaces";
import { aabbCollisionTest, collisionForce } from "@utils";

export class Physics {
  public entities: Entity[];
  public lastTickTime: number;

  private fps: number;

  constructor(options?: { fps?: number }) {
    this.entities = [];
    this.fps = options?.fps || 60;
    this.lastTickTime = Date.now();
  }

  public start(callback?: (delta: number) => void): void {
    setInterval(() => {
      const currentTime = Date.now();
      const lastTickTime = this.lastTickTime || currentTime;
      this.lastTickTime = currentTime;

      // ? deltaTime is in seconds (ms / 1000)
      const deltaTime = (currentTime - lastTickTime) / 1000;

      if (callback) callback(deltaTime);

      this.entities.forEach((entity) => {
        entity.tick(deltaTime);

        if (entity.type === "ghost") return;

        const hits: Entity[] = [];

        const otherEntities = this.entities.filter(
          (each) => each.id !== entity.id
        );

        otherEntities.forEach((each) => {
          if (each.type === "ghost") return;

          const hit = aabbCollisionTest(
            entity.getCollisionModel(),
            each.getCollisionModel()
          );

          if (hit) hits.push(each);
        });

        if (entity.type === "static") return;

        hits.forEach((each) => {
          const impulse = collisionForce(
            entity.getCollisionModel(),
            each.getCollisionModel()
          );

          entity.addForce(impulse);
        });
      });
    }, 1000 / this.fps);
  }

  public addEntity(entity: Entity): void {
    const index = this.entities.findIndex((each) => each.id === entity.id);

    if (index > -1) return;

    this.entities.push(entity);
  }

  public removeEntity(id: string): void {
    const index = this.entities.findIndex((each) => each.id === id);

    if (index < 0) return;

    this.entities.splice(index, 1);
  }

  public entityIds(): string[] {
    return this.entities.map((each) => each.id);
  }

  public jsonEntities(type?: string): IEntity[] {
    let entities = this.entities;

    if (type) {
      entities = entities.filter(
        (each) => each.type.toLowerCase() === type.toLowerCase()
      );
    }

    return entities.map((each) => each.toJSON());
  }
}
