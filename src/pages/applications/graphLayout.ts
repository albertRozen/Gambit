interface Point {
  x: number
  y: number
}

export interface PlacedNode extends Point {
  angle: number
}

export const radialLayout = (
  count: number,
  center: Point,
  radius: number,
): PlacedNode[] => {
  return Array.from({ length: count }, (_, index) => {
    const angle = (2 * Math.PI * index) / count - Math.PI / 2
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
      angle,
    }
  })
}
