"use strict";

const {app, Menu} = require('electron')

const menuTemplate = [{
    label: 'File',
    submenu: [
      {
      label: 'New Connection Window',
      accelerator: 'CmdOrCtrl+N',
      click() {
        windowManager.create();
      }
    }, 
    {
      label: 'New Connection Tab',
      accelerator: 'CmdOrCtrl+T',
      click() {
        windowManager.current.webContents.send('action', 'createInstance');
      }
    }, 
    {
      type: 'separator'
    }, 
    {
      label: 'Close Window',
      accelerator: 'Shift+CmdOrCtrl+W',
      click() {
        windowManager.current.close();
      }
    }, 
    {
      label: 'Close Tab',
      accelerator: 'CmdOrCtrl+W',
      click() {
        windowManager.current.webContents.send('action', 'delInstance');
      }
    }
  ]},
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Report an Issue...',
        click () { require('electron').shell.openExternal('https://github.com/s00d/vedis') }
      },
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/s00d/vedis') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  menuTemplate[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  menuTemplate[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}


module.exports = { menuTemplate };