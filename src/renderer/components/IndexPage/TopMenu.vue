<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">VEDIS</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">DB: <span v-text="db"></span></a>
            <div class="dropdown-menu" aria-labelledby="dropdown01">
              <a class="dropdown-item" href="#" v-for="db in count" :key="db-1" v-text="db-1" @click="selectDB(db-1)"></a>
            </div>
          </li>
        </ul>
      </div>

      <a class="navbar-brand" href="#">Status: <span v-text="redis_status"></span></a>
    </nav>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import addButton from './addButton'
  export default {
    components: { addButton },
    data () {
      return {
        
      }
    },
    methods: {
      ...mapActions({selectDB: 'selectDB'}),
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      count: function() {
        return this.selectedTab.count
      },
      db: function() {
        return this.selectedTab.config.db
      },
      redis_status: function() {
        return this.selectedTab.redis_status
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  
</style>
