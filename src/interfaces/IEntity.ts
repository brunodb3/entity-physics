export interface IEntity {
  id: string;
  type: string;
  mass: number;
  anchor: number;
  lastInputSequence: number;
  entitiesColliding: string[];
  direction: "left" | "right";
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  boundingBox: { width: number; height: number };
  movementMultiplier: { x: number; y: number; z: number };
  animation: { frame: number; speed: number; name: string };
}
