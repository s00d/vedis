const electron = require('electron');
const path = require('path');
const fs = require('fs');
import Vue from 'vue'; 

class LocalStore {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.autoSave = opts.autoSave || false;
    this.defaults = opts.defaults;
    
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, val) {
    Vue.set(this.data, key, val);
    if (this.autoSave) this.save();
  }
  del(key, val) {
    Vue.delete(this.data, key);
    if (this.autoSave) this.save();
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  clear() {
    this.data = this.defaults;
    this.save();
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

export { LocalStore }
