import type { Point, Algorithm } from './types'

function* cut(
  points: Point[],
  start: Point,
  middle: Point,
  end: Point,
  result: Point[] // 需要画出来 故
): Generator<Point[], Point[]> {
  // 按顺时针算使叉积为正
  const { x: startX, y: startY } = start
  const startMiddleDx = middle.x - startX
  const startMiddleDy = middle.y - startY
  const startMiddlePoints: Point[] = [] // middleStart顺时针方向 点集
  let startMiddleMax = 0 // middleStart顺时针方向 最大距离 +
  let startMiddle!: Point // middleStart顺时针方向 距离最远点

  const { x: middleX, y: middleY } = middle
  const middleEndDx = end.x - middleX
  const middleEndDy = end.y - middleY
  const middleEndPoints: Point[] = [] // endMiddle顺时针方向 点集
  let middleEndMax = 0 // endMiddle顺时针方向 最大距离 +
  let middleEnd!: Point // endMiddle顺时针方向 距离最远点

  let point: Point
  let area: number
  let i = points.length
  while (i) {
    point = points[--i]

    area = startMiddleDx * (point.y - startY) - (point.x - startX) * startMiddleDy
    if (area > 0) {
      yield result.concat(middle, point)
      startMiddlePoints.push(point)
      if (area > startMiddleMax) {
        startMiddleMax = area
        startMiddle = point
      }
    } else {
      area = middleEndDx * (point.y - middleY) - (point.x - middleX) * middleEndDy
      if (area > 0) {
        yield result.concat(end, point)
        middleEndPoints.push(point)
        if (area > middleEndMax) {
          middleEndMax = area
          middleEnd = point
        }
      }
    }
  }

  if (startMiddle) {
    yield* cut(startMiddlePoints, start, startMiddle, middle, result)
  }
  result.push(middle)
  if (middleEnd) {
    yield* cut(middleEndPoints, middle, middleEnd, end, result)
  }

  return result
}

/** 分治法求最小凸包 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
const divide: Algorithm = function* (points) {
  const size = points.length
  if (size < 4) {
    return points
  }

  let left!: Point
  let right!: Point

  let point: Point
  let i = size
  while (i) {
    point = points[--i]

    if (!left || left.x > point.x) {
      left = point
    }

    if (!right || right.x < point.x) {
      right = point
    }
  }

  const { x, y } = left
  const dx = right.x - x
  const dy = right.y - y

  let max = 0 // 上包最大距离 +
  let min = 0 // 下包最大距离 -

  let top!: Point // 上包距离最远点
  let bottom!: Point // 下包距离最远点

  const up: Point[] = [] // 上包点集
  const down: Point[] = [] // 下包点集

  let area: number
  i = size
  while (i) {
    point = points[--i]
    yield [left, right, point]
    area = dx * (point.y - y) - (point.x - x) * dy

    if (area > 0) {
      up.push(point)
      if (area > max) {
        max = area
        top = point
      }
    } else if (area < 0) {
      down.push(point)
      if (area < min) {
        min = area
        bottom = point
      }
    }
  }

  if (left === right) {
    return [top, bottom]
  }
  if (top === bottom) {
    return [left, right]
  }

  const result: Point[] = [left] // 顺时针
  if (top) {
    yield* cut(up, left, top, right, result)
  }
  result.push(right)
  if (bottom) {
    yield* cut(down, right, bottom, left, result)
  }

  return result
}

export default divide
