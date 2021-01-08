//Define variables
var weather = [];
var days = [];
var times = [];
var svg;
//Define chart dimensions
var margin;
var width;
var height;
//on Document load, fetch the required data
document.addEventListener("DOMContentLoaded", function () {
  d3.json(
    "http://api.openweathermap.org/data/2.5/forecast?zip=85281,us&APPID=a4aad1be82f76940d5c8d122e1bd834b&units=imperial",
    function (data) {
      console.log(data.list);
      weather = data.list;
      //Format the data as needed for heatmap

      //Attach the main svg to our chard id in index.html
      svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", 100) //Plugin your height & width
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(10,10)"); //translate as per your dimensions

      //Invoke the function which plots the heatmap
      heatmap();

      //Define tooltip
    }
  );
});

function heatmap() {
  //Get the value of colorscale selected to use it
  let colorvalue = document.getElementById("color-scale-select").value;
  console.log("Selected color value is, ", colorvalue);

  // Build X scales and axis:

  // Build Y scales and axis:

  // Build color scale

  // Make the tooltip work with the events
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    //Code for mouseover
  };
  var mousemove = function (d) {
    //Code for mousemove
  };
  var mouseleave = function (d) {
    //Code for mouseleave
  };

  // add the squares for the heatmap

  // Add title to graph

  // Add subtitle to graph

  //Created legend and add to svg
}
