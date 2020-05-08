<template>
  <div class="theme-container">
    <h1>{{ $site.title }}</h1>
    <p>{{ $site.description }}</p>
    <Content/><!-- make sure to include markdown outlet -->
  </div>
  <Debug/>
</template>

<style>
.theme-container {
  font-family: Arial, Helvetica, sans-serif;
}
</style>