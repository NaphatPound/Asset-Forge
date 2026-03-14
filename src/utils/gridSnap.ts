export function snapPosition(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapRotation(degrees: number, snapDegrees: number = 15): number {
  return Math.round(degrees / snapDegrees) * snapDegrees;
}

export function snapScale(value: number, snapSize: number = 0.25): number {
  return Math.round(value / snapSize) * snapSize;
}

export function snapVector3(
  vec: [number, number, number],
  gridSize: number
): [number, number, number] {
  return [
    snapPosition(vec[0], gridSize),
    snapPosition(vec[1], gridSize),
    snapPosition(vec[2], gridSize),
  ];
}
