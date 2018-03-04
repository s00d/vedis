<template>
  <div class="pane-group">
    <div class="pane pane-sm sidebar">
        <div class="input-group mb-12">
          <input type="text" class="form-control" placeholder="Search" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary add" type="button" @click="show = !show">+</button>
          </div>
        </div>
        <div>
          <table class="pane table-striped" id="list">
            <tbody class="list">
              <tr v-for="(text, key) in val" :key="key" :class="{active: selectedItem.key === key}" class="line" @click="selectItem(key, text)">
                <td class="list-item">
                  <span 
                    scope="row" 
                    v-text="text">
                  </span>
                  <a class="rm-btn float-right">x</a>
                </td>
              </tr>
            </tbody>
          </table>       
        </div>

      </div>

        <div class="pane" style="width: 551px;">
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
          <button class="btn btn-default btn-sm float-right" @click="save">Save Changes</button>
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
        old: '',
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
        this.old = this.selectedItem.text;
      }
    },
    computed: {
        ...mapState({
            select: state => state.List.select
        }),
    },
    methods: {
      ...mapActions({saveKey: 'saveKey', createKey: 'createKey', removeKey: 'removeKey'}),
      save() {
        this.val[this.selectedItem.key] = this.selectedItem.text;
        this.removeKey({type: 'set', old: this.old, key: this.select.key});
        this.saveKey({type: 'set', val: this.selectedItem.text, key: this.select.key})
      },
      selectItem(key, text) {
        this.old = text;
        this.selectedItem.key = key;
        this.selectedItem.text = text;
      },
      create(data) {
        console.log(data)
        this.saveKey({type: 'set', val: data['Name:'], key: this.select.key})
        this.val[data['Name:']] = data['Name:'];
        this.show = false;
      },
    },
    mounted () {
      if(this.select.val == null) return;
      this.val = this.select.val
      this.selectedItem = {
        key: Object.keys(this.val)[0],
        text: this.val[Object.keys(this.val)[0]]
      }
      this.old = this.selectedItem.text;
    }
  }
</script>

<style scoped>
  .editor {
    width: 100%;
    height: 200px;
  }

 .active, .selected {
    color: #fff !important;
    background-color: #116cd6 !important;
  }

</style>
