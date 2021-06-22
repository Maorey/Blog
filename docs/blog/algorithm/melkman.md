---
title: 最小凸包
index: 3
---

*2021-06-18*

## 问题描述

::: warning 求点集的最小凸包
平面上有3个及以上的点, 求这些点的**最小外接凸多边形**(凸包)
:::

## 演示

<Show />

## 前置知识

[参考链接](./pinp#凸多边形)

## 方法介绍

### 穷举法 (O(n<sup>3</sup>))

穷举法试图枚举出所有可能, 并从中找到满足要求的情况. 所以重点是找到凸包顶点的充要条件, 这里判断的依据是:
> 若**AB**之外的点都在直线$\overline{AB}$的**同一侧**, 则点**A**和点**B**都是凸包的顶点

计算的步骤为:

1. 从点集里取出一点**A**, 与剩下的点**B**依次连接, 得到一条直线**L**($\overline{AB}$) (共 $\displaystyle\sum_{i=1}^{n-1}{i}$ 条)
2. 判断其他点(共 $n - 2$ 个)是否都在直线**L**的同一侧, 是则将**L**加入边数组
3. [按需] 将边数组转换为点数组 (将边首尾相连并展平`O(n㏒n)`)

#### 演示

<Play :algorithm="exhaust" :speed="80" />

<details>
<summary>推导及代码实现</summary>

<<< @/blog/algorithm/components/melkman/exhaust.ts

</details>

### 分治法 (快包 O(n㏒n))

也叫快速凸包构造算法(快包), 核心思想(分而治之)为:

> 划分点集为更小的点集, 直到能解决问题, 然后汇总结果

对于一个点集, 最容易确定是凸包顶点的, 是上下左右**4个极值点(集)**(x/y有相等时取两端参与划分), 剩下的点集暂时无法确定

基于这4个极值点(集), 可以想到把点集划分为**5个区域**, 很明显在中间的4-8边形内不可能存在凸包顶点, 剩余的**4个区域**(左上角、右上角、左下角、右下角) 可能存在凸包顶点

这4个区域可以视作新的点集继续划分, 但是问题是: 新的点集的极值点就**不一定**是凸包顶点了(请自己尝试)

<div style="filter:brightness(0.5)">

![划分](melkman/divide.png)

</div>

我们需要用别的方式找到凸包上的点, 很容易证明:

> **到划分线距离最远**的点一定是凸包上的点

*<sup>划分线即凸包顶点的连线, 比如前面提到的极值点, 这里用于将点集进行划分</sup>*

所以考虑将划分方式改为三角形, 整理下计算的步骤:

1. 找到x极值点**p0**和**p1**(p0.x < p1.x>), 线段$\overline{p_0p_1}$将点集划分为两个部分, 称作**上包**(逆时针方向)和**下包**(顺时针方向)
2. 在**上包**中找到离直线$\overline{p_0p_1}$最远的点**p2**, 分别使用直线$\overline{p_0p_2}$ 和 直线$\overline{p_2p_1}$ 继续划分出新的上包**A**(逆时针方向, 下包一定在多边形内部了)
  1. 若**A**为空, 不再继续划分
  2. **A**不为空则对**A**按照步骤**2**进行划分
3. 对**下包**也做与**第2步**相似的操作

#### 演示

<Play :algorithm="divide" :speed="125" />

<details>
<summary>推导及代码实现</summary>

使用[前置知识](#前置知识)中介绍过的通过叉积的正负判断点在线段的顺时针/逆时针方向的方法, 叉积的绝对值表示两向量围成的**平行四边形面积**, 距离最远的点一定可以围出**最大的面积**(底相等, 高越大面积越大), 据此可以划分上下包及找到距离划分线最远的点

<<< @/blog/algorithm/components/melkman/divide.ts

</details>

### Jarvis 步进法 (O(nH))

把点集想象成木板上钉的若干钉子, 要构造出最小凸包, 我们可以借助一根绳子, 先找到一颗最外面的钉子, 然后顺时针或逆时针绕着木板行走, 每次绳子将和一颗或多颗钉子同时接触, 走一圈下来即可围出最小凸包

计算的步骤为:

1. 左上、右上、左下、右下四个角处的点一定是凸包上的点, 因此选任意一个用来作为起点
2. 依次从剩下的点里取出一个点, 按照顺时针或逆时针方向, 夹角最接近平角的点(存在多个时任取一个就行)即为凸包顶点

优化一下:

1. 先找到左上角的点入栈, 选取顺时针方向遍历, 结果为点数组(栈), 先将下一个非起点的点入栈
2. 遍历全部点
    1. 若一个点**A**在栈顶两点向量的逆时针方向则用点**A**替换栈顶继续下一个点
    2. 若完成本轮遍历时得到的顶点为起点, 则结束, 否则入栈继续下一轮

#### 演示

<Play :algorithm="jarvis" :speed="125" />

<details>
<summary>推导及代码实现</summary>

<<< @/blog/algorithm/components/melkman/jarvis.ts

</details>

### Graham 扫描法 (O(n㏒n)) [^GrahamScan]

在[Jarvis 步进法](#jarvis-步进法-o-nh)中, 我们已经可以顺时针或逆时针地将凸包围出来了, 但是每次都要去遍历所有的点判断其时针方向才能确定一个顶点, 那要是我们按照时针方向去一个个寻找顶点不就只需要遍历一次了么？

Graham 扫描法就是这个思路, 还是先找到一个起点, 然后剩下的点按照相对起点的时针方向排序, 然后进行连接

计算的步骤为(左上角起顺时针方向):

1. 找到左上角点作为起点**O**
2. 将点集按照与起点**O**的幅角(y轴正向)从小到大排序, 幅角相等则按与起点**O**的距离排序(近的在前), 先把第一个点添加进凸包顶点数组末尾
3. 从排序数组中取出第一个点**A**, 直到数组为空时结束
4. 从凸包数组取末尾两点得到一条直线**L**, 若点**A**在直线**L**顺时针方向, 则将点**A**加入凸包数组, 继续执行第**3**步; 否则移除凸包数组末尾点, 继续执行第**4**步

#### 演示

<Play :algorithm="graham" :speed="125" />

<details>
<summary>推导及代码实现</summary>

其他点与起点的幅角范围为 [0, 180°], 使用$\cos$函数即可排序幅角, 同时可计算出距离

<<< @/blog/algorithm/components/melkman/graham.ts

</details>

### Melkman 算法 (O(n))

从[Graham 扫描法](#graham-扫描法-o-n㏒n)改进而来, 改进的思路是: Graham 扫描法一次只能从一端处理下一个有序点, 若是可以打开合适的位置, 那么任意一点都可以成为"下一个有序点", 从而使用同样的方式去处理. 因此它也变成了一个在线算法: 在得到一个三角形凸包后, 之后每加入一个点就按上述思路对凸包进行调整. 该算法在输入的点有序时(按照幅角排序), 时间复杂度可达到`O(n)`, 否则 `O(n㏒n)`

计算的步骤为:

1. 先依次取出点, 直到能构造出**顺时针方向的**三角形 (注意可能存在三点共线的情况)
2. 读取下一点**A**, 顺时针遍历凸包上的边
    1. 若点**A**在所有边的**顺时针**方向, 则点**A**在凸包内部, 继续步骤**2**
    2. 若点**A**在其中一条边**L**的**逆时针**方向, 则点**A**在凸包外部, 从边**L**处"打开"凸包, 使用与 Graham 扫描法相似的方法(步骤**3**)连接该点, 然后继续步骤**2**

#### 演示

<Play :algorithm="melkman" :speed="250" />

<details>
<summary>推导及代码实现</summary>

<<< @/blog/algorithm/components/melkman/melkman.ts

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
import exhaust from './components/melkman/exhaust'
import divide from './components/melkman/divide'
import jarvis from './components/melkman/jarvis'
import graham from './components/melkman/graham'
import melkman from './components/melkman/melkman'

export default {
  components: { Show, Play },
  methods: { exhaust, divide, jarvis, graham, melkman }
}
</script>
