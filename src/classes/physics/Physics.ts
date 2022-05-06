import { Entity } from "@classes";
import { IEntity } from "@interfaces";
import { collisionForce } from "@utils";

export class Physics {
  public entities: Entity[];
  public lastTickTime: number;

  private fps: number;
  private shouldApplyCollisions: boolean;
  private shouldDetectCollisions: boolean;

  constructor(options?: {
    fps?: number;
    shouldDetectCollisions?: boolean;
    shouldApplyCollisions?: boolean;
  }) {
    this.entities = [];
    this.fps = options?.fps || 60;
    this.lastTickTime = Date.now();
    this.shouldApplyCollisions = options?.shouldApplyCollisions || false;
    // ? If shouldApplyCollisions is true, shouldDetectCollisions will also be true
    this.shouldDetectCollisions = options?.shouldApplyCollisions
      ? true
      : options?.shouldDetectCollisions || false;
  }

  public start(callback?: (delta: number) => void): void {
    setInterval(() => {
      const currentTime = Date.now();
      const lastTickTime = this.lastTickTime || currentTime;
      this.lastTickTime = currentTime;

      // ? deltaTime is in seconds (ms / 1000)
      const deltaTime = (currentTime - lastTickTime) / 1000;

      if (callback) callback(deltaTime);

      this.entities.forEach((entity, index) => {
        entity.tick(deltaTime);

        // @todo: apply more efficient algorithms for checking collision?
        // see https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects
        if (this.shouldDetectCollisions) {
          entity.entitiesColliding = entity.checkCollisions(
            this.entities.filter((_, otherIndex) => otherIndex !== index)
          );

          if (this.shouldApplyCollisions) {
            entity.entitiesColliding.forEach((collider) => {
              const colliderEntity = this.entities.find(
                (each) => each.id === collider
              );

              if (!colliderEntity) return;

              this.applyCollisionForces(entity, colliderEntity);
            });
          }
        }
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

  public applyCollisionForces(entity1: Entity, entity2: Entity): void {
    const entity1CollisionModel = entity1.getCollisionModel();
    const entity2CollisionModel = entity2.getCollisionModel();

    const entity1Force = collisionForce(
      entity1CollisionModel,
      entity2CollisionModel
    );
    const entity2Force = collisionForce(
      entity2CollisionModel,
      entity1CollisionModel
    );

    entity1.addForce(entity1Force);
    entity2.addForce(entity2Force);
  }
}
