<template>
  <div class="btn-group">
    <div class="top-item" @click="show = !show">
      <span class="icon icon-plus"></span>Add
    </div>
    <modal v-if="show" 
          @close="show = false" 
          @save="change" 
          :inputs="{
            'Type:': {type: 'enum', enum: ['string', 'hash', 'list', 'set', 'zset']}, 
            'Key Name:': {type: 'string', minLength: 1}
          }"
          title="Create new"
          button="add"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import modal from '../modal.vue'
const { remote } = require('electron')


  export default {
    data () {
      return {
        show: false
      }
    },
    components: { modal },
    computed: {
        
    },
    watch: {
     
    },
    methods: {
      ...mapActions({createKey: 'createKey'}),
      change(data) {
        this.createKey({key: data['Key Name:'], type: data['Type:']})
        this.show = false;
      },
    },
    mounted () {
     
    }
  }
</script>
<style scoped>
  .add {
    background: #fff;
  }

  .btn-group {
    padding-right: 2px;
    padding-left: 2px;  
  }
</style>
