<template>
  <div class="n">
    <!-- Chrome 小恐龙游戏 -->
    <div id="t" />

    <img class="f" src="../assets/404.jpg" />
    <img class="c" src="../assets/crack.jpg" />

    <h2 class="t">哦豁，网页找不到啦 Σ(っ °Д °;)っ</h2>
    <sub class="t">试试 摸摸小恐龙 或 按按空格/上/下键 呗 (｡◕ˇ∀ˇ◕)</sub>
    <a class="a" :href="$site.base">回首页</a>
  </div>
</template>

<script>
import { onMounted } from 'vue'
// import { initRunner as tRexRunner } from 't-rex-runner/dist/runner'
// import tRexRunner from '../libs/tRexRunner.min'

function initTRexRunner() {
  import('../libs/tRexRunner.min').then(module => {
    module.default('#t')
  })
}

export default {
  setup() {
    onMounted(initTRexRunner)
  },
}
</script>

<style>
.n {
  width: 100%;
  text-align: center;
  user-select: none;
  pointer-events: none;
}

.n #t {
  width: 100%;
  height: 150px;
  max-width: 600px;
  margin-top: 10px;
  pointer-events: all;
}

.n .f {
  width: 450px;
  height: 90px;
  margin: auto;
  display: block;
  object-fit: cover;
  object-position: 0 -76px;
}

@media screen and (max-width: 426px) {
  .n .f {
    object-position: 0 -46px;
  }
}

.n .c {
  width: 440px;
  height: 330px;
}

.n .t {
  margin: 10px 0;
  display: block;
}

.n .a {
  pointer-events: all;
}
</style>
