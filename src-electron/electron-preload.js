/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

import { contextBridge, ipcRenderer } from 'electron'

// Expose methods defined in electron-main.js
contextBridge.exposeInMainWorld('electron', {
  getConfig: (key) => ipcRenderer.invoke('getConfig', key),
  setConfig: (key, val) => ipcRenderer.invoke('setConfig', key, val),
  getAllDisplays: () => ipcRenderer.invoke('getAllDisplays'),
  onAutoUpdate: (status, percent, message) => ipcRenderer.on('autoUpdate', status, percent, message)
})
