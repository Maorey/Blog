<template>
  <div :class="$style.wrap">
    <h2 class="t">哦豁，网页找不到啦 Σ(っ °Д °;)っ</h2>

    <img class="f" src="../assets/404.jpg" />
    <img class="c" src="../assets/crack.jpg" />

    <!-- Chrome 小恐龙游戏 -->
    <div id="t" />
    <sub class="t">试试 摸摸小恐龙 或 按按空格/上/下键 呗 (｡◕ˇ∀ˇ◕)</sub>

    <a :href="home">回首页</a>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useData } from 'vitepress'

export default {
  setup() {
    onMounted(() => {
      // 't-rex-runner/dist/runner'
      import('../libs/runner').then(initRunner => {
        initRunner = initRunner.runner || initRunner

        initRunner('#t')
      })
    })

    return {
      home: useData().site.value.base,
    }
  },
}
</script>

<style lang="scss" module>
.wrap {
  width: 100%;
  text-align: center;
  user-select: none;

  :global {
    #t {
      width: 100%;
      height: 150px;
      max-width: 600px;
    }

    .f {
      width: 450px;
      height: 90px;
      margin: auto;
      display: block;
      object-fit: cover;
      object-position: 0 -76px;
      filter: invert(0.87);
      pointer-events: none;
    }
    @media screen and (max-width: 426px) {
      .f {
        object-position: 0 -46px;
      }
    }

    .c {
      width: 440px;
      height: 330px;
      pointer-events: none;
    }

    .t {
      display: block;
    }
  }
}
</style>
