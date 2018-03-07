<template>
  <div class="list"  v-if="show">
      <div class="col-xs-12 tree-item"  :class="{bold: isFolder, selected: tree.open || selected}" :style="offset" @click="toggle" :id="id" @dblclick="startRename(tree)">
        <span v-if="isFolder"> [{{tree.open ? '-' : '+'}}] </span>
        <i class="icon icon-folder" v-if="isFolder"></i>
        <span v-if="!tree.edit" v-text="tree.name"></span>
        <input v-else type="text" style="width: 80%" class="black" v-model="tree.path" @keyup.enter="renameList(tree.path)">
    
        <a class="rm-btn float-right"  v-if="tree.name !== 'root'" @click.stop="removeKey({type: 'string', key: item.path})">x</a>
        <!-- <span class="label label-default float-right mr-fix" v-text="length" v-if="isFolder"></span> -->
      </div>
      <tree2-component v-if="isFolder && !isFolderLoad && tree.open" 
        v-for="(data, key) in tree.children"
        :id="key"
        :level="level+1"
        :key="data.link"
        :tree="data" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { omitBy } from 'lodash';

let toData = '';

export default {
  components: { el: {} },
  name: 'tree2-component',
  props: {
      id: {
          type: [Number, String]
      },
      tree: {
          type: [Number, String, Object, Array]
      },
      level: {
          type: Number,
          default: 1,
      }
  },
  data: function () {
      return {
          show: true,
          oldPath: ''
      }
  },
  computed: {
      ...mapState({
          save: state => state.settings.data.save
      }),
      offset() {
        return 'padding-left:'+(this.level * 10)+'px'
      },
      isFolder() {
        return this.tree.type === 'folder';
        // return 'children' in this.tree && this.tree.children !== false;  //&& Object.keys(this.tree.children).length;
      },
      isFolderLoad() {
          return this.isFolder && this.tree.children === 'unload';
      },
      selected() {
          return this.$route.query.key === this.tree.path
      },
      length() {
          return 'children' in this.tree && this.tree.children !== 'unload' ? Object.keys(this.tree.children).length : 'un'
      },
      link: {
          get() {
              return this.tree.link;
          },
          set(val) {
              return  this.$store.commit('tree/rename', {old_link: this.tree.path, new_link: val});
          }
      }
  },
  methods: {
     ...mapActions({
       openTree: 'openTree', 
       selectItemRedis: 'selectItem', 
       removeKey: 'removeKey', 
       setEditTree:'setEditTree', 
       editTree: 'editTree',
       renameList: 'renameList',
      }),
      toggle() {
        if (this.isFolder) {
          this.openTree("0"+this.tree.path);
        } else {
          this.selectItemRedis(this.tree);
        }
      },
      addChild() {
          this.tree.children.push({
              name: this.defaultText ? this.defaultText : 'New Node',
              id: id++
          })
      },
      startRename(tree) {
        if(this.isFolder()) return;
        tree.oldPath = this.oldPath;
        this.setEditTree(tree.path);
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
</style>
