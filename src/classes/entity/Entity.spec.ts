import { Vector2 } from "three";

import { Entity } from "@classes";

describe("Entity", () => {
  it("should create a new Entity", () => {
    const entity = new Entity("some-id");

    expect(entity.id).toBe("some-id");
  });

  describe("addForce()", () => {
    it("should add a force", () => {
      const entity = new Entity("some-id");
      const addForceSpy = jest
        .spyOn(entity.kinematics, "addForce")
        .mockImplementation(() => {});

      entity.addForce({ x: 1, y: 0 });

      expect(addForceSpy).toHaveBeenNthCalledWith(1, new Vector2(1, 0));
    });
  });

  describe("tick()", () => {
    it("should change position based on velocity on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Vector2(1, 1);

      expect(entity.position.x).toBe(0);
      expect(entity.position.y).toBe(0);

      entity.tick(1);

      expect(entity.position.x).toBe(1);
      expect(entity.position.y).toBe(1);
    });

    it("should change direction based on velocity on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Vector2(-1, 0);

      expect(entity.direction).toBe("right");

      entity.tick(1);

      expect(entity.direction).toBe("left");
    });
  });

  describe("toJSON()", () => {
    it("should return entity in JSON", () => {
      const entity = new Entity("some-id", {
        anchor: 0.5,
        aabb: {
          min: { x: 0, y: 0 },
          max: { x: 2, y: 2 },
        },
      });

      expect(entity.toJSON()).toStrictEqual({
        mass: 1,
        anchor: 0.5,
        id: "some-id",
        type: "ghost",
        direction: "right",
        movementMultiplier: 1,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        animation: { frame: 0, speed: 0, name: "default" },
        aabb: { min: { x: 0, y: 0 }, max: { x: 2, y: 2 } },
        boundingBox: {
          topLeftX: 0,
          topLeftY: 2,
          width: 2,
          height: 2,
        },
      });
    });

    it("should return entity in JSON with correct bounding box", () => {
      const entity = new Entity("some-id", {
        anchor: 0.5,
        aabb: {
          min: { x: -10, y: -5 },
          max: { x: 5, y: 10 },
        },
      });

      expect(entity.toJSON()).toStrictEqual({
        mass: 1,
        anchor: 0.5,
        id: "some-id",
        type: "ghost",
        direction: "right",
        movementMultiplier: 1,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        animation: { frame: 0, speed: 0, name: "default" },
        aabb: { min: { x: -10, y: -5 }, max: { x: 5, y: 10 } },
        boundingBox: {
          topLeftX: -10,
          topLeftY: 10,
          width: 15,
          height: 15,
        },
      });
    });
  });
});
