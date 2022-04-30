import { app, BrowserWindow, nativeTheme, screen } from 'electron'
import path from 'path'
import os from 'os'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

function createWindow (url, display = 0, fullscreen = false) {
  const displays = screen.getAllDisplays()
  const selectedDisplay = displays[display]

  if (!selectedDisplay) {
    return // Display not found
  }

  const { x, y } = selectedDisplay.bounds

  const window = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
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
  window.setFullScreen(fullscreen)

  window.loadURL(process.env.APP_URL + '#' + url)

  return window
}

app.whenReady().then(() => {
  const mainWindow = createWindow('/', 0)

  mainWindow.on('close', () => {
    app.quit()
  })

  // Output windows (fullscreen)
  createWindow('/output/livestream', 1, true)
  createWindow('/output/livestream/alpha', 2, true)
  createWindow('/output/beamer', 3, true)
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})
