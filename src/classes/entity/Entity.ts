import { Vector3 } from "three";

import { Kinematics } from "@classes";
import { IEntity } from "@interfaces";
import { isBoxColliding } from "@utils";

// @todo: add flexibility for any kind of properties?
export class Entity {
  public id: string;
  public type: string;
  public kinematics: Kinematics;
  public runningMultiplier: number;
  public lastInputSequence: number;
  public direction: "left" | "right";
  public position: { x: number; y: number; z: number };
  public collisionBox: { width: number; height: number };
  public animation: {
    frame: number;
    speed: number;
    name: string;
  };
  public movementMultiplier: {
    x: number;
    y: number;
    z: number;
  };

  constructor(
    id: string,
    options?: {
      type?: string;
      minVelocity?: number;
      maxVelocity?: number;
      acceleration?: number;
      runningMultiplier?: number;
      frictionMultiplier?: number;
      animation?: {
        frame?: number;
        speed?: number;
        name?: string;
      };
      // ? Fow now, we only support collision boxes
      collisionBox?: {
        width?: number;
        height?: number;
      };
      movementMultiplier?: {
        x?: number;
        y?: number;
        z?: number;
      };
    }
  ) {
    this.id = id;
    this.direction = "right";
    this.lastInputSequence = 0;
    this.position = { x: 0, y: 0, z: 0 };
    this.type = options?.type || "default";
    this.runningMultiplier = options?.runningMultiplier || 1.5;
    this.collisionBox = {
      width: options?.collisionBox?.width || 0,
      height: options?.collisionBox?.height || 0,
    };
    this.animation = {
      frame: options?.animation?.frame || 0,
      speed: options?.animation?.speed || 0,
      name: options?.animation?.name || "default",
    };
    this.movementMultiplier = {
      x: options?.movementMultiplier?.x || 1,
      y: options?.movementMultiplier?.y || 1,
      z: options?.movementMultiplier?.z || 1,
    };
    this.kinematics = new Kinematics({
      minVelocity: options?.minVelocity,
      maxVelocity: options?.maxVelocity,
      acceleration: options?.acceleration,
      frictionMultiplier: options?.frictionMultiplier,
    });
  }

  public tick(delta: number): void {
    const { velocity } = this.kinematics;

    this.position.x += velocity.x * delta * this.movementMultiplier.x;
    this.position.y += velocity.y * delta * this.movementMultiplier.y;
    this.position.z += velocity.z * delta * this.movementMultiplier.z;

    if (velocity.x < 0) {
      this.direction = "left";
    }

    if (velocity.x > 0) {
      this.direction = "right";
    }
  }

  public checkCollisions(entities: Entity[]): string[] {
    const collisions: string[] = [];
    const entityCollisionBox = {
      x: this.position.x,
      y: this.position.y,
      width: this.collisionBox.width,
      height: this.collisionBox.height,
    };

    entities.forEach((each) => {
      const eachCollisionBox = {
        x: each.position.x,
        y: each.position.y,
        width: each.collisionBox.width,
        height: each.collisionBox.height,
      };

      const hit = isBoxColliding(entityCollisionBox, eachCollisionBox);

      if (hit) collisions.push(each.id);
    });

    return collisions;
  }

  public addForce(
    force: { x: number; y: number; z?: number },
    running?: boolean
  ): void {
    const forceVector = new Vector3(force.x, force.y, force.z || 0);

    if (running) forceVector.multiplyScalar(this.runningMultiplier);

    this.kinematics.addForce(forceVector);
  }

  public toJSON(): IEntity {
    return {
      id: this.id,
      type: this.type,
      direction: this.direction,
      lastInputSequence: this.lastInputSequence,
      animation: {
        frame: this.animation.frame,
        speed: this.animation.speed,
        name: this.animation.name,
      },
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      velocity: {
        x: this.kinematics.velocity.x,
        y: this.kinematics.velocity.y,
        z: this.kinematics.velocity.z,
      },
      movementMultiplier: {
        x: this.movementMultiplier.x,
        y: this.movementMultiplier.y,
        z: this.movementMultiplier.z,
      },
      collisionBox: {
        width: this.collisionBox.width,
        height: this.collisionBox.height,
      },
    };
  }
}
