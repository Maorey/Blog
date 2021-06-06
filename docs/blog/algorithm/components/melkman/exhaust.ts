import type { Point, Algorithm } from './types'

/** 穷举法求最小凸包 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
const exhaust: Algorithm = function* (points: Point[]) {
  const size = points.length
  if (size < 4) {
    return points
  }

  const result: Point[][] = []

  let i = size
  while (i) {
    const p0 = points[--i]
    const { x, y } = p0
    let j = i
    while (j) {
      // 线段 [p0, p1]
      const p1 = points[--j]

      const dx = p1.x - x
      const dy = p1.y - y

      let lastTurn: boolean | null = null

      let k = size
      while (k) {
        if (--k === i || k === j) {
          continue
        }
        // 检查其他点是否在线段所在直线的同一侧
        const p2 = points[k]

        yield result.concat([[p0, p1, p2]])

        const turn = dx * (p2.y - y) > (p2.x - x) * dy
        if (lastTurn === null) {
          lastTurn = turn
        } else if (turn !== lastTurn) {
          lastTurn = null
          break
        }
      }

      if (lastTurn !== null) {
        result.push([p0, p1])
        yield result
      }
    }
  }

  return result
}

export default exhaust
