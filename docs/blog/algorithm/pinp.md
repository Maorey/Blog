---
title: 点在面内
index: 1
---

## 问题描述

平面上有一个任意多边形(包括凹凸岛洞交错等), 指定任意平面点, 求该点是否在该多边形内

## 演示

<PinP />

## 方法介绍

### 面积和

### 夹角和

### 回转数

### 射线法

## 射线法实现

```ts
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
```

## 升维

在3D场景中要如何实现？



<script lang="ts">
import PinP from './components/PinP.vue'

export default { components: { PinP } }
</script>
