---
title: 最小凸包
index: 3
---

2021-06-04

## 问题描述

平面上任意位置有3个及以上的点, 求这些点的最小外接凸多边形

## 演示

<Show />

## 前置知识

[参考链接](./pinp#凸多边形)

## 方法介绍

### 穷举法 (O(n<sup>3</sup>))

不放过任何可能的点, 所以首先要知道凸包顶点一定满足的条件: 其他点都在**相邻顶点所在直线的同一侧**

计算的步骤为:

1. 从点集里取出一点**A**, 与剩下的点**B**依次连接, 得到一条直线**L** (共 $\sum_{\substack{1 < i < n - 1}}$ 条)
2. 判断其他点是否都在这条直线**L**的同一侧 (共 $n - 2$ 个), 是则将这两点**A**和**B**去重地加入凸包数组 (插入更佳 按x,y排序)
3. 按一定规则(按x,y排序)连接(排序)凸包数组得到凸包

### 分治法 (快包 O(n㏒n))

也叫快速凸包构造算法(快包), 核心思想为划分点集为更小的部分, 然后分而治之

对于一个点集, 最容易确定是凸包顶点的, 是上下左右**4个极值点(集)**(有相等时取两端参与划分), 剩下的点集暂时无法确定

那么基于这4个极值点(集), 可以想到把点集划分为**5个区域**, 很明显在中间的4-8边形内不可能存在凸包顶点, 剩余的**4个区域**(左上角、右上角、左下角、右下角) 可能存在凸包顶点

这4个区域可以视作新的点集, 继续对其划分直到不可分, 四个角划分方式相似. 比如, 左上角按左上两组极值点集进行划分, 再以相同地方式继续划分左上角的左上角

上下左右四个顶点集顺时针连接即可得到凸包

![划分](melkman/divide.png)

#### 演示

<Play :algorithm="divide" />

<details>
<summary>推导及代码实现</summary>

<<< @/blog/algorithm/components/melkman/divide.ts

</details>

### Jarvis 步进法 (O(nH))

把点集想象成木板上钉的若干钉子, 要构造出最小凸包, 我们可以借助一根绳子, 先找到一颗最外面的钉子, 然后顺时针或逆时针绕着木板行走, 每次绳子将和一颗或多颗钉子同时接触, 走一圈下来即可围出最小凸包

计算的步骤为:

1. 左上、右上、左下、右下四个角处的点一定是凸包上的点, 因此选任意一个用来作为起点
2. 依次从剩下的点里取出一个点, 按照顺时针或逆时针方向, 夹角最小的一个或多个点即为凸包顶点

边界情况:

1. 第二个凸包顶点: 夹角与所选起点对应平行于坐标轴的射线计算, 比如选取左上角为起点, 顺时针方向前进, 则射线为起点→x轴正方向
2. 何时闭合凸包(完成条件): 可以将起点添加的点集末尾, 若下一个计算出的点是起点则闭合

#### 演示

<Play :algorithm="divide" />

<details>
<summary>推导及代码实现</summary>

```ts

```

</details>

### Graham 扫描法 (O(n㏒n)) [^GrahamScan]

首先选取一个一定是凸包顶点的点作为起点, 将坐标系原点移到起点, 将剩下的点按照幅角排序, 这样就可以依次去判断和连接了

计算的步骤为(左下角起顺时针方向):

1. 找到所有x最小的点, 按照y升序全部加入凸包数组, 取末尾的点为起点**O**
2. 依次计算剩余的点与起点**O**的幅角(y轴正向), 从小到大排序, 幅角相等按距离排序(近的在前), 第一个点和最后一个点一定是凸包顶点, 先把第一个点添加进凸包数组末尾
3. 从排序数组中取出第一个点**A**
    1. 若点**A**为最后一个点, 加入凸包数组并结束
    2. 从凸包数组取末尾两点得到一条直线**L**, 若点**A**在直线**L**右边, 则将点**A**加入凸包数组, 继续执行第**3**步; 否则移除凸包数组末尾点, 继续执行第**3.2**步

#### 演示

<Play :algorithm="divide" />

<details>
<summary>推导及代码实现</summary>

```ts

```

</details>

### Melkman 算法 (O(n))

从[Graham 扫描法](#graham-扫描法-o-n㏒n)改进而来, 是一个在线算法. 算法首先需要得到一个三角形凸包, 之后每加入一个点就对凸包进行调整

计算的步骤为:

1. 先依次取出点, 直到能构造出三角形 (可能存在三点共线的情况)
2. 读取下一点**A**, 记录点**A**与凸包的所有边的转向情况
    1. 都在顺时针/逆时针方向则点**A**在凸包内部, 不做任何处理
    2. 找到方向突变(在凸包外部)的两条边的交点索引**i**, 使用与 Graham 扫描法相似的方法(步骤**3**)连接该点

#### 演示

<Play :algorithm="divide" />

<details>
<summary>推导及代码实现</summary>

```ts

```

</details>

## 升维

3D中的情况如何?

[凸包问题——快速凸包算法](https://zhuanlan.zhihu.com/p/166105080)

## 参考链接

- [凸包算法剖析](https://cyw3.github.io/YalesonChan/2016/ConvexHull.html)

[^GrahamScan]: [Understanding Graham scan algorithm for finding the Convex hull of a set of Points](https://muthu.co/understanding-graham-scan-algorithm-for-finding-the-convex-hull-of-a-set-of-points/)

<script lang="ts">
import Show from './components/melkman/Show.vue'
import Play from './components/melkman/Play.vue'
import divide from './components/melkman/divide'

export default { components: { Show, Play }, methods: { divide } }
</script>
