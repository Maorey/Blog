import type { Point, Algorithm } from './types'

/** 比较极值点
 * @param extreme 当前极值点
 * @param point
 *
 * @returns false: 非极值点 true: 新极值点; x/y(排序字段): 与当前极值点相等
 */
type Compare = (extreme: Point, point: Point) => boolean | keyof Point
const compareLeft: Compare = (e, p) => (e.x === p.x ? 'y' : e.x > p.x)
const compareRight: Compare = (e, p) => (e.x === p.x ? 'y' : e.x < p.x)
const compareTop: Compare = (e, p) => (e.y === p.y ? 'x' : e.y < p.y)
const compareBottom: Compare = (e, p) => (e.y === p.y ? 'x' : e.y > p.y)

/** 更新极值点集
 * @param point
 * @param extremes 【最多保留两个】
 * @param compare
 *
 * @returns 是否更新了极值点
 */
const updateExtremes = (point: Point, extremes: Point[], compare: Compare) => {
  if (!extremes.length) {
    extremes.push(point)
    return true
  }

  const extreme0 = extremes[0]
  const result = compare(extreme0, point)

  if (!result) {
    return
  }

  if (result === true) {
    extremes.splice(0, 2, point)
    return true
  }

  const value = point[result]
  const min = extreme0[result]
  const extreme1 = extremes[1]
  if (value > min && (!extreme1 || value > extreme1[result])) {
    extremes[1] = point

    return true
  }
  if (value < min) {
    extremes[0] = point
    extreme1 || (extremes[1] = extreme0)

    return true
  }
}

type InRange = (point: Point, xExtremes: Point[], yExtremes: Point[]) => boolean
const inLeftTopRange: InRange = (point, leftExtremes, topExtremes) =>
  point.x < topExtremes[0].x && point.y > leftExtremes[leftExtremes.length - 1].y
const inRightTopRange: InRange = (point, rightExtremes, topExtremes) =>
  point.x > topExtremes[topExtremes.length - 1].x &&
  point.y > rightExtremes[rightExtremes.length - 1].y
const inLeftBottomRange: InRange = (point, leftExtremes, bottomExtremes) =>
  point.x < bottomExtremes[0].x && point.y < leftExtremes[0].y
const inRightBottomRange: InRange = (point, rightExtremes, bottomExtremes) =>
  point.x > bottomExtremes[bottomExtremes.length - 1].x && point.y < rightExtremes[0].y

type GetVector = (xExtremes: Point[], yExtremes: Point[]) => [Point, Point]
const getLeftTopVector: GetVector = (leftExtremes, topExtremes) => [
  topExtremes[0],
  leftExtremes[leftExtremes.length - 1],
]
const getRightTopVector: GetVector = (rightExtremes, topExtremes) => [
  rightExtremes[rightExtremes.length - 1],
  topExtremes[topExtremes.length - 1],
]
const getLeftBottomVector: GetVector = (leftExtremes, bottomExtremes) => [
  leftExtremes[0],
  bottomExtremes[0],
]
const getRightBottomVector: GetVector = (rightExtremes, bottomExtremes) => [
  bottomExtremes[bottomExtremes.length - 1],
  rightExtremes[0],
]

const isClockwise = (point: Point, vector: [Point, Point]) =>
  (vector[1].x - vector[0].x) * (point.y - vector[0].y) >
  (point.x - vector[0].x) * (vector[1].y - vector[0].y)

/** 划分角落
 * 上下极值点y坐标相等时, 按x坐标升序
 * 左右极值点x坐标相等时, 按y坐标升序
 */
const enum Corner {
  leftTop,
  rightTop,
  leftBottom,
  rightBottom,
}

interface CornerPoints extends Array<Point> {
  c: Corner
  x: Compare
  y: Compare
  i: InRange
  v: [Point, Point]
}
/** 对指定的四个角落之一进行划分
 * @param cornerPoints
 * @param corner
 * @returns [x极值点集, y极值点集, 相同角落待确定点集]
 */
const partitionCorner = (cornerPoints: CornerPoints): [Point[], Point[], CornerPoints] => {
  const xPoints: Point[] = []
  const yPoints: Point[] = []

  let i = cornerPoints.length
  if (i < 2) {
    return [cornerPoints, xPoints, yPoints as CornerPoints]
  }

  let point: Point
  while (i) {
    point = cornerPoints[--i]

    updateExtremes(point, xPoints, cornerPoints.x)
    updateExtremes(point, yPoints, cornerPoints.y)
  }

  const restCornerPoints: CornerPoints = [] as any
  restCornerPoints.c = cornerPoints.c
  restCornerPoints.x = cornerPoints.x
  restCornerPoints.y = cornerPoints.y
  restCornerPoints.i = cornerPoints.i
  restCornerPoints.v = cornerPoints.v

  i = cornerPoints.length
  while (i) {
    point = cornerPoints[--i]
    cornerPoints.i(point, xPoints, yPoints) &&
      isClockwise(point, cornerPoints.v) &&
      restCornerPoints.push(point)
  }

  return [xPoints, yPoints, restCornerPoints]
}

/** 将点集划分为5个区域
 * @param points
 * @returns
 */
const partition = (
  points: Point[]
): void | [[Point[], Point[], Point[], Point[]], CornerPoints[]] => {
  let i = points.length
  if (i < 3) {
    return
  }

  const leftExtremes: Point[] = []
  const rightExtremes: Point[] = []
  const topExtremes: Point[] = []
  const bottomExtremes: Point[] = []

  let point: Point
  while (i) {
    point = points[--i]

    updateExtremes(point, leftExtremes, compareLeft)
    updateExtremes(point, rightExtremes, compareRight)
    updateExtremes(point, topExtremes, compareTop)
    updateExtremes(point, bottomExtremes, compareBottom)
  }

  const leftTopCornerPoints: CornerPoints = [] as any
  const leftTopVector = getLeftTopVector(leftExtremes, topExtremes)
  leftTopCornerPoints.c = Corner.leftTop
  leftTopCornerPoints.x = compareLeft
  leftTopCornerPoints.y = compareTop
  leftTopCornerPoints.i = inLeftTopRange
  leftTopCornerPoints.v = leftTopVector

  const rightTopCornerPoints: CornerPoints = [] as any
  const rightTopVector = getRightTopVector(rightExtremes, topExtremes)
  rightTopCornerPoints.c = Corner.rightTop
  rightTopCornerPoints.x = compareRight
  rightTopCornerPoints.y = compareTop
  rightTopCornerPoints.i = inRightTopRange
  rightTopCornerPoints.v = rightTopVector

  const leftBottomCornerPoints: CornerPoints = [] as any
  const leftBottomVector = getLeftBottomVector(leftExtremes, bottomExtremes)
  leftBottomCornerPoints.c = Corner.leftBottom
  leftBottomCornerPoints.x = compareLeft
  leftBottomCornerPoints.y = compareBottom
  leftBottomCornerPoints.i = inLeftBottomRange
  leftBottomCornerPoints.v = leftBottomVector

  const rightBottomCornerPoints: CornerPoints = [] as any
  const rightBottomVector = getRightBottomVector(rightExtremes, bottomExtremes)
  rightBottomCornerPoints.c = Corner.rightBottom
  rightBottomCornerPoints.x = compareRight
  rightBottomCornerPoints.y = compareBottom
  rightBottomCornerPoints.i = inRightBottomRange
  rightBottomCornerPoints.v = rightBottomVector

  i = points.length
  while (i) {
    point = points[--i]

    inLeftTopRange(point, leftExtremes, topExtremes)
      ? isClockwise(point, leftTopVector) && leftTopCornerPoints.push(point)
      : inRightTopRange(point, rightExtremes, topExtremes)
      ? isClockwise(point, rightTopVector) && rightTopCornerPoints.push(point)
      : inLeftBottomRange(point, leftExtremes, bottomExtremes)
      ? isClockwise(point, leftBottomVector) && leftBottomCornerPoints.push(point)
      : inRightBottomRange(point, rightExtremes, bottomExtremes) &&
        isClockwise(point, rightBottomVector) &&
        rightBottomCornerPoints.push(point)
  }

  return [
    [leftExtremes, rightExtremes, topExtremes, bottomExtremes],
    [leftTopCornerPoints, rightTopCornerPoints, leftBottomCornerPoints, rightBottomCornerPoints],
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

  const [[leftPoints, rightPoints, topPoints, bottomPoints], cornerPointsList] = partitionResult

  let cornerPoints: CornerPoints
  let xExtremes: Point[]
  let yExtremes: Point[]
  while (cornerPointsList.length) {
    yield generateConvex(leftPoints, rightPoints, topPoints, bottomPoints)

    cornerPoints = cornerPointsList.shift()!
    ;[xExtremes, yExtremes, cornerPoints] = partitionCorner(cornerPoints)

    switch (cornerPoints.c) {
      case Corner.leftTop:
        leftPoints.push(...xExtremes)
        topPoints.unshift(...yExtremes)
        break
      case Corner.rightTop:
        rightPoints.push(...xExtremes)
        topPoints.push(...yExtremes)
        break
      case Corner.leftBottom:
        leftPoints.unshift(...xExtremes)
        bottomPoints.unshift(...yExtremes)
        break
      case Corner.rightBottom:
        rightPoints.unshift(...xExtremes)
        bottomPoints.push(...yExtremes)
        break
    }

    cornerPoints.length && cornerPointsList.push(cornerPoints)
  }

  return generateConvex(leftPoints, rightPoints, topPoints, bottomPoints)
}

export default divide
