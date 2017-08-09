import css from "./css/browservizdemo.css";
var hub = require("browservizjs")
//----------------------------------------------------------------------------------------------------
var BrowserVizDemo = (function(){

    var self;
    var hub;                     // defined in BrowserViz.js, has lots of helpful socket
    var x= 10;

//----------------------------------------------------------------------------------------------------
function setHub(self, newHub) {
   self.hub = newHub;
   }
//----------------------------------------------------------------------------------------------------
function sendMessage(self, msg){
   self.hub.send(msg)
   } // sendMessage

//----------------------------------------------------------------------------------------------------
function addMessageHandlers(self){

   self.hub.addMessageHandler("ping", this.pong)

   } // addMessageHandlers
//----------------------------------------------------------------------------------------------------
function pong(self,msg){

   return_msg = {cmd: msg.callback, status: "success", callback: "", payload: "pong"};
   self.sendMessage(return_msg);
   } // pong

//----------------------------------------------------------------------------------------------------
// called out of the hub once the web page (the DOM) is ready (fully loaded)
function init(self) {

   console.log("=== STARTING inst/browserCode/src/browservizdemo.js init");
   console.log("incoming self")
    console.log(self);
   $(window).resize(handleWindowResize);
   self.handleWindowResize();
   console.log("=== ending inst/browserCode/src/browservizdemo.js initializeUI");
   }  // init

//----------------------------------------------------------------------------------------------------
function handleWindowResize () {

   var plotDiv = $("#browserVizDemoDiv");
   plotDiv.width(0.95 * $(window).width());
   plotDiv.height(0.90 * $(window).height());

   } // handleWindowResize
//--------------------------------------------------------------------------------
return({
    init: init,
    setHub: setHub,
    sendMessage: sendMessage,
    addMessageHandlers: addMessageHandlers,
    handleWindowResize: handleWindowResize,
    pong: pong
    })
//--------------------------------------------------------------------------------
}); //  BrowserVizDemo object

window.bvd = BrowserVizDemo()
bvd.setHub(bvd, hub)
console.log("bvd main, bvd: ");
console.log(bvd)
hub.init(bvd);
bvd.addMessageHandlers(bvd)

  // mysteriously:  only by assigning the module function to 'f' can it be
  // successfully passed to the hub and called when the document is ready

var f = bvd.init;
hub.addOnDocumentReadyFunction(f);
hub.start();
