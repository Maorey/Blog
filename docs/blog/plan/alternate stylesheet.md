---
title: 一种基于 alternate stylesheet 的整站换肤方案
index: 1
---

*2021-06-15*

## 背景

有时候需要网站能换肤, 嗯, 就酱

## 换肤方案

换肤有两种应用场景, 一种是构建时生成单个指定皮肤, 一种是运行时切换皮肤

TODO: 来个表格 样式覆盖(根元素加class, css优先级) css变量 alternate stylesheet 其它略(less `<style` `<link`)

## alternate stylesheet

它是 [HTML 4.01 规范](https://www.w3.org/TR/html401/present/styles.html#h-14.3) 中的内容, 允许切换网页使用的样式表, 详情请[访问MDN](https://developer.mozilla.org/docs/Web/CSS/Alternative_style_sheets), 浏览器兼容性还不错, 完全可以在生产环境使用

## 目标

TODO: 来个表格

1. 整站换肤
2. 易开发易维护降成本
  - 默认自动注入皮肤变量同时生成多套可运行时切换的皮肤
  - 支持异步chunk
  - css module / css object (`import STYLE from '*.scss'`) 支持
  - 细粒度特殊处理支持: 允许指定注入的变量 & 允许随皮肤切换样式和其他
  - 易于开发调试
3. 良好的扩展性 (用户定制)
4. 无缝(刷新)切换/懒加载/预加载/按需加载皮肤

## 实现思路

TODO: 来个表格

1. alternate stylesheet
2. scss/less... vars + webpack插件
  - loader 配置全局变量
  - runtime代码广播换肤事件(可自定义), 维护当前皮肤状态(全局变量, 可自定义)以待获取 (比如异步chunk)
  - 搜集构建信息, 根据当前皮肤提供接口更新css object(如使用vue reactivity劫持下 可做到比如维护一套变量控制包括echarts在内的皮肤及切换)
  - 提供接口, 构建时处理
  - 支持热更新, 但暂不支持开发环境切换皮肤(style标签, 支持成本大, 要么丢热更新, 要么改style标签内容, 这都可以做成另一种换肤方案了), 支持使用指定皮肤(命令行参数)启动开发环境
  - 暂不支持 css-in-js (styled-component 等)
3. 可支持 css var、在线打包、上传css
4. `<link rel="preload/prefetch"`

## 具体实现

TODO: api/规范 + 工程化
