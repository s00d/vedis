<template>
  <div class="pane">
    <string-edit v-if="select.type === 'STRING'" />
    <hash-edit v-else-if="select.type === 'HASH'" />

    <list-edit v-else-if="select.type === 'LIST'" />
    <set-edit v-else-if="select.type === 'SET'" />
    <z-set-edit v-else-if="select.type === 'ZSET'" />
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import StringEdit from './StringEdit'
  import HashEdit from './HashEdit'
  import ListEdit from './ListEdit'
  import SetEdit from './SetEdit'
  import ZSetEdit from './ZSetEdit'

  export default {
    components: { StringEdit, HashEdit, ListEdit, SetEdit, ZSetEdit },
    data () {
      return {
       
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
  }
</script>

<style scoped>
  .row{
    padding-left: 20px;
    padding-right: 20px;
  }

</style>