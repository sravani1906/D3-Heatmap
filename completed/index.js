//Define variables
var weather = [];
var days = [];
var times = [];
var tooltip;
var svg;
//Define chart dimensions
var margin = { top: 80, right: 25, bottom: 100, left: 200 },
  width = 750 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;
//on Document load, fetch the required data
document.addEventListener("DOMContentLoaded", function () {
  d3.json(
    "http://api.openweathermap.org/data/2.5/forecast?zip=85281,us&APPID=a4aad1be82f76940d5c8d122e1bd834b&units=imperial",
    function (data) {
      console.log(data.list);
      result = data.list;
      //Format the data as needed for heatmap
      weather = result.map(function (d) {
        let date = new Date(d["dt_txt"]);
        return {
          day: date.getDate(),
          hour: date.getHours(),
          value: d["main"]["temp"],
        };
      });
      //Getting keys needed for plotting axes
      days = weather.map((d) => d.day);
      days = [...new Set(days)];
      times = weather.map((d) => d.hour);
      times = [...new Set(times)];
      //console.log("Weather", weather, days, times);
      //Attach the main svg to our chard id in index.html
      svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //Invoke the function which plots the heatmap
      heatmap();
      //Define tooltip
      tooltip = d3
        .select("#wrapper")
        .append("g")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    }
  );
});

function heatmap() {
  //Remove previously plotted defs for legend
  svg.select("defs").remove();
  svg.select(".x-axis").remove();

  //Get the value of colorscale selected to use it
  let colorvalue =
    document.getElementById("color-scale-select").value || "interpolateOranges";
  let colorScheme = "";
  switch (colorvalue) {
    case "interpolateOranges":
      colorScheme = d3.interpolateOranges;
      break;
    case "interpolateReds":
      colorScheme = d3.interpolateReds;
      break;
    case "interpolateBlues":
      colorScheme = d3.interpolateBlues;
      break;
    case "interpolateOrRd":
      colorScheme = d3.interpolateOrRd;
      break;
    case "interpolatePuBuGn":
      colorScheme = d3.interpolatePuBuGn;
      break;
    default:
      colorScheme = d3.interpolateOranges;
      break;
  }

  // Build X scales and axis:
  var x = d3.scaleBand().range([0, width]).domain(times).padding(0.05);
  svg
    .append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

  // Build Y scales and axis:
  var y = d3.scaleBand().range([height, 0]).domain(days).padding(0.05);
  svg
    .append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain")
    .remove();

  // Build color scale
  var myColor = d3
    .scaleSequential()
    .interpolator(colorScheme)
    .domain([
      d3.min(weather, function (d) {
        return d.value;
      }),
      d3.max(weather, function (d) {
        return d.value;
      }),
    ]);

  // Make the tooltip wotk with the events
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "grey").style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .html("Temperature: " + d.value + "F")
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // add the squares for the heatmap
  svg
    .selectAll()
    .data(weather, function (d) {
      return d.day + ":" + d.hour;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.hour);
    })
    .attr("y", function (d) {
      return y(d.day);
    })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Add title to graph
  svg
    .append("text")
    .attr("x", 140)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("Weather forecast heatmap");

  // Add subtitle to graph
  svg
    .append("text")
    .attr("x", 120)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "grey")
    .style("max-width", 400)
    .text("5 day Tempe weather forcast in 3hr intervals");

  //Add legend
  const defs = svg.append("defs");
  let barHeight = 20;
  let axisScale = d3.scaleLinear().domain(myColor.domain()).range([0, width]);
  let axisBottom = (g) =>
    g
      .attr("class", `x-axis`)
      .attr("transform", `translate(0,${height + margin.bottom / 2})`)
      .call(
        d3
          .axisBottom(axisScale)
          .ticks(width / 80)
          .tickSize(-barHeight)
      );

  const linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient");

  linearGradient
    .selectAll("stop")
    .data(
      myColor.ticks().map((t, i, n) => ({
        offset: `${(100 * i) / n.length}%`,
        color: myColor(t),
      }))
    )
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr("stop-color", (d) => d.color);
  //Adding created legend to svg
  svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0,${height + margin.bottom / 2 - barHeight})`)
    .append("rect")
    .attr("transform", `translate(0, 0)`)
    .attr("width", width)
    .attr("height", barHeight)
    .style("fill", "url(#linear-gradient)");

  svg
    .append("g")
    .call(axisBottom)
    .style("color", "white")
    .selectAll(".tick text")
    .attr("fill", "black");
}
