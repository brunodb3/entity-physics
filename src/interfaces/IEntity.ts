export interface IEntity {
  id: string;
  type: string;
  direction: "left" | "right";
  lastInputSequence: number;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  animation: { frame: number; speed: number; name: string };
  movementMultiplier: { x: number; y: number; z: number };
}
