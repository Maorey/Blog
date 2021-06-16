---
title: 动态规划
index: 1
---

*2020-12-11*

## 这是啥

参考百度百科 :wink: :

**动态规划**(Dynamic Programming, DP)是:

- **数学**的二级学科**运筹学**下的三级学科
- 求解**多阶段决策过程最优化**的过程, 是一种数学方法论, 没有公式可套 (但有套路)
- 每个阶段的决策依赖当前状态, 而又会引起状态转移, 故称"动态"
- 兄弟姐妹有 *线型规划* 、*非线型规划*、*组合最优化*、*图论*等

## 能干啥

~~主持大菊, 运筹帷幄~~

应用广泛, 如经济、工业、军事等领域, 并在背包问题、生产经营问题、资金管理问题、资源分配问题、最短路径问题和复杂系统可靠性问题等中取得了显著的效果...

::: tip 画重点
这里只讨论编程领域的应用
:::

## 怎么干

### 基础概念

_(做出决策 = 计算出结果)_

- 状态: 当前阶段上下文
- 边界: 无法继续优化的阶段, 即决策确定 _(无边界 = 无解/无数解 = 死循环)_
- 无后效性: 当前阶段做出决策后, 后续决策 不受 之前阶段 的影响, 即状态单向转移, 后续决策都是基于前面有限的阶段
- 状态转移方程: 不同阶段间上下文关系
- 重叠子结构: 不同阶段之间要解决的若干问题有重复
- 备忘录(DP Table): 在寻找最优子结构, 化简状态转移方程的过程中用于记录各阶段状态或决策的额外数据, 应该尽量去掉
- 最优子结构: 对阶段的划分和决策的过程最优化, 最优子结构一定也是由最优子结构组成

## 举例子

与分治法类似 (如快速/归并排序算法), 都是将待求解问题分为若干子问题, 从子问题的解得到原问题的解, 大事化小, 小事化了. 不同的是分治法一般是**自顶向下**递归求解, 而动态规划优化后一般是**自底向上**求解

以求解 斐波那契数列 第 `n` 位的值为例

问题分析:thinking:: 斐波那契数列 前两位为 `1`， 之后的每一位的值等于它前面两位的和

:bulb::sparkles: 暴力求解无脑走一波(自顶向下)

### 普通递归算法 :thumbsdown:

```ts{2}
function fibonacci(n: number): number {
  return n < 3 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)
}
```

求解过程如下:

```mermaid
flowchart TB
  A("f(n)") --> A1("f(n - 1)")
    A1 --> A11("f(n - 2)")
      A11 --> A111(...)
        A111 --> A1111("f(1)") --> B111
        A111 --> A1112("f(2)") --> B111
      A11 --> A112(...)
        subgraph c
        A112 --> A1121("f(1)") --> B112
        A112 --> A1122("f(2)") --> B112
        end
    A1 --> A12("f(n - 3)")
      subgraph b
      A12 --> A121(...)
        A121 --> A1211("f(1)") --> B121
        A121 --> A1212("f(2)") --> B121
      A12 --> A122(...)
        A122 --> A1221("f(1)") --> B122
        A122 --> A1222("f(2)") --> B122
      end
  A --> A2("f(n - 2)")
  subgraph a
    A2 --> A21("f(n - 3)")
      A21 --> A211(...)
        A211 --> A2111("f(1)") --> B211
        A211 --> A2112("f(2)") --> B211
      A21 --> A212(...)
        A212 --> A2121("f(1)") --> B212
        A212 --> A2122("f(2)") --> B212
    A2 --> A22("f(n - 4)")
      A22 --> A221(...)
        A221 --> A2211("f(1)") --> B221
        A221 --> A2212("f(2)") --> B221
      A22 --> A222(...)
        A222 --> A2221("f(1)") --> B222
        A222 --> A2222("f(2)") --> B222
  end

  B1("f(n - 1)") --> B("f(n)")
    B11("f(n - 2)") --> B1
      B111(...) --> B11
      B112(...) --> B11
    B12("f(n - 3)") --> B1
      subgraph b
      B121(...) --> B12
      B122(...) --> B12
      end
  B2("f(n - 2)") --> B
    subgraph a
    B21("f(n - 3)") --> B2
      B211(...) --> B21
      B212(...) --> B21
    B22("f(n - 4)") --> B2
      B221(...) --> B22
      B222(...) --> B22
    end
```

如图所示, 圈起来的都是重复子问题, 可以通过使用备忘录空间换时间的方式来实现剪枝

### 带备忘录递归算法 :thumbsup:

```ts
let DPTable: { [key: number]: number }

function solve(n: number): number {
  return (
    DPTable[n] ||
    (DPTable[n] = n < 3 ? 1 : solve(n - 1) + solve(n - 2))
  )
}

function fibonacci(n: number): number {
  DPTable = {}
  const result = solve(n)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}
```

### 动态规划算法 :heart_eyes::call_me_hand:

我们应用动态规划的概念来审视上面的解法

- 状态: `n`的值
- 重叠子结构: 上图框起来的部分, 比如 `f(n - 2)` 计算了两次, `f(n - 3)` 计算了三次...
- 备忘录: 使用一个简单对象(这里也可以是数组)缓存每个阶段计算结果
- 最优子结构: 对于 `n > 2` 存在最优子结构, 如下图:

```mermaid
flowchart TB
  A("f(n)") --> A1("f(n - 1)")
    A1 --> A11("f(n - 2)")
      A11 --> A111(...)
        A111 --> A1111("f(1)")
        A111 --> A1112("f(2)")
      A11 x-.-x A112(...)
        subgraph c
        A112 --> A1121("f(1)")
        A112 --> A1122("f(2)")
        end
    A1 x-.-x A12("f(n - 3)")
      subgraph b
      A12 --> A121(...)
        A121 --> A1211("f(1)")
        A121 --> A1212("f(2)")
      A12 --> A122(...)
        A122 --> A1221("f(1)")
        A122 --> A1222("f(2)")
      end
  A x-.-x A2("f(n - 2)")
  subgraph a
    A2 --> A21("f(n - 3)")
      A21 --> A211(...)
        A211 --> A2111("f(1)")
        A211 --> A2112("f(2)")
      A21 --> A212(...)
        A212 --> A2121("f(1)")
        A212 --> A2122("f(2)")
    A2 --> A22("f(n - 4)")
      A22 --> A221(...)
        A221 --> A2211("f(1)")
        A221 --> A2212("f(2)")
      A22 --> A222(...)
        A222 --> A2221("f(1)")
        A222 --> A2222("f(2)")
  end
style a fill:var(--c-brand),fill-opacity:0.2,stroke:var(--c-brand),stroke-dasharray:5 5
style b fill:var(--c-brand),fill-opacity:0.2,stroke:var(--c-brand),stroke-dasharray:5 5
style c fill:var(--c-brand),fill-opacity:0.2,stroke:var(--c-brand),stroke-dasharray:5 5
```

- 边界: `n = 1 或 2`
- 无后效性: `n > 2` 的每个阶段的结果**完全取决于**它前面两个阶段的结果
- 状态转移方程: 易得(已最简): $f(n) = \begin{cases}
   1 & n = 1, n = 2 \\
   f(n - 1) + f(n - 2) & n > 2
\end{cases}$

所以这么一波分析之后, 找到最优的求解过程应该如下

```mermaid
flowchart TB
  A1("f(1)") --> A3("f(3)")
  A2("f(2)") --> A3
  A2 --> A4("f(4)")
  A3 --> A4
  A3 --> Ad1(...)
  A4 --> Ad1
  A4 --> Ad2(...)
  Ad1 --> Ad2
  Ad1 --> An2("f(n - 2)")
  Ad2 --> An2
  Ad2 --> An1("f(n - 1)")
  An2 --> An1
  An2 --> An("f(n)")
  An1 --> An
```

顺着备忘录的思路根据**状态转移方程**改为**自底向上**求解的形式:

```ts
function fibonacci(n: number) {
  const DPTable: { [key: number]: number } = { 1: 1, 2: 1 }

  for (let i = 3; i <= n; i++) {
    DPTable[i] = DPTable[i - 1] + DPTable[i - 2]
  }

  return DPTable[n]
}
```

很明显备忘录是可以优化掉的, 易得:

```ts
function fibonacci(n: number) {
  let prev = 1
  let curr = 1
  let next
  while (n-- > 2) {
    next = prev + curr
    prev = curr
    curr = next
  }

  return curr
}
```

### 对比

```echarts
(function() {
function O(v){return v==4 ? 'O(2&lt;sup>n&lt;/sup>)' : v==2 ? 'O(nlogn)' : v==1 ? 'O(n)' : v==0 ? 'O(0)' :''}
function A(v){return v==4 ? 'O(2^n)' : O(v)}
return {
  legend: {},
  tooltip: {
    trigger: 'axis',
    confine: true,
    formatter: function(p,t,c) {
      var d=p[0],e=p[1],f='&lt;b style="margin-left:10px">',g='&lt;/b>',
        h='&lt;i style="display:inline-block;width:12px;height:12px;margin-right:5px;vertical-align:middle;border-radius:100%;background:',i='">&lt;/i>'
      return c(t, '&lt;h4>'+ d.name +'&lt;/h4>&lt;div style="text-align:left">'+
        h+ d.color +i+ d.seriesName +f+ O(d.value) +g+ '&lt;br/>'+
        h+ e.color +i+ e.seriesName +f+ O(e.value) +g+ '&lt;/div>')
    }
  },
  xAxis: [{
    type: 'category',
    data: ['普通递归', '带备忘录递归', '带备忘录动态规划', '动态规划'],
    axisPointer: { type: 'shadow' }
  }],
  yAxis: [
    { type: 'value', name: '时间复杂度', axisLabel: { formatter: A } },
    { type: 'value', name: '空间复杂度', axisLabel: { formatter: A } }
  ],
  series: [
    { name: '时间复杂度', type: 'bar', data: [4, 2, 1, 1] },
    { name: '空间复杂度', type: 'bar', yAxisIndex: 1, data: [4, 2, 2, 1] }
  ]
}
})()
```

## 讲套路

上面的示例只是体现了动态规划的一般过程, 动态规划是一种求解**最值**的方法论, 它的核心是**尽可能压缩可能解空间**, 具体做法是将大问题拆解为若干小问题, 求解小问题推导出大问题的解。

设计动态规划算法主要思路为:

- 明确状态, 搞清楚当前面对的问题
- 分析上游状态, 弄明白要解决当前阶段的问题最直接的需求
- 跟踪下游状态, 对当前问题的解决是否满足对下游的需求

上下游情况考虑清楚一个, 往往就能设计出状态转移方程. 从求解一个问题开始, 一般的解决过程如下:

```mermaid
flowchart TB
  A("分析问题, 尝试枚举出所有可能解(暴力求解)") --> B{"分析DP要素(重叠子结构/状态/边界/无后效性), 确定是否可DP"}
  B ------> |否| D(其他办法)
  B --> |是| C(DP开始)
  C --> C1(尝试自顶向下递归, 分析执行过程)
  C1 --> C2(找出最优子结构, 设计状态转移方程)
  C2 --> C3(使用备忘录剪枝重叠子问题)
  C3 --> C4(将算法改造成自底向上递推求解的形式)
  C -.-> C2
  C2 -.-> C4
```

## 做练习


::: warning 黄金矿工
有**5座**储量不尽相同的金矿, 每座金矿需要的矿工人数也不尽相同(如下表), 现有矿工**10位**, 每座金矿只能挖光或不挖, 不能只投入一部分人挖走部分金矿。求利益最大化方案(挖到最多金子)
:::

| 金矿 | 金矿A | 金矿B | 金矿C | 金矿D | 金矿E |
|:----:|:----:|:----:|:----:|:----:|:----:|
| 储量(kg) | 400 | 500 | 200 | 300 | 350 |
| 需要的矿工数 | 5 | 5 | 3 | 4 | 3 |

### 问题分析

穷举: 每座矿只有挖或不挖两种情况, 故挖矿方案共有 `@sum_(n=1)^5 C_5^n@` 种, 从中找出投入不超过10位矿工并且获得金矿最多的方案即可, 算法实现的时间复杂度为 `@O(2^n)@` (空间复杂度`@O(n)@`, 金矿全都挖的时候)

尝试DP (以下 "x位矿工挖n座矿的最优方案" 简称 "x人n矿")

分解问题:

```mermaid
flowchart TB
  A(10人5矿) --> B(10人4矿) -.-> |若总收益大于右边方案| D[最优采矿方案]
  A --> C(x人1矿 + 10-x人4矿) -.-> |若总收益大于左边方案| D
```

:wink:发现动态规划要素了没？

继续分解看看:

```mermaid
flowchart TB
  A(10人5矿) --> B(10人4矿)
  A --> C(x人1矿 + 10-x人4矿)

  B --> D(10人3矿)
  B --> E(y人1矿 + 10-y人3矿)

  C --> F(10-x人3矿)
  C --> G(z人1矿 + 10-x-z人3矿)
```

若设金矿数量为 `goldMineCount` , 矿工数为 `minerCount`, 金矿储量依次为 `reserves[]` , 金矿用工数依次为 `requiredMiners[]` , 则`10人5矿`可以表示为:
$$
f(10, 5) = max(f(10, 4), reserves[4] + f(10 - requiredMiners[4], 4))
$$

递推下去这个问题会有边界么? 显然存在, 如下:
$$
f(x, 1) = \begin{cases}
  reserves[0] & x >= requiredMiners[0] \\
  0 & x < requiredMiners[0]
\end{cases}
$$

所以这个问题是可以用动态规划方法解决的:v:

由上可得状态转移方程如下:

$$
f(minerCount, goldMineCount) = \begin{cases}
  0 & goldMineCount <= 1 \& \\ & \quad minerCount < requiredMiners[0] \\
  reserves[0] & goldMineCount = 1 \& \\ & \quad minerCount >= requiredMiners[0] \\
  f(minerCount, goldMineCount - 1) & goldMineCount > 1 \& \\ & \quad minerCount < requiredMiners[goldMineCount - 1] \\
  max( & goldMineCount > 1 \& \\
    \quad f(minerCount, goldMineCount - 1), & \quad minerCount >= requiredMiners[goldMineCount - 1] \\
    \quad reserves[goldMineCount - 1] + \\
    \qquad f( \\
    \qquad\quad minerCount - requiredMiners[goldMineCount - 1], \\
    \qquad\quad goldMineCount - 1 \\
    \qquad ) \\
  )
\end{cases}
$$

:running:那么DP走起~

<details open>
<summary><code>f(minerCount, goldMineCount)</code> 备忘录</summary>

|**minerCount / goldMineCount**|**1**|**2**|**3**|**4**|**5**|
|:----:|:----:|:----:|:----:|:----:|:----:|
|**1**|0|0|0|0|0|
|**2**|0|0|0|0|0|
|**3**|0|0|200<br/>*(C)*|200<br/>*(C)*|350<br/>*(E)*|
|**4**|0|0|200<br/>*(C)*|300<br/>*(D)*|350<br/>*(E)*|
|**5**|400<br/>*(A)*|500<br/>*(B)*|500<br/>*(B)*|500<br/>*(B)*|500<br/>*(B)*|
|**6**|400<br/>*(A)*|500<br/>*(B)*|500<br/>*(B)*|500<br/>*(B)*|550<br/>*(C + E)*|
|**7**|400<br/>*(A)*|500<br/>*(B)*|500<br/>*(B)*|500<br/>*(B) / (C + D)*|650<br/>*(D + E)*|
|**8**|400<br/>*(A)*|500<br/>*(B)*|700<br/>*(B + C)*|700<br/>*(B + C)*|850<br/>*(B + E)*|
|**9**|400<br/>*(A)*|500<br/>*(B)*|700<br/>*(B + C)*|800<br/>*(B + D)*|850<br/>*(B + E)*|
|**10**|400<br/>*(A)*|900<br/>*(A + B)*|900<br/>*(A + B)*|900<br/>*(A + B)*|900<br/>*(A + B)*|
|**11**|400<br/>*(A)*|900<br/>*(A + B)*|900<br/>*(A + B)*|900<br/>*(A + B)*|1050<br/>*(B + C + E)*|
|**12**|400<br/>*(A)*|900<br/>*(A + B)*|900<br/>*(A + B)*|1000<br/>*(B + C + D)*|1150<br/>*(B + D + E)*|
|**13**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1100<br/>*(A + B + C)*|1250<br/>*(A + B + E)*|
|**14**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1200<br/>*(A + B + D)*|1250<br/>*(A + B + E)*|
|**15**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1200<br/>*(A + B + D)*|1350<br/>*(B + C + D + E)*|
|**16**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1200<br/>*(A + B + D)*|1450<br/>*(A + B + C + E)*|
|**17**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1400<br/>*(A + B + C + D)*|1550<br/>*(A + B + D + E)*|
|**18**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1400<br/>*(A + B + C + D)*|1550<br/>*(A + B + D + E)*|
|**19**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1400<br/>*(A + B + C + D)*|1550<br/>*(A + B + D + E)*|
|**20**|400<br/>*(A)*|900<br/>*(A + B)*|1100<br/>*(A + B + C)*|1400<br/>*(A + B + C + D)*|1750<br/>*(A + B + C + D + E)*|

</details>

::: tip 提示
后文中将省略已出现过的代码
:::

### 带备忘录递归算法 :thumbsup:

只计算最大收益数值(`getMostGold`):

```ts
/** 金矿信息 */
interface GoldMine {
  /** 黄金储量 */
  gold: number
  /** 需要矿工数 */
  cost: number
}

let DPTable: { [key: string]: number }

function solve<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount: number
): number {
  const key = minerCount + '.' + goldMineCount
  const result = DPTable[key]
  if (result !== undefined) {
    return result
  }

  if (goldMineCount < 2) {
    const goldMine = goldMines[0]

    return (DPTable[key] = minerCount < goldMine.cost ? 0 : goldMine.gold)
  }

  const goldMine = goldMines[--goldMineCount]
  const right =
    minerCount < goldMine.cost
      ? 0
      : minerCount === goldMine.cost
        ? goldMine.gold
        : goldMine.gold + solve(goldMines, minerCount - goldMine.cost, goldMineCount)

  const left = solve(goldMines, minerCount, goldMineCount)

  return (DPTable[key] = left > right ? left : right)
}

function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): number {
  DPTable = {}
  const result = solve(goldMines, minerCount, goldMineCount)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}

/* 验证
getMostGold(
  [
    { id: '1', gold: 400, cost: 5 },
    { id: '2', gold: 500, cost: 5 },
    { id: '3', gold: 200, cost: 3 },
    { id: '4', gold: 300, cost: 4 },
    { id: '5', gold: 350, cost: 3 },
  ],
  10
)
*/
```

得到详细方案(`getMostGold`):

```ts
/** 得到黄金最多的 采矿方案 */
interface Plan<T extends GoldMine = GoldMine> extends GoldMine {
  /** 要挖掘的金矿 */
  mines: T[]
}

function addTo<T extends GoldMine = GoldMine>(
  goldMine: T,
  plans: Plan<T>[]
): Plan<T>[] {
  const { gold, cost } = goldMine

  let i = plans.length
  let plan: Plan<T>
  while (i--) {
    plan = plans[i]

    plan.gold += gold
    plan.cost += cost
    plan.mines.push(goldMine)
  }

  return plans
}
function merge<T extends GoldMine = GoldMine, R extends GoldMine = T>(
  leftPlans: Plan<T>[],
  rightPlans: Plan<R>[]
): Plan<T | R>[] {
  let leftGold = leftPlans[0].gold
  let rightGold = rightPlans[0].gold

  if (leftGold === rightGold) {
    // 归并
    const mergedPlans: Array<Plan<T | R>> = []

    let l = leftPlans.length
    let r = rightPlans.length
    while (l && r) {
      mergedPlans.unshift(
        leftPlans[l - 1].cost > rightPlans[r - 1].cost
          ? leftPlans[--l]
          : rightPlans[--r]
      )
    }
    while (l) {
      mergedPlans.unshift(leftPlans[--l])
    }
    while (r) {
      mergedPlans.unshift(rightPlans[--r])
    }

    return mergedPlans
  }

  return leftGold > rightGold ? leftPlans : rightPlans
}

let DPTable: { [key: string]: any }

function solve<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount: number
): Plan<T>[] {
  const key = minerCount + '.' + goldMineCount
  const result = DPTable[key]
  if (result !== undefined) {
    return result
  }

  let goldMine
  let cost

  if (goldMineCount < 2) {
    goldMine = goldMines[0]
    cost = goldMine.cost

    return (DPTable[key] =
      minerCount < cost
        ? [{ gold: 0, cost: 0, mines: [] }]
        : [{ gold: goldMine.gold, cost, mines: [goldMine] }])
  }

  goldMine = goldMines[--goldMineCount]
  cost = goldMine.cost

  if (minerCount < cost) {
    return (DPTable[key] = solve(goldMines, minerCount, goldMineCount))
  }

  let right
  if (minerCount === cost) {
    right = [{ gold: goldMine.gold, cost, mines: [goldMine] }]
  } else {
    right = addTo(goldMine, solve(goldMines, minerCount - cost, goldMineCount))
  }

  return (DPTable[key] = merge(solve(goldMines, minerCount, goldMineCount), right))
}

function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): Plan<T>[] {
  DPTable = {}
  const result = solve(goldMines, minerCount, goldMineCount)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}
```

### 动态规划算法 :heart_eyes::call_me_hand:

只计算最大收益数值(`getMostGold`):

```ts
function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): number {
  const DPTable: { [goldMineCount: number]: number } = {}

  let goldMine: T
  let gold: number
  let cost: number
  let j: number
  while (goldMineCount--) {
    goldMine = goldMines[goldMineCount]
    gold = goldMine.gold
    cost = goldMine.cost

    for (j = minerCount; j >= cost; j--) {
      DPTable[j] = Math.max(DPTable[j] || 0, (DPTable[j - cost] || 0) + gold)
    }
  }

  return DPTable[minerCount]
}
```

得到详细方案(`getMostGold`):

```ts
function copyPlan<T extends GoldMine = GoldMine>(plan: Plan<T>): Plan<T> {
  return { ...plan, mines: [...plan.mines] }
}

function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): Plan<T>[] {
  const DPTable: { [goldMineCount: number]: Plan<T>[] } = {}

  let goldMine: T
  let gold: number
  let cost: number
  let j: number
  let leftPlans: Plan<T>[]
  let rightPlans: Plan<T>[]
  while (goldMineCount--) {
    goldMine = goldMines[goldMineCount]
    gold = goldMine.gold
    cost = goldMine.cost

    for (j = minerCount; j >= cost; j--) {
      leftPlans = DPTable[j - cost]
      leftPlans = leftPlans
        ? addTo(goldMine, leftPlans.map(copyPlan))
        : [{ gold, cost, mines: [goldMine] }]
      rightPlans = DPTable[j]
      DPTable[j] = rightPlans ? merge(leftPlans, rightPlans) : leftPlans
    }
  }

  return DPTable[minerCount]
}
```

## 留作业

请思考:

1. 黄金矿工各算法的时间/空间复杂度怎么评估?

2. 动态规划一定比递归更优么?

  *例如矿工数远远大于金矿数的情况;空间/频繁读写敏感场景*

## 参考链接

[漫画：什么是动态规划？](https://zhuanlan.zhihu.com/p/31628866)
