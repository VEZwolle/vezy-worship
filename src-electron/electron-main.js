import { app, BrowserWindow, nativeTheme, screen, ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import os from 'os'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
let autoUpdaterDownloaded = false

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

const config = new Store()

// Expose methods to the renderer thread
ipcMain.handle('getConfig', (e, key) => {
  return config.get(key)
})
ipcMain.handle('setConfig', (e, key, val) => {
  config.set(key, val)
})
ipcMain.handle('getAllDisplays', () => {
  return screen.getAllDisplays()
})
ipcMain.on('closeApp', () => {
  const autoupdateCheck = config.get('autoupdate')
  if (autoupdateCheck === undefined || autoupdateCheck) {
    if (autoUpdaterDownloaded) autoUpdater.quitAndInstall(false, false)
  } else {
    autoUpdater.autoInstallOnAppQuit = false
  }
  mainWindow = null
  app.quit()
})

// Needed to use FileSystem API
app.commandLine.appendSwitch('enable-experimental-web-platform-features')

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay()

  mainWindow = createWindow('/', primaryDisplay)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.file.level = 'info' // debug info
  mainWindow.on('ready-to-show', () => {
    const autoupdateCheck = config.get('autoupdate')
    if (autoupdateCheck === undefined || autoupdateCheck) autoUpdater.checkForUpdatesAndNotify()
  })

  mainWindow.on('close', (e) => {
    if (mainWindow) {
      e.preventDefault()
      mainWindow.webContents.send('appClose', true)
    }
  })

  // help window, create & hide, prevent closing
  let helpWindow = createWindow('/help', primaryDisplay, false, 1000, 800)
  helpWindow.hide()
  helpWindow.on('close', (event) => {
    if (app.quitting) {
      helpWindow = null
    } else {
      event.preventDefault()
      helpWindow.hide()
    }
  })
  // open links external
  helpWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    // options: https://www.electronjs.org/docs/latest/api/browser-window
    switch (true) {
      case (details.url.toLowerCase().startsWith('https://login.planningcenteronline.com')):
      case (details.url.toLowerCase().startsWith('https://api.planningcenteronline.com')):
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
            title: 'VezyWorship | Planning Center Online',
            autoHideMenuBar: true,
            width: 750,
            height: 750
          }
        }
      case (details.url.toLowerCase().endsWith('/#/help')):
        helpWindow.show()
        return { action: 'deny' }
      default:
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
            autoHideMenuBar: true
          }
        }
    }
  })

  // Output windows (fullscreen)
  const displays = screen.getAllDisplays()
  const outputDisplays = config.get('displays') || {}

  createWindow('/output/beamer', displays[outputDisplays.beamer], true)
  createWindow('/output/livestream', displays[outputDisplays.livestream], true)
  createWindow('/output/livestream/alpha', displays[outputDisplays.livestreamAlpha], true)
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => { app.quitting = true })

function createWindow (url, display, fullscreen = false, width = 1000, height = 600) {
  if (!display) {
    return // Display not found
  }

  const { x, y } = display.bounds

  const window = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width,
    height,
    x: x + 50,
    y: y + 50,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  window.removeMenu()

  if (fullscreen) {
    window.setFullScreen(true)
    window.setAlwaysOnTop(true)
    window.setSkipTaskbar(true)
  }

  window.loadURL(process.env.APP_URL + '#' + url)

  return window
}

/* New Update Available */
autoUpdater.on('error', (error) => {
  console.error(error)
  mainWindow.webContents.send('autoUpdate', -1, 0, 'Updates controle app fout, probeer het later opnieuw')
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('autoUpdate', 0, 0, 'Controle op app updates...')
})

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('autoUpdate', 1, 0, 'Geen updates beschikbaar')
})

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('autoUpdate', 2, 1, `Update versie ${info.version} beschikbaar`)
})

autoUpdater.on('download-progress', (progressObj) => {
  // const message = (`Download speed: ${(progressObj.bytesPerSecond / 1028576).toFixed(2)} Mb/sec (${(progressObj.transferred / 1028576).toFixed(2)}/${(progressObj.total / 1028576).toFixed(2)} Mb)`)
  mainWindow.webContents.send('autoUpdate', 3, progressObj.percent, 'downloading')
})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdaterDownloaded = true
  mainWindow.webContents.send('autoUpdate', 4, 100, `Versie ${info.version} gedownload, wordt na afsluiten geinstalleerd.`)
})
