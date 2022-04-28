export interface ICollidingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

// ? See https://github.com/kittykatattack/learningPixi#the-hittestrectangle-function
export function isBoxColliding(
  boxA: ICollidingBox,
  boxB: ICollidingBox
): boolean {
  let vx;
  let vy;
  let hit;
  let combinedHalfWidths;
  let combinedHalfHeights;

  hit = false;

  boxA.centerX = boxA.x + boxA.width / 2;
  boxA.centerY = boxA.y + boxA.height / 2;
  boxB.centerX = boxB.x + boxB.width / 2;
  boxB.centerY = boxB.y + boxB.height / 2;

  boxA.halfWidth = boxA.width / 2;
  boxA.halfHeight = boxA.height / 2;
  boxB.halfWidth = boxB.width / 2;
  boxB.halfHeight = boxB.height / 2;

  vx = boxA.centerX - boxB.centerX;
  vy = boxA.centerY - boxB.centerY;

  combinedHalfWidths = boxA.halfWidth + boxB.halfWidth;
  combinedHalfHeights = boxA.halfHeight + boxB.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      hit = true;
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }

  return hit;
}
