const {contextBridge, ipcRenderer} = require('electron');

const sharedConstants = {
  APP_NAME: 'MP Backup',
};

contextBridge.exposeInMainWorld("db", {
  run: (sql, params) => ipcRenderer.invoke("db:run", sql, params),
  all: (sql, params) => ipcRenderer.invoke("db:all", sql, params)
});

contextBridge.exposeInMainWorld('appConstants', sharedConstants);