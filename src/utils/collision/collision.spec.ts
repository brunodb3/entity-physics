import { Vector3 } from "three";
import {
  testForCollision,
  collisionForce,
  ICollisionEntity,
} from "./collision";

describe("collision", () => {
  describe("testForCollision()", () => {
    it("should detect a collision", () => {
      const firstEntity: ICollisionEntity = { x: 0, y: 0, width: 1, height: 1 };
      const secondEntity: ICollisionEntity = {
        x: 2,
        y: 2,
        width: 1,
        height: 1,
      };

      expect(testForCollision(firstEntity, secondEntity)).toBe(false);

      // ? Moving second entity to collide with the first
      secondEntity.x = 0.5;
      secondEntity.y = 0.5;

      expect(testForCollision(firstEntity, secondEntity)).toBe(true);
    });
  });

  describe("collisionForce()", () => {
    it("should return an empty force if velocity is zero", () => {
      const firstEntity: ICollisionEntity = {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        velocity: { x: 0, y: 0 },
      };
      const secondEntity: ICollisionEntity = {
        x: 2,
        y: 2,
        width: 1,
        height: 1,
      };

      expect(collisionForce(firstEntity, secondEntity)).toStrictEqual(
        new Vector3(0, 0)
      );
    });

    it("should return the resulting force of a collision", () => {
      const firstEntity: ICollisionEntity = {
        x: 0,
        y: 0,
        mass: 1,
        width: 1,
        height: 1,
        velocity: { x: 1, y: 0 },
      };
      const secondEntity: ICollisionEntity = {
        x: 2,
        y: 0,
        mass: 1,
        width: 1,
        height: 1,
        velocity: { x: 0, y: 0 },
      };

      expect(collisionForce(firstEntity, secondEntity, 1)).toStrictEqual(
        new Vector3(-0.5, 0)
      );

      expect(collisionForce(secondEntity, firstEntity, 1)).toStrictEqual(
        new Vector3(0.5, 0)
      );
    });
  });
});
