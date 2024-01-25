// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');
const { shell } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/icons/256x256.png')
    });

    tray = new Tray(path.join(__dirname, 'assets/icons/32x32.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Quit', click: function () {
                mainWindow.destroy();
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('FacileThings');

    mainWindow.loadURL('https://app.facilethings.com');

    mainWindow.on('close', function (event) {
        event.preventDefault();
        mainWindow.hide();
        return false;
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' }
    })

}

const gotLock = app.requestSingleInstanceLock();

if(!gotLock) {
    app.quit();
} else {

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our primary window.
        if (mainWindow) {
            mainWindow.show();
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    app.on('ready', createWindow);

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
        else {
            mainWindow.show();
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

}

