<template>
  <div :class="$style.wrap">
    <p>// TODO: 计算射线与多边形相交次数</p>
    <i @click="toggle">{{ isRay ? '正在画射线' : '正在画多边形' }}(右键结束)</i>
    <i @click="clear">重置</i>
    <canvas ref="el" width="320" height="320" />
    <p>
      计算结果: 你画的是<b
        :style="`color: ${result ? 'green' : result === false ? 'red' : ''}`"
        >{{ result ? '凸多边形' : result === false ? '凹多边形' : '--' }}</b
      >; 射线与多边形相交<b>{{ cross }}次</b>
    </p>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue'

interface Point {
  x: number
  y: number
}

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
  context.fillRect(point.x - 1, point.y - 1, 2, 2)
}
function drawRayAndCrossPoint(
  context: CanvasRenderingContext2D,
  rayEndPoint: Point,
  rayViaPoint: Point,
  polygon: Point[]
) {
  const { x: ex, y: ey } = rayEndPoint
  const dy = rayViaPoint.y - ey
  const dx = rayViaPoint.x - ex
  const k = dy / dx
  const c = ey - k * ex
  let y = dy > 0 ? SIZE : 0
  let x = (y - c) / k
  if (dx > 0) {
    if (x > SIZE) {
      // 与右边界相交
      x = SIZE
      y = k * x + c
    }
  } else if (x < 0) {
    // 与左边界相交
    x = 0
    y = c
  }
  context.beginPath()
  context.moveTo(ex, ey)
  context.lineTo(x, y)
  context.closePath()
  context.strokeStyle = 'green'
  context.stroke()

  return 0
}

function isConvex(polygon: Point[]) {
  // see: https://en.wikipedia.org/wiki/Graham_scan
  for (let i = polygon.length, j = 0, k = 1, lastTurn = null; i--; k = j, j = i) {
    const p1 = polygon[i]
    const p2 = polygon[j]
    const p3 = polygon[k]
    const turn = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x) >= 0
    if (lastTurn === null) {
      lastTurn = turn
    } else if (turn !== lastTurn) {
      return false
    }
  }

  return true
}

export default {
  setup() {
    const el = ref<HTMLCanvasElement>()
    const isRay = ref<boolean>()
    const result = ref<boolean | null>()
    const cross = ref(0)

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D
    let rect: DOMRect

    let rayEndPoint: Point | undefined
    const polygon: Point[] = []
    const drawRay = (rayViaPoint: Point) => {
      drawPolygon(context, polygon)
      drawPoint(context, rayEndPoint!)
      cross.value = drawRayAndCrossPoint(context, rayEndPoint!, rayViaPoint, polygon)
    }
    const onClick = (event: MouseEvent) => {
      const point = { x: event.pageX - rect.x, y: event.pageY - rect.y }
      if (isRay.value) {
        rayEndPoint || (rayEndPoint = point)
        drawRay(point)
      } else {
        polygon.push(point)
        drawPolygon(context, polygon)
        polygon.length > 2 &&
          result.value !== false &&
          (result.value = isConvex(polygon))
      }
    }
    const onMove = (event: MouseEvent) => {
      isRay.value
        ? rayEndPoint && drawRay({ x: event.pageX - rect.x, y: event.pageY - rect.y })
        : polygon.length &&
          drawPolygon(
            context,
            polygon.concat({ x: event.pageX - rect.x, y: event.pageY - rect.y })
          )
    }
    const clear = () => {
      context && clearCanvas(context)
      isRay.value = false
      result.value = null
      cross.value = 0
      rayEndPoint = undefined
      polygon.splice(0)
    }
    const toggle = () => {
      if (isRay.value) {
        if (rayEndPoint) {
          drawPolygon(context, polygon)
          rayEndPoint = undefined
        } else {
          clear()
        }
      } else if (polygon.length > 2) {
        drawPolygon(context, polygon)
        isRay.value = true
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

    return { el, isRay, result, cross, toggle, clear }
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
