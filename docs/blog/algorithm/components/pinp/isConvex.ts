import type { Point } from './types'

/** [向量叉积] 判断一个多边形是否为凸多边形
 * @param polygon
 * @returns
 */
export default function isConvex(polygon: Point[]) {
  for (let i = polygon.length, j = 0, k = 1, lastTurn = null; i--; k = j, j = i) {
    const p0 = polygon[i]
    const p1 = polygon[j]
    const p2 = polygon[k]
    const turn = (p2.x - p0.x) * (p1.y - p0.y) >= (p1.x - p0.x) * (p2.y - p0.y)
    if (lastTurn === null) {
      lastTurn = turn
    } else if (turn !== lastTurn) {
      return false
    }
  }

  return true
}
