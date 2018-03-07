<template>
  <header class="toolbar toolbar-header">
    <div class="tab-group">
      <div class="tab-item" v-for="(item, key) in tabs" :key="key" :class="{active: key === tab}" @click="selectTab(key)">
        <span class="icon icon-cancel icon-close-tab"></span>
        <span v-text="item.config.name"></span>

        <span class="icon icon-cancel icon-close-tab" @click.stop="closeTab(key)"></span>
      </div>
      <div class="tab-item tab-item-fixed" @click="addNewTab">
        <span class="icon icon-plus"></span>
      </div>
    </div>

    <div class="toolbar-actions">
      <div class="btn-group">
          <div class="navbar-brand" href="#" style="padding-top: 10px;">VEDIS</div>

          <div class="top-item" @click="reloadList()" v-if="connect">
            <span class="icon icon-arrows-ccw"></span>Refresh
          </div>
          <add-button v-if="connect"/>

          <div class="top-item" @click="selectType('editor')" v-if="connect" :class="{active: type === 'editor'}">
            <span class="icon icon-pencil"></span>Editor
          </div>

          <div class="top-item" @click="selectType('terminal')" v-if="connect" :class="{active: type === 'terminal'}">
            <span class="icon icon-pencil"></span>Terminal
          </div>

          <div class="top-item" @click="selectType('settings')" v-if="connect" :class="{active: type === 'settings'}">
            <span class="icon icon-cog"></span>Settings
          </div>
      </div>

  
      <div v-if="connect" class="top-item btn-dropdown pull-right dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">DB: <span v-text="config.db"></span></div>
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
      ...mapActions({
        selectDB: 'selectDB', 
        addNewTab: 'addNewTab', 
        selectTab: 'selectTab', 
        selectType: 'selectType',
        closeTab: 'closeTab',
        reloadList: 'reloadList'
      })
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
      this.$events.$on('new-tab', () => {
        this.addNewTab()
      })
      this.$events.$on('close-tab', () => {
        this.closeTab(this.tab)
      })
    }
  }
</script>

<style scoped>
  .toolbar-actions > .btn-group > .btn {
    display: inline-block;
    padding: 12px;

  }

  .toolbar-actions {
    margin: 0;
    padding: 0;
  }

  .toolbar-actions > .btn-group {
    margin: 0;
    padding: 0 20px;
  }
  

  .tab-item .icon-close-tab {
    position: absolute;
    top: 50%;
    right: 5px;
    width: 15px;
    height: 15px;
    font-size: 15px;
    line-height: 15px;
    text-align: center;
    color: #666;
    opacity: 0;
    transition: opacity .1s linear,background-color .1s linear;
    border-radius: 3px;
    transform: translateY(-50%);
    z-index: 10;
  }

  .tab-item:hover .icon-close-tab, .tab-item:hover:not(.active):after {
    opacity: 1;
  }
</style>
