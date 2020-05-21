const electron = require('electron');
const { ipcMain, Notification } = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

// As devMode to active live reload use this require and script "yarn electron":
//require('electron-reload')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('@notification/REQUEST', async (event, message) => {
  try {
    const { title, body } = message;

    const notification = new Notification({
      title,
      body,
    });

    notification.show();
    } catch (err) {
    event.sender.send('@notification/FAILURE', 'Houve um erro na criação da notificação');
    }
});