<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  export default {
    name: 'vedis',
    methods: {
      ...mapActions({redis_connect: 'connectToRedis'}),
    },
    mounted () {
      console.log('test', this.$store);
      this.redis_connect();

      window.showModal = modal => {
        this.activeElement = document.activeElement

        return new Promise((resolve, reject) => {
          this.promise = {resolve, reject}
        })
      }
    }
          
  }
</script>

<style>
  /* CSS */

</style>
