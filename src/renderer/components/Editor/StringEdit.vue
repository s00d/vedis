<template>
  <div class="pane-group">
    <div class="pane">
      <textarea autocomplete="off" class="editor form-control" v-model="val"></textarea>
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
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  export default {
    data () {
      return {
        val: ''
      }
    },
    watch: {
      'select.val'(val) {
        this.val = val
      }
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      select: function() {
        return this.selectedTab.select
      },
    },
    methods: {
      ...mapActions({saveKey: 'saveKey'}),
      save() {
        this.saveKey({type: 'string', val: this.val, key: this.select.key})
      }
    },
    mounted () {
      this.val = this.select.val
    }
  }
</script>

<style scoped>

</style>
