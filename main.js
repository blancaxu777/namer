const { app, BrowserWindow } = require("electron");
const path = require('path')
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 450,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${path.join(__dirname, 'build','app.html')}`);
});
