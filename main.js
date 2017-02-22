const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = require('electron')

const path = require('path')
const url = require('url')

let template = [{
  label: 'Settings',
  submenu: [{
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: function() {
      app.quit();
    }
  }, {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function() {
      reloadAllWindows();
    }
  }, {
    label: 'Settings',
    accelerator: 'CmdOrCtrl+Z',
    role: 'settings',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        createSettingsWindow();
      }
    }
  }]
}, {
  label: 'View',
  submenu: [
  {
    label: 'Layout 1',
    accelerator: 'Cmd+1',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        closeAllWindows();
        createFirstLayoutWindow();
      }
    }
  },
  {
    label: 'Layout 2',
    accelerator: 'Cmd+2',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        closeAllWindows();
        createSecondLayoutWindow();
      }
    }
  },
  {
    label: 'Layout 3',
    accelerator: 'Cmd+3',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        closeAllWindows();
        createThirdLayoutWindow();
      }
    }
  },
  {
    label: 'Layout 4',
    accelerator: 'Cmd+4',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        closeAllWindows();
        createFourthLayoutWindow();
      }
    }
  }
  ]
}]

ipcMain.on('openPlaylistWindow', (event, arg) => {
  if (playlistWindow) {
    playlistWindow.close()
  }
  else {
    createPlaylistWindow()
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let settingsWindow
let playlistWindow

function closeAllWindows() {
  if(mainWindow) { mainWindow.close() }
  if(settingsWindow) { settingsWindow.close() }
  if(playlistWindow) { playlistWindow.close() }
}

function reloadAllWindows() {
  if(mainWindow) { mainWindow.reload() }
  if(settingsWindow) { settingsWindow.reload() }
  if(playlistWindow) { playlistWindow.reload() }
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({width: 250, height: 250, resizable: false, alwaysOnTop: true})

  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'settings.html'),
    protocol: 'file:',
    slashes: true
  }))

  settingsWindow.on('closed', function () {
    settingsWindow = null
    reloadAllWindows();
  })
}

function createPlaylistWindow() {
  playlistWindow = new BrowserWindow({width: 450, height: 200, resizable: false, alwaysOnTop: true})

  playlistWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'playlist.html'),
    protocol: 'file:',
    slashes: true
  }))

  playlistWindow.on('closed', function () {
    playlistWindow = null
  })
}

function createFirstLayoutWindow () {
  mainWindow = new BrowserWindow({width: 380, height: 155, resizable: false, frame: false, alwaysOnTop: true})
  // mainWindow = new BrowserWindow({width: 800, height: 500, resizable: false, frame: false})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'layout_1.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
    reloadAllWindows();
  })
}

function createSecondLayoutWindow () {
  mainWindow = new BrowserWindow({width: 380, height: 130, resizable: false, frame: false, alwaysOnTop: true})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'layout_2.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
    reloadAllWindows();
  })
}

function createThirdLayoutWindow() {
  mainWindow = new BrowserWindow({width: 260, height: 100, resizable: false, frame: false, alwaysOnTop: true})
  // mainWindow = new BrowserWindow({width: 800, height: 500, resizable: false, frame: false})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'layout_3.html'),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
    reloadAllWindows();
  })
}

function createFourthLayoutWindow() {
  mainWindow = new BrowserWindow({width: 260, height: 74, resizable: false, frame: false, alwaysOnTop: false})
  // mainWindow = new BrowserWindow({width: 800, height: 500, resizable: false, frame: false})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'layout_4.html'),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
    reloadAllWindows();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createFirstLayoutWindow();

  electron.powerMonitor.on('resume', () => {
    console.log('The system is going to resuming')
    reloadAllWindows();
  })

});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createFirstLayoutWindow()
  }
})
