<template>
  <div class="dialogue-widget type">
    <img class="icon" src="">
    <span class="title" v-text="title"></span>
    <form>
      <input tabindex="1">
    </form>
    <div class="divider"></div>
    <button class="cancel" tabindex="3" @click="$emit('cancel')"></button>
    <button class="ok" tabindex="2" @click="$emit('ok', inputs)"></button>
  </div>
</template>
<script>
  var fs = require('fs')
  var glue = require('hyperglue')
  var insertCss = require('insert-css')
  var xtend = require('xtend')
  var path = require('path')

  export default {
    name: 'modal',
    props: {  
      img: {
          type: String,
          default: ''
      },
      ok: {
          type: String,
          default: 'OK'
      },
      cancel: {
          type: String,
          default: 'Cancel'
      },
      inputs: {
          type: Object,
          default: {}
      }
    },
    data () {
      return {
        result: {}
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      save() {
        this.$emit('save', this.result);
      },
    },
  };
</script>
<style>
  .dialog-widget.background {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  width: 100%;
  height: 100%;
}

.dialog-widget.alert, .dialog-widget.confirm, .dialog-widget.prompt {
  position: fixed;
  left: calc(50% - 160px);
  width: 300px;
  top: calc(50% - 115px);
  border: solid 1px #ddd;
  background: whitesmoke;
  z-index: 10000;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  color: black;
  padding: 15px 10px 15px 10px;
  font-family: arial;
}

.dialog-widget img {
  width: 40px;
  height: 40px;
  position: fixed;
}

.dialog-widget img[src=""] {
  display: none;
}

.dialog-widget.alert .divider, .dialog-widget.alert input, .dialog-widget.alert .cancel {
  display: none;
}

.dialog-widget.confirm input {
  display: none;
}

.dialog-widget.alert .ok {
  margin-top: 15px;
  float: right;
}

.dialog-widget input {
  padding: 8px;
  -webkit-appearance: none;
  border: solid 1px #ccc;
  border-radius: 5px;
  margin: 15px 5px 5px 5px;
  width: calc(100% - 16px - 2px - 10px);
  font-size: 12px;
}

.dialog-widget .url {
  text-align: center;
  font-size: 18px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
}

.dialog-widget[data-icon="true"] .url {
  margin-left: 40px;
}

.dialog-widget .title {
  text-align: center;
  display:block;
  font-size: 14px;
}

.dialog-widget .divider {
  border-top: solid 1px #ddd;
  padding: 0;
  margin: 15px 0 15px -10px;
  width: calc(100% + 20px);
}

.dialog-widget .ok, .dialog-widget .cancel {
  color: #005AFF;
  padding: 8px;
  width: calc(50% - 5px);
  font-size: 13px;
  background-color: #EBEBF1;
  border: none;
  border-radius: 5px;
}

.dialog-widget .ok {
  margin-left: 5px;
}

</style>