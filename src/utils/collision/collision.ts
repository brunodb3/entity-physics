import { Vector2 } from "three";

export interface ICollisionEntity {
  x?: number;
  y?: number;
  mass?: number;
  min: { x: number; y: number };
  max: { x: number; y: number };
  velocity?: { x: number; y: number };
}

export function aabbCollisionTest(
  entity1: ICollisionEntity,
  entity2: ICollisionEntity
): boolean {
  const distanceEntity1 = {
    x: entity1.min.x - entity2.max.x,
    y: entity1.min.y - entity2.max.y,
  };
  const distanceEntity2 = {
    x: entity2.min.x - entity1.max.x,
    y: entity2.min.y - entity1.max.y,
  };

  if (distanceEntity1.x > 0 || distanceEntity1.y > 0) return false;
  if (distanceEntity2.x > 0 || distanceEntity2.y > 0) return false;

  return true;
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
): Vector2 {
  if (!entity1.velocity || !entity2.velocity) {
    return new Vector2(0, 0);
  }

  if (!impulsePower) impulsePower = 5;
  if (!entity1.mass) entity1.mass = 1;
  if (!entity2.mass) entity2.mass = 1;

  const entity1Vector = new Vector2(entity1.x, entity1.y);
  const entity2Vector = new Vector2(entity2.x, entity2.y);

  const collisionVector = new Vector2(
    entity1Vector.x - entity2Vector.x,
    entity1Vector.y - entity2Vector.y
  );

  collisionVector.normalize();

  const relativeVelocityVector = new Vector2(
    entity1.velocity.x - entity2.velocity.x,
    entity1.velocity.y - entity2.velocity.y
  );

  const speed =
    relativeVelocityVector.x * collisionVector.x +
    relativeVelocityVector.y * collisionVector.y;

  const impulse = (impulsePower * speed) / (entity1.mass + entity2.mass);

  collisionVector.multiplyScalar(impulse);

  return collisionVector;
}
