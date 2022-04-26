export interface IEntity {
  id: string;
  direction: "left" | "right";
  lastInputSequence: number;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}
