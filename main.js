'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const menu = require('menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

var zoomFactor = 1.0;

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

function reloadHandler () {
  mainWindow.webContents.reloadIgnoringCache();
}

function actualSizeHandler () {
  zoomFactor = 1.0;
  mainWindow.webContents.setZoomFactor(zoomFactor);
}

function zoomInHandler () {
  zoomFactor += 0.1;
  mainWindow.webContents.setZoomFactor(zoomFactor);
}

function zoomOutHandler () {
  zoomFactor -= 0.1;
  mainWindow.webContents.setZoomFactor(zoomFactor);
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
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'Command+R',
      click: reloadHandler
    }, {
      type: 'separator'
    }, {
      label: 'Actual Size',
      accelerator: 'Command+0',
      click: actualSizeHandler
    }, {
      label: 'Zoom In',
      accelerator: 'Command+Shift+=',
      click: zoomInHandler
    }, {
      label: 'Zoom Out',
      accelerator: 'Command+Shift+-',
      click: zoomOutHandler
    }, {
      type: 'separator'
    }, {
      label: 'Enter Full Screen',
      accelerator: 'Ctrl+Command+F',
      click: fullScreenHandler
    }]
  }];
}

// Quit when all windows are closed.
app.on('window-all-closed', allClosedHandler);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', readyHandler);
