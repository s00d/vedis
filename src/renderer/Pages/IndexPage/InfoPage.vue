<template>
  <div class="pane pane-border starter-template" v-if="load">
        
    <h1>VEDIS v<span v-text="info.client_version"></span></h1>
    <h4 style="color: #aeaeae">Vedis is a simple app in Electron and Vue to manage Redis databases.</h4>
    <hr>

    <b>local server</b>

    <div class="info-list">
      <p class="lead"><b>Redis version</b>: <span v-text="info.server.redis_version"></span></p>
      <p><b>Keys</b>: <span v-text="info.size"></span></p>
      <p><b>Memory used</b>: <span v-text="bytesToSize(info.memory.used_memory)"></span></p>
      <p><b>Uptime</b>: <span v-text="secondsToTime(info.server.uptime_in_seconds)"></span></p>
      <p><b>Last save</b>: <span v-text="timeConverter(info.persistence.rdb_last_save_time)"></span></p>
      <p><b>User cpu</b>: <span v-text="info.cpu.used_cpu_user"></span></p>
      <p><b>System cpu</b>: <span v-text="info.cpu.used_cpu_sys"></span></p>
      <p><b>Clients</b>: <span v-text="info.clients.connected_clients"></span></p>
    </div>


    <p><a href="https://github.com/s00d/vedis" target="_blank">Redis-web on GitHub</a></p>
    <p><a href="http://redis.io/documentation" target="_blank">Redis Documentation</a></p>

    <button class="btn btn-info" @click="show_info = !show_info">Show Info</button>
    <div class="info" v-show="show_info">
        <table class="table">
            <thead>
            <tr>
                <th>key</th>
                <th>value</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(data, key) in info" :key="key">
                <td><span v-text="key"></span></td>
                <td>
                    <div class="col-xs-12 col-md-4" v-for="(value, id) in data" :key="id">
                    <span class="label label-primary">
                        <span v-text="id"></span>: <span v-text="value"></span>
                    </span>
                    </div>

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
    name: 'info-page',
    data () {
      return {
        show_info: false,
        command: '',
        commandHistory: ''
      }
    },
    methods: {
      ...mapActions({getInfo: 'getInfo'}),
      timeConverter(UNIX_timestamp) {
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return a.getDate() + ' ' + months[a.getMonth()] + ' ' + a.getFullYear() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
      },
      bytesToSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
          let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) return `${bytes} ${sizes[i]})`;
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    },
    secondsToTime(secs) {
        if(!secs) return 0;
        return (new Date(secs * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    },
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
      }
    },
    mounted () {
      this.getInfo();
    }
  }
</script>

<style scoped>
  .starter-template {
    padding: 10px 15px;
    text-align: center;
  }
  p {
      margin-top: 0;
      margin-bottom: 1px;
  }
  .info-list {
    
  }
</style>
