// import { createAction } from 'Utils';
import { Client } from 'ssh2';
import net from 'net';
import Redis from 'ioredis';
import _ from 'lodash';
import Vue from 'vue';

const state = {
  tabs: [
    {
      list: {},
      select: false,
      status: 'not connected',
      connect: false,
      config: {
        name: 'tab 0',
      },
      instance: null,
      pattern: '*' ,
      fetchCount: 100,
      cursor: 0,
      count: 16,
      sort: false
    }
  ],
  tab: 0,
}

const getters = {
  selectedTab: state => {
    return state.tabs[state.tab]
  }
}

const mutations = {
  SELECT_DB (state, db) {
    state.tabs[state.tab].config.db = db
    state.tabs[state.tab].instance.select(db);
  },
  SET_CONFIG(state, params) {
    Vue.set(state.tabs[state.tab], 'config', Object.assign(state.tabs[state.tab].config, params))
  },
  SET_STATUS(state, status) {
    state.tabs[state.tab].status = status
  },
  SET_INSTANCE(state, inst) {
    state.tabs[state.tab].instance = inst
  },
  ADD_NEW_TAB(state) {
    state.tabs.push({
      list: {},
      select: false,
      status: 'not connected',
      connect: false,
      config: {
        name: 'tab ' + Object.keys(state.tabs).length,
      },
      instance: null,
      pattern: '*' ,
      fetchCount: 100,
      cursor: 0,
      count: 16,
      sort: false
    })
    state.tab = Object.keys(state.tabs).length - 1
},
}

const actions = {
  addNewTab({ dispatch, commit, state }) {
    commit('ADD_NEW_TAB');  
  },
  selectTab({ dispatch, commit, state }, tab) {
    state.tab = tab
  },
  setConfig({ dispatch, commit, state }, config) {
    commit('SET_CONFIG', config);  
    dispatch('connectToRedis');
    // dispatch('reloadList');
  },
  selectDB({ dispatch, commit, state }, db) {
    commit('SELECT_DB', db);  
    dispatch('reloadList');
  },
  selectItem({ dispatch, commit, state }, item) {
    Vue.set(state.tabs[state.tab], 'select', {}); 
    if (item.type === 'STR') state.tabs[state.tab].instance.get(item.path).then(str => {
      Vue.set(state.tabs[state.tab].select, 'key', item.path); 
      Vue.set(state.tabs[state.tab].select, 'val', str); 
      Vue.set(state.tabs[state.tab].select, 'size', str.length); 
    });

    
    if (item.type === 'HASH') state.tabs[state.tab].instance.hgetall(item.path).then(values => {
      let vals = {};
      for(let key in values) {
        vals[key] = values[key];
      }
      Vue.set(state.tabs[state.tab].select, 'key', item.path); 
      Vue.set(state.tabs[state.tab].select, 'val', vals); 
      Vue.set(state.tabs[state.tab].select, 'size', Object.keys(vals).length); 
    });

    if (item.type === 'LIST') state.tabs[state.tab].instance.llen(item.path).then(count => {
      state.tabs[state.tab].instance.lrange(item.path, 0, count).then(values => {
        let vals = {};
        for(let key in values) {
          vals[key] = values[key];
        }
        Vue.set(state.tabs[state.tab].select, 'key', item.path); 
        Vue.set(state.tabs[state.tab].select, 'val', vals); 
        Vue.set(state.tabs[state.tab].select, 'size', Object.keys(vals).length); 
      });
    });

    if (item.type === 'SET') state.tabs[state.tab].instance.smembers(item.path).then(values => {
      let vals = {};
      for(let key in values) {
        vals[key] = values[key];
      }
      Vue.set(state.tabs[state.tab].select, 'key', item.path); 
      Vue.set(state.tabs[state.tab].select, 'val', vals); 
      Vue.set(state.tabs[state.tab].select, 'size', Object.keys(vals).length);
    });

    if (item.type === 'ZSET') state.tabs[state.tab].instance.zrange(item.path, 0, -1).then(values => {
      let vals = {};
      for(let key in values) {
        state.tabs[state.tab].instance.zscore(item.path, values[key]).then(score => {
          vals[Object.keys(vals).length] = {score: score, val: values[key]}
          Vue.set(state.tabs[state.tab].select, 'val', vals); 
        });
        
      }
      Vue.set(state.tabs[state.tab].select, 'key', item.path); 
      Vue.set(state.tabs[state.tab].select, 'size', Object.keys(vals).length);
    });

    Vue.set(state.tabs[state.tab].select, 'type', item.type); 
    
  },
  createKey({ dispatch, commit, state }, data = {key, type}) {
    return state.tabs[state.tab].instance.exists(data.key).then(exists => {
      if (exists) {
        alert('The key already exists')
        throw new Error('The key already exists')
      }

      dispatch('saveKey', data)
      dispatch('reloadListScan', 0)
      return data
    })
  },
  saveKey({ dispatch, commit, state }, data = {key, type, val}) {
    switch (data.type) {
      case 'string':
        return state.tabs[state.tab].instance.set(data.key, 'val' in data ? data.val : '')
      case 'list':
        if ('index' in data) {
          return state.tabs[state.tab].instance.lset(data.key, data.index, data.val)
        } else {
          return state.tabs[state.tab].instance.rpush(data.key, 'val' in data ? data.val : 'New Item')
        }
      case 'hash':
        return state.tabs[state.tab].instance.hset(data.key, 'item' in data ? data.item : 'New Key', 'val' in data ? data.val :'New Value')
      case 'set':
        return state.tabs[state.tab].instance.sadd(data.key, 'val' in data ? data.val : 'New Member')
      case 'zset':
        return state.tabs[state.tab].instance.zadd(data.key, 'score' in data ? data.score : 0, 'val' in data ? data.val : 'New Member')
    }
  },
  removeKey({ dispatch, commit, state }, data = {key, type, val}) {
    switch (data.type) {
      case 'string': {
        Vue.delete(state.tabs[state.tab].list, data.key);
        return state.tabs[state.tab].instance.del(data.key)
      }
      case 'tree':
        return state.tabs[state.tab].instance.keys(data.key+':*').then(exists => {
          for (let key of exists) state.tabs[state.tab].instance.del(key);
        });
        return state.tabs[state.tab].instance.del(data.key)
      case 'list': {
        Vue.delete(state.tabs[state.tab].select.val, data.id);
        return state.tabs[state.tab].instance.lrem(data.key, 1, data.item)
      }
      case 'hash': {
        Vue.delete(state.tabs[state.tab].select.val, data.item);
        return state.tabs[state.tab].instance.hdel(data.key, data.item)
      }
      case 'set': {
        Vue.delete(state.tabs[state.tab].select.val, data.id);
        return state.tabs[state.tab].instance.srem(data.key, data.item)
      }
      case 'zset': {
        Vue.delete(state.tabs[state.tab].select.val, data.id);
        return state.tabs[state.tab].instance.zrem(data.key, data.item)
      }
      default: {
        Vue.delete(state.tabs[state.tab].list, data.key);
        return state.tabs[state.tab].instance.del(data.key)
      }
    }
  },
  reloadList ({ dispatch, commit, state }, data = {pattern: '*', cursor: 0}) {
    if (data.pattern.indexOf('*') === -1 && data.pattern.indexOf('?') === -1) {
      data.pattern += '*'
    }
    state.tabs[state.tab].list = {};
    state.tabs[state.tab].pattern = data.pattern;
    dispatch('reloadListScan', data.cursor)
  },
  reloadListScan({ dispatch, commit, state }, cursor = 0) {
    return new Promise((resolve, reject) => {
      state.tabs[state.tab].instance.scan(cursor, 'MATCH', state.tabs[state.tab].pattern, 'COUNT', state.tabs[state.tab].fetchCount)
        .then(function(res) {
          const cursor = res[0]
          for(let key of res[1]) {
            Vue.set(state.tabs[state.tab].list, key, {path_sbr: key, path: key, show: true, type: 'none', select: false})
            state.tabs[state.tab].list[key].path_sbr = state.tabs[state.tab].list[key].path.slice(0,20) + (state.tabs[state.tab].list[key].path.length > 20 ? '...' : '')
            state.tabs[state.tab].instance.type(key).then(function(type) {
              if (type !== 'none') {
                if(type === 'string') type = 'str';
                state.tabs[state.tab].list[key].type = type.toUpperCase();
              }
            })
          }

          if (state.tabs[state.tab].sort) Object.keys(state.tabs[state.tab].list).sort().forEach(function(key) {
            var value = state.tabs[state.tab].list[key];
            Vue.delete(state.tabs[state.tab].list, key)
            Vue.set(state.tabs[state.tab].list, key, value)
          });

          if (Number(cursor) === 0) {
            Vue.set(state.tabs[state.tab], 'cursor', 0)
          } else if (Object.keys(state.tabs[state.tab].list).length >= 100) {
            Vue.set(state.tabs[state.tab], 'cursor', parseInt(cursor))
          } else {
            dispatch('reloadListScan', res[0])
          }
          
          resolve()
        })
    })
  },
  connectToRedis({ commit, state }) {
    let sshErrorThrown = false
    let redisErrorThrown = false
    let redisErrorMessage
  
    if (state.tabs[state.tab].config.ssh) {
      sshRedis(commit);
    } else {
      handleRedis({}, commit);
    }

    // function sshRedis(commit) {
    //   commit('SET_STATUS', 'SSH connecting...');
  
    //   const conn = new Client();
    //   conn.on('ready', () => {
    //     const server = net.createServer(function (sock) {
    //       conn.forwardOut(sock.remoteAddress, sock.remotePort, state.tabs[state.tab].config.host, state.tabs[state.tab].config.port, (err, stream) => {
    //         if (err) {
    //           sock.end()
    //         } else {
    //           sock.pipe(stream).pipe(sock)
    //         }
    //       })
    //     }).listen(0, function () {
    //       handleRedis(state.tabs[state.tab].config, { host: '127.0.0.1', port: server.address().port })
    //     })
    //   }).on('error', err => {
    //     sshErrorThrown = true;
          // commit('SET_STATUS', 'Disconnect');
    //     alert(`SSH Error: ${err.message}`);
    //   })
  
    //   try {
    //     const connectionConfig = {
    //       host: state.tabs[state.tab].config.sshHost,
    //       port: state.tabs[state.tab].config.sshPort || 22,
    //       username: state.tabs[state.tab].config.sshUser
    //     }
    //     if (state.tabs[state.tab].sshKey) {
    //       conn.connect(Object.assign(connectionConfig, {
    //         privateKey: state.tabs[state.tab].config.sshKey,
    //         passphrase: state.tabs[state.tab].config.sshKeyPassphrase
    //       }))
    //     } else {
    //       conn.connect(Object.assign(connectionConfig, {
    //         password: state.tabs[state.tab].sshPassword
    //       }))
    //     }
    //   } catch (err) {
    //     commit('SET_STATUS', 'Disconnect');
    //     alert(`SSH Error: ${err.message}`);
    //   }
    // }
  
    function handleRedis(override, commit) {
      commit('SET_STATUS', 'Redis connecting...');
      if (state.tabs[state.tab].config.ssl) {
        let tls = {};
        if (state.tabs[state.tab].config.tlsca) tls.ca = state.tabs[state.tab].config.tlsca;
        if (state.tabs[state.tab].config.tlskey) tls.key = state.tabs[state.tab].config.tlskey;
        if (state.tabs[state.tab].config.tlscert) tls.cert = state.tabs[state.tab].config.tlscert;
        Vue.set(state.tabs[state.tab].config, 'tls', tls);
      }
      const redis = new Redis(_.assign({}, state.tabs[state.tab].config, override, {
        retryStrategy() {
          return false;
        }
      }));
      redis.defineCommand('setKeepTTL', {
        numberOfKeys: 1,
        lua: 'local ttl = redis.call("pttl", KEYS[1]) if ttl > 0 then return redis.call("SET", KEYS[1], ARGV[1], "PX", ttl) else return redis.call("SET", KEYS[1], ARGV[1]) end'
      });
      redis.defineCommand('lremindex', {
        numberOfKeys: 1,
        lua: 'local FLAG = "$$#__@DELETE@_REDIS_@PRO@__#$$" redis.call("lset", KEYS[1], ARGV[1], FLAG) redis.call("lrem", KEYS[1], 1, FLAG)'
      });
      redis.defineCommand('duplicateKey', {
        numberOfKeys: 2,
        lua: 'local dump = redis.call("dump", KEYS[1]) local pttl = 0 if ARGV[1] == "TTL" then pttl = redis.call("pttl", KEYS[1]) end return redis.call("restore", KEYS[2], pttl, dump)'
      });

      redis.once('connect', function () {
        redis.ping((err, res) => {
          if (err) {
            if (err.message === 'Ready check failed: NOAUTH Authentication required.') {
              err.message = 'Redis Error: Access denied. Please double-check your password.';
            }
            if (err.message !== 'Connection is closed.') {
              alert(err.message);
              redis.disconnect();
            }
            commit('SET_STATUS', 'Disconnect');
            state.tabs[state.tab].connect = false
            return;
          }
          const version = redis.serverInfo.redis_version;
          if (version && version.length >= 5) {
            const versionNumber = Number(version[0] + version[2]);
            if (versionNumber < 28) {
              alert('Vedis only supports Redis >= 2.8 because servers older than 2.8 don\'t support SCAN command, which means it not possible to access keys without blocking Redis.');
              commit('SET_STATUS', 'Disconnect');
              state.tabs[state.tab].connect = false
              return;
            }
          }
          commit('SET_STATUS', 'Connected');
          commit('SET_INSTANCE', redis)
          state.tabs[state.tab].connect = true;
        })

        
      });
      
      redis.once('error', function (error) {
        commit('SET_STATUS', 'Error');
        redisErrorMessage = error;
        commit('SET_STATUS', 'Disconnect');
        state.tabs[state.tab].connect = false
        alert(error);
      });
      redis.once('end', function () {
        commit('SET_STATUS', 'Disconnect');
        if (!sshErrorThrown) {
          let msg = 'Redis Error: Connection failed. ';
          if (redisErrorMessage) {
            msg += `(${redisErrorMessage})`;
          }
          commit('SET_STATUS', 'Disconnect');
          state.tabs[state.tab].connect = false
          alert(msg);
        }
      });

      
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
