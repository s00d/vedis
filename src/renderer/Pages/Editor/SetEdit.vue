<template>
  <div class="pane-group">
    <div class="pane pane-sm sidebar">
        <div class="input-group search-input">
          <span class="icon icon-search"></span>
          <input type="search" class="form-control" placeholder="Key name / value" v-model="filter">
          <div class="input-group-append">
            <button class="btn btn-sm btn-outline-secondary add" type="button" @click="show = !show">+</button>
          </div>
        </div>
        <div class="list-padding">
          <table class="pane table-striped" id="list">
            <tbody class="list">
              <tr v-for="(text, key) in getFilterList" :key="key" :class="{active: selectedItem.key === key}" class="line" @click="selectItem(key, text)">
                <td class="list-item">
                  <span 
                    scope="row" 
                    v-text="text">
                  </span>
                  <a class="rm-btn float-right" @click.stop="removeKey({type: 'set', key: select.key, item: text, id: key})">x</a>
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
        filter: '',
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
      },
      filter(val) {
        this.setFilter(val)
      }
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab',
        getFilterList: 'getFilterList'
      }),
      select: function() {
        return this.selectedTab.select
      },
    },
    methods: {
      ...mapActions({saveKey: 'saveKey', createKey: 'createKey', removeKey: 'removeKey', setFilter: 'setFilter'}),
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
</style>
