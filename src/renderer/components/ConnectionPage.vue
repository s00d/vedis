<template>
  <div class="window">
    <div class="window-content">
      <div class="pane-group">
        <div class="pane-sl sidebar">
          <nav class="nav-group">
            <h5 class="nav-group-title">Favorites</h5>
            <a class="nav-group-item" v-for="(fav, id) in favorites.data" :key="id" @click="favoriveSelect(fav, id)" :class="{active: favoriteSelected === id}">
              <span class="icon icon-star-empty"></span>
              <span v-text="fav.name"></span>
              <a class="rm-btn float-right" @click="removeFavorite(fav, id)">x</a>
                 
            </a>
          </nav>
        </div>
        <div class="pane">
          <form>
            
            
            <div class="form-group row">
              <label for="example-text-input" class="col-4 col-form-label">Redis HOST: </label>
              <div class="col-8">
                <input class="form-control" type="text" placeholder="127.0.0.1" v-model="config.host">
              </div>
            </div>

            <div class="form-group row">
              <label for="example-text-input" class="col-4 col-form-label">Redis PORT: </label>
              <div class="col-8">
                <input class="form-control" type="text" placeholder="6379" v-model="config.port">
              </div>
            </div>

            <div class="form-group row">
              <label for="example-text-input" class="col-4 col-form-label">Password: </label>
              <div class="col-8">
                <input class="form-control" type="password" placeholder="password" v-model="config.password">
              </div>
            </div>

            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="config.ssh">
                <span class="span-label">SSL</span>
              </label>
            </div>

            <div v-if="config.ssh">
              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">Private Key</label>
                <div class="col-8">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Select Private Key File (PEM)" v-model="config.tlskey">
                    <span class="input-group-btn">
                      <input type="file" @change="tlskeyClick" ref="tlskey" hidden/>
                      <button class="btn btn-secondary" type="button" @click="$refs.tlskey.click()">...</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">Certificate</label>
                <div class="col-8">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Select Certificate File (PEM)" v-model="config.tlscert">
                    <span class="input-group-btn">
                      <input type="file" @change="tlscertClick" ref="tlscert" hidden/>
                      <button class="btn btn-secondary" type="button" @click="$refs.tlscert.click()">...</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">CA</label>
                <div class="col-8">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Select CA File (PEM)" v-model="config.tlsca">
                    <span class="input-group-btn">
                      <input type="file" @change="tlscaClick" ref="tlsca" hidden/>
                      <button class="btn btn-secondary" type="button" @click="$refs.tlsca.click()">...</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="config.sshTunnel">
                <span class="span-label">SSL thonnel</span>
              </label>
            </div>

            <div v-if="config.sshTunnel">
              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">SSH Host: </label>
                <div class="col-8">
                  <input class="form-control" type="text" v-model="config.sshHost">
                </div>
              </div>

               <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">SSH User: </label>
                <div class="col-8">
                  <input class="form-control" type="text" v-model="config.sshUser">
                </div>
              </div>

              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">SSH Password: </label>
                <div class="col-8">
                  <div class="input-group">
                    <input type="password" class="form-control" v-model="config.sshPassword">
                    <span class="input-group-btn">
                      <input type="file" @change="sshKeyPassphraseClick" ref="sshPassword" hidden/>
                      <button class="btn btn-secondary" type="button" @click="$refs.sshPassword.click()">...</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-group row">
                <label for="example-text-input" class="col-4 col-form-label">SSH Port: </label>
                <div class="col-8">
                  <input class="form-control" type="text" placeholder="22" v-model="config.sshPort">
                </div>
              </div>

            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-form btn-default" @click="addFavorite">Add to favorite</button>
              <button type="submit" class="btn btn-form btn-primary float-right" @click="set">Connect</button>
            </div>
          </form>


        </div>
      </div>
    </div>
  </div>
</template>

<script> 
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { LocalStore } from '../../store.js'
  const store = new LocalStore({
    configName: 'favorites',
    defaults: {}
  });
  // store.clear();
  console.log('store', store);

  export default {
    name: 'index-page',
    data () {
      return {
        ssh: false,
        sshTunnel: false,
        
        favorites: store,
        favoriteSelected: false,
        config: {
          name: 'Tab',
          db: 0,

          host: '127.0.0.1',
          port: 6379,
          password: '',

          ssh: false,
          sshHost: '127.0.0.1',
          sshPort: 22,
          sshUser: 'user',
          sshKey: '',
          sshKeyPassphrase: '',
          sshPassword: '',
          

          sshTunnel: false,
          tlsca: '',
          tlskey: '',
          tlscert: '',
        },
      }
    },
    methods: {
      ...mapActions({setConfig: 'setConfig'}),
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      sshKeyPassphraseClick(e) {
        this.config.sshKeyPassphrase = e.target.files[0];
      },
      tlscaClick() {
        this.config.tlscaClick = e.target.files[0];
      },
      tlskeyClick() {
        this.config.tlscaClick = e.target.files[0];
      },
      tlscertClick() {
        this.config.tlscaClick = e.target.files[0];
      },
      set() {
        this.setConfig(this.config)
      },
      addFavorite() {
        this.config.name = 'Tab: ' + this.config.host;
        this.favorites.set(Object.keys(this.favorites.data).length + 1, JSON.parse(JSON.stringify(this.config)));
        this.favorites.save()
      },
      removeFavorite(fav, id) {
        this.favorites.del(id);
        this.favorites.save()
      },
      favoriveSelect (fav, id) {
        this.$set(this, 'config', fav);
        this.favoriteSelected = id;
      }
    },
    computed: {
      redis_status() { return this.$store.state.List.status },
    },
    mounted () {
      console.log();
    }
  }
</script>

<style scoped>
  .toolbar-footer {
    padding: 3px;
  }

  .pane {
    padding: 30px 200px; 
  }
  
  form {
    padding: 10px; 
    border: 1px solid gray;
  }

  .span-label {
    padding-left: 15px;
  }

  .pane-sl {
    max-width: 250px;
    min-width: 220px
}
</style>
