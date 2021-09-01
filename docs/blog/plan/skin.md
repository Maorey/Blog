---
title: 一种基于前端工程化的整站综合换肤方案
index: 1
---

~~*2021-06-15*~~ ~~*2021-08-27*~~ *2021-09-03*

## 背景

有时候需要网站能换肤, 嗯, 就酱 *// 换肤迁移到这里(webpack no)太难了*

## 换肤方案

换肤有两种应用场景, 一种是构建时生成单个指定皮肤, 常见于“换皮项目”; 一种是运行时切换皮肤, 满足用户个性化需求

这里仅作简单介绍, 欢迎讨论、补充

### 构建时

即构建时生成指定皮肤, 主要面临的问题其实是项目管理方面的问题: 如何快速迭代满足甲方需求; 如何复用、同步各定制版本的功能; 如何避免版本/功能混乱、高耦合, 一个bug影响各个定制版本 等等

就换肤本身来说, 除了上述的问题外, 还存在因难以开发维护、难以自动化测试, 导致UI不稳定、风格不一致等问题

这里不展开讨论

### 运行时

即网站本身提供了多个版本, 甚至允许自定义皮肤, 用户可以按照自己的喜好切换皮肤

这其中又分需要刷新网页的和不需要刷新的, 前者常见于网站为不同特征用户提供不同的功能和交互体验的场景, 比如: 中文版英文版 老年版普通版青少年版 普通版极简版 设计师商家用户 等等; 后者比较常见, 比如: 浅色深色模式 各种主题等

具体实现方案大概有以下几种
<a id="fnref"><!-- 表格不能换行写而且里面的描回不来, 就离谱┓( ´∀` )┏ --></a>
| 方案 | 实现方式 | 优点 | 缺点
|--|--|--|--
| 配置文件 | 应用内根据配置项<ins title="可以与下面的方案结合">实现对应内容</ins> | 1. 样式和布局等都可配置<br>2. 允许用户自定义<br>3. 配置数据有移植潜力 | 1. 配置与应用强耦合, 配置项变更和管理成本较高
| [CSS变量](https://developer.mozilla.org/en-US/docs/Web/CSS/var())<sup><a href="#fn1">[1]</a></sup> | 通过修改CSS变量值实现换肤 | 1. 实现简单快速<br>2. 设计变量代码集中 | 1. 难以修改布局、动画等, 无法修改<ins title="canvas">js控制的样式</ins><br>2. 不兼容IE
| 样式覆盖 | <ins title="一般在根元素上增加class, 对应的样式都在这个class选择器下">利用CSS样式优先级覆盖默认样式</ins> | 1. 实现简单快速<br>2. 样式代码集中 | 1. 修改布局不够优雅, <ins title="略有影响性能">代码冗余</ins>, 无法修改<ins title="canvas">js控制的样式</ins><br>2. 需要良好的规范及代码组织, 否则<ins title="比如滥用!important内联样式等">维护成本高</ins><br>3. 难以<ins title="需要设计规范、保存用户的css">允许用户自定义</ins>
| [可替换样式表](https://developer.mozilla.org/docs/Web/CSS/Alternative_style_sheets)<sup><a href="#fn2">[2]</a></sup> | 通过可替换样式表来切换对应的样式文件 | 1. 样式<ins title="css可以完全不一样, 包括背景图、动画等等">自由度高</ins><br>2. 没有冗余代码, 整体<ins title="由浏览器来完整整个样式的切换">性能高</ins> | 1. 需要样式规范, 且无法修改<ins title="canvas">js控制的样式</ins><br>2. 难以<ins title="保存用户的css">允许用户自定义</ins><br>3. 增加打包时间和<ins title="但对浏览器的性能影响忽略不计, 因为可以先不加载或预加载, 切换的时候才会应用">体积</ins>
| [Vanilla JS](https://segmentfault.com/a/1190000000355277) | Vanilla JS :smirk: | 1. 自由度最高<br>2. 可配置且支持自定义<br>3. 支持canvas | 1. 开发维护成本高<br>2. 性能开销高 |

## 目标

本文讨论的方案是一种比较综合性的方案, 利用前端工程化的思路来尽可能规范化生产、降低心智负担 和 提效降本. **适合的才是最好的**, 这个方案也有其应用场景和局限

理想状况:

1. 整站换肤
2. 易开发易维护降成本
  - 集中管理整站风格
  - 可运行时切换的皮肤
  - css module / css object (`import STYLE from '*.scss'`) 支持
  - 细粒度特殊处理支持: 允许指定注入的变量 & 允许随皮肤切换样式和其他
  - 易于开发调试
  - 支持异步chunk
3. 良好的扩展性 (用户定制)
4. 无缝(刷新)切换/懒加载/预加载/按需加载皮肤

## 实现思路

1. alternate stylesheet + other
2. <ins title="使用css预处理语言编程能力">scss/less...</ins> vars + webpack插件
  - loader 注入全局变量 & 开放 css object 能力
  - 提供接口, 显式声明要注入变量、要调试的皮肤(cli)
  - runtime 代码广播换肤事件(可自定义), 维护当前皮肤状态(全局变量, 可自定义)以待获取 (比如异步chunk)
  - 收集构建信息, 用于 html 生成和默认切换 (也可存到后端)
  - 支持热更新, <ins title="style标签, 支持成本大, 要么丢热更新, 要么改style标签内容, 这都可以做成另一种换肤方案了">但暂不支持开发环境切换皮肤</ins>
  - 暂不支持 css-in-js (styled-component 等)
3. 配置 + css vars 或 编译保存皮肤
4. `<link rel="preload/prefetch"` / runtime

看看示例: <a href="/vue-tpl/other" target="_blank" rel="noopener noreferrer">示例2</a> | <a href="/vue-tpl" target="_blank" rel="noopener noreferrer">示例1</a> | <a href="/vue-tpl/report" target="_blank" rel="noopener noreferrer">打包分析</a> | [repo](https://github.com/Maorey/vue-tpl)

## 具体实现

*懒得画图*

如[上一节](#实现思路)所述, 选择了 `alternate stylesheet` + css预处理语言 作为方案的核心, 那么皮肤文件(`.css`)可以分为两类: <ins title="任何皮肤都生效的">**基础样式**</ins> 和 <ins title="只在当前皮肤生效的">**皮肤样式**</ins>; 文件加载方式又可分为: <ins title="静态写入html的">**同步**</ins> 和 <ins title="动态按需写入html的">**异步**</ins>

### 规范

所以首先要强调前端开发规范和设计规范, 因为没有办法自动去做多套皮肤的适配. 对于开发方面的规范主要有以下要求:

1. 遵循样式集中管理规范, 即: 有一套<ins title="色系、字体、图标、尺寸间距等">设计变量</ins>, 所有样式均需遵循
  - css样式
  - 内联样式
  - canvas样式

是的, 只有一条要求, 在现有项目基本满足以上规范的情况下, 应用此方案会比较顺利

### css 预处理语言 及 皮肤文件

生成多套皮肤是利用了css预处理语言编译到css文件的能力, 而 css 预处理语言基本都支持**变量**和一定的编程能力, 设计规范的落地主要通过 **变量** 和 相应前端组件 来实现

故, 一套 **css 预处理语言 变量<ins title="以scss为例, 还支持扩展、混入、方法等">等</ins>声明** 对应 一套皮肤文件, 要实现这一点需要做这些事情:

1. 皮肤注入: webpack loader, 为每个css预处理语言源码注入指定皮肤, 并允许复数皮肤
2. 皮肤打包: webpack plugin, 识别皮肤module, 生成文件, 处理同步异步加载runtime
3. 皮肤加载及应用: 根据构建信息加载/切换皮肤

下面是更多细节

### js引用 及 css module

js引用指在js中获取到设计变量的值, 这种场景常见于`canvas`及一些只能使用js动态计算样式的特殊情况, 支持方式很简单, 将设计变量导出即可使用:

```scss
// vars.scss
:export {
  theme: $colorTheme;
  theme1: mix($colorWhite, $colorTheme, 10%);
  top: trimUnit($heightHeader); // 60px => 60 (也可以实现 1rem => 14px)
  // ...
}
```

```ts
import VARS from '@index/scss/export/vars.scss'

// 仅作示意, init已被劫持, 下面会介绍
// 更好的方式是准备好几套echarts皮肤, 需要使用设计变量的情况很少
echarts.init(el).setOption(
  () => ({
    color: [VARS.theme, VARS.theme1],
    grid: { top: +VARS.top },
    // ...
  })
)
```

[css modules](https://github.com/css-modules/css-modules) 将class编译为唯一的标识, 在多数情况下, 不同皮肤的 css modules 对象是相同的, 但是考虑到<ins title="js引用, 样式替换等">等其他情况</ins>, 需要`loader` 提供允许自定义皮肤切换行为的能力, 即: 当皮肤改变时, css object值(键不太可能变)更新逻辑

比如在vue里, 可以直接使用 `Vue.observable()` 将css object转化为vue响应式对象, 在大多数场景下会自动随皮肤切换, 这其中可以对上述不同皮肤相同css object的情况作优化

对于其它框架, 可能需要使用响应式框架或状态管理等方式来实现

### 皮肤开发

可以通过cli参数及环境变量允许开发者配置相关路径, 要调试的皮肤等, 另外允许以下方式:

```html
<script lang="ts">
  /// 基础样式(所有皮肤下都生效) ///
  import './scss/a.scss?skin='
  // 指定scss变量文件相对路径(别名|皮肤文件(相对皮肤文件夹))
  import './scss/b.scss?skin=|foo.scss'

  /// 皮肤样式(自动打包到各种皮肤) ///
  import './scss/c.scss'
  import D from './scss/d.module.scss'

  /// 指定皮肤样式 ///
  import './scss/e.scss?skin=dark'
  import './scss/f.scss?skin=light'

  // CSS Module
  import getSkin from '@/skin'
  import dark from './scss/g.module.scss?skin=dark|foo.scss'
  import light from './scss/g.module.scss?skin=light|bar.scss'

  import { Component, Vue } from 'vue-property-decorator'

  const G = getSkin({ dark, light })

  @Component
  export default class extends Vue {
    // = computed
    protected get D() {
      return D
    }

    protected get G() {
      return G
    }
  }
</script>

<!-- 基础样式 -->
<style lang="scss" module skin="|">
.bar {
  display: none;
}
</style>
<style lang="scss" module skin="|foo.scss">
.bar {
  color: $red;
}
</style>
<!-- 皮肤样式 -->
<style lang="scss" module>
.foo {
  @if $skin == light {
    color: $red;
  } @else {
    color: $blue;
  }
}
</style>
<!-- 指定皮肤样式【不支持CSS Module】 -->
<style lang="scss" skin="dark">
.foo {
  color: $red;
}
</style>
<style lang="scss" skin="light">
.foo {
  color: $red;
}
</style>
<!-- 不支持scoped -->
```

需要特别说明的是, 在js中引用, 可以使用一些hack但awesome的方式来处理, 以`echarts`为例:

<details>
<summary>hack echarts</summary>

```ts
let idMap: IObject<IArguments> = {}
/// hack 方法 ///
let originSetOption: Function
const originInit = echarts.init
echarts.init = function(dom: any, theme?: string | IObject, opts?: IObject) {
  const instance = originInit.call(this, dom, theme || get(), opts)
  ;(instance as any).$ = opts

  if (!originSetOption) {
    try {
      const echartsProto = Object.getPrototypeOf(instance)
      originSetOption = echartsProto.setOption
      echartsProto.setOption = function() {
        let args: IArguments | any[] = arguments
        idMap[this.id] = args

        if (isFn(args[0])) {
          args = [...args]
          args[0] = args[0]()
        }

        return originSetOption.apply(this, args)
      }
    } catch (error) {}
  }

  return instance
}

/// 监听皮肤改变 ///
on(process.env.SKIN_FIELD, skin => {
  const newIdMap: IObject<IArguments> = {}

  let instance
  let args
  let opts
  let id
  for (id in idMap) {
    if ((instance = (echarts as any).getInstanceById(id))) {
      args = idMap[id]
      opts = (instance as any).$
      instance.dispose()

      instance = echarts.init(instance.getDom(), skin, opts)
      newIdMap[(instance as any).id] = args
      if (isFn(args[0])) {
        args = [...args]
        args[0] = args[0]()
      }
      originSetOption.apply(instance, args)
    }
  }

  idMap = newIdMap
})

/// 响应窗口大小改变 ///
window.addEventListener(
  'resize',
  throttle(() => {
    let id
    let instance
    for (id in idMap) {
      (instance = (echarts as any).getInstanceById(id)) && instance.resize()
    }
  }, 250)
)
```

</details>

即: 劫持 `init` 函数, 收集相关实例初始化信息, 当皮肤改变时, <ins title="这里提前准备了对应的eCharts主题">对所有图表进行更新</ins>, 并解决[js使用设计变量随皮肤更新问题](#js引用-及-css-module)

### 其他

皮肤打包插件会将chunk(`splitChunk`之后)中的css模块按皮肤拆成多个文件(`{skin}@{filename}.css`), 并提供runtime<ins title="当前皮肤通过全局变量获取, 可通过环境变量配置相关字段等">加载皮肤</ins>

可通过另外的插件自动向html正确地注入对应的 js/css(含皮肤) 文件链接, 和 preload/prefetch/defer/async/module 等配置

相对固定(可环境变量配置)工程目录结构以自动读取皮肤、设置入口等

将runtime chunk直接内联到html中, 以便服务端渲染

代码仓库拆分需要js和样式分离(分开打包, js中不import样式)并保留css预编译源码

微前端化皮肤管理

...

<!-- 没得办法, 只能人工脚注了┓( ´∀` )┏ -->
<hr>
1. 允许自定义css属性, 并在其作用域内的任何css中使用, 且修该自定义属性的值后, 使用该属性的样式会更新 <a href="#fnref" id="fn1">↩︎</a>

  ```css
  /* :root: 全局变量 */
  :root {
    /* 自定义属性必须以 -- 开头 */
    --main-bg-color: pink;
  }

  body {
    /* 变量无效(未定义/作用域...)时显示red */
    background-color: var(--main-bg-color, red);
  }
  ```

2. 它是 [HTML 4.01 规范](https://www.w3.org/TR/html401/present/styles.html#h-14.3) 中的内容, 允许切换网页使用的样式表, 切换样式方式如下 <a href="#fnref" id="fn2">↩︎</a>

  ```html
  <link href="reset.css" rel="stylesheet">

  <link href="default.css" rel="stylesheet" title="Default">
  <link href="fancy.css" rel="alternate stylesheet" title="Fancy">
  <link href="basic.css" rel="alternate stylesheet" title="Basic">

  <script>
  /** 设置当前皮肤
   * @param skin 要设置的皮肤名
   */
  function setSkin(skin: string) {
    /// 切换样式 ///
    for (const el of document.querySelectorAll<HTMLLinkElement>('link[title]')) {
      el.disabled = true // 必须先disabled下
      el.disabled = el.title !== skin
    }
  }
  </script>
  ```
