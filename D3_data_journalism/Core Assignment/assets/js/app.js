var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") // insert chart to tag id "scatter"
  .append("svg") // append svg element
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g") // group, g element
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // purpose of transform is to move screen


// import Data
d3.csv("assets/data/data.csv").then(function (censusData) {


  // parse Data/Cast as numbers
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;  // parse as numbers
    data.healthcare = +data.healthcare;
    data.abbr = data.abbr;

  });

  // create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain(
      [
        d3.min(censusData, d => d.poverty) * 0.8,
        d3.max(censusData, d => d.poverty) * 1.1     // up to 24       


      ])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain(
      [
        d3.min(censusData, d => d.healthcare) * 0.8,
        d3.max(censusData, d => d.healthcare) * 1.1      // up to 28       

      ])
    .range([height, 0]);

  //create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //append axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty)) // cx data point 
    .attr("cy", d => yLinearScale(d.healthcare)) // y coordinate
    .attr("r", "12") // radius
    .attr("class", "stateCircle") //circle color styling on d3Style.css, class .stateCircle
    .attr("opacity", ".9");

  //add text to circle
  var circleText = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty)) // look at poverty property and apply return that x coordinate
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText") // .stateText class in d3Style.css stying for circle text
    .attr("font-size", "9");

  console.log(censusData);

  // Create axes labels
  chartGroup.append("text") // svg text element
    .attr("transform", "rotate(-90)") // transform and rotate y label text 
    .attr("y", 0 - margin.left + 40) // add margin 40 pixels away from the edge
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") // moving text by 1em, centering
    .attr("class", "axisText") // class axisText
    .text("Lack Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText") // attribute fill to change color of text
    .text("In Poverty (%)"); // append to text element
}).catch(function (error) {
  console.log(error);
});