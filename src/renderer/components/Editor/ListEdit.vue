<template>
  <div class="row">
    <div class="col-md-3" id="sidebar" style="padding: 3px">
      <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-brand">
                    <div class="input-group mb-12">
                      <input type="text" class="form-control" placeholder="Search" />
                      <div class="input-group-append">
                        <button class="btn btn-outline-secondary add" type="button" @click="show = !show">+</button>
                      </div>
                    </div>
                </li>
                <li v-for="(text, key) in val" :key="key" :class="{active: selectedItem.key === key}" class="line" @click="selectItem(key, text)">
                  <span 
                    scope="row" 
                    v-text="key">
                  </span>:
                  <span 
                    scope="row" 
                    v-text="text">
                  </span>
                  <a class="rm-btn float-right">x</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="col-md-9" style="padding: 3px">
      <textarea autocomplete="off" class="editor form-control" v-model="selectedItem.text"></textarea>
      <div class="operation-pannel">
        <label class="wrap-selector">
          Wrapping
        </label>
        <select class="mode-selector">
          <option value="raw">Raw</option>
          <option value="json" disabled="">JSON</option>
          <option value="messagepack" disabled="">MessagePack</option>
        </select>
        <button class="btn btn-default pull-right" @click="save">Save Changes</button>
      </div>
    </div>

    <modal v-if="show" 
          @close="show = false" 
          @save="change" 
          :inputs="{
            'Name:': {type: 'string', minLength: 1}
          }"
          title="Create new"
          button="add"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import modal from '../modal.vue'
  export default {
    components: { modal },
    data () {
      return {
        val: {},
        selectedItem: {
          key: '', 
          text: ''
        },
        show: false
      }
    },
    watch: {
      'select.val'(val) {
        if(val == null) return;
        this.val = val
        this.selectedItem = {
          key: Object.keys(this.val)[0],
          text: this.val[Object.keys(this.val)[0]]
        }
      }
    },
    computed: {
        ...mapState({
            select: state => state.List.select
        }),
    },
    methods: {
      ...mapActions({saveKey: 'saveKey', createKey: 'createKey'}),
      save() {
        this.val[this.selectedItem.key] = this.selectedItem.text;
        this.saveKey({type: 'list', index: this.selectedItem.key, val: this.selectedItem.text, key: this.select.key})
      },
      selectItem(key, text) {
        this.selectedItem.key = key;
        this.selectedItem.text = text;
      },
      change(data) {
        console.log(data)
        this.saveKey({type: 'list', key: this.select.key, val: data['Name:']})
        let keys = Object.keys(this.val);
        this.val[parseInt(keys[keys.length - 1]) + 1] = data['Name:'];
        this.show = false;
      },
    },
    mounted () {
      if(this.select.val == null) return;
      this.val = this.select.val
      console.log(this.val)
      console.log(Object.keys(this.val)[0])
      console.log(this.val[Object.keys(this.val)[0]])
      this.selectedItem = {
          key: Object.keys(this.val)[0],
          text: this.val[Object.keys(this.val)[0]]
        }
    }
  }
</script>

<style scoped>
  .editor {
    width: 100%;
    height: 200px;
  }

  .line {
    cursor: pointer;
    padding: 6px;
    border: 1px solid #d2d2d2;
  }
  .active {
    background: rgb(175, 175, 175);
  }

  .list {
    height: 20px;
    overflow-y: auto;
  }

  #sidebar {
    height: 80vh;
    transition: all 0.3s;
    overflow-y: auto;
  }

  .rm-btn {
    cursor: pointer;
    color: red !important;
    /* width: 20px; */
  }
  .sidebar-nav {
    position: absolute;
    top: 0;
    width: 98%;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .sidebar-nav li {
    /* text-indent: 20px; */
    line-height: 14px;
  }

</style>
