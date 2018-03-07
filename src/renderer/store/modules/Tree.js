// import { createAction } from 'Utils';
import { Client } from 'ssh2';
import net from 'net';
import Redis from 'ioredis';
import _ from 'lodash';
import Vue from 'vue';



const state = {
  
}

let searchKeyByKeys = (tree, keys, offset = 0, cancel_search = false) => {
  let path = tree;
  for(let i = 0; i < keys.length-offset; i++) {
    path = path.children[keys[i]];
  }
  return path;
}

const getters = {
  selectedTree: state => {
    // return state.tabs[state.tab].tree
  },
}

const actions = {
  pushTreeList({ dispatch, commit, state, getters }, data) {
    let result = {};
    for (let str of data) {
      let new_link = str.split(':');
      let link = result;
      let path = '';
      for (var i = 0; i < new_link.length - 1; i++) {
        path += new_link[i]
        if(new_link[i].length === 0) new_link[i] = '-'
        if (!(new_link[i] in link)) link["0"+new_link[i]] = {type: 'folder', name: new_link[i], path: path, open: false, children: {}};
        link = link["0"+new_link[i]].children;
      }
    
      if(new_link[new_link.length-1].length === 0) new_link[i] = '-'
      link[new_link[new_link.length-1]] = {type: 'item', name: new_link[new_link.length-1], path: str}
      if (getters.selectedTab.sort) Object.keys(link).sort().forEach(function(key) {
        var value = link[key];
        Vue.delete(link, key)
        Vue.set(link, key, value)
      });
    }
    commit('SET_TREE_LIST', result)
  },
  openTree({state, getters}, path) {
    if(!path) return;
    let keys = path.split(":");
    let tree = searchKeyByKeys(getters.selectedTab.treeList, keys);
    Vue.set(tree, 'open', 'open' in tree ? !tree.open : true);
  },
  setEditTree({state, getters}, path) {
    if(!path) return;
    let keys = path.split(":");
    let tree = searchKeyByKeys(getters.selectedTab.treeList, keys);
    Vue.set(tree, 'edit', 'edit' in tree ? !tree.edit : true);
  }
}

const mutations = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
