<template>
  <div :class="STYLE.wrap">
    <i @click="toggle">{{ isPoint ? '请指定点' : '正在画多边形' }}(点我/右键结束)</i>
    <i @click="clear">重置</i>
    <canvas
      width="320"
      height="320"
      @click="onClick"
      @mousemove="onMove"
      @contextmenu.stop.prevent="toggle"
    />
    <p>
      计算结果:
      <b :style="`color: ${result ? 'green' : result === false ? 'red' : ''}`">{{
        result ? '点在面内(或边上)' : result === false ? '点在面外' : '--'
      }}</b>
    </p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

import STYLE from '../style/canvas.module.scss'
import isPointInPolygon from './isPointInPolygon'
import type { Point } from './types'

const SIZE = 320

function clearCanvas(context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, SIZE, SIZE)
}

function drawPolygon(context: CanvasRenderingContext2D, polygon: Point[]) {
  clearCanvas(context)

  context.beginPath()
  let point = polygon[0]
  context.moveTo(point.x, point.y)
  for (let i = 1, len = polygon.length; i < len; i++) {
    point = polygon[i]
    context.lineTo(point.x, point.y)
  }
  context.closePath()
  context.strokeStyle = 'green'
  context.fillStyle = 'rgb(0,255,0,0.1)'
  context.stroke()
  context.fill()
}

function drawPoint(context: CanvasRenderingContext2D, point: Point) {
  context.fillStyle = 'red'
  context.fillRect(point.x - 2, point.y - 2, 4, 4)
}

const getPoint = (event: MouseEvent): Point => ({
  x: event.pageX - (event.target as HTMLCanvasElement).offsetLeft,
  y: event.pageY - (event.target as HTMLCanvasElement).offsetTop,
})

export default {
  setup() {
    const isPoint = ref<boolean>()
    const result = ref<boolean | null>()

    const polygon: Point[] = []

    let context: CanvasRenderingContext2D

    const onClick = (event: MouseEvent) => {
      context = (event.target as HTMLCanvasElement).getContext('2d')!
      const point = getPoint(event)

      if (isPoint.value) {
        drawPolygon(context, polygon)
        drawPoint(context, point)
        result.value = isPointInPolygon(point, polygon)
      } else {
        polygon.push(point)
        polygon.length < 2 ? drawPoint(context, point) : drawPolygon(context, polygon)
        result.value = null
      }
    }
    const onMove = (event: MouseEvent) => {
      !isPoint.value && polygon.length && drawPolygon(context, polygon.concat(getPoint(event)))
    }

    const clear = () => {
      isPoint.value = false
      result.value = null
      polygon.splice(0)
      clearCanvas(context)
    }

    const toggle = () => {
      if (isPoint.value) {
        clear()
      } else if (polygon.length > 2) {
        drawPolygon(context, polygon)
        isPoint.value = true
      }
    }

    return { STYLE, isPoint, result, toggle, clear, onClick, onMove }
  },
}
</script>
