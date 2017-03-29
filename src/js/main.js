$( document ).ready(function() {

var colour1 = "#3100EC";
var colour2 = "#B19FF8";
var lineOpacity = 0.1;


var sectionWidth = d3.select('.graph-section').style("width").replace('px','') - 100;
var sectionHeight = d3.select('.graph-section').style("height").replace('px','') - 120;

//set max width
if (sectionWidth > 750) { sectionWidth = 750};

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 50, bottom: 20, left: 50},
    width = sectionWidth - margin.left - margin.right,
    height = sectionHeight - margin.top - margin.bottom;

// Parse the set / time
// var parseset = d3.time.format("%b %Y").parse;

// Set the ranges
var x = d3.scaleLinear().range([35, (width - 35)]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5)
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickPadding(10);

// Define the line
var scoreline = d3.line() 
    .x(function(d) { return x(d.set); })
    .y(function(d) { return y(d.score); });
    
// Adds the svg canvas
var svg = d3.select("#graph-wrap")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/data-1.csv",function(error,data) {

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.set; }));
    y.domain([14, 46]);
    // y.domain([15, d3.max(data, function(d) { return d.score; })]);

    // Nest the entries by name
    var dataNest = d3.nest()
        .key(function(d) {return d.name;})
        .entries(data);

    // set the colour scale
    // var color = d3.scaleOrdinal(d3.schemeCategory10);   


    // Loop through each name / key
    dataNest.forEach(function(d,i) { 

        //Add the line
        svg.append("path")
            .attr("class", "line")
            .style("stroke", colour1 )
            .style("stroke-width", 2)
            .style("opacity", lineOpacity)
            .attr("id", 'line'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", scoreline(d.values));

        //add data-circles
        for (i = 0; i < 4; i++) {  
            svg.append("circle")
              .attr("cx", function() { return x(d.values[i].set); })
              .attr("cy",function() { return y(d.values[i].score); })
              .attr("r",function() {return 5})
              .style("fill", "#fff")
              .style("stroke", colour1 )
              .style("stroke-width", 2)
              .style("opacity", lineOpacity)
              .attr("class", 'point'+d.key.replace(/\s+/g, '')) // assign ID
        }


        // Add the Legend (circle, text, cover circle)
        svg.append("circle")
          .attr("cx", (width + 30) )
          .attr("cy", function() {return y(d.values[3].score)})
          .attr("r", "20")
          .style("fill", colour1)
          .style("opacity", lineOpacity)
          .attr("id", 'legCirc'+d.key.replace(/\s+/g, '')) // assign ID
    

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", (width + 30) )  // space legend
            .attr("y", function() {return ( y(d.values[3].score) + 5 )})
            .attr("class", "legend")    // style the legend
            .style("fill", "white" )
            .text(d.key)
            .attr("id", 'legTxt'+d.key.replace(/\s+/g, '')) // assign ID

        //opaque wrap over the text and circle 
        svg.append("circle")
          .attr("cx", (width + 30) )
          .attr("cy", function() {return y(d.values[3].score)})
          .attr("r", "20")
          .style("opacity", "0")
          .on("click", function(){ hideClicked(d); })
          .attr("class", "pointer")
          .on("mouseover", function(){ 
            hideClicked(d)
          })
          .on("mouseout", function(){ 
            hideClicked(d)
          })


        



          
         


    });

    // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


}); //END D3 DATA FUNCTION


// function activeLine(d) {
//   // Determine if current line is visible 
//   var active   = d.active ? false : true,
//   newOpacity = active ? colour1 : colour2; 
//   // Hide or show the elements based on the ID
//   d3.select("#line"+d.key.replace(/\s+/g, ''))
//       .transition().duration(100) 
//       .style("stroke", newOpacity )

//   d3.selectAll(".point"+d.key.replace(/\s+/g, ''))
//       .transition().duration(100) 
//       .style("stroke", newOpacity ) 
//   // Upset whether or not the elements are active
//   d.active = active;
// }

function hideClicked(d) {
  // Determine if current line is visible 
  var active   = d.active ? false : true,
  newOpacity = active ? 1 : lineOpacity; 

  // Hide or show the elements based on the ID
  d3.select("#line"+d.key.replace(/\s+/g, ''))
      .transition().duration(100) 
      .style("opacity", newOpacity); 

  d3.selectAll(".point"+d.key.replace(/\s+/g, ''))
      .transition().duration(100) 
      .style("opacity", newOpacity);

  d3.select("#legCirc"+d.key.replace(/\s+/g, ''))
      .transition().duration(100) 
      .style("opacity", newOpacity); 

  // Set whether or not the elements are active
  d.active = active;
}


















  



  // var width = 500,
  //     height = 500,
  //     margin = 50;

  // var svg = d3.select("#graph-wrap").append("svg").attr("width", width).attr("height", height);
  // var x = d3.scaleLinear().domain([0, 5]).range([margin, width - margin]);
  // var y = d3.scaleLinear().domain([15, 45]).range([height - margin, margin]);
  // var r = d3.scaleLinear().domain([0, 500]).range([0, 20]);
  

  // console.log(x(20))

  // var xAxis = d3.axisBottom()
  //   .scale(x)

  // var yAxis = d3.axisLeft()
  //   .scale(y)

  // svg.append("g")
  //   .attr("class", "axis")
  //   .attr("transform", "translate(0," + (height - margin) + ")")
  //   .call(xAxis);

  // svg.append("g")
  //   .attr("class", "axis")
  //   .attr("transform", "translate(" + margin + ",0)")
  //   .call(yAxis);

  // svg.selectAll(".h").data(d3.range(-8, 10, 2)).enter()
  //   .append("line").classed("h", 1)
  //   .attr("x1", margin).attr("x2", height - margin)
  //   .attr("y1", y).attr("y2", y)

  // svg.selectAll(".v").data(d3.range(1, 5)).enter()
  //   .append("line").classed("v", 1)
  //   .attr("y1", margin).attr("y2", width - margin)
  //   .attr("x1", x).attr("x2", x)



  // d3.csv("data/data-1.csv",function(csv) {
  //   console.log(csv.clarifier);

  //   // then we create the marks, which we put in an initial position
     
  //     svg.selectAll("circle").data(csv).enter()
  //       .append("circle")
  //       .attr("cx",function(d) {return x(0);})
  //       .attr("cy",function(d) {return y(0);})
  //       .attr("r",function(d) {return r(0);})
     
  //       .style("fill", 'blue')
  //       // .style("opacity",function(d) {return o(+d.GDPcap);})
     
  //         // .append("title")
  //         // .text(function(d) {return d.country;})
       
  //     // now we initiate - moving the marks to their position
     
  //     svg.selectAll("circle").transition().duration(1000)
  //       .attr("cx",function(d) {return y(d.clarifier);})
  //       .attr("cy",function(d) {return y(d.clarifier);})
  //       .attr("r", '50')
  //   })















  // var parseTime = d3.timeParse("%Y");






});   //close document.ready