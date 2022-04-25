import { mocked } from "jest-mock";

import { Physics, Entity } from "@classes";

jest.useFakeTimers();
jest.mock("../entity");
jest.spyOn(global, "setInterval");

describe("Physics", () => {
  beforeEach(() => {
    mocked(Entity).mockClear();
  });

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

    it("should replace the last tick time with current tick time", () => {
      const physics = new Physics();

      physics.start();

      expect(physics.lastTickTime).toBe(Date.now());

      jest.advanceTimersByTime(1000);

      // ? There's an 8ms delay when running the interval,
      //   probably how long it takes for the method to execute
      expect(physics.lastTickTime).toBe(Date.now() - 8);
    });

    it("should tick the entities on the array at every tick", () => {
      const physics = new Physics();

      physics.start();

      physics.entities.push(new Entity("some-id"));

      // ? 60fps means around 16ms per frame, so we advance by 17 for 1 frame
      jest.advanceTimersByTime(17);

      expect(physics.entities[0].tick).toHaveBeenCalledTimes(1);
      // ? Delta is in seconds, so 16 / 1000
      expect(physics.entities[0].tick).toHaveBeenNthCalledWith(1, 0.016);
    });
  });
});
