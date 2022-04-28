export interface IEntity {
  id: string;
  type: string;
  lastInputSequence: number;
  direction: "left" | "right";
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  collisionBox: { width: number; height: number };
  movementMultiplier: { x: number; y: number; z: number };
  animation: { frame: number; speed: number; name: string };
}
