<template>
  <div class="pane">
    <div class="terminal" ref="terminal">
      <div v-for="(item, id) in responses" class="terminal-line" :key="id">
          <span v-if="'command' in item"><span v-html="prefix"></span> <span v-html="item.command"></span><br></span>
          <span v-html="item.response" ></span>
      </div>
      <prompt :active="true" :visible="true" @emitCommand="runCommand" :directory="prefix" v-if="!pause"></prompt>
    </div>
  </div>
</template>

<script>
  import Prompt from './Prompt'
  import commands from 'redis-commands'
  import splitargs from 'redis-splitargs'
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    components: { 
      Prompt
    },
    data () {
      return {
        prefix: "redis >",
        responses: [],
        newRedis: null, 
        pause: false
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
    mounded () {
      this.activatePrompt()

      this.redis.on('select', this.onSelectBinded)

      document.onkeydown = (evt) => {
           // ctrl + y
        if (evt && evt.ctrlKey && evt.keyCode == 67) {
          if (this.newRedis) this.newRedis.disconnect()
        }
      }
    },
    methods: {
      runCommand (string) {
        let command = splitargs(string);
        const commandName = command[0] && command[0].toUpperCase()
        if ((string == 'y' || string === 'yes') &&  (this.responses[this.responses.length-1].command === 'FLUSHALL' || this.responses[this.responses.length-1].command === 'FLUSHDB')) {
          this.execute(this.responses[this.responses.length-1].command)
        } else if (commandName === 'FLUSHALL' || commandName === 'FLUSHDB') {
          this.responses.push({response: 'Are you sure (y/n)?', command: command.join(' ')});
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
        return `<div class="monitor">
          <span class="time">${time}</span>
          <span class="command">
            <span class="command-name">${command}</span>
            <span class="command args">${args.join(' ')}</span>
          </span>
        </div>`
      },
      execute(args) {
        this.pause = true;
        if (args.length === 1 && args[0].toUpperCase() === 'MONITOR') {
          this.newRedis = this.redis.duplicate()
          console.log(this.newRedis.monitor);
          
          this.newRedis.monitor((err, monitor) => {
            console.log(err, monitor);
            this.responses.push({command: args.join(' '), response: 'Enter monitor mode. Press Ctrl+C to exit.'});
            monitor.on('monitor', (time, args) => {
              this.responses.push({response: this.formatMonitor(time, args)});
              this.activatePrompt()
            })
          })
        } else if (args.length > 1 && ['SUBSCRIBE', 'PSUBSCRIBE'].indexOf(args[0].toUpperCase()) !== -1) {
          this.newRedis = this.redis.duplicate()
          newRedis.call.apply(newRedis, args).then(res => {
            this.responses.push({command: args.join(' '), response: 'Enter subscription mode. Press Ctrl+C to exit.'});
          })
          newRedis.on('message', (channel, message) => {
            this.responses.push({response: formatMessage(channel, message)})
          })
          newRedis.on('pmessage', (pattern, channel, message) => {
            this.responses.push({response: formatMessage(channel, message)})
          })
        } else {
          this.redis.call.apply(this.redis, args).then(res => {
            this.responses.push({command: args.join(" "), response: res})
            this.pause = false;
            this.activatePrompt()
          }).catch(err => {
            this.responses.push({command: args.join(" "), response: err.message})
            this.pause = false;
            this.activatePrompt()
          })
        }
      },
      activatePrompt () {
        this.promptActive = true
        this.$nextTick(() => {
          this.scrollBottom()
        })
      },
      
      scrollBottom () {
        this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight
      }
    }
  }
</script>

<style scoped>
 input {
  font-size: 100%;
  background: inherit;
  border: none;
}

.terminal-line {
  min-height: 22px;
}

@media screen and (min-width: 1800px) {
  .terminal-line {
    max-width: 70%;
  }
}

.terminal-line > * {
  display: inline-block;
  vertical-align: middle;
  text-align: start;
}

.terminal {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  padding: 15px;
  margin-right: auto;
}

.sep {
  color: #b48ead;
}

.yellow {
  color: #ebcb8b;
}

</style>