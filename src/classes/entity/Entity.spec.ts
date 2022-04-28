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
        collisionBox: { width: 0, height: 0 },
        movementMultiplier: { x: 1, y: 1, z: 1 },
        animation: { frame: 0, speed: 0, name: "default" },
      });
    });
  });

  describe("checkCollisions()", () => {
    it("should return the colliding entities", () => {
      const entities: Entity[] = [];

      for (let index = 0; index < 5; index++) {
        const entity = new Entity(`entity-${index}`, {
          collisionBox: { width: 1, height: 1 },
        });

        entity.position.x = index;
        entity.position.y = index;

        entities.push(entity);
      }

      entities.forEach((entity, index) => {
        const collisions = entity.checkCollisions(
          entities.filter((_, otherIndex) => otherIndex !== index)
        );

        expect(collisions).toStrictEqual([]);
      });

      // ? Moving second entity to collide with the first
      entities[1].position.x = 0.5;
      entities[1].position.y = 0.5;

      entities.forEach((entity, index) => {
        const collisions = entity.checkCollisions(
          entities.filter((_, otherIndex) => otherIndex !== index)
        );

        // ? Only for first and second entity should collide
        if (index === 0) {
          expect(collisions).toStrictEqual([`entity-1`]);
        } else if (index === 1) {
          expect(collisions).toStrictEqual([`entity-0`]);
        } else {
          expect(collisions).toStrictEqual([]);
        }
      });
    });
  });
});
