// import { createAction } from 'Utils';
import { Client } from 'ssh2';
import net from 'net';
import Redis from 'ioredis';
import _ from 'lodash';
import Vue from 'vue';
import json from '../../../../package.json';

const state = {
  tabs: [
    {
      max: 100,
      list: {},
      select: false,
      status: 'not connected',
      connect: false,
      config: {
        name: 'tab 0',
      },
      info: {},
      tree: false,
      treeList: {},
      instance: null,
      pattern: '*' ,
      filter: '',
      fetchCount: 100,
      cursor: 0,
      count: 16,
      sort: false,
      type: 'editor'
    }
  ],
  tab: 0,
  last: 1,
}

const getters = {
  selectedTab: state => {
    return state.tabs[state.tab]
  },
  getFilterList: state => {
    if(state.tabs[state.tab].filter.length === 0) return state.tabs[state.tab].select.val
    var re = new RegExp(state.tabs[state.tab].filter);
    return _.pickBy(state.tabs[state.tab].select.val, function(value, key) {
      return key.match( re ) || (typeof value === 'string' && value.match( re )) || (typeof value === 'object' && value.val.match( re ))
    });
  }
}

const mutations = {
  SELECT_DB (state, db) {
    Vue.set(state.tabs[state.tab].config, 'db', db)
    state.tabs[state.tab].instance.select(db);
  },
  SET_CONFIG(state, params) {
    Vue.set(state.tabs[state.tab], 'config', Object.assign(state.tabs[state.tab].config, params))
  },
  SET_PARAMS(state, params) {
    Vue.set(state.tabs, state.tab, Object.assign(state.tabs[state.tab], params))
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
        name: 'tab ' + state.last,
      },
      info: {},
      instance: null,
      pattern: '*' ,
      filter: '',
      fetchCount: 100,
      cursor: 0,
      count: 16,
      sort: false,
      type: 'editor'
    })
    state.last++;
    state.tab = Object.keys(state.tabs).length - 1
  },
  SET_FILTER(state, filter) {
    Vue.set(state.tabs[state.tab], 'filter', filter)
  },
  SET_TAB(state, tabId) {
    Vue.set(state, 'tab', tabId)
  },
  SET_TREE_LIST(state, data) {
    state.tabs[state.tab].treeList.children = _.assign({}, state.tabs[state.tab].treeList.children, data);
  }
}

const actions = {
  selectType({ dispatch, commit, state, getters }, type) {
    getters.selectedTab.type = type
  },
  addNewTab({ dispatch, commit, state }) {
    commit('ADD_NEW_TAB');  
  },
  closeTab({ dispatch, commit, state }, id) {
    if(state.tabs.length === 1) return;
    commit('SET_TAB', 0)
    Vue.delete(state.tabs, id)
  },
  setFilter({ dispatch, commit, state }, filter) {
    commit('SET_FILTER', filter);  
  },
  selectTab({ dispatch, commit, state }, tab) {
    commit('SET_TAB', tab)
  },
  setConfig({ dispatch, commit, state }, config) {
    commit('SET_CONFIG', config);  
    dispatch('connectToRedis');
    // dispatch('reloadList');
  },
  setParams({ dispatch, commit, state }, config) {
    commit('SET_PARAMS', config); 
    dispatch('reloadList');
    // dispatch('reloadList');
  },
  selectDB({ dispatch, commit, state }, db) {
    commit('SELECT_DB', db);  
    dispatch('reloadList');
  },
  reloadList ({ dispatch, commit, state, getters }, data = {pattern: '*', cursor: 0}) {
    if (data.pattern.indexOf('*') === -1 && data.pattern.indexOf('?') === -1) {
      data.pattern += '*'
    }
    getters.selectedTab.list = {};
    getters.selectedTab.treeList = {type: 'folder', name: 'root', open: true, children: {}}
    getters.selectedTab.pattern = data.pattern;
    dispatch('reloadListScan', data.cursor)
  },
  setEditList({ dispatch, commit, state, getters }, path) {
    let item = getters.selectedTab.list[path];
    Vue.set(getters.selectedTab.list[path], 'edit', 'edit' in item ? !item.edit : true);
  },
  pushList({ dispatch, commit, state, getters }, data) {
    for(let key of data) {
      Vue.set(getters.selectedTab.list, key, {path_sbr: key, path: key, show: true, type: 'none', select: false, edit: false})
      getters.selectedTab.list[key].path_sbr = getters.selectedTab.list[key].path.slice(0,20) + (getters.selectedTab.list[key].path.length > 20 ? '...' : '')
      getters.selectedTab.instance.type(key).then(function(type) {
        if (type !== 'none') {
          getters.selectedTab.list[key].type = type.toUpperCase();
        }
      })
      // getters.selectedTab.instance.ttl(key).then((ttl) => {
      //   getters.selectedTab.list[key].ttl = ttl;
      // });
    }

    if (getters.selectedTab.sort) Object.keys(getters.selectedTab.list).sort().forEach(function(key) {
      var value = getters.selectedTab.list[key];
      Vue.delete(getters.selectedTab.list, key)
      Vue.set(getters.selectedTab.list, key, value)
    });
  },
  reloadListScan({ dispatch, commit, state, getters }, cursor = 0) {
    return new Promise((resolve, reject) => {
      getters.selectedTab.instance.scan(cursor, 'MATCH', getters.selectedTab.pattern, 'COUNT', getters.selectedTab.fetchCount)
        .then(function(res) {
          if (getters.selectedTab.tree) dispatch('pushTreeList', res[1]); 
          else dispatch('pushList', res[1]);

          const cursor = res[0]
          if (Number(cursor) === 0) {
            Vue.set(getters.selectedTab, 'cursor', 0)
          } else if (getters.selectedTab.max > 0 && Object.keys(getters.selectedTab.list).length >= getters.selectedTab.max) {
            Vue.set(getters.selectedTab, 'cursor', parseInt(cursor))
          } else {
            dispatch('reloadListScan', res[0])
          }
          resolve()
        })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
