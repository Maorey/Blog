<template>
  <div :class="$style.wrap">
    <br />
    <i @click="toggle">{{ isRay ? '正在画射线' : '正在画多边形' }}(右键结束)</i>
    <i @click="clear">重置(不能操作点我)</i>
    <canvas ref="el" width="320" height="320" />
    <p>
      计算结果: 你画的是
      <b :style="`color: ${result ? 'green' : result === false ? 'red' : ''}`">{{
        result ? '凸多边形' : result === false ? '凹多边形' : '--'
      }}</b>
      ; 射线与多边形相交
      <b :style="`color: ${cross % 2 ? 'green' : 'red'}`">{{ cross }}</b> 次
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
  context.fillRect(point.x - 2, point.y - 2, 4, 4)
}
function drawRayAndCrossPoint(
  context: CanvasRenderingContext2D,
  rayEndPoint: Point,
  rayViaPoint: Point,
  polygon: Point[]
) {
  const { x: rayEndX, y: rayEndY } = rayEndPoint
  const dy = rayViaPoint.y - rayEndY
  const dx = rayViaPoint.x - rayEndX
  const k = dy / dx
  const c = rayEndY - k * rayEndX
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
  context.moveTo(rayEndX, rayEndY)
  context.lineTo(x, y)
  context.closePath()
  context.strokeStyle = 'green'
  context.stroke()

  let cross = 0
  for (let i = polygon.length, j = 0; i--; j = i) {
    const { x: startX, y: startY } = polygon[i]
    const { x: endX, y: endY } = polygon[j]

    const kP = (endY - startY) / (endX - startX)
    const cP = startY - kP * startX

    const crossX = (cP - c) / (k - kP)
    const crossY = k * crossX + c

    if (
      ((crossX > startX && crossX < endX) || (crossX > endX && crossX < startX)) &&
      ((crossY > startY && crossY < endY) || (crossY > endY && crossY < startY)) &&
      ((crossX > rayEndX && crossX < x) || (crossX > x && crossX < rayEndX)) &&
      ((crossY > rayEndY && crossY < y) || (crossY > y && crossY < rayEndY))
    ) {
      drawPoint(context, { x: crossX, y: crossY })
      cross++
    }
  }

  return cross
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
      if (isRay.value) {
        rayEndPoint && drawRay({ x: event.pageX - rect.x, y: event.pageY - rect.y })
      } else {
        const length = polygon.length
        if (length) {
          const tempPolygon = polygon.concat({
            x: event.pageX - rect.x,
            y: event.pageY - rect.y,
          })
          drawPolygon(context, tempPolygon)
          length > 1 && (result.value = isConvex(tempPolygon))
        }
      }
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
</style>
