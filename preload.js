const {contextBridge, ipcRenderer} = require('electron');

const sharedConstants = {
  APP_NAME: 'MP Backup',
};

contextBridge.exposeInMainWorld("db", {
  run: (sql, params) => ipcRenderer.invoke("db:run", sql, params),
  all: (sql, params) => ipcRenderer.invoke("db:all", sql, params),
});

contextBridge.exposeInMainWorld("click", {
  tpl: (tpl) => ipcRenderer.invoke("click:tpl", tpl)
});

contextBridge.exposeInMainWorld('appConstants', sharedConstants);