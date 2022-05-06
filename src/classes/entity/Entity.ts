import { Vector3 } from "three";

import { IEntity } from "@interfaces";
import { Kinematics } from "@classes";
import { ICollisionEntity, testForCollision } from "@utils";

// @todo: add flexibility for any kind of properties?
// @todo: add collision types:
//        - ghost
//          can't collide with any other entities
//        - static
//          entities may collide, but this.velocity stays the same
//        - kinematic
//          fully dynamic kinematics
export class Entity {
  public id: string;
  public type: string;
  public mass: number;
  public anchor: number;
  public kinematics: Kinematics;
  public runningMultiplier: number;
  public lastInputSequence: number;
  // @todo: add more directions (up, up-right, down-right, down, etc...)
  //        could also make it a circle and the direction is the angle? (number)
  public direction: "left" | "right";
  public entitiesColliding: string[];
  public position: { x: number; y: number; z: number };
  public boundingBox: { width: number; height: number };
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
      mass?: number;
      anchor?: number;
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
      // ? For now, we only support collision boxes
      boundingBox?: {
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
    this.entitiesColliding = [];
    this.mass = options?.mass || 1;
    this.anchor = options?.anchor || 1;
    this.position = { x: 0, y: 0, z: 0 };
    this.type = options?.type || "default";
    this.runningMultiplier = options?.runningMultiplier || 1.5;
    this.boundingBox = {
      width: options?.boundingBox?.width || 0,
      height: options?.boundingBox?.height || 0,
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
    const entityCollisionModel = this.getCollisionModel();

    entities.forEach((each) => {
      const eachCollisionModel = each.getCollisionModel();
      const hit = testForCollision(entityCollisionModel, eachCollisionModel);

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
      mass: this.mass,
      type: this.type,
      anchor: this.anchor,
      direction: this.direction,
      entitiesColliding: this.entitiesColliding,
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
      boundingBox: {
        width: this.boundingBox.width,
        height: this.boundingBox.height,
      },
    };
  }

  public getCollisionModel(): ICollisionEntity {
    return {
      mass: this.mass,
      width: this.boundingBox.width,
      height: this.boundingBox.height,
      velocity: this.kinematics.velocity,
      x: this.position.x - this.boundingBox.width * this.anchor,
      y: this.position.y - this.boundingBox.height * this.anchor,
    };
  }
}
