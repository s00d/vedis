<template>
  <div class="pane pane-sl sidebar">
    <div class="search-input">
      <span class="icon icon-search"></span>
      <input type="search" class="form-control" placeholder="Key name or patterns (e.g. user:*)" v-model="pattern">
    </div>
    <div class="list-padding">
      <list :data="list" v-if="!treeEnable" />

      <div class="pane table-striped" v-else>
        <tree :tree="treeList" id="root" />
      </div>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import contextMenu from 'vue-context-menu'
import tree from './List/tree2.vue';
import list from './List/list.vue';
import modal from '../modal.vue'

  export default {
    data () {
      return {
        
        pattern: '',
        selectItem: null,
        old_name: '',
      }
    },
    components: { contextMenu, tree, list, modal },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      list() {
        return this.selectedTab.list
      },
      cursor() {
        return this.selectedTab.cursor
      },
      treeEnable() {
        return this.selectedTab.tree
      },
      treeList() {
        return this.selectedTab.treeList
      }
    },
    watch: {
      pattern(val) {
        this.reloadList({pattern: val, cursor: this.cursor})
      }
    },
    methods: {
      ...mapActions({reloadList: 'reloadList'}),
      
    },
    mounted () {
      this.reloadList();
    }
  }
</script>

<style scoped>
  .type {
    width: 10px;
  }

  

  .active, .selected {
    color: #fff !important;
    background-color: #116cd6 !important;
  }
  .badge {
    width: 45px;
  }



/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
    background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555; 
}

.ctx-item:focus, .ctx-item:hover {
    color: #2b2d2f;
    text-decoration: none;
    background-color: #f5f5f5;
    cursor: normal;
}




    
</style>
