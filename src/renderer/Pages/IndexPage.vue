<template>
  <div class="window">
    <top-menu />
    <div class="window-content" v-if="connect">
      <div class="pane-group">
        <left-menu />
        <editor v-if="select && type === 'editor'" />
        <info-page v-if="!select && type === 'editor'" />
        <terminal v-if="type === 'terminal'" />
        <Settings v-if="type === 'settings'" />
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
  import Terminal from './IndexPage/Terminal'
  import Settings from './IndexPage/SettingsPage'

  import ConnectionPage from './IndexPage/ConnectionPage'
  import InfoPage from './IndexPage/InfoPage'
  
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    name: 'index-page',
    components: { LeftMenu, TopMenu, Editor, addButton, ConnectionPage, Terminal, InfoPage, Settings },
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
      type: function() {
        return this.selectedTab.type
      },
    },
    mounted () {
      
    }
  }
</script>

<style>
  .toolbar-footer {
    padding: 3px;
  }
</style>
