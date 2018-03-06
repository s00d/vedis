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

  .tab-item.active {
    color: black !important;
  }

  .search {
    position: fixed;
    z-index: 1000;
    width: 220px;
    height: 26px;
}

  .list-padding {
    padding-top: 28px;
  }

  .add {
    padding: 0 .5rem;
  }

  .top-item {
      display: inline-block;
      padding: 12px;
      cursor: pointer;
  }
  .top-item:hover {
    background-color: #e8e6e8;
  }
  .top-item.active {
    background: #dbdfe1;
  }

  .top-item .icon {
    margin-right: 5px;
  }
</style>
