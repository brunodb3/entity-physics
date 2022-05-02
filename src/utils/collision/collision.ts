import { Vector3 } from "three";

export interface ICollisionEntity {
  x: number;
  y: number;
  mass?: number;
  width: number;
  height: number;
  velocity?: { x: number; y: number };
}

export function testForCollision(
  entity1: ICollisionEntity,
  entity2: ICollisionEntity
): boolean {
  return (
    entity1.x < entity2.x + entity2.width &&
    entity1.x + entity1.width > entity2.x &&
    entity1.y < entity2.y + entity2.height &&
    entity1.y + entity1.height > entity2.y
  );
}

// ? This returns the collision force for the first entity. If you want for both,
//   just do the calculation again with the parameters in swapped positions.
//   example:
//            Entity1.force = collisionForce(entity1, entity2)
//            Entity2.force = collisionForce(entity2, entity1)
//
export function collisionForce(
  entity1: ICollisionEntity,
  entity2: ICollisionEntity,
  impulsePower?: number
): Vector3 {
  if (!entity1.velocity || !entity2.velocity) {
    return new Vector3(0, 0);
  }

  const entity1Vector = new Vector3(entity1.x, entity1.y);
  const entity2Vector = new Vector3(entity2.x, entity2.y);

  const collisionVector = new Vector3(
    entity1Vector.x - entity2Vector.x,
    entity1Vector.y - entity2Vector.y
  );

  const distance = entity1Vector.distanceTo(entity2Vector);

  const collisionNormVector = new Vector3(
    collisionVector.x / distance,
    collisionVector.y / distance
  );

  const relativeVelocityVector = new Vector3(
    entity1.velocity.x - entity2.velocity.x,
    entity1.velocity.y - entity2.velocity.y
  );

  const speed =
    relativeVelocityVector.x * collisionNormVector.x +
    relativeVelocityVector.y * collisionNormVector.y;

  const impulse =
    (impulsePower || 5 * speed) / ((entity1.mass || 1) + (entity2.mass || 1));

  return new Vector3(
    impulse * collisionNormVector.x,
    impulse * collisionNormVector.y
  );
}
