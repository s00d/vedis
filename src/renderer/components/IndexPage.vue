<template>
  <div class="window">
    <div class="tab-group">
      <div class="tab-item">
        <span class="icon icon-cancel icon-close-tab"></span>
        Tab
      </div>
      <div class="tab-item tab-item-fixed">
        <span class="icon icon-plus"></span>
      </div>
    </div>
    <header class="toolbar toolbar-header">
      <div class="toolbar-actions">
        <div class="btn-group">
           <div class="navbar-brand" href="#">VEDIS</div>
          <button class="btn btn-default">
            <span class="icon icon-home"></span>
          </button>
          <button class="btn btn-default">
            <span class="icon icon-arrows-ccw"></span>
          </button>
          <add-button />
        </div>

    
        <button class="btn btn-default btn-dropdown pull-right dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">DB: <span v-text="db"></span></button>
        <div class="dropdown-menu" aria-labelledby="dropdown01">
          <a class="dropdown-item" href="#" v-for="db in count" :key="db-1" v-text="db-1" @click="selectDB(db-1)"></a>
        </div>
      </div>
    </header>
    <div class="window-content" v-if="connect">
      <div class="pane-group">
        <left-menu />
        <editor v-if="select" />
      </div>
    </div>
    <div class="window-content" v-else>
      <connection-page  />>
    </div>
    <footer class="toolbar toolbar-footer">
      <h1 class="title"><span class="float-right">Status: <span v-text="redis_status"></span></span></h1>
    </footer>
  </div>
</template>

<script>
  import LeftMenu from './IndexPage/LeftMenu'
  import TopMenu from './IndexPage/TopMenu'
  import Editor from './Editor/Editor'
  import addButton from './IndexPage/addButton'

  import ConnectionPage from './ConnectionPage'
  
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    name: 'index-page',
    components: { LeftMenu, TopMenu, Editor, addButton, ConnectionPage },
    methods: {
      ...mapActions({selectDB: 'selectDB'}),
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      redis_status() { return this.$store.state.List.status },
      ...mapState({
            count: state => state.List.count,
            db: state => state.List.config.db,
            select: state => state.List.select,
            config: state => state.List.config,
            connect: state => state.List.connect,
        }),
    },
    mounted () {
      console.log();
    }
  }
</script>

<style>
  .toolbar-footer {
    padding: 3px;
  }
</style>
