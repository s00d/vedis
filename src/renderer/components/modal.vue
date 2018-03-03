<template>
  <transition name="modal-fade">
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
  };
</script>
<style>
  

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