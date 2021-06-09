import type { Point, Algorithm } from './types'

const isPointEqual = (a: Point, b: Point) => a === b || (a.x === b.x && a.y === b.y)

/** jarvis步进法求最小凸包 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
const jarvis: Algorithm = function* (points) {
  const size = points.length
  if (size < 4) {
    return points
  }

  let start!: Point

  let point: Point
  let i = size
  while (i) {
    point = points[--i]

    if (!start || point.x < start.x || (point.x === start.x && point.y < start.y)) {
      start = point
    }
  }

  const result: Point[] = [start]

  let pointer = 0 // 栈顶
  let startPoint: Point
  let x: number
  let y: number
  let dx: number
  let dy: number
  let j: number
  i = size
  while (i) {
    point = points[--i]
    startPoint = result[pointer]
    if (isPointEqual(point, startPoint)) {
      continue
    }

    result.push(point)
    pointer++

    x = startPoint.x
    y = startPoint.y
    dx = point.x - x
    dy = point.y - y

    j = size
    while (j) {
      point = points[--j]
      yield result.concat(point)

      if (dx * (point.y - y) < (point.x - x) * dy) {
        result[pointer] = point
        dx = point.x - x
        dy = point.y - y
      }
    }

    if (isPointEqual(result[pointer], start)) {
      result.pop()
      break
    }
  }

  return result
}

export default jarvis
