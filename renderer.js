const {BrowserWindow} = require('electron').remote;
var url = require('url');
var path = require('path');
var $ = require('jquery');
let win;
$(document).ready(function(){
  $('.btn').click(function(){
    win = new BrowserWindow();
    win.maximize();
   win.loadURL(url.format({
     pathname : path.join("/home/mounik/Workspace/eaatsm/flashing","flashing.html"),
     protocol : "file:",
     slashes : true
   }));
  });
});
