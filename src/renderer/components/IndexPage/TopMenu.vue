<template>
  <header class="toolbar toolbar-header">
    <div class="tab-group">
      <div class="tab-item" v-for="(item, key) in tabs" :key="key" :class="{active: key === tab}" @click="selectTab(key)">
        <span class="icon icon-cancel icon-close-tab"></span>
        <span v-text="item.config.name"></span>
      </div>
      <div class="tab-item tab-item-fixed" @click="addNewTab">
        <span class="icon icon-plus"></span>
      </div>
    </div>

    <div class="toolbar-actions">
      <div class="btn-group">
          <div class="navbar-brand" href="#">VEDIS</div>
        <button class="btn btn-default">
          <span class="icon icon-home"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-arrows-ccw"></span>
        </button>
        <add-button v-if="connect"/>

        <button class="btn btn-default" @click="selectType('editor')" v-if="connect" :disabled="type === 'editor'">
          <span class="icon icon-pencil"></span>
        </button>

        <button class="btn btn-default" @click="selectType('terminal')" v-if="connect" :disabled="type === 'terminal'">
          <span class="icon icon-window"></span>
        </button>
      </div>

  
      <button v-if="connect" class="btn btn-default btn-dropdown pull-right dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">DB: <span v-text="config.db"></span></button>
      <div class="dropdown-menu" aria-labelledby="dropdown01" v-if="connect">
        <a class="dropdown-item" href="#" v-for="db in count" :key="db-1" v-text="db-1" @click="selectDB(db-1)"></a>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import addButton from './addButton'
  export default {
    components: { addButton },
    data () {
      return {
        
      }
    },
    methods: {
      ...mapActions({selectDB: 'selectDB', addNewTab: 'addNewTab', selectTab: 'selectTab', selectType: 'selectType'}),
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      ...mapState({
        tabs: state => state.List.tabs,
        tab: state => state.List.tab,
      }),
      config: function() {
        return this.selectedTab.config
      },
      count: function() {
        return this.selectedTab.count
      },
      redis_status: function() {
        return this.selectedTab.redis_status
      },
      connect: function() {
        return this.selectedTab.connect
      },
      type: function() {
        return this.selectedTab.type
      },
    },
    mounted () {

    }
  }
</script>

<style scoped>
  
</style>
