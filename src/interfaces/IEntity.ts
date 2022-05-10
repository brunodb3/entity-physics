export interface IEntity {
  id: string;
  mass: number;
  anchor: number;
  movementMultiplier: number;
  direction: "left" | "right";
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  type: "ghost" | "static" | "kinematic";
  animation: { frame: number; speed: number; name: string };
  aabb: { min: { x: number; y: number }; max: { x: number; y: number } };
  boundingBox: {
    topLeftX: number;
    topLeftY: number;
    width: number;
    height: number;
  };
}
