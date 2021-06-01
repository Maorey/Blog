---
sidebar: auto
---

# 我的博客

> 转载我的任何博客都需要注明出处, 禁止断章取义、人身攻击, 禁止用于商业用途

## 介绍

基于 [vitepress](https://github.com/vuejs/vitepress) 的静态文档网站, 使用 [markdown](http://markdown.p2hp.com) 标记语言写作

## 环境准备

- [node](https://nodejs.org/): 10.x 版本以上

写文章可以用各种 markdown 编辑器, 或者任何文本编辑器, 甚至直接在 github 网页上写, 但是有些语法可能会不支持预览(比如图表)

## 安装使用

使用命令行, 建议配置 [github CI/CD](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions)

### 初次安装

npm (安装node附带):

```bash
npm i
```

[yarn](https://classic.yarnpkg.com)【建议】:

```bash
yarn
```

### 生成网站

npm:

```bash
npm build
```

yarn【建议】:

```bash
yarn build
```

## 目录结构

```bash
│
├── docs # 文档目录
│   │── .vitepress # 博客配置代码, 含主题等
│   │── public # 静态资源, 如使用到的图片等
│   │── components # vue组件目录 (任意位置)
│   │
│   │── ... # 自定义博客文档结构 (每个目录都需要一个 index.md 文件, 【不要使用前面的文件夹名】)
│   │
│   └── index.md # 目录对应的默认页
│
├── ... # 项目相关配置文件
│
└── dist # 生成的静态网站
```

## 支持markdown语法

插件列表如下 (`=>`表示生成结果)

- [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub)

  ```md
  功能: 下标
  标记: ~内容~
  示例: H~2~0 => H<sub>2</sub>O
  ```

- [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup)

  ```md
  功能: 上标
  标记: ^内容^
  示例: 29^th^ => 29<sup>th</sup>
  ```

- [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins)

  ```md
  功能: 插入 (删除: ~~内容~~)
  标记: ++内容++
  示例: ++inserted++ => <ins>inserted</ins>
  ```

- [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr)

  ```md
  功能: 缩写
  标记: *[缩写]: 全称
  示例:
    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
    The HTML specification is maintained by the W3C.

    =>

  The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.
  ```

- [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)

  ```md
  功能: 标记 (默认加黄色背景)
  标记: ==内容==
  示例: ==marked== => <mark>inserted</mark>
  ```

- [markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex) [支持公式](https://katex.org/docs/supported.html)

  ```md
  功能: 数学公式 katex 语法
  标记: 行内 $katex$ 块级 $$katex$$
  示例: $f(x)$ => <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal" style="margin-right: 0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>
  ```

- [markdown-it-latex](https://github.com/tylingsoft/markdown-it-latex) 数学公式latex/asciimath语法

- [markdown-it-deflist](https://github.com/markdown-it/markdown-it-deflist)

  ```md
  功能: 定义列表 (<dl>)
  标记:
  项目 (<dt>)
  : 描述 (<dd>)
  示例: 见 https://pandoc.org/MANUAL.html#definition-lists
  ```

- [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)

  ```md
  功能: 脚注
  标记: [^1] 内容 [^1]: 脚注
  示例:
  Here is a footnote reference,[^1] and another.[^longnote]

  [^1]: Here is the footnote.

  [^longnote]: Here's one with multiple blocks.

  Subsequent paragraphs are indented to show that they
belong to the previous footnote.

  =>

  Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup>
  <hr class="footnotes-sep">
  <section class="footnotes">
    <ol class="footnotes-list">
      <li id="fn1" class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩</a></p>
      </li>
      <li id="fn2" class="footnote-item"><p>Here’s one with multiple blocks.</p>
      <p>Subsequent paragraphs are indented to show that they
      belong to the previous footnote. <a href="#fnref2" class="footnote-backref">↩</a></p>
      </li>
    </ol>
  </section>
  ```

- [markdown-it-img-lazy](https://github.com/tolking/markdown-it-img-lazy) 懒加载图片, 相同位置文件名前加`_o_`用于点击浏览大图(都可以浏览大图)

- [markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists)

  ```md
  功能: 任务列表
  标记: 列表项(-/1.): [ ] todo [x] done
  示例:
  - [ ] todo
  - [x] done

  =>

  <ul class="contains-task-list"><li class="task-list-item"><input class="task-list-item-checkbox" disabled="" type="checkbox"> todo</li><li class="task-list-item"><input class="task-list-item-checkbox" checked="" disabled="" type="checkbox"> done</li></ul>
  ```

- [markdown-it-html5-media](https://github.com/eloquence/markdown-it-html5-media) 使用图片标记`![描述](链接)`, 以链接后缀区分媒体类型

- ~~[markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes) 链接属性~~

- markdown-it-plugin-[echarts](https://github.com/apache/incubator-echarts):
  **使用`eval`获取图表配置对象**(即: 可以写js)

  width/height: 指定容器宽高, 数字单位为`px`, 其他单位使用字符串

  ```echarts
  {
    width: '100%',
    height: 250,
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }
    ]
  }
  ```

- markdown-it-plugin-[mermaid](https://github.com/mermaid-js/mermaid):


  ```mermaid
  graph TD
  A[Hard] -->|Text| B(Round)
  B --> C{Decision}
  C -->|One| D[Result 1]
  C -->|Two| E[Result 2]
  ```

- markdown-it-plugin-[flowchart](https://github.com/adrai/flowchart.js):

  ```flowchart
  st=>start: Start:>http://www.google.com[blank]
  e=>end:>http://www.google.com
  op1=>operation: My Operation
  sub1=>subroutine: My Subroutine
  cond=>condition: Yes
  or No?:>http://www.google.com
  io=>inputoutput: catch something...
  para=>parallel: parallel tasks

  st->op1->cond
  cond(yes)->io->e
  cond(no)->para
  para(path1, bottom)->sub1(right)->op1
  para(path2, top)->op1
  ```

- [使用Vue组件](https://vitepress.vuejs.org/guide/using-vue.html)

  ```md
  # Docs

  This is a .md using a custom component

  <CustomComponent />

  ## More docs

  ...

  <script setup>
  import CustomComponent from '../components/CustomComponent.vue'
  </script>
  ```

## 使用说明

在每个 `.md` 文件中可以使用如下宏:

```markdown
// 顶部注释区域, 不显示在正文中
---
// 指定文章标题
title: 文章标题

// 可以通过链接访问, 但不出现在导航链接中 true/false
hide: true

// 指定左侧栏是否显示 可选值为:
// 不指定: 对应目录结构
// auto: 对应文章的目录结构
// false: 不显示
sidebar: auto

// 同目录下的排序, 数字小的在后面
index: 0
---

// 正文区域
// 若注释区未设置标题则使用第一个一级标题
# 文章标题

// 列出当前目录树(仅index.md), 文章目录请使用 markdown 目录语法
<Menu />
```

公式参考链接: [katex](https://katex.org) ~~[asciimath](http://asciimath.org)~~, [可视化](https://demo.wiris.com/mathtype/en/developers.php#mathml-latex)

[emoji](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

更多请参考: [vitepress](https://vitepress.vuejs.org/guide/frontmatter.html)

## TODO

- [ ] markdown 插件:
  - [ ] 字体图标(含SVG Symbol)
  - [x] 图片查看/媒体播放
  - [ ] 待定
- [ ] 标签/归档
- [ ] 换肤/背景
- [ ] UI
- [ ] bug: 代码高亮行错位
