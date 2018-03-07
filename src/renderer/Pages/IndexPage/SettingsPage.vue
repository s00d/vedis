<template>
  <div class="pane pane-border starter-template" v-if="load">

    <div class="card" style="width: 100%">
      <div class="card-header">program Config</div>
      <table class="table">
            <thead>
            <tr>
                <th class="edit-key">key</th>
                <th>value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Tree</td>
                <td>
                  <input type="checkbox" class="form-control" v-model="tree">
                </td>
            </tr>
            <tr>
                <td>Sort</td>
                <td>
                  <input type="checkbox" class="form-control" v-model="sort">
                </td>
            </tr>
            <tr>
                <td>Count(0 - all)</td>
                <td>
                   <input type="number" class="form-control"  v-model="max" >
                </td>
            </tr>
            <tr>
                <td>Load from redis(>0)</td>
                <td>
                  <input type="number" class="form-control"  v-model="fetchCount" >
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div class="card" style="width: 100%" v-for="(data, key) in items" :key="key"  v-if="key != 'size' && key != 'client_version'">
      <div class="card-header" v-text="key"></div>
      <table class="table">
            <thead>
            <tr>
                <th class="edit-key">key</th>
                <th>value</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(value, id) in data" :key="id">
                <td><span v-text="id"></span></td>
                <td>
                   <input type="text" class="form-control" v-model="items[key][id]">
                </td>
            </tr>
            </tbody>
        </table>
    </div>

  </div>
</template>

<script> 
  import { mapActions, mapGetters, mapState } from 'vuex'
 
  export default {
    name: 'settings-page',
    data () {
      return {
        items: {}
      }
    },
    methods: {
      ...mapActions({getInfo: 'getInfo', setParams: 'setParams'}),
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      info() {
        return this.selectedTab.info
      },
      load() {
        return Object.keys(this.info).length > 2
      },
      tree() {
        return this.selectedTab.tree
      },
      tree: {
          get() {
              return this.selectedTab.tree
          },
          set(val) {
              return this.setParams({tree: val})
          }
      },
      sort: {
          get() {
              return this.selectedTab.sort
          },
          set(val) {
              return this.setParams({sort: val})
          }
      },
      max: {
          get() {
              return this.selectedTab.max
          },
          set(val) {
              return this.setParams({max: val})
          }
      },
      fetchCount: {
          get() {
              return this.selectedTab.fetchCount
          },
          set(val) {
              return this.setParams({fetchCount: val})
          }
      },
    },
    watch: {
      info(val) {
        this.items = val
      }
    },
    mounted () {
      // this.items = this.info
      this.getInfo();
    }
  }
</script>

<style scoped>
  .starter-template {
    padding: 10px 50px;
    text-align: center;
  }
  .edit-key {
    width: 200px;
  }
</style>
