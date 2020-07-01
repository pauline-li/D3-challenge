var svgWidth = 960;
var svgHeight = 625;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

// initial params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

  // updating x-scale 
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
    d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
    d3.max(censusData, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// for updating xAxis var upon click on X axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
  // for updating xAxis var upon click on Y axis label
function renderYAxes(newYScale, YAxis) {
  var leftAxis = d3.axisLeft(newYScale); 
  YAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function for updating circles group
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
//circleText
function renderText(circleText, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
  return circleText;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {
  console.log("update tool tip", chosenXAxis);
  var label;
 
  // set x and y axis label on tooltip based on selection
  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    label = "Age:";
  }
  else {
    label = "Household Income:";
  }
 
  if (chosenYAxis === "obesity") {
    ylabel = "Obesity:";
  }
  else if (chosenYAxis === "smokes") {
    ylabel = "Smokes:";
  }
  else {
    ylabel = "Lack Healthcare:";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
          if (chosenXAxis === "poverty") {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`); // format poverty prec
          }
          else
          return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`); // format y axis perc
    });
   
  //function chosen x and y tooltip
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

  // parse data/cast as numbers
  censusData.forEach(function (data) {   
    data.poverty = +data.poverty;  // parse as numbers
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.age = +data.age;
    data.abbr = data.abbr;

  });

  // xLinearScale function 
  var xLinearScale = xScale(censusData, chosenXAxis);


  var yLinearScale = yScale(censusData, chosenYAxis);
 
  // Create bottom(x) and left(y) axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append axes to chart
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis); 

  // create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis])) // look at this cx (center x) data point and apply return that x coordinate
    .attr("cy", d => yLinearScale(d[chosenYAxis])) // apply to y coordinate
    .attr("r", "12") // radius
    .attr("class", "stateCircle") //circle color styling clas in d3Style.css
    .attr("opacity", ".9");


  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

 
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

 
  var obesityLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -60))
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -40))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

    var healthcareLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -20))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");  


  //  add text to Circle
  var circleText = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis])) // look at this data point property and apply return that x coordinate
    .attr("y", d => yLinearScale(d[chosenYAxis])) 
    .attr("class", "stateText") // .stateText class in d3Style.css stying for circle text
    .attr("font-size", "9");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () { 
      // get value of selection
      var value = d3.select(this).attr("value");

     if(true){   
      if (value == "poverty" || value=="income" || value=="age") { 
        console.log(value)
        // replaces chosenXAxis with value
        chosenXAxis = value;
      
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

             
        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
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
      else
            
        // replaces chosenXAxis with value
        chosenYAxis = value;
        yLinearScale = yScale(censusData, chosenYAxis);
       
              
        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(chosenYAxis == "healthcare"){
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);  
          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);

        }
        else {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true); 
       }
    
       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

       circleText = renderText(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis); //* update circle text

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    } 
  
  }); 

}).catch(function (error) {
  console.log(error);
});