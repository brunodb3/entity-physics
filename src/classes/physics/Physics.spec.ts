import { Physics, Entity } from "@classes";

import { aabbCollisionTest } from "@utils";

jest.useFakeTimers();

jest.mock("../entity");
jest.mock("../../utils/collision");

jest.spyOn(global, "setInterval");

describe("Physics", () => {
  it("should create a new Physics", () => {
    const physics = new Physics();

    expect(physics.entities).toStrictEqual([]);
  });

  describe("start()", () => {
    it("should start a ticker at the set interval", () => {
      const physics = new Physics();

      physics.start();

      expect(setInterval).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        1000 / 60
      );
    });

    it("should call the callback if it was given", () => {
      const callback = jest.fn();

      const physics = new Physics();

      physics.start(callback);

      jest.advanceTimersByTime(17);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenNthCalledWith(1, 0.016);
    });

    it("should replace the last tick time with current tick time", () => {
      const physics = new Physics();

      physics.start();

      expect(physics.lastTickTime).toBe(Date.now());

      jest.advanceTimersByTime(1000);

      // ? There's an 8ms delay when running the interval,
      //   probably how long it takes for the method to execute?
      expect(physics.lastTickTime).toBe(Date.now() - 8);
    });

    it("should tick the entities on the array at every tick", () => {
      const physics = new Physics();

      physics.start();

      physics.addEntity(new Entity("some-id"));

      // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
      jest.advanceTimersByTime(17);

      expect(physics.entities[0].tick).toHaveBeenCalledTimes(1);
      // ? Delta is in seconds, so 16 / 1000
      expect(physics.entities[0].tick).toHaveBeenNthCalledWith(1, 0.016);
    });

    describe("collisions", () => {
      beforeEach(() => {
        (aabbCollisionTest as jest.Mock).mockClear();
      });

      it("should calculate collisions for each entity", () => {
        const entity1 = {
          id: "entity1",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const entity2 = {
          id: "entity2",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const physics = new Physics();

        physics.start();

        physics.addEntity(entity1);
        physics.addEntity(entity2);

        // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
        jest.advanceTimersByTime(17);

        expect(aabbCollisionTest).toHaveBeenCalledTimes(2);
      });

      it("should not calculate collisions for ghost entities", () => {
        const entity1 = {
          id: "entity1",
          type: "ghost",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const entity2 = {
          id: "entity2",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const physics = new Physics();

        physics.start();

        physics.addEntity(entity1);
        physics.addEntity(entity2);

        // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
        jest.advanceTimersByTime(17);

        expect(aabbCollisionTest).toHaveBeenCalledTimes(2);
      });

      it("should calculate the impact results of the collisions", () => {
        const entity1 = {
          id: "entity1",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const entity2 = {
          id: "entity2",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        (aabbCollisionTest as jest.Mock).mockImplementation(() =>
          jest.fn(() => true)
        );

        const physics = new Physics();

        physics.start();

        physics.addEntity(entity1);
        physics.addEntity(entity2);

        // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
        jest.advanceTimersByTime(17);

        expect(entity1.addForce).toHaveBeenCalledTimes(1);
        expect(entity2.addForce).toHaveBeenCalledTimes(1);
      });

      it("should not calculate the impact results of the collisions for static entities", () => {
        const entity1 = {
          id: "entity1",
          type: "static",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        const entity2 = {
          id: "entity2",
          tick: jest.fn(),
          addForce: jest.fn(),
          getCollisionModel: jest.fn(),
        } as unknown as Entity;

        (aabbCollisionTest as jest.Mock).mockImplementation(() =>
          jest.fn(() => true)
        );

        const physics = new Physics();

        physics.start();

        physics.addEntity(entity1);
        physics.addEntity(entity2);

        // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
        jest.advanceTimersByTime(17);

        expect(entity1.addForce).toHaveBeenCalledTimes(0);
        expect(entity2.addForce).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("addEntity()", () => {
    it("should add an entity", () => {
      const physics = new Physics();
      const entity = { id: "some-id" } as Entity;

      physics.addEntity(entity);

      expect(physics.entities).toStrictEqual([entity]);
    });

    it("should not add an entity that already exists", () => {
      const physics = new Physics();
      const entity = { id: "some-id" } as Entity;

      physics.addEntity(entity);

      expect(physics.entities).toStrictEqual([entity]);

      physics.addEntity(entity);

      expect(physics.entities).toStrictEqual([entity]);
    });
  });

  describe("removeEntity()", () => {
    it("should remove an entity", () => {
      const physics = new Physics();
      const entity = { id: "some-id" } as Entity;

      physics.entities = [entity];
      physics.removeEntity(entity.id);

      expect(physics.entities).toStrictEqual([]);
    });

    it("should not remove an entity if it does not exist", () => {
      const physics = new Physics();
      const entity = { id: "some-id" } as Entity;

      physics.entities = [entity];
      physics.removeEntity("some-other-id");

      expect(physics.entities).toStrictEqual([entity]);
    });
  });

  describe("entityIds()", () => {
    it("should return a list of entity ids", () => {
      const physics = new Physics();

      physics.entities = [
        { id: "some-id" } as Entity,
        { id: "some-other-id" } as Entity,
      ];

      expect(physics.entityIds()).toStrictEqual(["some-id", "some-other-id"]);
    });
  });

  describe("jsonEntities()", () => {
    it("should map entities calling the toJSON of each entity", () => {
      const physics = new Physics();

      physics.addEntity(new Entity("some-id"));

      physics.jsonEntities();

      expect(physics.entities[0].toJSON).toHaveBeenCalledTimes(1);
    });

    it("should map entities based on their type", () => {
      const physics = new Physics();

      physics.entities = [
        { type: "1", toJSON: () => ({ id: "1", type: "1" }) } as any,
        { type: "2", toJSON: () => ({ id: "2", type: "2" }) } as any,
      ];

      expect(physics.jsonEntities("1")).toStrictEqual([{ id: "1", type: "1" }]);
    });
  });
});
