import { Vector2 } from "three";

import { Kinematics } from "@classes";

describe("Kinematics", () => {
  it("should create a new Kinematics", () => {
    const kinematics = new Kinematics();

    expect(kinematics.acceleration).toBe(0.7);
    expect(kinematics.minVelocity).toBe(0.5);
    expect(kinematics.frictionMultiplier).toBe(0.9);
    expect(kinematics.maxVelocity).toBe(9.5);
    expect(kinematics.velocity).toStrictEqual(new Vector2(0, 0));
  });

  describe("addForce()", () => {
    it("should add a force to the velocity", () => {
      const kinematics = new Kinematics();

      expect(kinematics.velocity).toStrictEqual(new Vector2(0, 0));

      kinematics.addForce(new Vector2(1, 0));

      const expectedVelocity = new Vector2(1, 0);

      expectedVelocity.multiplyScalar(kinematics.acceleration);
      expectedVelocity.multiplyScalar(kinematics.frictionMultiplier);

      expect(kinematics.velocity).toStrictEqual(expectedVelocity);
    });

    it("should normalize velocity if it's greater than the maximum", () => {
      const kinematics = new Kinematics();

      expect(kinematics.velocity).toStrictEqual(new Vector2(0, 0));

      kinematics.addForce(new Vector2(20, 0));

      const expectedVelocity = new Vector2(20, 0);

      expectedVelocity.multiplyScalar(kinematics.acceleration);
      expectedVelocity.multiplyScalar(kinematics.frictionMultiplier);

      expectedVelocity.normalize();
      expectedVelocity.multiplyScalar(kinematics.maxVelocity);

      expect(kinematics.velocity).toStrictEqual(expectedVelocity);
    });

    it("should set velocity to zero if it's smaller than threshold", () => {
      const kinematics = new Kinematics();

      expect(kinematics.velocity).toStrictEqual(new Vector2(0, 0));

      kinematics.addForce(new Vector2(0.5, 0));

      const expectedVelocity = new Vector2(0.5, 0);

      expectedVelocity.setScalar(0);

      expect(kinematics.velocity).toStrictEqual(expectedVelocity);
    });
  });
});
