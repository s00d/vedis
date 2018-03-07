import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron'
import { windowManager } from './windowManager';
const defaultMenu = require('electron-default-menu');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function (e, hasVisibleWindows) {
  if (!hasVisibleWindows) {
    if (mainWindow === null) {
      mainWindow = mainWindow.create();
    }
  }
});

app.on('ready', function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(windowManager.menu));
  mainWindow = windowManager.create();
});

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
