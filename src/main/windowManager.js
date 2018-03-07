'use strict';

import { app, BrowserWindow, Menu, shell, dialog } from 'electron';
import EventEmitter from 'events';
import defaultMenu from 'electron-default-menu';

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let windowManager = null;

class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.windows = new Set();
    app.on('browser-window-blur', this.emit.bind(this, 'blur'));
    app.on('browser-window-focus', this.emit.bind(this, 'focus'));
  }

  get current() {
    return BrowserWindow.getFocusedWindow() || this.create();
  }

  get menu() {
    const menu = defaultMenu(app, shell);

    menu.splice(4, 1);
    menu.splice(1, 0, 
      {
        label: 'File',
        submenu: [{
          label: 'New Connection Window',
          accelerator: 'CmdOrCtrl+N',
          click() {
            windowManager.create();
          }
        }, {
          label: 'New Connection Tab',
          accelerator: 'CmdOrCtrl+T',
          click() {
            windowManager.current.webContents.send('action', 'new-tab');
          }
        }, {
          type: 'separator'
        }, {
          label: 'Close Window',
          accelerator: 'Shift+CmdOrCtrl+W',
          click() {
            windowManager.current.close();
          }
        }, {
          label: 'Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click() {
            windowManager.current.webContents.send('action', 'close-tab');
          }
        }]
      }
    )

    menu.splice(5, 0, 
      {
        label: 'Help',
        role: 'help',
        submenu: [{
          label: 'Report an Issue...',
          click() {
            require('shell').openExternal('mailto:Vurus191288@gmail.com');
          }
        }, {
          label: 'Learn More',
          click() {
            require('shell').openExternal('https://github.com/s00d/vedis');
          }
        }]
      }
    )
    return menu;
  }

  create(type = 'main', arg = false) {
    const option = {
      backgroundColor: '#ececec'
    };
    if (type === 'main') {
      option.height = 563,
      option.width = 1000,
      option.useContentSize = true,
      // option.show = false;
      option.minWidth = 840;
      option.minHeight = 400;
    } else if (type === 'patternManager') {
      option.width = 600;
      option.height = 300;
      option.title = 'Manage Patterns';
      option.resizable = true;
      option.fullscreen = false;
    }

    const newWindow = new BrowserWindow(option);
    if (!option.show) {
      newWindow.once('ready-to-show', () => {
        newWindow.show()
      })
    }
    newWindow.loadURL(`${winURL}${arg ? '?arg=' + arg : ''}`);

    this._register(newWindow);

    return newWindow;
  }

  _register(win) {
    this.windows.add(win);
    win.on('closed', () => {
      this.windows.delete(win);
      if (!BrowserWindow.getFocusedWindow()) {
        this.emit('blur');
      }
    });
    this.emit('focus');
  }

  dispatch(action, args) {
    this.windows.forEach(win => {
      if (win && win.webContents) {
        win.webContents.send('action', action, args);
      }
    });
  }
}

windowManager = new WindowManager();

export { windowManager }
