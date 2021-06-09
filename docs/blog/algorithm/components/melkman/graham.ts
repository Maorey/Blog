import type { Point, Algorithm } from './types'

const isPointEqual = (a: Point, b: Point) => a === b || (a.x === b.x && a.y === b.y)

/** [稳定] 将 point 插入 points
 * @param point
 * @param points
 * @param compare 比较方法 返回 true: element > point
 */
function insert(
  point: Point,
  points: Point[],
  compare: (element: Point, point: Point) => boolean
) {
  // 二分查找 [low, high]
  let low = 0
  let mid: number
  let high = points.length - 1
  while (low <= high) {
    mid = (low + high) >> 1 // 除2并向下取整
    if (compare(points[mid], point)) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  // 插入
  // points.splice(low, 0, point)
  mid = points.length
  while (mid > low) {
    points[mid] = points[--mid]
  }
  points[low] = point
}
/** 将点集按与 start→x轴正向 的幅角 排序 (幅角相等按距离)
 * @param points
 * @param start
 * @returns
 */
function sortPoints(points: Point[], start: Point) {
  const result: Point[] = []

  /** 缓存点与起点的角度、距离 */
  const cache = new WeakMap<Point, [/** angle */ number, /** distance */ number]>()
  const getInfo = (point: Point) => {
    let info = cache.get(point)
    if (!info) {
      const distance = ((start.x - point.x) ** 2 + (start.y - point.y) ** 2) ** 0.5
      info = [(point.y - start.y) / distance, distance]
      cache.set(point, info)
    }

    return info
  }

  const compare = (element: Point, point: Point) => {
    const elementInfo = getInfo(element)
    const pointInfo = getInfo(point)

    return elementInfo[0] === pointInfo[0]
      ? elementInfo[1] < pointInfo[1]
      : elementInfo[0] < pointInfo[0]
  }

  let i = points.length
  while (i) {
    isPointEqual(points[--i], start) || insert(points[i], result, compare)
  }

  return result
}

/** graham扫描法求最小凸包 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
const graham: Algorithm = function* (points) {
  let i = points.length
  if (i < 4) {
    return points
  }

  let start!: Point

  let point: Point
  while (i) {
    point = points[--i]

    if (!start || point.x < start.x || (point.x === start.x && point.y < start.y)) {
      start = point
    }
  }

  const result: Point[] = [start]

  let pointer = 1 // 栈顶
  let startPoint: Point
  let endPoint: Point
  points = sortPoints(points, start)
  i = points.length
  i && result.push(points[--i])
  yield result
  while (i) {
    point = points[i - 1]
    yield result.concat(point)
    if (i < 2) {
      result.push(point)
      break
    }

    startPoint = result[pointer - 1]
    endPoint = result[pointer]

    if (
      (endPoint.x - startPoint.x) * (point.y - startPoint.y) <
      (point.x - startPoint.x) * (endPoint.y - startPoint.y)
    ) {
      result.pop()
      pointer--
    } else {
      result.push(point)
      pointer++
      i--
    }
  }

  return result
}

export default graham
