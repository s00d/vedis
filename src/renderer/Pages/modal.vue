<template>
  <transition name="modal-fade">npm i smalltalk


    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-text="title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="color: black">
            <div class="input-group mb-12" v-for="(data, title) in inputs" :key="title">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default" v-text="title"></span>
              </div>
              
              <select class="form-control" v-if="data.type === 'enum'" v-model="result[title]">
                <option selected>Choose...</option>
                <option v-for="(text, key) in data.enum" :key="key" v-text="text"></option>
              </select>
              <input type="text" class="form-control" v-if="data.type === 'string'" v-model="result[title]">
              <input type="number" class="form-control" v-if="data.type === 'number'" v-model="result[title]">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-text="button" @click="save">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Close</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'modal',
    props: {  
      title: {
          type: String,
          default: 'Modal title'
      },
      button: {
          type: String,
          default: 'Save changes'
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
    mounted () {
      for (let id in this.inputs) {
        if('default' in this.inputs[id]) this.$set(this.result, id, this.inputs[id].default);
      }
    }
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





  .modal {
    padding: 100px;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-content {
    width: 500px;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>