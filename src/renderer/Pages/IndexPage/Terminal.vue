<template>
  <div class="pane">
    <div id="sandbox">
      <pre class="output" ref="terminal">
        <span v-for="(item, id) in responses" :key="id">
          <span class="command" v-html="item.command" v-if="'command' in item"></span>
          <span style="white-space: initial">
            <span class="prefix">  =&gt; </span><span :class="item.type" v-html="item.response"></span>
          </span>
        </span>
      </pre>
      <div class="input">
        <textarea rows="1" placeholder="// type some javascript and hit enter (:help for info)" v-model="command" @keyup.enter.prevent="runCommand"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import commands from 'redis-commands'
  import splitargs from 'redis-splitargs'
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    components: { 
    },
    data () {
      return {
        prefix: "redis >",
        responses: [],
        newRedis: null, 
        command: ''
      }
    },
    computed: {
      ...mapGetters({
        selectedTab: 'selectedTab'
      }),
      redis: function() {
        return this.selectedTab.instance
      },
    },
    created () {
      this.$nextTick(() => {
        window.addEventListener('keydown', this.stopRedis)
      })
    },
    mounded () {
      this.activatePrompt()
      this.$nextTick(() => {
        window.addEventListener('keydown', this.stopRedis)
      })

      // this.redis.on('select', this.onSelectBinded)
    },
    methods: {
      stopRedis(e) {
        if(e.keyCode == 38) {
          // this.$refs.terminal.scrollBy(0, 100); 
          this.$refs.terminal.scrollTop -= 100
        }
        if(e.keyCode == 40) {
          this.$refs.terminal.scrollTop += 100
          // this.$refs.terminal.scrollBy(0, -100); 
        }

        if (e.ctrlKey && String.fromCharCode(e.which).toLowerCase() === 'c') {
          this.$events.$emit('disconect-monitor');
          this.responses.push({response: 'Disconected!'});
          this.activatePrompt()

        }
      },
      runCommand () {
        let string = this.command;
        this.command = "";
        let command = splitargs(string);
        if(command.length === 0) return;
        const commandName = command[0] && command[0].toUpperCase()
        if ((string == 'y' || string === 'yes') &&  (this.responses[this.responses.length-1].command === 'FLUSHALL' || this.responses[this.responses.length-1].command === 'FLUSHDB')) {
          this.execute(this.responses[this.responses.length-1].command)
        } else if (commandName === 'FLUSHALL' || commandName === 'FLUSHDB') {
          this.responses.push({response: 'Are you sure (y/n)?', command: command.join(' '), type: "info"});
        } else {
          this.execute(command)
        }
      },
      formatMonitor(time, args) {
        args = args || []
        const command = args[0] ? args.shift().toUpperCase() : ''
        if (command) {
          commands.getKeyIndexes(command.toLowerCase(), args).forEach(index => {
            args[index] = `<span class="command-key">${args[index]}</span>`
          })
        }
        return `<span style="color: white; margin-right: 4px;">${time}</span>
          <span style="color: #cf7ea9;">${command}</span>
          <span>${args.join(' ')}</span>`
      },
      execute(args) {
        if (args.length === 1 && args[0].toUpperCase() === ':HELP') {
          this.responses.push({command: args.join(' '), response: 'type javascript commands into the console, hit enter to evaluate. [up/down] to scroll through history, ":clear" to reset it. ', type: "help"});
        } else if (args.length === 1 && args[0].toUpperCase() === ':CLEAR') {
           this.responses = [];
        } else if (args.length === 1 && args[0].toUpperCase() === 'MONITOR') {
          this.redis.monitor((err, monitor) => {
            this.responses.push({command: args.join(' '), response: 'Enter monitor mode. Press Ctrl+C to exit.', type: "help"});
            monitor.on('monitor', (time, args) => {
              this.responses.push({response: this.formatMonitor(time, args)});
              this.activatePrompt()
            })
            this.$events.$on('disconect-monitor', () => {
              monitor.disconnect()
            });
          })
        } else if (args.length > 1 && ['SUBSCRIBE', 'PSUBSCRIBE'].indexOf(args[0].toUpperCase()) !== -1) {
          const newRedis = this.redis.duplicate()
          newRedis.call.apply(newRedis, args).then(res => {
            this.responses.push({command: args.join(' '), response: 'Enter subscription mode. Press Ctrl+C to exit.', type: "help"});
          })
          newRedis.on('message', (channel, message) => {
            this.responses.push({response: channel+": "+message})
          })
          newRedis.on('pmessage', (pattern, channel, message) => {
            this.responses.push({response: channel+": "+message})
          })
          this.$events.$on('disconect-monitor', () => {
            newRedis.disconnect()
          });
        } else {
          this.redis.call.apply(this.redis, args).then(res => {
            this.responses.push({command: args.join(" "), response: res})
            this.activatePrompt()
          }).catch(err => {
            this.responses.push({command: args.join(" "), response: err.message, type: "error"})
            this.activatePrompt()
          })
        }
      },
      activatePrompt () {
        this.$nextTick(() => {
          this.scrollBottom()
        })
      },
      
      scrollBottom () {
        if (this.$refs.terminal && this.$refs.terminal.scrollHeight) this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;

      }
    }
  }
</script>

<style lang="scss" scoped>
#sandbox,
#sandbox pre.output,
#sandbox pre.output span,
#sandbox textarea,
#sandbox textarea:focus {
	font-size:14px;
	line-height:1.3;
	font-weight: normal;
	font-family:"Consolas", "Andale Mono", "Courier New", "Courier", monospace;
	border:0 none;
	outline:0 none;
	-webkit-box-shadow:none;
	   -moz-box-shadow:none;
	        box-shadow:none;
}
#sandbox {
	background:#333;
	color: #ccc;
  background: #333;
  
  height:99%;
}
#sandbox pre.output {
	display:block;
	white-space:pre;
	width:100%;
	height:90%;
	overflow-y:auto;
	position:relative;
	padding:0;
	margin:0 0 10px;
	border:0 none;
}
#sandbox pre.output span           { color:#f7f7f7; }
#sandbox pre.output span.command   { color:#ccc; }
#sandbox pre.output span.prefix    { color:#777; }
#sandbox pre.output span.undefined { color:#777; }
#sandbox pre.output span.string    { color:#99f; }
#sandbox pre.output span.number    { color:#7f7; }
#sandbox pre.output span.error     { color:#f77; }
#sandbox pre.output span.info      { color:rgb(58, 0, 219); }
#sandbox pre.output span.help      { color:#b48ead; }

#sandbox .input {
  padding:0 0 0 65px;
  margin: 4px;
	position:relative;
}
#sandbox .input:before {
	content:"redis >";
	position:absolute;
	top: 1px;
	left: 0;
	color:#ddd
}
#sandbox textarea {
	color:#f7f7f7;
	background:#333;
	border:0 none;
	outline:0 none;
	padding:0;
	margin:0;
	resize: none;
	width:100%;
	overflow:hidden;
}
#sandbox textarea:focus {
	outline:0 none;
}


#sandbox pre.output::-webkit-scrollbar,
#sandbox pre.output::-webkit-scrollbar-button,
#sandbox pre.output::-webkit-scrollbar-track,
#sandbox pre.output::-webkit-scrollbar-track-piece,
#sandbox pre.output::-webkit-scrollbar-thumb,
#sandbox pre.output::-webkit-scrollbar-corner,
#sandbox pre.output::-webkit-resizer {
	background: transparent;
}
#sandbox pre.output::-webkit-scrollbar {
	width:  7px;
	height: 7px;
	-webkit-border-radius: 4px;
	        border-radius: 4px;
}
#sandbox pre.output::-webkit-scrollbar-track-piece {
	-webkit-border-radius: 5px;
	        border-radius: 5px;
}
#sandbox pre.output::-webkit-scrollbar-thumb {
	background: #4f4f4f;
	border-radius: 5px;
}
#sandbox pre.output::-webkit-scrollbar-button {
	width:0;
	height:0;
}



</style>