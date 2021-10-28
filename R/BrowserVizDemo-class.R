library (httpuv)
library (methods)
#----------------------------------------------------------------------------------------------------
#browserVizDemoBrowserFile <- system.file(package="BrowserVizDemoApp", "browserCode", "dist", "bvDemo.html")
appBrowserFile <- NULL

.onLoad <- function(...){
   appBrowserFile <<- system.file(package="BrowserVizDemoApp", "browserCode", "dist", "bvDemo.html")
   }


#----------------------------------------------------------------------------------------------------
.BrowserVizDemo <- setClass ("BrowserVizDemoClass",
                            representation = representation (),
                            contains = "BrowserViz",
                            prototype = prototype (uri="http://localhost", 9000)
                            )

#----------------------------------------------------------------------------------------------------
setGeneric ('ping',  signature='obj', function (obj) standardGeneric ('ping'))
setGeneric ('plot',  signature='obj', function (obj, x, y) standardGeneric ('plot'))
setGeneric ('getSelection',  signature='obj', function (obj) standardGeneric ('getSelection'))
#----------------------------------------------------------------------------------------------------
#setupMessageHandlers <- function()
#{
#   addRMessageHandler("handleResponse", "handleResponse")#
#
# } # setupMessageHandlers
#----------------------------------------------------------------------------------------------------
# constructor
BrowserVizDemo = function(portRange, host="localhost", title="BrowserVizDemo", quiet=TRUE)
{
  .BrowserVizDemo(BrowserViz(portRange, title, browserFile=appBrowserFile, quiet=FALSE))

} # BrowserVizDemo: constructor
#----------------------------------------------------------------------------------------------------
setMethod('ping', 'BrowserVizDemoClass',

  function (obj) {
     send(obj, list(cmd="ping", callback="handleResponse", status="request", payload=""))
     while (!browserResponseReady(obj)){
        wait(obj, 100)
        }
     getBrowserResponse(obj)
     }) # ping

#----------------------------------------------------------------------------------------------------
setMethod('plot', 'BrowserVizDemoClass',

  function (obj, x, y) {
     xMin <- min(x)
     xMax <- max(x)
     yMin <- min(y)
     yMax <- max(y)
     printf("about to puase in BrowserVizDemoApp/BrowserVizDemo-class::plot")
     send(obj, list(cmd="plotxy", callback="handleResponse", status="request",
                    payload=list(x=x, y=y, xMin=xMin, xMax=xMax, yMin=yMin, yMax=yMax)))
     while (!browserResponseReady(obj)){
        if(!obj@quiet) message(sprintf("plot waiting for browser response"));
        wait(obj, 100)
        }
     getBrowserResponse(obj)
     })

#----------------------------------------------------------------------------------------------------
setMethod('getSelection', 'BrowserVizDemoClass',

  function (obj) {
     send(obj, list(cmd="getSelection", callback="handleResponse", status="request", payload=""))
     while (!browserResponseReady(obj)){
        if(!obj@quiet) message(sprintf("getSelection waiting for browser response"));
        wait(obj, 100)
        }
     getBrowserResponse(obj)
     })

#----------------------------------------------------------------------------------------------------
