<template>
  <div class="pane pane-sm sidebar">
    <div class="input-group mb-12">
      <input class="form-control" type="text" placeholder="Search" v-model="pattern">
    </div>
     <div>
      <table class="pane table-striped" id="list">
        <tbody class="list">
          <tr v-for="(item, key) in list" :key="key" :class="{active: item.path === selected}" @click="select(item)"  @contextmenu.prevent="ctxMenuOpen($event, item)">
            <td class="type list-item"><span class="badge badge-pill" :class="setColor(item.type)" v-text="item.type">HASH</span></td>
            <td class="list-item">
              <span v-text="item.path_sbr"></span> 
              <a class="rm-btn float-right" @click.stop="removeKey({type: 'string', key: item.path})">x</a>
            </td>
          </tr>
          <tr class="next">
            <td width="20px"></td>
            <td><a href="#" @click="reloadList({pattern,cursor})">...</a> </td>
          </tr>
        </tbody>
      </table>       
     </div>

     <context-menu id="ctx-menu ctx-menu-left" ref="ctxMenu">
      <li class="ctx-item">Copy to clipboad</li>
      <li class="ctx-item disabled ctx-min"><hr class="ctx-ln"></li>
      <li class="ctx-item">Set ttl...</li>
      <li class="ctx-item">Rename</li>
      <li class="ctx-item">Dublicate</li>
      <li class="ctx-item disabled ctx-min"><hr class="ctx-ln"></li>
      <li class="ctx-item">Delete</li>
    </context-menu>
  </div>
</template>

<script>
import addButton from './addButton'
import { mapActions, mapGetters, mapState } from 'vuex'
import contextMenu from 'vue-context-menu'

  export default {
    data () {
      return {
        selected: '',
        pattern: '',
        selectItem: null
      }
    },
    components: { addButton, contextMenu },
    computed: {
        ...mapState({
            list: state => state.List.list,
            cursor: state => state.List.cursor
        }),
        // ...mapGetters({
        //     filteredMsg: 'sms_list/get_message'
        // }),
    },
    watch: {
      pattern(val) {
        this.reloadList({pattern: val, cursor: this.cursor})
      }
    },
    methods: {
      ...mapActions({reloadList: 'reloadList', selectItemRedis: 'selectItem', removeKey: 'removeKey'}),
      setColor(type) {
        if(type === 'none') return 'badge-danger';
        if(type === 'HASH') return 'badge-primary';
        if(type === 'STR') return 'badge-success';
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
      removeItem() {

      }
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

  .list-item {
    padding-left: 3px;
    padding-right: 3px;
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
