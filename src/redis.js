let redis = null;

let sshErrorThrown = false
let redisErrorThrown = false
let redisErrorMessage

if (state.config.ssh) {
  sshRedis();
} else {
  handleRedis({});
}

// function sshRedis(commit) {
//   commit('SET_STATUS', 'SSH connecting...');

//   const conn = new Client();
//   conn.on('ready', () => {
//     const server = net.createServer(function (sock) {
//       conn.forwardOut(sock.remoteAddress, sock.remotePort, state.config.host, state.config.port, (err, stream) => {
//         if (err) {
//           sock.end()
//         } else {
//           sock.pipe(stream).pipe(sock)
//         }
//       })
//     }).listen(0, function () {
//       handleRedis(state.config, { host: '127.0.0.1', port: server.address().port })
//     })
//   }).on('error', err => {
//     sshErrorThrown = true;
//     commit('SET_SETTINGS', {status: 'Disconnect'});
//     alert(`SSH Error: ${err.message}`);
//   })

//   try {
//     const connectionConfig = {
//       host: state.config.sshHost,
//       port: state.config.sshPort || 22,
//       username: state.config.sshUser
//     }
//     if (state.sshKey) {
//       conn.connect(Object.assign(connectionConfig, {
//         privateKey: state.config.sshKey,
//         passphrase: state.config.sshKeyPassphrase
//       }))
//     } else {
//       conn.connect(Object.assign(connectionConfig, {
//         password: state.sshPassword
//       }))
//     }
//   } catch (err) {
//     commit('SET_STATUS', 'Disconnect');
//     alert(`SSH Error: ${err.message}`);
//   }
// }

function handleRedis(override, commit) {
  commit('SET_STATUS', 'Redis connecting...');
  if (state.config.ssl) {
    let tls = {};
    if (state.config.tlsca) tls.ca = state.config.tlsca;
    if (state.config.tlskey) tls.key = state.config.tlskey;
    if (state.config.tlscert) tls.cert = state.config.tlscert;
    commit('SET_SETTINGS', {tls: tls});
  }
  const redis = new Redis(_.assign({}, state.config, override, {
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
        return;
      }
      const version = redis.serverInfo.redis_version;
      if (version && version.length >= 5) {
        const versionNumber = Number(version[0] + version[2]);
        if (versionNumber < 28) {
          alert('Vedis only supports Redis >= 2.8 because servers older than 2.8 don\'t support SCAN command, which means it not possible to access keys without blocking Redis.');
          commit('SET_STATUS', 'Disconnect');
          return;
        }
      }
      commit('SET_STATUS', 'Connected');
      commit('SET_INSTANCE', redis)
    })

    
  });
  
  redis.once('error', function (error) {
    commit('SET_STATUS', 'Error');
    redisErrorMessage = error;
    alert(error);
  });
  redis.once('end', function () {
    commit('SET_STATUS', 'Disconnect');
    if (!sshErrorThrown) {
      let msg = 'Redis Error: Connection failed. ';
      if (redisErrorMessage) {
        msg += `(${redisErrorMessage})`;
      }
      alert(msg);
    }
  });

  
}