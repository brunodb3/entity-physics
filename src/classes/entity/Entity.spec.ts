import Victor from "victor";

import { Entity } from "@classes";

// @todo: enable tests again
describe.skip("Entity", () => {
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

      expect(addForceSpy).toHaveBeenNthCalledWith(1, new Victor(1, 0));
    });
  });

  describe("tick()", () => {
    it("should change position based on velocity on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Victor(1, 1);

      expect(entity.position.x).toBe(0);
      expect(entity.position.y).toBe(0);

      entity.tick(1);

      expect(entity.position.x).toBe(1);
      expect(entity.position.y).toBe(1);
    });

    it("should change direction based on velocity on tick", () => {
      const entity = new Entity("some-id");
      entity.kinematics.velocity = new Victor(-1, 0);

      expect(entity.direction).toBe("right");

      entity.tick(1);

      expect(entity.direction).toBe("left");
    });

    it("should calculate AABB on tick", () => {
      const entity = new Entity("some-id");

      expect(entity.aabb).toStrictEqual({
        min: { x: 0, y: 0 },
        max: { x: 0, y: 0 },
      });

      entity.position.x = 2;
      entity.position.y = 2;

      entity.tick(1);

      expect(entity.aabb).toStrictEqual({
        min: { x: 2, y: 2 },
        max: { x: 2, y: 2 },
      });
    });
  });

  describe("toJSON()", () => {
    it("should return entity in JSON", () => {
      const entity = new Entity("some-id", {
        anchor: 0.5,
        width: 2,
        height: 2,
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
        aabb: { min: { x: -1, y: -1 }, max: { x: 1, y: 1 } },
        boundingBox: {
          topLeftX: -1,
          topLeftY: 1,
          width: 2,
          height: 2,
        },
      });
    });

    it("should return entity in JSON with correct bounding box", () => {
      const entity = new Entity("some-id", {
        anchor: 0.5,
        width: 10,
        height: 10,
        position: { x: -5, y: -5 },
      });

      expect(entity.toJSON()).toStrictEqual({
        mass: 1,
        anchor: 0.5,
        id: "some-id",
        type: "ghost",
        direction: "right",
        movementMultiplier: 1,
        velocity: { x: 0, y: 0 },
        position: { x: -5, y: -5 },
        animation: { frame: 0, speed: 0, name: "default" },
        aabb: { min: { x: -10, y: -10 }, max: { x: 0, y: 0 } },
        boundingBox: {
          topLeftX: -10,
          topLeftY: 0,
          width: 10,
          height: 10,
        },
      });
    });
  });

  describe("getAABB()", () => {
    it("should return the axis-aligned bounding box", () => {
      const entity = new Entity("some-id", {
        anchor: 0.5,
        width: 2,
        height: 2,
      });

      expect(entity.getAABB()).toStrictEqual({
        min: { x: -1, y: -1 },
        max: { x: 1, y: 1 },
      });
    });
  });
});
