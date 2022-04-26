import { Vector3 } from "three";

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

      expect(addForceSpy).toHaveBeenNthCalledWith(1, new Vector3(1, 0, 0));
    });

    it("should add a force when running", () => {
      const entity = new Entity("some-id");
      const addForceSpy = jest
        .spyOn(entity.kinematics, "addForce")
        .mockImplementation(() => {});

      entity.addForce({ x: 1, y: 0 }, true);

      const expectedForce = new Vector3(1, 0, 0);
      expectedForce.multiplyScalar(entity.runningMultiplier);

      expect(addForceSpy).toHaveBeenNthCalledWith(1, expectedForce);
    });
  });

  describe("tick()", () => {
    it("should change position based on velocity on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Vector3(1, 1, 0);

      expect(entity.position.x).toBe(0);
      expect(entity.position.y).toBe(0);

      entity.tick(1);

      expect(entity.position.x).toBe(1);
      expect(entity.position.y).toBe(1);
    });

    it("should change direction based on position on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Vector3(-1, 0, 0);

      expect(entity.direction).toBe("right");

      entity.tick(1);

      expect(entity.direction).toBe("left");
    });
  });

  describe("toJSON()", () => {
    it("should return entity in JSON", () => {
      const entity = new Entity("some-id");

      expect(entity.toJSON()).toStrictEqual({
        id: "some-id",
        type: "default",
        direction: "right",
        lastInputSequence: 0,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        animation: { frame: 0, speed: 0, name: "default" },
      });
    });
  });
});
