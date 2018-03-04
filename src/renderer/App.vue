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
  .active, .selected {
    color: #fff !important;
    background-color: #116cd6 !important;
  }

  .editor {
    width: 100%;
    height: 200px;
  }

  .rm-btn {
    color: red !important;
  }

  a {
    cursor: pointer;
  }

  .table-striped tbody tr:nth-of-type(odd) {
    background-color: #ffffff;
  }

  .table-striped tr:nth-child(even), thead {
    background-color: #f5f5f4;
  }
</style>
