// import { createAction } from 'Utils';
import { Client } from 'ssh2';
import net from 'net';
import Redis from 'ioredis';
import _ from 'lodash';
import Vue from 'vue';
import json from '../../../../package.json';

const state = {
  
}

const getters = {
  
}

const mutations = {
  
}

const actions = {
  getInfo({ dispatch, commit, state, getters }, type) {
    Vue.set(getters.selectedTab, 'info', {size: 0});
    
    getters.selectedTab.instance.info().then(exists => {
      exists = exists.split('\n');
      let deps = {}
      let name = '';
      for (let str of exists) {
        str = str.replace( /\r/g, "").replace( / /g, "_").toLowerCase();
        if(str.match(/^#/g)) {
          name = str.replace( /#_/g, "");
          deps[name] = {};
        } else {
          let vals = str.split(':');
          if(vals.length > 1) deps[name][vals[0]] = vals[1];
        }
      }
      Vue.set(getters.selectedTab, 'info', deps);
      Vue.set(getters.selectedTab.info, 'client_version', json.version);
    });
    return getters.selectedTab.instance.dbsize().then(size => {
      Vue.set(getters.selectedTab.info, 'size', size);
    });
  },
  selectItem({ dispatch, commit, state, getters }, item) {
    getters.selectedTab.instance.type(item.path).then(function(type) {
      type = type.toUpperCase();
      Vue.set(getters.selectedTab, 'select', {}); 
      if (type === 'STRING') getters.selectedTab.instance.get(item.path).then(str => {
        Vue.set(getters.selectedTab.select, 'key', item.path); 
        Vue.set(getters.selectedTab.select, 'val', str); 
        Vue.set(getters.selectedTab.select, 'size', str.length); 
      });
      
      if (type === 'HASH') getters.selectedTab.instance.hgetall(item.path).then(values => {
        let vals = {};
        for(let key in values) {
          vals[key] = values[key];
        }
        Vue.set(getters.selectedTab.select, 'key', item.path); 
        Vue.set(getters.selectedTab.select, 'val', vals); 
        Vue.set(getters.selectedTab.select, 'size', Object.keys(vals).length); 
      });

      if (type === 'LIST') getters.selectedTab.instance.llen(item.path).then(count => {
        getters.selectedTab.instance.lrange(item.path, 0, count).then(values => {
          let vals = {};
          for(let key in values) {
            vals[key] = values[key];
          }
          Vue.set(getters.selectedTab.select, 'key', item.path); 
          Vue.set(getters.selectedTab.select, 'val', vals); 
          Vue.set(getters.selectedTab.select, 'size', Object.keys(vals).length); 
        });
      });

      if (type === 'SET') getters.selectedTab.instance.smembers(item.path).then(values => {
        let vals = {};
        for(let key in values) {
          vals[key] = values[key];
        }
        Vue.set(getters.selectedTab.select, 'key', item.path); 
        Vue.set(getters.selectedTab.select, 'val', vals); 
        Vue.set(getters.selectedTab.select, 'size', Object.keys(vals).length);
      });

      if (type === 'ZSET') getters.selectedTab.instance.zrange(item.path, 0, -1).then(values => {
        let vals = {};
        for(let key in values) {
          getters.selectedTab.instance.zscore(item.path, values[key]).then(score => {
            vals[Object.keys(vals).length] = {score: score, val: values[key]}
            Vue.set(getters.selectedTab.select, 'val', vals); 
          });
          
        }
        Vue.set(getters.selectedTab.select, 'key', item.path); 
        Vue.set(getters.selectedTab.select, 'size', Object.keys(vals).length);
      });

      Vue.set(getters.selectedTab.select, 'type', type); 
    })
  },
  createKey({ dispatch, commit, state, getters }, data = {key, type}) {
    return getters.selectedTab.instance.exists(data.key).then(exists => {
      if (exists) {
        alert('The key already exists')
        throw new Error('The key already exists')
      }

      dispatch('saveKey', data)
      dispatch('reloadListScan', 0)
      return data
    })
  },
  saveKey({ dispatch, commit, state, getters }, data = {key, type, val}) {
    switch (data.type.toUpperCase()) {
      case 'STRING':
        return getters.selectedTab.instance.set(data.key, 'val' in data ? data.val : '')
      case 'LIST':
        if ('index' in data) {
          return getters.selectedTab.instance.lset(data.key, data.index, data.val)
        } else {
          return getters.selectedTab.instance.rpush(data.key, 'val' in data ? data.val : 'New Item')
        }
      case 'HASH':
        return getters.selectedTab.instance.hset(data.key, 'item' in data ? data.item : 'New Key', 'val' in data ? data.val :'New Value')
      case 'SET':
        return getters.selectedTab.instance.sadd(data.key, 'val' in data ? data.val : 'New Member')
      case 'ZSET':
        return getters.selectedTab.instance.zadd(data.key, 'score' in data ? data.score : 0, 'val' in data ? data.val : 'New Member')
    }
  },
  removeKey({ dispatch, commit, state, getters }, data = {key, type, val}) {
    getters.selectedTab.instance.type(item.path).then(function(type) {
      switch (type.toUpperCase()) {
        case 'STRING': {
          Vue.delete(getters.selectedTab.list, data.key);
          return getters.selectedTab.instance.del(data.key)
        }
        case 'TREE':
          return getters.selectedTab.instance.keys(data.key+':*').then(exists => {
            for (let key of exists) getters.selectedTab.instance.del(key);
          });
          return getters.selectedTab.instance.del(data.key)
        case 'LIST': {
          Vue.delete(getters.selectedTab.select.val, data.id);
          return getters.selectedTab.instance.lrem(data.key, 1, data.item)
        }
        case 'HASH': {
          Vue.delete(getters.selectedTab.select.val, data.item);
          return getters.selectedTab.instance.hdel(data.key, data.item)
        }
        case 'SET': {
          Vue.delete(getters.selectedTab.select.val, data.id);
          return getters.selectedTab.instance.srem(data.key, data.item)
        }
        case 'ZSET': {
          Vue.delete(getters.selectedTab.select.val, data.id);
          return getters.selectedTab.instance.zrem(data.key, data.item)
        }
        default: {
          Vue.delete(getters.selectedTab.list, data.key);
          return getters.selectedTab.instance.del(data.key)
        }
      }
    });
  },
  renameList({ dispatch, commit, state, getters }, item) {
    getters.selectedTab.instance.rename(item.oldPath, item.path).then(function(type) {
      // item.edit = false;
      // item.path = item.oldPath;
      // item.path_sbr = item.oldPath.slice(0,20);
      dispatch('reloadList');
    });
  },
  connectToRedis({ commit, state, getters }) {
    let sshErrorThrown = false
    let redisErrorThrown = false
    let redisErrorMessage
  
    if (getters.selectedTab.config.sshTunnel) {
      sshRedis(getters.selectedTab.config);
    } else {
      handleRedis(getters.selectedTab.config, {});
    }

    function sshRedis(config) {
      commit('SET_STATUS', 'SSH connecting...');
  
      const conn = new Client();
      conn.on('ready', () => {
        const server = net.createServer(function (sock) {
          console.log(sock);
          conn.forwardOut(sock.remoteAddress, sock.remotePort, config.host, config.port, (err, stream) => {
            if (err) {
              sock.end()
            } else {
              sock.pipe(stream).pipe(sock)
            }
          })
        }).listen(0, function () {
          handleRedis(config, { host: '127.0.0.1', port: server.address().port })
        })
      }).on('error', err => {
        sshErrorThrown = true;
          commit('SET_STATUS', 'Disconnect');
        alert(`SSH Error: ${err.message}`);
      })
  
      try {
        const connectionConfig = {
          host: config.sshHost,
          port: config.sshPort || 22,
          username: config.sshUser
        }
        console.log(connectionConfig);
        if (getters.selectedTab.sshKey) {
          console.log(1);
          conn.connect(Object.assign(connectionConfig, {
            privateKey: config.sshKey,
            passphrase: config.sshKeyPassphrase
          }))
        } else {
          console.log(config.sshPassword);
          conn.connect(Object.assign(connectionConfig, {
            password: config.sshPassword
          }))
        }
      } catch (err) {
        commit('SET_STATUS', 'Disconnect');
        alert(`SSH Error: ${err.message}`);
      }
    }
  
    function handleRedis(config, override) {
      commit('SET_STATUS', 'Redis connecting...');
      if (getters.selectedTab.config.ssl) {
        let tls = {};
        if (config.tlsca) tls.ca = config.tlsca;
        if (config.tlskey) tls.key = config.tlskey;
        if (config.tlscert) tls.cert = config.tlscert;
        Vue.set(config, 'tls', tls);
      }

      const redis = new Redis(_.assign({}, config, override, {
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
            getters.selectedTab.connect = false
            return;
          }
          const version = redis.serverInfo.redis_version;
          if (version && version.length >= 5) {
            const versionNumber = Number(version[0] + version[2]);
            if (versionNumber < 28) {
              alert('Vedis only supports Redis >= 2.8 because servers older than 2.8 don\'t support SCAN command, which means it not possible to access keys without blocking Redis.');
              commit('SET_STATUS', 'Disconnect');
              getters.selectedTab.connect = false
              return;
            }
          }
          commit('SET_STATUS', 'Connected');
          commit('SET_INSTANCE', redis)
          config.name += " - " + config.host + ":" + config.port
          getters.selectedTab.connect = true;
        })

        
      });
      
      redis.once('error', function (error) {
        commit('SET_STATUS', 'Error');
        redisErrorMessage = error;
        commit('SET_STATUS', 'Disconnect');
        getters.selectedTab.connect = false
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
          getters.selectedTab.connect = false
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
