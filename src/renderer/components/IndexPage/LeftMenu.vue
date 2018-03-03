<template>
  <div class="wrapper">
    <nav id="sidebar">
      <!-- Sidebar Header -->
      <div>
        
        <div class="input-group mb-12">
          <input class="form-control" type="text" placeholder="Search" v-model="pattern">
          <div class="input-group-append">
            <add-button></add-button>
          </div>
        </div>

        
      </div>
      <ul class="list-unstyled components">
        <li v-for="(item, key) in list" :key="key" :class="item.path === selected ? 'active' : ''"><a href="#" @click="select(item)"  @contextmenu.prevent="ctxMenuOpen($event, item)">
          <span class="badge badge-pill" :class="setColor(item.type)" v-text="item.type">HASH</span>
          <span v-text="item.path_sbr"></span>  
        </a></li>
        <li class="next"><a href="#" @click="reloadList({pattern,cursor})">...</a></li>
      </ul>
    </nav>

    <context-menu id="ctx-menu ctx-menu-left" ref="ctxMenu">
      <!-- <li @click="doSomething(...)">option 1</li> -->
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
            cursor: state => state.List.cursor,
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
      ...mapActions({reloadList: 'reloadList', selectItemRedis: 'selectItem'}),
      setColor(type) {
        if(type === 'none') return 'badge-danger';
        if(type === 'HASH') return 'badge-primary';
        if(type === 'STR') return 'badge-success';
        if(type === 'ZSET') return 'badge-warning';
        if(type === 'LIST') return 'badge-info';
        if(type === 'HLIST') return 'badge-light';
      },
      select(item) {
        this.selected = item.path
        this.selectItemRedis(item)
      },
      ctxMenuOpen(event, item) {
        this.selectItem = item
        this.$refs.ctxMenu.open(event)
      }
    },
    mounted () {
      this.reloadList();
    }
  }
</script>

<style scoped>
 .wrapper {
    display: flex;
  }

  #sidebar {
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 999;
    background: #7386D5;
    color: #fff;
    transition: all 0.3s;
    overflow: visible;
    margin-top: 56px;
}

.badge {
  width: 45px;
}

#sidebar ul.components {
    padding: 0;
    border-bottom: 1px solid #47748b;
}

.list-unstyled {
    padding-left: 0;
    list-style: none;
    height: 78vh;
    overflow-y: auto;
    
}

ol, ul {
    margin-top: 0;
    margin-bottom: 10px;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    /* background: #6d7fcc; */
    background: #304cdb;
}

#sidebar ul li a {
    padding: 5px;
    font-size: 0.9em;
    display: block;
}

a[data-toggle="collapse"] {
    position: relative;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

.next {
  text-align: center;
}

::-webkit-scrollbar {
    width: 10px;
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

.ctx-min {
  height: 0;
  padding: 0;
}
.ctx-ln {
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>
