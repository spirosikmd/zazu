'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const localShortcut = require('electron-localshortcut');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

function fullScreenHandler () {
  if (!mainWindow.isFocused()) {
    return;
  }
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
    return;
  }
  mainWindow.setFullScreen(true);
}

function closedHandler () {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
}

function readyHandler () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', closedHandler);

  // Register global shortcuts.
  localShortcut.register(mainWindow, 'cmd+ctrl+f', fullScreenHandler);
}

function allClosedHandler () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
}

function willQuitHandler () {
  // Un-register all shortcuts.
  localShortcut.unregisterAll(mainWindow);
}

// Quit when all windows are closed.
app.on('window-all-closed', allClosedHandler);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', readyHandler);

app.on('will-quit', willQuitHandler);
