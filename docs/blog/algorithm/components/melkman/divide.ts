/** 使用canvas坐标系, 如下
o——→ x
|
↓
y
*/
import type { Point, Algorithm } from './types'

/** 四角
 * 上下极值点y坐标相等时, 按x坐标升序
 * 左右极值点x坐标相等时, 按y坐标升序
 */
const enum Corner {
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
const compareLeft: Compare = (e, p) => (e.x === p.x ? 'y' : e.x > p.x)
const compareRight: Compare = (e, p) => (e.x === p.x ? 'y' : e.x < p.x)
const compareTop: Compare = (e, p) => (e.y === p.y ? 'x' : e.y > p.y)
const compareBottom: Compare = (e, p) => (e.y === p.y ? 'x' : e.y < p.y)

/** 划分四个角的向量 */
type GetVector = (xExtremes: Point[], yExtremes: Point[]) => [Point, Point]
const getLeftTopVector: GetVector = (leftExtremes, topExtremes) => [
  topExtremes[0],
  leftExtremes[0],
]
const getRightTopVector: GetVector = (rightExtremes, topExtremes) => [
  rightExtremes[0],
  topExtremes[topExtremes.length - 1],
]
const getLeftBottomVector: GetVector = (leftExtremes, bottomExtremes) => [
  leftExtremes[leftExtremes.length - 1],
  bottomExtremes[0],
]
const getRightBottomVector: GetVector = (rightExtremes, bottomExtremes) => [
  bottomExtremes[bottomExtremes.length - 1],
  rightExtremes[rightExtremes.length - 1],
]

/** 是否在四个角 */
type InRange = (point: Point, vector: [Point, Point]) => boolean
const inLeftTopRange: InRange = (point, vector) => point.x < vector[0].x && point.y < vector[1].y
const inRightTopRange: InRange = (point, vector) => point.x > vector[1].x && point.y < vector[0].y
const inLeftBottomRange: InRange = (point, vector) =>
  point.x < vector[1].x && point.y > vector[0].y
const inRightBottomRange: InRange = (point, vector) =>
  point.x > vector[0].x && point.y > vector[1].y

// const insert = (point: Point, points: Point[], sortField: keyof Point) => {
//   // 二分查找 [low, high)
//   const value = point[sortField]
//   let low = 0
//   let high = points.length
//   let i: number
//   while (low < high) {
//     i = (low + high) >> 1 // 除2并向下取整
//     if (points[i][sortField] > value) {
//       high = i - 1
//     } else {
//       low = i + 1
//     }
//   }

//   // 插入
//   // points.splice(low, 0, point)
//   i = points.length
//   while (i > low) {
//     points[i] = points[--i]
//   }
//   points[low] = point
// }

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

/** 点是否在划分四个角向量的顺时针方向 不考虑dx/dy为0 */
const isClockwise = (point: Point, [{ x, y }, end]: [Point, Point]) =>
  (end.x - x) * (point.y - y) > (point.x - x) * (end.y - y)

interface Functions {
  c: Corner
  x: Compare
  y: Compare
  i: InRange
  v: GetVector
}
interface CornerPoints extends Array<Point> {
  f: Functions
}

/** 获取指定角落的处理函数
 * @param corner
 * @returns [compareX, compareY, inRange, getVector]
 */
const getFunctions = (corner: Corner): Functions => {
  switch (corner) {
    case Corner.leftTop:
      return {
        c: corner,
        x: compareLeft,
        y: compareTop,
        i: inLeftTopRange,
        v: getLeftTopVector,
      }
    case Corner.rightTop:
      return {
        c: corner,
        x: compareRight,
        y: compareTop,
        i: inRightTopRange,
        v: getRightTopVector,
      }
    case Corner.leftBottom:
      return {
        c: corner,
        x: compareLeft,
        y: compareBottom,
        i: inLeftBottomRange,
        v: getLeftBottomVector,
      }
    case Corner.rightBottom:
      return {
        c: corner,
        x: compareRight,
        y: compareBottom,
        i: inRightBottomRange,
        v: getRightBottomVector,
      }
  }
}
const getCornerPoints = (cornerOrCornerPoints: Corner | CornerPoints): CornerPoints => {
  const cornerPoints: CornerPoints = [] as any
  cornerPoints.f =
    (cornerOrCornerPoints as CornerPoints).f || getFunctions(cornerOrCornerPoints as Corner)

  return cornerPoints
}

/** 对指定的四个角落之一进行划分
 * @param cornerPoints
 *
 * @returns [x极值点集, y极值点集, 相同角落待确定点集]
 */
const partitionCorner = (cornerPoints: CornerPoints): [Point[], Point[], CornerPoints] => {
  const xExtremes: Point[] = []
  const yExtremes: Point[] = []

  const { x: compareX, y: compareY } = cornerPoints.f
  let i = cornerPoints.length
  let point: Point
  while (i) {
    point = cornerPoints[--i]

    updateExtremes(point, xExtremes, compareX)
    updateExtremes(point, yExtremes, compareY)
  }

  const restCornerPoints = getCornerPoints(cornerPoints)
  const inRange = restCornerPoints.f.i
  const vector = restCornerPoints.f.v(xExtremes, yExtremes)
  i = cornerPoints.length
  while (i) {
    point = cornerPoints[--i]

    inRange(point, vector) && isClockwise(point, vector) && restCornerPoints.push(point)
  }

  return [xExtremes, yExtremes, restCornerPoints]
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

  const leftTopCornerPoints = getCornerPoints(Corner.leftTop)
  const leftTopVector = getLeftTopVector(leftExtremes, topExtremes)

  const rightTopCornerPoints = getCornerPoints(Corner.rightTop)
  const rightTopVector = getRightTopVector(rightExtremes, topExtremes)

  const leftBottomCornerPoints = getCornerPoints(Corner.leftBottom)
  const leftBottomVector = getLeftTopVector(leftExtremes, bottomExtremes)

  const rightBottomCornerPoints = getCornerPoints(Corner.rightBottom)
  const rightBottomVector = getRightBottomVector(rightExtremes, bottomExtremes)

  i = points.length
  while (i) {
    point = points[--i]

    inLeftTopRange(point, leftTopVector)
      ? isClockwise(point, leftTopVector) && leftTopCornerPoints.push(point)
      : inRightTopRange(point, rightTopVector)
      ? isClockwise(point, rightTopVector) && rightTopCornerPoints.push(point)
      : inLeftBottomRange(point, leftBottomVector)
      ? isClockwise(point, leftBottomVector) && leftBottomCornerPoints.push(point)
      : inRightBottomRange(point, rightBottomVector) &&
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

  result.push(result[0])
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

    switch (cornerPoints.f.c) {
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
