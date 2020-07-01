
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



// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
    d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

//circleText

function renderText(circleText, newXScale, chosenXAxis) {

  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));
  return circleText;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  console.log("update tool tip", chosenXAxis);
  var label;
 
  if (chosenXAxis === "poverty") {
    label = "Poverty %:";
  }
  else if (chosenXAxis === "age") {
    label = "Age:";
  }
  else {
    label = "Household Income:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
          return (`${d.state}<br>${label} ${d[chosenXAxis]}`); //============add chosen
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data,this);
  })
    // on mouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data,this);
    });

  return circlesGroup;
}


// Import Data
d3.csv("assets/data/data.csv").then(function (censusData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  censusData.forEach(function (data) {   // Everything in csv comes in as string
    data.poverty = +data.poverty;  // parse as numbers
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.age = +data.age;
    data.abbr = data.abbr;

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
    .domain(
      [
        d3.min(censusData, d => d.healthcare) * 0.8,
        d3.max(censusData, d => d.healthcare) * 1.1      // up to 28       

      ])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Step 4: Append Axes to the chart
  // ==============================
  var xAxis = chartGroup.append("g")
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
    .attr("cx", d => xLinearScale(d[chosenXAxis])) // look at this cx (center x)data point / hair_lenght property and apply return that x coordinate
    .attr("cy", d => yLinearScale(d.healthcare)) // similiar to above except epply to y coordinate
    .attr("r", "12") // radius
    .attr("class", "stateCircle") //circle color styling on d3Style.css, class .stateCircle
    .attr("opacity", ".9");


  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  //==================
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty %");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");  

  //============Add Text to Circle
  // https://www.freecodecamp.org/forum/t/d3-add-labels-to-scatter-plot-circles/222646
  var circleText = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis])) // look at this data point / poverty property and apply return that x coordinate
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText") // .stateText class in d3Style.css stying for circle text
    .attr("font-size", "9");

  console.log(censusData); //*************** */

  // Create axes labels
  chartGroup.append("text") // svg text element
    .attr("transform", "rotate(-90)") // for y axis...bottom of line is against y axis
    .attr("y", 0 - margin.left + 40) // subtracting margin left and add 40, 40 pixels away from the edge
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") // moving the text by 1em...centering
    .attr("class", "axisText") // class is axisText
    .text("Lack Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");

      if (value == "poverty" || value=="income" || value=="age") {
        console.log(value)
        // replaces chosenXAxis with value
        chosenXAxis = value;

      
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        circleText = renderText(circleText, xLinearScale, chosenXAxis); //* update circle text




        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(chosenXAxis == "age"){
          ageLabel
          .classed("active", true)
          .classed("inactive", false);  
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);

        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
      }
    });

}).catch(function (error) {
  console.log(error);
});

