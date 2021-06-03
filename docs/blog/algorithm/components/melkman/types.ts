export interface Point {
  x: number
  y: number
}

/** 生成最小凸包算法 */
export type Algorithm = (points: Point[]) => Generator<Point[], Point[]>
