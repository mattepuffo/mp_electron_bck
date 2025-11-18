const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld("db", {
  run: (sql, params) => ipcRenderer.invoke("db:run", sql, params),
  all: (sql, params) => ipcRenderer.invoke("db:all", sql, params)
});