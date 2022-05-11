import { World, Entity } from "@classes";

// jest.useFakeTimers();

// jest.mock("../entity");
// jest.mock("../../utils/collision");

// jest.spyOn(global, "setInterval");

// @todo: enable tests again
describe.skip("World", () => {
  it("should create a new World", () => {
    const world = new World();

    expect(world.entities).toStrictEqual([]);
  });

  describe("start()", () => {
    it("should start a ticker at the set interval", () => {
      const world = new World();

      world.start();

      expect(setInterval).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        1000 / 60
      );
    });

    it("should call the callback if it was given", () => {
      const callback = jest.fn();

      const world = new World();

      world.start(callback);

      jest.advanceTimersByTime(17);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenNthCalledWith(1, 0.016);
    });

    it("should replace the last tick time with current tick time", () => {
      const world = new World();

      world.start();

      expect(world.lastTickTime).toBe(Date.now());

      jest.advanceTimersByTime(1000);

      // ? There's an 8ms delay when running the interval,
      //   probably how long it takes for the method to execute?
      expect(world.lastTickTime).toBe(Date.now() - 8);
    });

    it("should tick the entities on the array at every tick", () => {
      const world = new World();

      world.start();

      world.addEntity(new Entity("some-id"));

      // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
      jest.advanceTimersByTime(17);

      expect(world.entities[0].tick).toHaveBeenCalledTimes(1);
      // ? Delta is in seconds, so 16 / 1000
      expect(world.entities[0].tick).toHaveBeenNthCalledWith(1, 0.016);
    });
  });

  describe("addEntity()", () => {
    it("should add an entity", () => {
      const world = new World();
      const entity = { id: "some-id" } as Entity;

      world.addEntity(entity);

      expect(world.entities).toStrictEqual([entity]);
    });

    it("should not add an entity that already exists", () => {
      const world = new World();
      const entity = { id: "some-id" } as Entity;

      world.addEntity(entity);

      expect(world.entities).toStrictEqual([entity]);

      world.addEntity(entity);

      expect(world.entities).toStrictEqual([entity]);
    });
  });

  describe("removeEntity()", () => {
    it("should remove an entity", () => {
      const world = new World();
      const entity = { id: "some-id" } as Entity;

      world.entities = [entity];
      world.removeEntity(entity.id);

      expect(world.entities).toStrictEqual([]);
    });

    it("should not remove an entity if it does not exist", () => {
      const world = new World();
      const entity = { id: "some-id" } as Entity;

      world.entities = [entity];
      world.removeEntity("some-other-id");

      expect(world.entities).toStrictEqual([entity]);
    });
  });

  describe("entityIds()", () => {
    it("should return a list of entity ids", () => {
      const world = new World();

      world.entities = [
        { id: "some-id" } as Entity,
        { id: "some-other-id" } as Entity,
      ];

      expect(world.entityIds()).toStrictEqual(["some-id", "some-other-id"]);
    });
  });

  describe("jsonEntities()", () => {
    it("should map entities calling the toJSON of each entity", () => {
      const world = new World();

      world.addEntity(new Entity("some-id"));

      world.jsonEntities();

      expect(world.entities[0].toJSON).toHaveBeenCalledTimes(1);
    });

    it("should map entities based on their type", () => {
      const world = new World();

      world.entities = [
        { type: "1", toJSON: () => ({ id: "1", type: "1" }) } as any,
        { type: "2", toJSON: () => ({ id: "2", type: "2" }) } as any,
      ];

      expect(world.jsonEntities("1")).toStrictEqual([{ id: "1", type: "1" }]);
    });
  });
});
