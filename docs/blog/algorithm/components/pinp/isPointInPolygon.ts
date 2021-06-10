import type { Point } from './types'

/** [射线法] 判断一个点是否在一个多边形内(含边界)
 * @param param0
 * @param polygon
 * @returns
 */
export default function isPointInPolygon({ x: px, y: py }: Point, polygon: Point[]) {
  let odd = false // py射线与多边形的所有边的相交次数是否为奇数

  // polygon[i]-polygon[j] 为多边形的一条边
  for (let i = polygon.length, j = 0; i--; j = i) {
    const { x: startX, y: startY } = polygon[i]
    const { x: endX, y: endY } = polygon[j]

    // 点与边的端点重合
    if ((px === startX && py === startY) || (px === endX && py === endY)) {
      return true
    }

    // 点在边的范围内
    if ((py > startY && py <= endY) || (py <= startY && py > endY)) {
      // 边与py射线交点的X坐标
      const x = startX + ((endX - startX) * (py - startY)) / (endY - startY)

      // 点在边上
      if (x === px) {
        return true
      }

      // 射线与边相交
      if (x < px) {
        odd = !odd
      }
    }
  }

  return odd
}
