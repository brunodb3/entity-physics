import { Vector3 } from "three";
import { mocked } from "jest-mock";

import { Entity, Kinematics } from "@classes";

jest.mock("../kinematics");

describe("Entity", () => {
  beforeEach(() => {
    mocked(Kinematics).mockClear();
  });

  it("should create a new Entity", () => {
    const entity = new Entity("some-id");

    expect(entity.id).toBe("some-id");
  });

  describe("addForce()", () => {
    it("should add a force", () => {
      const entity = new Entity("some-id");

      entity.addForce({ x: 1, y: 0 });

      expect(mocked(Kinematics).prototype.addForce).toHaveBeenNthCalledWith(
        1,
        new Vector3(1, 0, 0)
      );
    });

    it("should add a force when running", () => {
      const entity = new Entity("some-id");

      entity.addForce({ x: 1, y: 0 }, true);

      const expectedForce = new Vector3(1, 0, 0);
      expectedForce.multiplyScalar(entity.runningMultiplier);

      expect(mocked(Kinematics).prototype.addForce).toHaveBeenNthCalledWith(
        2,
        expectedForce
      );
    });
  });

  describe("tick()", () => {
    it("should change position based on velocity on tick", () => {
      const entity = new Entity("some-id");

      mocked(Kinematics).prototype.velocity = new Vector3(1, 1, 0);

      expect(entity.position.x).toBe(0);
      expect(entity.position.y).toBe(0);

      entity.tick(1);

      expect(entity.position.x).toBe(1);
      // ? Y position is negative
      expect(entity.position.y).toBe(-1);
    });

    it("should change direction based on position on tick", () => {
      const entity = new Entity("some-id");

      mocked(Kinematics).prototype.velocity = new Vector3(-1, 0, 0);

      expect(entity.direction).toBe("right");

      entity.tick(1);

      expect(entity.direction).toBe("left");
    });
  });
});
