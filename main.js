'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const menu = require('menu');
const localShortcut = require('electron-localshortcut');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

/**
 * On full screen, check if main window is focused, and if not return.
 * If main window is focused and on full screen already then set to false
 * otherwise to full screen true.
 */
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

/**
 * On close dereference the window object, usually you would store windows
 * in an array if your app supports multi windows, this is the time
 * when you should delete the corresponding element.
 */
function closedHandler () {
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
  localShortcut.register(mainWindow, 'Command+Ctrl+F', fullScreenHandler);

  // Create the Application's main menu.
  const template = getMenuTemplate();

  menu.setApplicationMenu(menu.buildFromTemplate(template));
}

/**
 * On OS X it is common for applications and their menu bar
 * to stay active until the user quits explicitly with Cmd + Q.
 */
function allClosedHandler () {
  if (process.platform != 'darwin') {
    app.quit();
  }
}

/**
 * Un-register all shortcuts.
 */
function willQuitHandler () {
  localShortcut.unregisterAll(mainWindow);
}

/**
 * Get the template to use for main application menu.
 * @returns {Object} The template.
 */
function getMenuTemplate () {
  return [{
    label: 'Application',
    submenu: [{
      label: 'About Zazu', selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit', accelerator: 'Command+Q', click: function () {
        app.quit();
      }
    }]
  }, {
    label: 'Edit',
    submenu: [{
      label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'
    }, {
      label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'
    }, {
      label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'
    }, {
      label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'
    }, {
      label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'
    }]
  }];
}

// Quit when all windows are closed.
app.on('window-all-closed', allClosedHandler);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', readyHandler);

app.on('will-quit', willQuitHandler);
