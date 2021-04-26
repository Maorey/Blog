<template>
  <div :class="$style.wrap">
    <i @click="toggle">{{ isPoint ? '请指定点' : '正在画多边形' }}(右键切换)</i>
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
  context.fillRect(point.x - 1, point.y - 1, 2, 2)
}

function pinp({ x: px, y: py }: Point, polygon: Point[]) {
  let odd = false // py射线与多边形的所有边的相交次数是否为奇数

  // polygon[i]-polygon[j] 为多边形的一条边
  for (let i = polygon.length, j = 0; i--; j = i) {
    const { x: startX, y: startY } = polygon[i]
    const { x: endX, y: endY } = polygon[j]

    // 点与边的端点重合
    if ((px === startX && py === startY) || (px === endX && py === endY)) {
      return true
    }

    // 点在边的范围内
    if ((py > startY && py <= endY) || (py <= startY && py > endY)) {
      // 边与py射线交点的X坐标
      const x = startX + ((endX - startX) * (py - startY)) / (endY - startY)

      // 点在边上
      if (x === px) {
        return true
      }

      // 射线与边相交
      if (x < px) {
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

    const polygon: Point[] = []
    const onClick = (event: MouseEvent) => {
      const point = { x: event.pageX - rect.x, y: event.pageY - rect.y }
      if (isPoint.value) {
        drawPolygon(context, polygon)
        drawPoint(context, point)
        result.value = pinp(point, polygon)
      } else {
        polygon.push(point)
        drawPolygon(context, polygon)
        result.value = null
      }
    }
    const onMove = (event: MouseEvent) => {
      !isPoint.value &&
        polygon.length &&
        drawPolygon(
          context,
          polygon.concat({ x: event.pageX - rect.x, y: event.pageY - rect.y })
        )
    }
    const clear = () => {
      context && clearCanvas(context)
      isPoint.value = false
      result.value = null
      polygon.splice(0)
    }
    const toggle = () => {
      if (isPoint.value) {
        clear()
      } else if (polygon.length > 2) {
        drawPolygon(context, polygon)
        isPoint.value = true
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
