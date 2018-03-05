<template>
  <div class="btn-group">
    <button class="btn btn-default icon icon-plus" type="button" @click="show = !show">
 
    </button>
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
        console.log(data)
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
