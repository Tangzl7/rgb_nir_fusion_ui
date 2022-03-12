<template>
  <div id="app">
    <router-view v-if="router_state"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',

  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      router_state: true
    }
  },
  methods: {
    reload() {
      this.router_state = false;
      this.$nextTick(()=>{
        this.router_state = true;
      })
    }
  }
}
</script>

<style>

</style>
