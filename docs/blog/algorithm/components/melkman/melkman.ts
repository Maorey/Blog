import type { Point, Algorithm } from './types'

const isPointEqual = (a: Point, b: Point) => a === b || (a.x === b.x && a.y === b.y)

/** melkman算法法求最小凸包 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
const melkman: Algorithm = function* (points) {
  let i = points.length
  if (i < 4) {
    return points
  }

  const result: Point[] = [points[--i]]

  let pointer = 0 // 栈顶
  let startPoint: Point
  let endPoint: Point

  let point: Point
  // 构造初始凸包(三角形)
  while (i) {
    point = points[--i]
    endPoint = result[pointer]
    if (isPointEqual(point, endPoint)) {
      continue
    }
    yield result.concat(point)

    startPoint = result[pointer - 1]
    if (!startPoint) {
      result.push(point)
      pointer++
      continue
    }

    if (
      (endPoint.x - startPoint.x) * (point.y - startPoint.y) ===
      (point.x - startPoint.x) * (endPoint.y - startPoint.y)
    ) {
      // 共线 只保留两端的点叭~
      if (
        (point.x < startPoint.x && point.x < endPoint.x) ||
        (point.y < startPoint.y && point.y < endPoint.y)
      ) {
        result[startPoint.x < endPoint.x || startPoint.y < endPoint.y ? pointer - 1 : pointer] =
          point
      } else if (
        (point.x > startPoint.x && point.x > endPoint.x) ||
        (point.y > startPoint.y && point.y > endPoint.y)
      ) {
        result[startPoint.x > endPoint.x || startPoint.y > endPoint.y ? pointer - 1 : pointer] =
          point
      }
      continue
    }

    result.push(point)
    pointer++
    break
  }

  // 依次连接下一个点
  let startPointer: number
  let endPointer: number
  let lastTurn: boolean | null
  let turn: boolean
  while (i) {
    point = points[--i]
    yield result.concat(point)

    for (
      lastTurn = null, endPointer = pointer + 1, startPointer = 0;
      endPointer--;
      startPointer = endPointer
    ) {
      startPoint = points[startPointer]
      endPoint = points[endPointer]

      turn =
        (endPoint.x - startPoint.x) * (point.y - startPoint.y) >=
        (point.x - startPoint.x) * (endPoint.y - startPoint.y)
      if (lastTurn === null) {
        lastTurn = turn
      } else if (lastTurn !== turn) {
        lastTurn = null
        break
      }
    }

    if (lastTurn === null) {
      // 点在当前凸包外面
      // TODO
    }
  }

  return result
}

export default melkman
