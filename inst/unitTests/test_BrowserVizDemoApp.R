library(RUnit)
library(BrowserVizDemoApp)
#--------------------------------------------------------------------------------
PORT.RANGE <- 8000:8020
#--------------------------------------------------------------------------------
runTests <- function()
{
  testConstructor();
  testWindowTitle()
  testPlot()

} # runTests
#--------------------------------------------------------------------------------
testConstructor <- function()
{
   print("--- testConstructor")
   app <- BrowserVizDemo(PORT.RANGE, quiet=FALSE);
   openBrowser(app)

   checkTrue(ready(app))
   checkTrue(port(app) %in% PORT.RANGE)
   closeWebSocket(app)

} # testConstructor
#--------------------------------------------------------------------------------
testWindowTitle <- function()
{
   print("--- testWindowTitle")
   app <- BrowserVizDemo(PORT.RANGE)
   openBrowser(app)
   checkTrue(ready(app))
   checkEquals(getBrowserWindowTitle(app), "")
   setBrowserWindowTitle(app, "new title");
   checkEquals(getBrowserWindowTitle(app), "new title")
   closeWebSocket(app)

} # testWindowTitle
#--------------------------------------------------------------------------------
testPlot <- function()
{
   print("--- testPlot")
   app <- BrowserVizDemo(PORT.RANGE)
   openBrowser(app)
   checkTrue(ready(app))

   title <- "simple xy plot test";
   setBrowserWindowTitle(app, title)
   checkEquals(getBrowserWindowTitle(app), title)

   checkEquals(getSelection(app), list())

   plot(app, 1:10, (1:10)^2)

     # without direct manipulation of the plotted surface byt the user, there
     # will still be no selections

   checkEquals(getSelection(app), list())
   closeWebSocket(app)

} # testPlot
#--------------------------------------------------------------------------------
demo <- function()
{
   print("--- testPlot")
   app <- BrowserVizDemo(PORT.RANGE)
   checkTrue(ready(app))
   ping(app)
   checkEquals(ping(app), "pong")

   title <- "simple xy plot test";
   setBrowserWindowTitle(app, title)
   checkEquals(getBrowserWindowTitle(app), title)

   plot(app, 1:5, (1:5)^2)

     # without direct manipulation of the plotted surface by the user, there
     # will still be no selections

   getSelection(app)

   app

} # demo
#--------------------------------------------------------------------------------
if(!interactive())
    runTests()
