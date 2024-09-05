import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import process from 'process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, 
    },
  });
  win.setMenu(null);
  win.loadURL(`http://localhost:5173`);
  win.webContents.on('dom-ready', () => {
    win.webContents.send('image');
  });
  ipcMain.handle('openImage', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  })
  ipcMain.on('image', (event, image) => {
    process.stdout.write(image );
    app.quit();
  });

});