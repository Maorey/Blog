<template>
  <canvas ref="el" width="320" height="320"></canvas>
</template>

<script lang="ts">
import { ref, onUnmounted } from 'vue'

export default {
  setup() {
    const el = ref<HTMLCanvasElement>()

    onUnmounted(() => {})

    return { el }
  },
}
</script>
