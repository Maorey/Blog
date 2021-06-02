---
title: 最小凸包
index: 3
---

2021-06-04

## 问题描述

平面上任意位置有3个及以上的点, 求这些点的最小外接凸多边形

## 演示

<Melkman />

## 前置知识

[参考链接](./pinp#凸多边形)

## 方法介绍

### 穷举法 (O(n<sup>3</sup>))

最重要的目标时候找到哪些点是凸包的顶点, 然后根据坐标排序构造凸包

凸包的顶点满足的条件: 任意其他点在**两个顶点连线的同一侧** (如何判断见[前置知识](#前置知识))

计算的步骤为

1. 从点集里取出一点, 与剩下的点依次连接, 得到一条直线 (共 $\sum_{\substack{1 < i < n - 1}}$ 条)
2. 判断其他点是否在这条线的同一侧 (共 $n - 2$ 个), 是则将这两个顶点去重地加入顶点数组 (插入更佳 按x,y排序)
3. 按一定规则(按x,y排序)连接顶点得到凸包

### 分治法 (快包 O(n㏒n))

快速凸包构造算法的思路为: 想办法将点集进行划分, 然后分而治之

对于一个点集, 最容易确定是凸包顶点的, 是上下左右**4个极值点**, 剩下的凸包顶点暂时无法确定

那么基于这4个极值点, 可以想到把点集划分为**5个区域**, 很明显在这4个点围成的四边形内不可能存在凸包顶点, 那么还剩余的**4个区域**

对于这4个区域我们可以视作新的点集, 重复上述步骤直到不能继续划分

![划分](melkman/divide.png)

### Jarvis 步进法 (O(nH))

### Graham 扫描法 (O(n㏒n)) [^GrahamScan]

### Melkman 算法 (O(n))

## Melkman 算法实现

## 升维

3D中的情况如何?

[凸包问题——快速凸包算法](https://zhuanlan.zhihu.com/p/166105080)

## 参考链接

[凸包算法入门](https://www.cnblogs.com/dream-it-possible/p/8514706.html)

[^GrahamScan]: [Understanding Graham scan algorithm for finding the Convex hull of a set of Points](https://muthu.co/understanding-graham-scan-algorithm-for-finding-the-convex-hull-of-a-set-of-points/)

<script lang="ts">
import Melkman from './components/melkman/Melkman.vue'

export default { components: { Melkman } }
</script>
