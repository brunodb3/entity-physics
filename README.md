# Entity Physics

![npm (scoped)](https://img.shields.io/npm/v/@brunodb3/entity-physics?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/@brunodb3/entity-physics?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/@brunodb3/entity-physics?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/brunodb3/entity-physics?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/brunodb3/entity-physics?style=for-the-badge)

Simple entity physics simulation for game worlds. This project is still a work-in-progress.

_This project was created to help creating Northern Guilds, you can find more about the game on [northernguilds.com](https://northernguilds.com/)_

## Usage

Install the package to your project:

```bash
$ npm install --save @brunodb3/entity-physics
# or
$ yarn add @brunodb3/entity-physics
```

Then add it to your game client/server:

```typescript
import { Physics } from "@brunodb3/entity-physics";

// ? Instantiate the Physics processor
//   The default FPS value is 60
const physics = new Physics({ fps: 20 });

// ? Start the ticker (will be called at every frame, depending on desired FPS).
physics.start();
```

You can change the frequency of updates with the `fps` option on the `Physics` class. `{ fps: 60 }` means one frame every 16ms (roughly).

---

You can add entities to the physics processor and add forces to those entities. Their kinematics will be calculated at every tick (velocity, position, direction...):

```typescript
import { Physics, Entity } from "@brunodb3/entity-physics";

const physics = new Physics();

// ? All vectors are Vector3 from ThreeJS, but the Z axis is optional (if not given, will be 0).
//   This allows for 2D worlds as well and isometric 2D with height maps
// ? Entities start with `entity.kinematics.velocity = { x: 0, y: 0, z: 0 }`
const someEntity = new Entity("some-id");

// ? If you want an entity to be processed at every tick, you need to add it to
//   the `entities` array in the physics processor
physics.entities.addEntity(someEntity);

// ? All forces are multiplied by the `deltaTime`, allowing for multiple framerates
//   without compromising the actual processing of the entities
//   (at 20fps the position will be the same as at 60fps)
someEntity.addForce({ x: 1, y: 0 });
```

The force calculations are as follows:

```typescript
newForce = newForce * acceleration; // multiply by acceleration for smoother movement
velocity = velocity + newForce; // add the new force to the velocity
velocity = velocity * frictionMultiplier; // multiply the velocity by a friction multiplier, in order for the entity to stop when the force is 0
```

Entities can have different rates for acceleration, maximum/minimum velocity lengths amongst other options:

```typescript
const entity = new Entity('some-id', {
  runningMultiplier: 1.5, // when running, the force is multiplied by this value
  minVelocity: 0.5,
  maxVelocity: 9.5
  acceleration: 0.7,
  frictionMultiplier: 0.9
  ...
});
```

For more information on how to use the library, see the `.spec` files, as they provide working examples.

# Bruno Duarte Brito - 2022
