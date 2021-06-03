<template>
  <div :class="STYLE.wrap">
    <br />
    <i @click="run">生成最小凸包</i>
    <i @click="clear">重置</i>
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

function* runAlgorithm(algorithm: Algorithm, points: Point[]) {
  const iterator = algorithm(points)
  const speed = 250

  let result: IteratorResult<PointsWithDone, PointsWithDone>
  do {
    result = iterator.next()
    yield new Promise<PointsWithDone>(resolve => {
      const value = result.value
      value.done = result.done

      setTimeout(() => {
        resolve(value)
      }, speed)
    })
  } while (!result.done)
}

const SIZE = 320
function draw(context: CanvasRenderingContext2D, points?: Point[], line?: PointsWithDone) {
  context.clearRect(0, 0, SIZE, SIZE)

  let i = points && points.length
  let point
  if (i) {
    context.fillStyle = 'red'
    while (i--) {
      point = points![i]
      context.fillRect(point.x - 2, point.y - 2, 4, 4)
    }
  }

  i = line && line.length
  if (i) {
    let point = line![--i]

    if (!line!.done) {
      context.fillStyle = 'green'
      context.fillRect(point.x - 3, point.y - 3, 6, 6)

      if (i) {
        context.beginPath()
        context.moveTo(point.x, point.y)
        point = line![--i]
        context.lineTo(point.x, point.y)
        context.strokeStyle = 'red'
        context.stroke()
      }
    }

    context.beginPath()
    context.moveTo(point.x, point.y)
    while (i) {
      point = line![--i]
      context.lineTo(point.x, point.y)
    }
    line!.done && context.closePath()
    context.strokeStyle = 'green'
    context.stroke()
  }
}

export default {
  props: {
    /** 生成最小凸包算法, 类型为 Algorithm */
    algorithm: Function,
  },
  setup(props: any) {
    const points: Point[] = []

    let context: CanvasRenderingContext2D
    let animationStoped = false

    return {
      STYLE,
      async run() {
        animationStoped = false

        if (!context || !points.length) {
          return
        }

        for await (const line of runAlgorithm(props.algorithm, points)) {
          if (animationStoped) {
            return
          }

          draw(context, points, line)
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
