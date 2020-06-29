
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

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") // insert chart to tag id "scatter"
  .append("svg") // append svg element
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g") // group, g element
    .attr("height", height)
    .attr("width", width)
    .attr("transform", `translate(${margin.left}, ${margin.top})`); // purpose of transform is to move screen
    // translate is the....transform = "translate(x, y)"     


// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

   
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {   // Everything in csv comes in as string
      data.poverty = +data.poverty;  // parse as numbers
      data.healthcare = +data.healthcare;
      data.abbr = data.abbr;
   
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain(
          [
              d3.min(censusData, d => d.poverty)  * 0.8,
              d3.max(censusData, d => d.poverty)  * 1.1     // up to 24       
              
              
          ])  
    // x LINEAR scale for scatter plots..where data coming in
    //   .domain([8, d3.max(censusData, d => d.poverty)])  ***work
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain(
        [
        d3.min(censusData, d => d.healthcare)  * 0.8,
        d3.max(censusData, d => d.healthcare)  * 1.1      // up to 28       
        
        
        ]) 
    //   .domain(d3.extent(censusData, d => d.healthcare)) //y LINEAR scale for scatter plots
    //   .domain([0, d3.max(censusData, d => d.healthcare)]   ***work
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty)) // look at this cx (center x)data point / hair_lenght property and apply return that x coordinate
    .attr("cy", d => yLinearScale(d.healthcare)) // similiar to above except epply to y coordinate
    .attr("r", "12") // radius
    .attr("class","stateCircle") //circle color styling on d3Style.css, class .stateCircle
    .attr("opacity", ".9");

    //============Add Test to Circle
    // https://www.freecodecamp.org/forum/t/d3-add-labels-to-scatter-plot-circles/222646
    var circleText = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty)) // look at this data point / poverty property and apply return that x coordinate
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class","stateText") // .stateText class in d3Style.css stying for circle text
    .attr("font-size","9");
  

    console.log(censusData); //*************** */

    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60]) // so we don't want to interfere with our mouse when mouseover
    //   .html(function(d) { // use data bound and return the below string
    //     return (`${d.abbr}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
    //   });

    // Step 7: Create tooltip in the chart
    // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function(data) { // when click run this anonymous function
    //   toolTip.show(data, this); // make toolTip to show
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) { // event listener
    //     toolTip.hide(data); // when mouse out event hide tooltop
    //   });

    // Create axes labels
    chartGroup.append("text") // svg text element
      .attr("transform", "rotate(-90)") // for y axis...bottom of line is against y axis
      .attr("y", 0 - margin.left + 40) // subtracting margin left and add 40, 40 pixels away from the edge
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em") // moving the text by 1em...centering
      .attr("class", "axisText") // class is axisText
      .text("Lack Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText") // axisText is in css...us attribute fill to change color of text...example fill: #55aaf...no line breaking
      .text("In Poverty (%)"); // append to text element....
  }).catch(function(error) {
    console.log(error);
  });

