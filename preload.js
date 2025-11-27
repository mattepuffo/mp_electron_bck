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

contextBridge.exposeInMainWorld('mustache', {
  render: (template, data) => ipcRenderer.invoke('mustache:render', template, data)
});

contextBridge.exposeInMainWorld('electron', {
  selectDirectory: (operation) => ipcRenderer.invoke('select-directory', operation)
});

contextBridge.exposeInMainWorld('electronAPI', {
  comprimiCartella: (cartellaOrigine, nomeFileZip) => ipcRenderer.invoke('comprimi-cartella', cartellaOrigine, nomeFileZip)
});

contextBridge.exposeInMainWorld('appConstants', sharedConstants);