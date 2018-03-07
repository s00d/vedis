<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  export default {
    name: 'vedis',
    methods: {
      ...mapActions({redis_connect: 'connectToRedis'}),
    },
    mounted () {
      window.showModal = modal => {
        this.activeElement = document.activeElement

        return new Promise((resolve, reject) => {
          this.promise = {resolve, reject}
        })
      }
    }
          
  }
</script>

<style>
  /* CSS */
  .pane-sl {
    max-width: 250px;
    min-width: 220px
  }

  .pane-xl {
    max-width: 300px;
    min-width: 280px
  }

  .list > .active, .selected {
    color: black !important;
    background-color: #bbbbbb !important;
  }

  .editor {
    width: 100%;
    height: 200px;
  }

  .rm-btn {
    color: red !important;
    padding-right: 10px;
  }

  a {
    cursor: pointer;
  }

  .table-striped tbody tr:nth-of-type(odd), .tree-item:nth-of-type(odd) {
    background-color: #ffffff;
  }

  .table-striped tr:nth-child(even), thead, .tree-item:nth-child(even)  {
    background-color: #f5f5f4;
  }

  .tree-item {
    margin-left: 2px;
  }

  .tab-item.active {
    color: black !important;
  }

  .search-input {
    position: relative;
  }

  .search-input .icon-search {
    position: absolute;
    left: 5px;
    top: 2px;
    opacity: 0.5;
  }

  .search-input input {
    padding-left: 22px;
    height: 26px;
  }

  /* .search {
    position: fixed;
    z-index: 1000;
    width: 220px;
    height: 26px;
} */

  .list-padding {
    /* padding-top: 28px; */
  }

  .add {
    padding: 0 .5rem;
  }

  .top-item {
      display: inline-block;
      padding: 12px;
      cursor: pointer;
  }


  .toolbar {
    background-image: none;
    border-bottom: 1px solid #d3d3d3;
  }

  .top-item:hover {
    background: #bbbbbb;
  }
  .top-item.active {
    background: #bbbbbb;
  }

  .top-item .icon {
    margin-right: 5px;
  }


  .list-item {
    padding-left: 3px;
    padding-right: 3px;
  }

  .badge {
    width: 39px;
    overflow: hidden;
  }

  ul.tree {
    list-style-type: none !important;
    padding: 0 10px !important;
    font-size: 13px;
  }

    /* li.tree_item div {
      border: 1px solid white !important;
      padding: 3px 8px !important;
      text-decoration: none !important;
      cursor: pointer !important;
    }

    li.add_tree div {
      border-radius: 5px !important;
      padding: 3px 8px !important;
      text-decoration: none !important;
      cursor: pointer !important;
      font-weight: bold !important;
      border: 0 !important;
    }

    li.tree_item div:hover, li.add_tree div:hover {
      background-color: #021321 !important;
      color: white !important;
    }

    li.tree_item div.selected, li.add_tree div.selected {
      background-color: #546879 !important;
      color: white !important;
    }

    .form-control-clear {
      z-index: 10 !important;
      pointer-events: auto !important;
      cursor: pointer !important;
      right: 30px !important;
    } */
</style>
