<template>
  <div :class="STYLE.wrap">
    <i @click="run">生成最小凸包</i>
    <i @click="clear">重置</i>
    <input type="number" min="1" step="3" />
    <i @click="random">生成随机点</i>
    <canvas width="320" height="320" @click="onClick"></canvas>
  </div>
</template>

<script lang="ts">
import STYLE from '../style/canvas.module.scss'
import melkman from './melkman'
import type { Point } from './types'

const SIZE = 320
const drawPoints = (context: CanvasRenderingContext2D, points: Point[]) => {
  let i = points.length
  if (i) {
    context.fillStyle = 'red'
    let point
    while (i--) {
      point = points[i]
      context.fillRect(point.x - 2, point.y - 2, 4, 4)
    }
  }
}
const drawLine = (context: CanvasRenderingContext2D, polygon: Point[]) => {
  let i = polygon.length
  if (i) {
    let point = polygon[--i]
    context.beginPath()
    context.moveTo(point.x, point.y)
    while (i) {
      point = polygon[--i]
      context.lineTo(point.x, point.y)
    }
    context.closePath()
    context.strokeStyle = 'green'
    context.stroke()
  }
}
const draw = (context: CanvasRenderingContext2D, points?: Point[], polygon?: Point[]) => {
  context.clearRect(0, 0, SIZE, SIZE)

  points && drawPoints(context, points)
  polygon && drawLine(context, polygon)
}

function* runAlgorithm(context: CanvasRenderingContext2D, points: Point[]) {
  const polygon = yield* melkman(points)
  draw(context, points, polygon as Point[])
}

export default {
  setup() {
    const points: Point[] = []

    let context: CanvasRenderingContext2D

    return {
      STYLE,
      random(event: MouseEvent) {
        // 咱就不用 ref 昂 (`へ´*)ノ
        let index =
          +(event.target as any).previousSibling.value ||
          +(Math.random() + '').slice(8, 9 + ((Math.random() * 3) | 0)) + 1
        points.splice(index)
        while (index) {
          points[--index] = { x: (Math.random() * SIZE) | 0, y: (Math.random() * SIZE) | 0 }
        }

        context || (context = (event.target as any).nextSibling.getContext('2d'))
        draw(context, points)
      },
      run() {
        if (context && points) {
          const iterator = melkman(points)
          let result
          while (!(result = iterator.next()).done) {}
          draw(context, points, result.value as Point[])
        }
      },
      clear() {
        points.splice(0)
        context && draw(context)
      },
      onClick(event: MouseEvent) {
        const canvas = event.target as HTMLCanvasElement
        context = canvas.getContext('2d')!
        points.push({ x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop })

        draw(context, points)
      },
    }
  },
}
</script>
