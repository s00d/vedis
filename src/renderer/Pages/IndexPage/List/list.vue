<template>
  <div v-if="!treeEnable">
      <table class="pane table-striped" id="list" >
        <tbody class="list">
            <tr v-for="(item, key) in data" :key="key" :class="{active: item.path === selected}" @click="select(item)"  @contextmenu.prevent="ctxMenuOpen($event, item)" @dblclick="startRename(item.path)">
            <td class="type list-item"><span class="badge badge-pill" :class="setColor(item.type)" v-text="item.type">HASH</span></td>
            <td class="list-item">
            <span v-if="!item.edit" v-text="item.path_sbr"></span>
            <input v-else type="text" style="width: 80%" class="black" v-model="item.path" @keyup.enter="rename(item)">
        
            <a class="rm-btn float-right" @click.stop="removeKey({type: 'string', key: item.path})">x</a>
            </td>
            </tr>
            <tr class="next">
            <td width="20px"></td>
            <td><a href="#" @click="reloadList({pattern,cursor})">...</a> </td>
            </tr>
        </tbody>
        </table>  
        <context-menu id="ctx-menu ctx-menu-left" ref="ctxMenu">
            <li class="ctx-item" @click="$copyToClipboard(selectItem.path)">Copy to clipboad</li>
            <li class="ctx-item disabled ctx-min"><hr class="ctx-ln"></li>
            <li class="ctx-item" @click="showTTL">Set ttl...</li>
            <!-- <li class="ctx-item">Dublicate</li> -->
        </context-menu>
        
        <modal v-if="showTTLedit" 
            @close="showTTLedit = false" 
            @save="setTTL" 
            :inputs="{
                'ttl:': {type: 'number', minLength: 1, default: this.selectItem.ttl}
            }"
            title="Set TTL"
            button="add" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { omitBy } from 'lodash';
import contextMenu from 'vue-context-menu'
import modal from '../../modal.vue'

export default {
  components: { contextMenu, modal },
  name: 'list-component',
  props: {
      data: {
          type: [Number, String, Object, Array]
      }
  },
  data: function () {
      return {
          selected: '',
          oldPath: '',
          showTTLedit: false,
      }
  },
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
      },
      instance() {
        return this.selectedTab.instance
      }
  },
  methods: {
     ...mapActions({
         reloadList: 'reloadList', 
         selectItemRedis: 'selectItem', 
         removeKey: 'removeKey',
         setEditList: 'setEditList',
         renameList: 'renameList',
      }),
      setColor(type) {
        if(type === 'none') return 'badge-danger';
        if(type === 'HASH') return 'badge-primary';
        if(type === 'STRING') return 'badge-success';
        if(type === 'ZSET') return 'badge-warning';
        if(type === 'LIST') return 'badge-info';
        if(type === 'SET') return 'badge-light';
      },
      select(item) {
        this.selected = item.path
        this.selectItemRedis(item)
      },
      ctxMenuOpen(event, item) {
        this.selectItem = item
        this.$refs.ctxMenu.open(event)
      },
      showTTL() {
        this.instance.ttl(this.selectItem.path).then((ttl) => {
            console.log(ttl);
            this.selectItem.ttl = ttl;
            this.showTTLedit = true;
        });
      },
      setTTL(vals) {
        this.instance.expire(this.selectItem.path, parseInt(vals["ttl:"])).then((res) => {
            this.showTTLedit = false;
        });
      },
      startRename(path) {
        this.oldPath = path;
        this.setEditList(path);
      },
      rename(data) {
        data.oldPath = this.oldPath;
        this.renameList(data)
      }
  },
  mounted() {
    
  }
}
</script>

<style scoped>
    .mr-fix {
        margin-top: 3px;
        background-color: transparent;
        border: 1px solid white;
    }

    .remove-folder {
        color: #3097D1;
    }
    .remove-item {
        color: red;
    }
    .remove-folder:hover, .remove-item:hover {
        color:white;
    }

    .tree_item {
      margin-left: 2px;
    }
</style>
