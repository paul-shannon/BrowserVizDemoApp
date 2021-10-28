bvd_version = "1.0.2"
//----------------------------------------------------------------------------------------------------
var BrowserVizDemo = (function(hub){

   var plotDiv;
   var d3plotDiv;
   var selectedRegion;          // assigned out of brushReader function
   var dataReceived = false;    // when true, window resize does replot of data
   var dataset;                 // assigned from payload of incoming plotxy message
   var xMin, xMax, yMin, yMax;  // conveniently calculated in R, part of payload
   var datasetLength;

   var hub = hub;               // defined in BrowserViz.js, has lots of helpful socket
                                // and message support
   var bvDemo;                  // this simple webapp
   var selectedRegion = [];     // updated when a region of the plotting surface is brushed
   var selectedNames = [];

//----------------------------------------------------------------------------------------------------
function setHub(newHub)
{
   hub = newHub;

} // setHub
//----------------------------------------------------------------------------------------------------
function addMessageHandlers()
{
   hub.addMessageHandler("ping", ping)
   hub.addMessageHandler("plotxy", d3plotPrep)
   hub.addMessageHandler("getSelection", getSelection)

} // addMessageHandlers
//----------------------------------------------------------------------------------------------------
// called out of the hub once the web page (the DOM) is ready (fully loaded)
function initializeUI()
{
   plotDiv = $("#bvDemoDiv");
   d3plotDiv = d3.select("#bvDemoDiv");
   console.log("div: " + plotDiv)
   $(window).resize(handleWindowResize);
   handleWindowResize();

}  // initializeUI
//----------------------------------------------------------------------------------------------------
function handleWindowResize ()
{
   plotDiv.width(0.95 * $(window).width());
   plotDiv.height(0.90 * $(window).height());

      // an easy way to rescale the canvas when the browser window size changes: just redraw
   if(dataReceived)
      d3plot(dataset, xMin, xMax, yMin, yMax);

} // handleWindowResize
//--------------------------------------------------------------------------------
function brushReader(event)
{
   console.log("brushReader");
   console.log(event.selection);

   selectedRegion = event.selection;
   selectedNames = [];

   if(selectedRegion == null){
      return;
      }
	
   x0 = xScale.invert(selectedRegion[0][0]);
   x1 = xScale.invert(selectedRegion[1][0]);
     // allow for upside down (anti-cartesian) y coordinate
   y0 = yScale.invert(selectedRegion[1][1]);
   y1 = yScale.invert(selectedRegion[0][1]);

   console.log("x:  " + x0 + " - " + x1);
   console.log("y:  " + y0 + " - " + y1);
  
   for(var i=0; i < dataset.length; i++){
      var x = dataset[i].x;
      var y = dataset[i].y;
      console.log("checking [" + x + ", " + y + "]");
      if(x >= x0 & x <= x1 & y >= y0 & y <= y1) {
        console.log ("TRUE");
        selectedNames.push("point " + i);
        }
     } // for i

   console.log(" found " + selectedNames.length + " selected points");

}; // brushReader
//--------------------------------------------------------------------------------
function d3plotPrep (msg)
{
   payload = msg.payload;
   dataReceived = true;
   console.log("--- d3plotPrep, incoming dataset")
   console.log(msg)
   console.log(payload.x)

      // assign global variables
   dataset = [];
   datasetLength = payload.x.length
   console.log("-- assigning dataset")

   for(var i=0; i < datasetLength; i++){
     dataset.push({x: payload.x[i], y: payload.y[i]});
     }

   xMin = msg.payload.xMin;
   xMax = msg.payload.xMax;
   yMin = msg.payload.yMin;
   yMax = msg.payload.yMax;

   d3plot(dataset, xMin, xMax, yMin, yMax)

   if(msg.callback != null){
      var return_msg = {cmd: msg.callback, status: "success", callback: "", payload: ""};
      hub.send(return_msg);
      }

} // d3plotPrep
//--------------------------------------------------------------------------------
function d3plot(dataset, xMin, xMax, yMin, yMax)
{
  var width = plotDiv.width();
  var height = plotDiv.height();

  padding = 50;
  console.log("xMin: " + xMin);
  console.log("xMax: " + xMax);    
  console.log("yMin: " + yMin);
  console.log("yMax: " + yMax);    

  xScale = d3.scaleLinear()
                 .domain([xMin,xMax])
                 .range([padding,width-padding]);

  yScale = d3.scaleLinear()
                 .domain([yMin, yMax])
                 .range([height-padding, padding]); // note inversion



    // must remove the svg from a d3-selected object, not just a jQuery object
  d3plotDiv.select("#plotSVG").remove();  // so that append("svg") is not cumulative

  brush = d3.brush()
    .on("end", brushReader);

  var svg = d3.select("#bvDemoDiv")
      .append("svg")
      .attr("id", "plotSVG")
      .attr("width", width)
      .attr("height", height)
      .call(brush);

   const xAxis = d3.axisBottom()
         .scale(this.xScale);

   const yAxis = d3.axisLeft()
         .scale(this.yScale)


  var tooltip = d3plotDiv.append("div")
                   .attr("class", "tooltip")
                   .style("position", "absolute")
                   .style("z-index", "10")
                   .style("visibility", "hidden")
                   .text("a simple tooltip");

   svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d){
         return xScale(d.x);
        })
      .attr("cy", function(d){
         return yScale(d.y);
         })
      .attr("r", function(d){
        return 5;
        })
      .style("fill", function(d){
        return "red";
        })
      .on("mouseover", function(d,i){   // no id assigned yet...
         tooltip.text(d.id);
         return tooltip.style("visibility", "visible");
         })
      .on("mousemove", function(){
         return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

} // d3plot
//--------------------------------------------------------------------------------
function ping(msg)
{
   console.log("--- bvDemo.js responding now to ping")
   console.log(msg)
   var returnMsg = {cmd: msg.callback, callback: "", status: "success",
                    payload: "pong"};
   console.log("---- hub")
   console.log(hub)
   hub.send(returnMsg);

} // ping
//--------------------------------------------------------------------------------
function getSelection(msg)
{
   var returnMsg = {cmd: msg.callback, callback: "", status: "success",
                    payload: selectedNames};

   console.log("=== returning from getSelection, 2");
   console.log(returnMsg);
   hub.send(returnMsg);

} // getSelection
//--------------------------------------------------------------------------------

  return({
    setHub: setHub,
    addMessageHandlers: addMessageHandlers,
    initializeUI: initializeUI,
    plotxy: d3plotPrep
    });

}); // BrowserVizDemo
//--------------------------------------------------------------------------------
function test_app()
{
   console.log("--- direct (w/o R) testing bvDemoApp.js");
   msg = {"cmd":"plotxy",
          "callback": null,
          "status":"request",
          "payload":{"x":[1,2,3,4,5],
                     "y":[1,4,9,16,25],
                     "xMin":1,"xMax":5,"yMin":1,"yMax":25}}
   bvDemo.plotxy(msg);
    
} // test_app
//--------------------------------------------------------------------------------
console.log("--- executing bvDemo.js")
hub = BrowserViz;
bvDemo = BrowserVizDemo();
bvDemo.setHub(hub)
bvDemo.addMessageHandlers()

  // mysteriously:  only by assigning the module function to 'f' can it be
  // successfully passed to the hub and called when the document is ready

var f = bvDemo.initializeUI;
hub.addOnDocumentReadyFunction(f);
hub.start();

//--------------------------------------------------------------------------------
