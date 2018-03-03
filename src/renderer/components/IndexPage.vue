<template>
  <div id="wrapper" v-if="redis_status === 'Connected'">
    <!--  https://getbootstrap.com/docs/4.0/examples/jumbotron/# -->
    <top-menu />
    <div class="container" style="margin-top: 60px" >
      <!-- Example row of columns -->
      <div class="row">
        <div class="col-md-3">
          <left-menu />
        </div>
        <div class="col-md-9">
          <editor></editor>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
  import LeftMenu from './IndexPage/LeftMenu'
  import TopMenu from './IndexPage/TopMenu'
  import Editor from './Editor/Editor'

  export default {
    name: 'index-page',
    components: { LeftMenu, TopMenu, Editor },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      redis_status() { return this.$store.state.List.status },
    },
    mounted () {
      console.log();
    }
  }
</script>

<style>
  
</style>
