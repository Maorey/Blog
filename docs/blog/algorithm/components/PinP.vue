<template>
  <div :class="$style.wrap">
    <i @click="toggle">{{ isPoint ? '请指定点' : '正在绘制多边形' }}(右键切换)</i>
    <i @click="clear">重置</i>
    <canvas ref="el" width="320" height="320" />
    <p>
      计算结果:
      <b :style="`color: ${result ? 'green' : result === false ? 'red' : ''}`">{{
        result ? '点在面内(或边上)' : result === false ? '点在面外' : '--'
      }}</b>
    </p>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue'

interface Point {
  x: number
  y: number
}

function clearCanvas(context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, 320, 320)
}
function drawPolygon(context: CanvasRenderingContext2D, points: Point[]) {
  clearCanvas(context)

  context.beginPath()
  let point = points[0]
  context.moveTo(point.x, point.y)
  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i]
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
  context.fillRect(point.x - 1, point.y - 1, 2, 2)
}

function pinp({ x: px, y: py }: Point, points: Point[]) {
  let odd = false // py射线与多边形的所有边的相交次数是否为奇数

  // points[i]-points[j] 为多边形的一条边
  for (let i = points.length, j = 0; i--; j = i) {
    const { x: startX, y: startY } = points[i]
    const { x: endX, y: endY } = points[j]

    // 点与边的端点重合
    if ((px === startX && py === startY) || (px === endX && py === endY)) {
      return true
    }

    // 点在边的范围内
    if ((py >= startY && py <= endY) || (py <= startY && py >= endY)) {
      // 边与py射线交点的X坐标
      const x = startX + ((py - startY) * (endX - startX)) / (endY - startY)

      // 点在边上
      if (x === px) {
        return true
      }

      // 射线与边相交
      if (x > px) {
        odd = !odd
      }
    }
  }

  return odd
}

export default {
  setup() {
    const el = ref<HTMLCanvasElement>()
    const isPoint = ref<boolean>()
    const result = ref<boolean | null>()

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D
    let rect: DOMRect

    const points: Point[] = []
    const onClick = (event: MouseEvent) => {
      const point = {
        x: event.pageX - rect.x,
        y: event.pageY - rect.y,
      }
      if (isPoint.value) {
        result.value = pinp(point, points)
        drawPolygon(context, points)
        drawPoint(context, point)
      } else {
        result.value = null
        points.push(point)
        drawPolygon(context, points)
      }
    }
    const onMove = (event: MouseEvent) => {
      !isPoint.value &&
        points.length &&
        drawPolygon(
          context,
          points.concat({
            x: event.pageX - rect.x,
            y: event.pageY - rect.y,
          })
        )
    }
    const clear = () => {
      isPoint.value = false
      result.value = null
      points.splice(0)
      clearCanvas(context)
    }
    const toggle = () => {
      if (isPoint.value) {
        clear()
      } else if (points.length > 2) {
        isPoint.value = true
        drawPolygon(context, points)
      }
    }
    const stop = (event: MouseEvent) => {
      toggle()
      event.stopPropagation()
      event.preventDefault()
    }

    const on = () => {
      canvas.addEventListener('click', onClick)
      canvas.addEventListener('mousemove', onMove)
      canvas.addEventListener('contextmenu', stop)
    }
    const off = () => {
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('contextmenu', stop)
    }
    const init = () => {
      canvas && off()
      if (el.value) {
        canvas = el.value
        context = canvas.getContext('2d')!
        rect = canvas.getBoundingClientRect()
        on()
      }
    }

    watchEffect(init)
    onUnmounted(off)

    return { el, isPoint, result, toggle, clear }
  },
}
</script>

<style lang="scss" module>
.wrap {
  :global {
    i {
      margin-right: 10px;
      cursor: pointer;
    }

    canvas {
      display: block;
      width: 320px;
      height: 320px;
      margin-top: 10px;
      border: 1px solid var(--c-brand);
      cursor: crosshair;
    }
  }
}
</style>
