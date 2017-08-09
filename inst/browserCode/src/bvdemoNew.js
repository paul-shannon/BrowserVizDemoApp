import css from './css/browservizdemo.css';
var hub = require("browservizjs")
//----------------------------------------------------------------------------------------------------
var BrowserVizDemo = {

    self,
    hub,                     // defined in BrowserViz.js, has lots of helpful socket
    x: 10,

//----------------------------------------------------------------------------------------------------
setHub: function(newHub) {
   this.hub = newHub;
   },
//----------------------------------------------------------------------------------------------------
sendMessage: function(msg){

   hub.send(msg)
   }, // sendMessage

//----------------------------------------------------------------------------------------------------
addMessageHandlers: function(){

   this.hub.addMessageHandler("ping", this.pong)

   }, // addMessageHandlers
//----------------------------------------------------------------------------------------------------
pong: function(msg){

   return_msg = {cmd: msg.callback, status: "success", callback: "", payload: "pong"};
   sendMessage(return_msg);
   }, // pong

//----------------------------------------------------------------------------------------------------
// called out of the hub once the web page (the DOM) is ready (fully loaded)
initialize: function() {

   console.log("=== STARTING inst/browserCode/src/browservizdemo.js initializeUI");
   $(window).resize(handleWindowResize);
   this.handleWindowResize();
   console.log("=== ending inst/browserCode/src/browservizdemo.js initializeUI");
   },  // initializeUI

//----------------------------------------------------------------------------------------------------
handleWindowResize: function () {

   var plotDiv = $("#browserVizDemoDiv");
   plotDiv.width(0.95 * $(window).width());
   plotDiv.height(0.90 * $(window).height());

   }, // handleWindowResize
//--------------------------------------------------------------------------------
initializeUI: function() {

   console.log("=== STARTING inst/browserCode/src/browservizdemo.js initializeUI");
   console.log("=== ending inst/browserCode/src/browservizdemo.js initializeUI");

   },  // initializeUI
//----------------------------------------------------------------------------------------------------
} //  BrowserVizDemo object

window.bvd = BrowserVizDemo;
window.bvd.self = window.bvd;
bvd.setHub(hub)
hub.init();
bvd.addMessageHandlers()

  // mysteriously:  only by assigning the module function to 'f' can it be
  // successfully passed to the hub and called when the document is ready

var f = bvd.initializeUI;
hub.addOnDocumentReadyFunction(f);
hub.start();
