<template>
  <div id="app">
    <router-view :key="this.$router.path" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less">
</style>
