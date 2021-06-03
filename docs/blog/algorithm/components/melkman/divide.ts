import type { Point, Algorithm } from './types'

const insert = (point: Point, points: Point[], sortField: keyof Point) => {
  // 二分查找 [low, high)
  const value = point[sortField]
  let low = 0
  let high = points.length
  let i: number
  while (low < high) {
    i = (low + high) >> 1 // 除2并向下取整
    if (points[i][sortField] > value) {
      high = i - 1
    } else {
      low = i + 1
    }
  }

  // 插入
  // points.splice(low, 0, point)
  i = points.length
  while (i > low) {
    points[i] = points[--i]
  }
  points[low] = point
}

/** 划分角落
 * 上下极值点y坐标相等时, 按x坐标升序
 * 左右极值点x坐标相等时, 按y坐标升序
 */
const enum Corner {
  all,
  leftTop,
  rightTop,
  leftBottom,
  rightBottom,
}
/** 比较极值点
 * @param extreme 当前极值点
 * @param point
 *
 * @returns false: 非极值点 true: 新极值点; x/y(排序字段): 与当前极值点相等
 */
type Compare = (extreme: Point, point: Point) => boolean | keyof Point
/** 更新极值点集
 * @param point
 * @param extremes
 * @param compare
 */
const updateExtremes = (point: Point, extremes: Point[], compare: Compare) => {
  if (extremes.length) {
    const result = compare(extremes[0], point)
    if (result === true) {
      extremes.splice(0, extremes.length, point)
    } else if (result) {
      insert(point, extremes, result)
    }
  } else {
    extremes.push(point)
  }
}
const compareLeft: Compare = (e, p) => (e.x === p.x ? 'y' : e.x > p.x)
const compareRight: Compare = (e, p) => (e.x === p.x ? 'y' : e.x < p.x)
const compareTop: Compare = (e, p) => (e.y === p.y ? 'x' : e.y < p.y)
const compareBottom: Compare = (e, p) => (e.y === p.y ? 'x' : e.y > p.y)

interface VectorInfo {
  x: number
  y: number
  dx: number
  dy: number
}
const getVectorInfo = (
  xPoints: Point[],
  yPoints: Point[],
  corner: Exclude<Corner, Corner.all>
): VectorInfo => {
  let p0: Point
  let p1: Point
  switch (corner) {
    case Corner.leftTop:
      p0 = yPoints[0]
      p1 = xPoints[xPoints.length - 1]
      break
    case Corner.rightTop:
      p0 = xPoints[yPoints.length - 1]
      p1 = yPoints[xPoints.length - 1]
      break
    case Corner.leftBottom:
      p0 = xPoints[0]
      p1 = yPoints[0]
      break
    case Corner.rightBottom:
      p0 = yPoints[yPoints.length - 1]
      p1 = xPoints[0]
      break
  }

  const { x, y } = p0
  return { x, y, dx: p1.x - x, dy: p1.y - y }
}
const isClockwise = (point: Point, vectorInfo: VectorInfo) =>
  vectorInfo.dx * (point.y - vectorInfo.y) > (point.x - vectorInfo.x) * vectorInfo.dy

interface UncertainWithCorner extends Array<Point> {
  corner: Exclude<Corner, Corner.all>
}
/** 对指定的四个角落之一进行划分
 * @param points
 * @param corner
 * @returns [x极值点集, y极值点集, 相同角落待确定点集]
 */
const partitionCorner = (
  points: Point[],
  corner: Exclude<Corner, Corner.all>
): [Point[], Point[], UncertainWithCorner] => {
  const xPoints: Point[] = []
  const yPoints: Point[] = []

  let i = points.length
  if (i < 2) {
    return [points, xPoints, yPoints as UncertainWithCorner]
  }

  let compareX: Compare
  let compareY: Compare
  switch (corner) {
    case Corner.leftTop:
      compareX = compareLeft
      compareY = compareTop
      break
    case Corner.rightTop:
      compareX = compareRight
      compareY = compareTop
      break
    case Corner.leftBottom:
      compareX = compareLeft
      compareY = compareBottom
      break
    case Corner.rightBottom:
      compareX = compareRight
      compareY = compareBottom
      break
    default:
      console.error('partitionCorner: unknown corner ' + corner)
      return [xPoints, yPoints, yPoints as UncertainWithCorner]
  }

  let point: Point
  while (i) {
    point = points[--i]

    updateExtremes(point, xPoints, compareX)
    updateExtremes(point, yPoints, compareY)
  }

  const uncertain: UncertainWithCorner = [] as any
  uncertain.corner = corner
  const vectorInfo = getVectorInfo(xPoints, yPoints, corner)
  i = points.length
  while (i) {
    point = points[--i]
    isClockwise(point, vectorInfo) && uncertain.push(point)
  }

  return [xPoints, yPoints, uncertain]
}

/** 将点集划分为5个区域
 * @param points
 * @returns
 */
const partition = (
  points: Point[]
):
  | void
  | [
      [Point[], Point[], Point[], Point[]],
      [UncertainWithCorner, UncertainWithCorner, UncertainWithCorner, UncertainWithCorner]
    ] => {
  const leftPoints: Point[] = []
  const rightPoints: Point[] = []
  const topPoints: Point[] = []
  const bottomPoints: Point[] = []

  let i = points.length
  if (i < 3) {
    return
  }

  let point: Point
  while (i) {
    point = points[--i]

    updateExtremes(point, leftPoints, compareLeft)
    updateExtremes(point, rightPoints, compareRight)
    updateExtremes(point, topPoints, compareTop)
    updateExtremes(point, bottomPoints, compareBottom)
  }

  const leftTopUncertain: UncertainWithCorner = [] as any
  const leftTopVectorInfo = getVectorInfo(leftPoints, topPoints, Corner.leftTop)
  leftTopUncertain.corner = Corner.leftTop

  const rightTopUncertain: UncertainWithCorner = [] as any
  const rightTopVectorInfo = getVectorInfo(rightPoints, topPoints, Corner.rightTop)
  rightTopUncertain.corner = Corner.rightTop

  const leftBottomUncertain: UncertainWithCorner = [] as any
  const leftBottomVectorInfo = getVectorInfo(leftPoints, bottomPoints, Corner.leftBottom)
  leftBottomUncertain.corner = Corner.leftBottom

  const rightBottomUncertain: UncertainWithCorner = [] as any
  const rightBottomVectorInfo = getVectorInfo(rightPoints, bottomPoints, Corner.rightBottom)
  rightBottomUncertain.corner = Corner.rightBottom

  i = points.length
  while (i) {
    point = points[--i]

    isClockwise(point, leftTopVectorInfo)
      ? leftTopUncertain.push(point)
      : isClockwise(point, rightTopVectorInfo)
      ? rightTopUncertain.push(point)
      : isClockwise(point, leftBottomVectorInfo)
      ? leftBottomUncertain.push(point)
      : isClockwise(point, rightBottomVectorInfo) && rightBottomUncertain.push(point)
  }

  return [
    [leftPoints, rightPoints, topPoints, bottomPoints],
    [leftTopUncertain, rightTopUncertain, leftBottomUncertain, rightBottomUncertain],
  ]
}

const generateConvex = (
  leftPoints: Point[],
  rightPoints: Point[],
  topPoints: Point[],
  bottomPoints: Point[]
) => {
  const result: Point[] = [...leftPoints]

  result[result.length - 1] === topPoints[0] && result.pop()
  result.push(...topPoints)

  let i = rightPoints.length
  result[result.length - 1] === rightPoints[i - 1] && i--
  while (i) {
    result.push(rightPoints[--i])
  }

  i = bottomPoints.length
  result[result.length - 1] === bottomPoints[i - 1] && i--
  while (i) {
    result.push(bottomPoints[--i])
  }

  return result
}

const divide: Algorithm = function* (points) {
  const partitionResult = partition(points)
  if (!partitionResult) {
    return points
  }

  const [extremes, uncertain] = partitionResult
  const [leftPoints, rightPoints, topPoints, bottomPoints] = extremes

  let uncertainPoints: UncertainWithCorner
  let xPoints: Point[]
  let yPoints: Point[]
  while (uncertain.length) {
    yield generateConvex.apply(null, extremes)

    uncertainPoints = uncertain.shift()!
    ;[xPoints, yPoints, uncertainPoints] = partitionCorner(uncertainPoints, uncertainPoints.corner)

    switch (uncertainPoints.corner) {
      case Corner.leftTop:
        leftPoints.push(...xPoints)
        topPoints.unshift(...yPoints)
        break
      case Corner.rightTop:
        rightPoints.push(...xPoints)
        topPoints.push(...yPoints)
        break
      case Corner.leftBottom:
        leftPoints.unshift(...xPoints)
        bottomPoints.unshift(...yPoints)
        break
      case Corner.rightBottom:
        rightPoints.unshift(...xPoints)
        bottomPoints.push(...yPoints)
        break
    }

    uncertainPoints.length && uncertain.push(uncertainPoints)
  }

  return generateConvex.apply(null, extremes)
}

export default divide
