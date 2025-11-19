const {app, BrowserWindow, ipcMain, screen} = require('electron');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js').default;

let db;
let SQL;
let exeFolder;

if (app.isPackaged) {
  exeFolder = path.dirname(process.execPath);
} else {
  exeFolder = path.resolve(__dirname);
}

const dbPath = path.join(exeFolder, 'app.sqlite');

async function initDatabase() {
  const wasmPath = path.join(__dirname, "db", "sql-wasm.wasm");
  SQL = await initSqlJs({locateFile: () => wasmPath});

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log("DB caricato:", dbPath);
  } else {
    db = new SQL.Database();
    console.log("DB creato:", dbPath);

    db.run(`
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
    `);

    saveDatabase();
  }
}

function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  console.log("DB salvato:", dbPath);
}

ipcMain.handle("db:run", (event, sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  saveDatabase();
  return true;
});

ipcMain.handle("db:all", (event, sql, params = []) => {
  const stmt = db.prepare(sql);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
});

function createWindow() {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width * 0.8),
    height: Math.floor(height * 0.8),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenu(null);
  win.loadFile("renderer/index.html");
}

app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
});
