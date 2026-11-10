/**
 * This file is used specifically for security reasons.
 * Here you can securely expose privileged APIs into the renderer process
 * by leveraging Electron's contextBridge functionality and communicating
 * with the main process through Electron's inter-process communication (IPC).
 *
 * WARNING!
 * The preload script sandboxing offers limited access to a full Node.js environment.
 * Do NOT attempt to import packages from node_modules or use Node.js APIs directly in this file.
 * Instead, use IPC to communicate with the main process and access packages and Node.js
 * functionality there.
 *
 * Example on injecting window.myAPI.doAThing() into renderer thread:
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * Preload script documentation:
 * https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */

import { contextBridge, ipcRenderer } from 'electron'
import { quasarRuntime } from '#q-app/electron/preload'
/**
 * Can be used in the renderer process through `window.quasarRuntime`
 */
contextBridge.exposeInMainWorld("quasarRuntime", quasarRuntime)

// Expose methods defined in electron-main.js
contextBridge.exposeInMainWorld('electron', {
  getConfig: (key) => ipcRenderer.invoke('getConfig', key),
  setConfig: (key, val) => ipcRenderer.invoke('setConfig', key, val),
  getAllDisplays: () => ipcRenderer.invoke('getAllDisplays'),
  udp: () => ipcRenderer.invoke('udp'),
  oscSend: (outAddress, outPort, buffer) => ipcRenderer.invoke('oscSend', outAddress, outPort, buffer),
  showDisplaysNr: (show) => ipcRenderer.invoke('showDisplaysNr', show),
  onAutoUpdate: (status, percent, message) => ipcRenderer.on('autoUpdate', status, percent, message),
  onAppClose: (key) => ipcRenderer.on('appClose', key),
  closeApp: () => ipcRenderer.send('closeApp')
})
