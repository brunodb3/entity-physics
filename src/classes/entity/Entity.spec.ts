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
      const entity = new Entity("some-id");

      expect(entity.toJSON()).toStrictEqual({
        mass: 1,
        anchor: 1,
        id: "some-id",
        type: "ghost",
        direction: "right",
        movementMultiplier: 1,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        animation: { frame: 0, speed: 0, name: "default" },
        aabb: { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
      });
    });
  });
});
