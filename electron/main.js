const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 780,
        minWidth: 1024,   // Minimum width
        maxWidth: 1600,   // Maximum width
        minHeight: 600,   // Minimum height
        maxHeight: 1000,  // Maximum height
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        frame: true,     // Hide default window frame
        resizable: true, // Disable resizing
    });

    mainWindow.setMenu(null);

    // Set application title
    mainWindow.setTitle('Systém de Gestion du Magasin -Commune Taounate');

    // Set application icon
    mainWindow.setIcon(path.join(__dirname, '/app/images/logo.ico'));

    mainWindow.loadFile(path.join(__dirname, '/app/login.html'));

    // Handle window close
    mainWindow.on('close', () => {
        mainWindow = null;
    });

    // Add listener to reset the title if any JS changes it in the web page
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript('document.title = "Systém de Gestion du Magasin -Commune Taounate";');
    });
    mainWindow.webContents.openDevTools(); // This opens DevTools

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});