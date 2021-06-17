import type { Point, Algorithm } from './types'
import { insertAt } from './graham'

const isPointEqual = (a: Point, b: Point) => a === b || (a.x === b.x && a.y === b.y)

function* insertVertex(convex: Point[], vertex: Point, position: number) {
  let pointer = convex.length

  insertAt(convex, vertex, position)
  yield convex.concat(convex[0])

  let middlePointer = position ? position - 1 : pointer
  let endPointer: number
  const startVertex = convex[position]
  let middleVertex = convex[middlePointer]
  let endVertex: Point
  while (middleVertex !== startVertex) {
    endPointer = middlePointer ? middlePointer - 1 : pointer
    endVertex = convex[endPointer]

    if (
      (middleVertex.x - startVertex.x) * (endVertex.y - startVertex.y) <=
      (endVertex.x - startVertex.x) * (middleVertex.y - startVertex.y)
    ) {
      break
    }

    convex.splice(middlePointer, 1) // 优化: 循环外面处理
    pointer--
    position && position--
    middlePointer = position ? position - 1 : pointer
    middleVertex = convex[middlePointer]
    yield convex.concat(convex[0])
  }

  const lastMiddleVertex = middleVertex
  middlePointer = position === pointer ? 0 : position + 1
  middleVertex = convex[middlePointer]
  while (middleVertex !== startVertex && middleVertex !== lastMiddleVertex) {
    endPointer = middlePointer === pointer ? 0 : middlePointer + 1
    endVertex = convex[endPointer]

    if (
      (middleVertex.x - startVertex.x) * (endVertex.y - startVertex.y) >=
      (endVertex.x - startVertex.x) * (middleVertex.y - startVertex.y)
    ) {
      break
    }

    convex.splice(middlePointer, 1) // 优化: 循环外面处理
    pointer--
    middlePointer = middlePointer === pointer ? 0 : middlePointer
    middleVertex = convex[middlePointer]
    yield convex.concat(convex[0])
  }

  return pointer
}

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
  let product: number
  // 构造初始凸包(三角形)
  while (i) {
    point = points[--i]
    endPoint = result[pointer]
    if (isPointEqual(point, endPoint)) {
      continue
    }
    yield result.concat(point, result[0])

    startPoint = result[pointer - 1]
    if (!startPoint) {
      result.push(point)
      pointer++
      continue
    }

    product =
      (endPoint.x - startPoint.x) * (point.y - startPoint.y) -
      (point.x - startPoint.x) * (endPoint.y - startPoint.y)
    if (!product) {
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

    // 保证三个点顺时针方向
    if (product > 0) {
      result.push(point)
    } else {
      result[2] = result[1]
      result[1] = point
    }
    pointer++
    break
  }

  // 依次连接下一个点
  let startPointer: number
  let endPointer: number
  while (i) {
    point = points[--i]
    yield result.concat(point, result[0])

    for (startPointer = 0, endPointer = pointer + 1; endPointer--; startPointer = endPointer) {
      startPoint = result[startPointer]
      endPoint = result[endPointer]

      if (
        (endPoint.x - startPoint.x) * (point.y - startPoint.y) >=
        (point.x - startPoint.x) * (endPoint.y - startPoint.y)
      ) {
        // 点在当前凸包外面
        pointer = yield* insertVertex(result, point, startPointer)
        break
      }
    }
  }

  return result
}

export default melkman
