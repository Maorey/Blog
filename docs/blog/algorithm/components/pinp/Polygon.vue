<template>
  <div :class="STYLE.wrap">
    <br />
    <i @click="toggle">{{ isRay ? '正在画射线' : '正在画多边形' }}(点我/右键结束)</i>
    <i @click="clear">重置</i>
    <canvas
      width="320"
      height="320"
      @click="onClick"
      @mousemove="onMove"
      @contextmenu.stop.prevent="toggle"
    />
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
import { ref } from 'vue'
import STYLE from '../style/canvas.module.scss'

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

  const k = (rayViaPoint.y - rayEndY) / (rayViaPoint.x - rayEndX)
  const c = rayEndY - k * rayEndX

  let y = rayViaPoint.y > rayEndY ? SIZE : 0
  let x = (y - c) / k

  if (rayViaPoint.x > rayEndX) {
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
  for (let i = polygon.length, j = 0, k = 1, lastTurn = null; i--; k = j, j = i) {
    const p0 = polygon[i]
    const p1 = polygon[j]
    const p2 = polygon[k]
    const turn = (p1.x - p0.x) * (p2.y - p0.y) >= (p2.x - p0.x) * (p1.y - p0.y)
    if (lastTurn === null) {
      lastTurn = turn
    } else if (turn !== lastTurn) {
      return false
    }
  }

  return true
}

const getPoint = (event: MouseEvent): Point => ({
  x: event.pageX - (event.target as HTMLCanvasElement).offsetLeft,
  y: event.pageY - (event.target as HTMLCanvasElement).offsetTop,
})

export default {
  setup() {
    const isRay = ref<boolean>()
    const result = ref<boolean | null>()
    const cross = ref(0)

    const polygon: Point[] = []
    let rayEndPoint: Point | undefined

    let context: CanvasRenderingContext2D

    const drawRay = (rayViaPoint: Point) => {
      drawPolygon(context, polygon)
      drawPoint(context, rayEndPoint!)
      cross.value = drawRayAndCrossPoint(context, rayEndPoint!, rayViaPoint, polygon)
    }

    const onClick = (event: MouseEvent) => {
      context = (event.target as HTMLCanvasElement).getContext('2d')!
      const point = getPoint(event)

      if (isRay.value) {
        rayEndPoint || (rayEndPoint = point)
        drawRay(point)
      } else {
        polygon.push(point)
        if (polygon.length < 2) {
          drawPoint(context, point)
        } else {
          drawPolygon(context, polygon)
          polygon.length > 2 && result.value !== false && (result.value = isConvex(polygon))
        }
      }
    }
    const onMove = (event: MouseEvent) => {
      if (isRay.value) {
        rayEndPoint && drawRay(getPoint(event))
      } else if (polygon.length) {
        const tempPolygon = polygon.concat(getPoint(event))
        drawPolygon((event.target as HTMLCanvasElement).getContext('2d')!, tempPolygon)
        polygon.length > 1 && (result.value = isConvex(tempPolygon))
      }
    }

    const clear = () => {
      isRay.value = false
      result.value = null
      cross.value = 0
      rayEndPoint = undefined
      polygon.splice(0)
      clearCanvas(context)
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

    return { STYLE, isRay, result, cross, toggle, clear, onClick, onMove }
  },
}
</script>
