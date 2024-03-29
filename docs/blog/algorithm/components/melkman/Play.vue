<template>
  <div :class="STYLE.wrap">
    <br />
    <i @click="run">生成最小凸包</i>
    <i @click="clear">重置</i>
    <i @click="down">加速</i>
    <i @click="up">减速</i>
    <input type="number" min="1" step="3" />
    <i @click="random">生成随机点</i>
    <canvas width="320" height="320" @click="onClick"></canvas>
    <br />
  </div>
</template>

<script lang="ts">
import type { Point, Algorithm } from './types'

import STYLE from '../style/canvas.module.scss'

interface PointsWithDone extends Array<Point> {
  done?: boolean
}
interface LinesWithDone extends Array<Point[]> {
  done?: boolean
}
type PolygonWithDone = PointsWithDone | LinesWithDone

function* runAlgorithm(algorithm: Algorithm, points: Point[], speed: number) {
  const iterator = algorithm(points)

  let result: IteratorResult<PolygonWithDone, PolygonWithDone>
  do {
    result = iterator.next()
    speed = yield new Promise<PolygonWithDone>(resolve => {
      const value = result.value
      value.done = result.done

      setTimeout(() => {
        resolve(value)
      }, speed)
    })
  } while (!result.done)
}

const SIZE = 320
const drawPoints = (
  context: CanvasRenderingContext2D,
  points: Point[],
  fillStyle: string | CanvasGradient | CanvasPattern = 'red',
  size = 4
) => {
  let i = points.length
  if (i) {
    context.fillStyle = fillStyle
    const half = size >> 1
    let point
    while (i--) {
      point = points[i]
      context.fillRect(point.x - half, point.y - half, size, size)
    }
  }
}
const drawLine = (
  context: CanvasRenderingContext2D,
  polygon: Point[],
  strokeStyle: string | CanvasGradient | CanvasPattern = 'green',
  closePath?: boolean
) => {
  let i = polygon.length
  let point = polygon[--i]
  context.beginPath()
  context.moveTo(point.x, point.y)
  while (i) {
    point = polygon[--i]
    context.lineTo(point.x, point.y)
  }
  closePath && context.closePath()
  context.strokeStyle = strokeStyle
  context.stroke()
}
const draw = (context: CanvasRenderingContext2D, points?: Point[], polygon?: PolygonWithDone) => {
  context.clearRect(0, 0, SIZE, SIZE)

  points && drawPoints(context, points)

  let i = polygon && polygon.length
  if (i) {
    let pointOrLine = polygon![i - 1]

    if (Array.isArray(pointOrLine)) {
      if (!polygon!.done) {
        drawPoints(context, pointOrLine, 'green', 6)
        drawLine(context, pointOrLine, 'red')
        i--
      }
      while (i) {
        drawLine(context, (polygon as LinesWithDone)[--i])
      }
    } else {
      if (!polygon!.done) {
        drawPoints(context, [pointOrLine], 'green', 6)

        --i && drawLine(context, [pointOrLine, (polygon as PointsWithDone)[i - 1]], 'red')
        polygon = (polygon as PointsWithDone).slice(0, i)
      }

      drawLine(context, polygon as PointsWithDone, 'green', polygon!.done)
    }
  }
}

export default {
  props: {
    /** 生成最小凸包算法, 类型为 Algorithm */
    algorithm: Function,
    /** 初始播放速度 */
    speed: Number,
  },
  setup(props: any) {
    const points: Point[] = []

    const step = 10
    let speed: number = props.speed

    let context: CanvasRenderingContext2D
    let animationStoped = false

    return {
      STYLE,
      up() {
        speed += step
      },
      down() {
        speed -= step
        speed < speed && (speed = step)
      },
      random(event: MouseEvent) {
        animationStoped = true

        // 咱就不用 ref 昂 (`へ´*)ノ
        let index =
          +(event.target as any).previousSibling.value ||
          +(Math.random() + '').slice(8, 9 + ((Math.random() * 2) | 0)) + 1
        points.splice(index)
        while (index) {
          points[--index] = { x: (Math.random() * SIZE) | 0, y: (Math.random() * SIZE) | 0 }
        }

        context || (context = (event.target as any).nextSibling.getContext('2d'))
        draw(context, points)
      },
      async run() {
        animationStoped = false

        if (!context || !points.length) {
          return
        }

        const iterator = runAlgorithm(props.algorithm, points, speed)
        let result: IteratorResult<Promise<PolygonWithDone>>
        while (!(result = iterator.next(speed)).done) {
          const polygon = await result.value
          if (animationStoped) {
            return
          }

          draw(context, points, polygon)
        }
      },
      clear() {
        animationStoped = true
        points.splice(0)
        context && draw(context)
      },
      onClick(event: MouseEvent) {
        animationStoped = true

        const canvas = event.target as HTMLCanvasElement
        context = canvas.getContext('2d')!
        points.push({ x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop })

        draw(context, points)
      },
    }
  },
}
</script>
