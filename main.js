const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // carica la tua app (file o url)
  mainWindow.loadFile('index.html');
}

function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'app.sqlite');
  const dbExisted = fs.existsSync(dbPath);

  const db = new Database(dbPath);

  if (!dbExisted) {
    console.log('DB non trovato — creo il DB e le tabelle iniziali:', dbPath);

    const createSql = `
        CREATE TABLE IF NOT EXISTS operation_log
        (
            id        INTEGER PRIMARY KEY,
            operation VARCHAR(255),
            date      TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sync
        (
            name      VARCHAR(255),
            directory VARCHAR(255),
            server    VARCHAR(255),
            path      VARCHAR(255),
            type      VARCHAR(255)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS name_uq ON sync (name);

        CREATE TABLE IF NOT EXISTS ftp
        (
            name     VARCHAR,
            host     VARCHAR,
            username VARCHAR,
            password VARCHAR
        );

        CREATE UNIQUE INDEX IF NOT EXISTS ftp_uq ON ftp (name);
    `;

    try {
      db.exec('BEGIN;');
      db.exec(createSql);
      db.exec('COMMIT;');
      console.log('Tabelle e indici creati con successo.');
    } catch (err) {
      db.exec('ROLLBACK;');
      console.error('Errore durante la creazione delle tabelle:', err);
      throw err;
    }
  } else {
    console.log('DB trovato — nessuna creazione necessaria:', dbPath);
  }

  return db;
}

app.whenReady().then(() => {
  const db = initDatabase();

  global.sharedDb = db;

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (global.sharedDb) {
      try {
        global.sharedDb.close();
      } catch (e) {
      }
    }
    app.quit();
  }
});
