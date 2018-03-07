import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron'
const defaultMenu = require('electron-default-menu');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  const menu = defaultMenu(app, shell);

  menu.splice(4, 1);
  menu.splice(1, 0, 
    {
      label: 'File',
      submenu: [{
        label: 'New Connection Window',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createWindow();
          
        }
      }, {
        label: 'New Connection Tab',
        accelerator: 'CmdOrCtrl+T',
        click() {
          // mainWindow.current.webContents.send('action', 'createInstance');
        }
      }, {
        type: 'separator'
      }, {
        label: 'Close Window',
        accelerator: 'Shift+CmdOrCtrl+W',
        click() {
          mainWindow.current.close();
        }
      }, {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W',
        click() {
          mainWindow.current.webContents.send('action', 'delInstance');
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

  
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    // createWindow()
    windowManager.create();
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
