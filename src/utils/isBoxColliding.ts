export interface ICollidingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function isBoxColliding(
  boxA: ICollidingBox,
  boxB: ICollidingBox
): boolean {
  return (
    boxA.x + boxA.width > boxB.x &&
    boxA.x < boxB.x + boxB.width &&
    boxA.y + boxA.height > boxB.y &&
    boxA.y < boxB.y + boxB.height
  );
}
