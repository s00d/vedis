<template>
  <div class="window">
    <div class="tab-group">
      <div class="tab-item" v-for="(item, key) in tabs" :key="key" :class="{active: key === tab}" @click="selectTab(key)">
        <span class="icon icon-cancel icon-close-tab"></span>
        <span v-text="item.config.name"></span>
      </div>
      <div class="tab-item tab-item-fixed" @click="addNewTab">
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

    
        <button class="btn btn-default btn-dropdown pull-right dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">DB: <span v-text="config.db"></span></button>
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
      ...mapActions({selectDB: 'selectDB', addNewTab: 'addNewTab', selectTab: 'selectTab'}),
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      ...mapState({
        tabs: state => state.List.tabs,
        tab: state => state.List.tab,
      }),
      count: function() {
        return this.selectedTab.count
      },
      select: function() {
        return this.selectedTab.select
      },
      config: function() {
        return this.selectedTab.config
      },
      connect: function() {
        return this.selectedTab.connect
      },
      redis_status: function() {
        return this.selectedTab.status
      },
    },
    mounted () {
      console.log('data', this.count);
    }
  }
</script>

<style>
  .toolbar-footer {
    padding: 3px;
  }
</style>
