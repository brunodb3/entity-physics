import { Vector2 } from "three";
import {
  aabbCollisionTest,
  collisionForce,
  ICollisionEntity,
} from "./collision";

describe("collision", () => {
  describe("aabbCollisionTest()", () => {
    it("should detect a collision", () => {
      const firstEntity: ICollisionEntity = {
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      };
      const secondEntity: ICollisionEntity = {
        min: { x: 2, y: 2 },
        max: { x: 3, y: 3 },
      };

      expect(aabbCollisionTest(firstEntity, secondEntity)).toBe(false);

      // ? Moving second entity to collide with the first
      secondEntity.min.x = 1;
      secondEntity.min.y = 1;

      expect(aabbCollisionTest(firstEntity, secondEntity)).toBe(true);
    });
  });

  describe("collisionForce()", () => {
    it("should return an empty force if velocity is zero", () => {
      const firstEntity: ICollisionEntity = {
        x: 0,
        y: 0,
        velocity: { x: 0, y: 0 },
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      };
      const secondEntity: ICollisionEntity = {
        x: 2,
        y: 2,
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      };

      expect(collisionForce(firstEntity, secondEntity)).toStrictEqual(
        new Vector2(0, 0)
      );
    });

    it("should return the resulting force of a collision", () => {
      const firstEntity: ICollisionEntity = {
        x: 0,
        y: 0,
        mass: 1,
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
        velocity: { x: 1, y: 0 },
      };
      const secondEntity: ICollisionEntity = {
        x: 2,
        y: 0,
        mass: 1,
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
        velocity: { x: 0, y: 0 },
      };

      expect(collisionForce(firstEntity, secondEntity, 1)).toStrictEqual(
        new Vector2(0.5, -0)
      );

      expect(collisionForce(secondEntity, firstEntity, 1)).toStrictEqual(
        new Vector2(-0.5, -0)
      );
    });
  });
});
