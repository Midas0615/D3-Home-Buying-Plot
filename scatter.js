var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

//Define Color
//var colors = d3.scaleOrdinal(d3.schemeCategory10);
//console.log(colors);

//Color scales for each Country    
var Alameda = d3.scaleLinear()
  .domain([15,150])
  .range(["#fed98e", "#cc4c02"]);
    
var San_Mateo = d3.scaleLinear()
  .domain([20,150])
  .range(["#bdc9e1", "#0570b0"]);

var Santa_Clara = d3.scaleLinear()
  .domain([30,160])
  .range(["#bae4b3", "#238b45"]);

// var SouthA = d3.scaleLinear()
//   .domain([57,64])
//   .range(["#fbb4b9", "#ae017e"]);

// var Australia = d3.scaleLinear()
//   .domain([200,270])
//   .range(["#9e9ac8", "#54278f"]);  
       
/*    
var temp = color("Asia");
console.log(temp[2]);    
*/
    
//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var xScale = d3.scaleLinear()
    .domain([0,16]) //Need to redefine this after loading the data
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0,15]) //Need to redfine this after loading the data
    .range([height, 0]);
    
//Define Tooltip here
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);    
    
//Define Axis
var xAxis = d3.axisBottom(xScale).tickPadding(2).tickSize(-height);
var yAxis = d3.axisLeft(yScale).tickPadding(2).tickSize(-width);
    
//Append Axes first so the circles appear above the grid lines   
//X-axis        
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
//Label for X-axis    
svg.append("text")
    .attr("class", "label")
    .attr("y", height + 30)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Median Price(1/2) (in 10 thousand US Dollars)");
    
//Y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
    
//Label for Y-axis
svg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -50)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("font-size", "12px")
    .text("Average Elementary School Score");
    
//Defining Zooming behaviour
// var zoom = d3.zoom().scaleExtent([0.5, 2]).on("zoom", zoomed);  
// svg.call(zoom);
        
d3.json("demo.json", function(data) {
});

//Reading data from two files and combining them    
d3.csv("continent.csv", function (contset){
    d3.csv("scatterdata.csv", function(scatterdataset){
    for (var i = 0; i < scatterdataset.length; i++){
            var City = scatterdataset[i].City;

            for (var j = 0; j <scatterdataset.length; j++){
                
                if (contset[j].City == City){
                scatterdataset[i].Country = contset[j].Country;
                }
            }  
        }
        
    // var title = svg.append("text")
    //     .text("Energy Consumption, 2010")
    //     .attr("x", width/2-margin.right-35)
    //     .attr("y", margin.top/4-30)
    //     .attr("font-size","20px")
    //     .attr("font-weight","bold").attr("fill","steelblue");    

    //Draw circles using the data    
    //.attr("class","circle-container")

    console.log(scatterdataset);

        svg.selectAll(".dot")
        .data(scatterdataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.wscore)/.5;})
        .attr("cx", function(d) {return xScale(d.median_price/200000);})
        .attr("cy", function(d) {return yScale(d.sscore);})
        .style("fill", function (d) {
                            if (d.Country=="Alameda"){return Alameda(d.population/1000);}
                            else if (d.Country=="San Mateo"){return San_Mateo(d.population/1000);}
                            else{return Santa_Clara(d.population/1000);}})
                            // else if (d.continent=="South America"){return SouthA(d.ecc);}
                            // else{return Australia(d.ecc);}})
        .on("mouseover", function(d) {
            div.html("<b>"+d.City + "</b><br>"+"City: "+ d.City +"<br>" + "Population: "+ d.population +"<br>" + "Median Price: $" + d.median_price +"<br>"+ "Average Elementary School Score: "+ d.sscore + "<br>"+"Walkscore: "+ d.wscore)
                .transition()		
                .duration(200).ease(d3.easeLinear)		
                .style("opacity", .9)
                .style("left", (d3.event.pageX+20) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
                
            d3.select(this).attr("stroke","yellow").attr("stroke-width","3px");            
            })
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
                
                d3.select(this).attr("stroke","orange").attr("stroke-width","0px");
            
        });
        
        //Write City names
        svg.selectAll(".text")
            .data(scatterdataset)
            .enter().append("text")
            .attr("class","text")
            .style("text-anchor", "start")
            .attr("x", function(d) {return xScale(d.median_price/200000)-(Math.sqrt(d.wscore)/.5-10);})
            .attr("y", function(d) {return yScale(d.sscore)-(Math.sqrt(d.wscore)/.5)-2;})
            .style("fill", "#757a82")
            .attr("font-weight", "bold")
            .text(function (d) {return d.City;});
        
        
        /*svg.select(".circle-container").selectAll(".dot").data(scatterdataset).enter()
            .append("text")
            .attr("class", "dot")
            .attr("x", function(d) {return xScale(d.gdp);})
            .attr("y", function(d) {return yScale(d.ecc);})
            .text("test");
        */
       //Legend and stuff    
        svg.append("rect")
            .attr("x", width-190)
            .attr("y", height-190)
            .attr("width", 120)
            .attr("height", 160)
            .style("stroke-width", "2px")
            .style("stroke","#ddd");

        svg.append("circle")
            .attr("r", 2)
            .attr("cx", width-115)
            .attr("cy", height-175)
            .style("fill", "darkgrey");

        svg.append("circle")
            .attr("r", 6)
            .attr("cx", width-115)
            .attr("cy", height-150)
            .style("fill", "darkgrey");

        svg.append("circle")
            .attr("r", 16)
            .attr("cx", width-115)
            .attr("cy", height-100)
            .style("fill", "darkgrey");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -140)
            .attr("y", height-172)
            .style("text-anchor", "end")
            .text("10");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -140)
            .attr("y", height-147)
            .style("text-anchor", "end")     
            .text("30");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -140)
            .attr("y", height-95) 
            .style("text-anchor", "end")
            .text("80");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -130)
            .attr("y", height-50)
            .style("text-anchor", "middle")
            .style("fill", "Green") 
            .attr("font-size", "16px")
            .text("Walkscore");
    });
}); 

var clipper = svg.append("clipPath")
            .attr("id","clipper").append("rect")
            .attr("x", -22)
            .attr("y", -10)
            .attr("width", 830)
            .attr("height", 420); 

function zoomed(){
                 
    console.log(this);
    //Redrawing the circles    
    svg.selectAll(".dot").attr("transform", d3.event.transform);
    
    //d3.select(this).selectAll(".dot").attr("clip-path","url(#clipper)");
    
    svg.selectAll(".text").attr("transform", d3.event.transform);
    //var transform = svg.selectAll(".dot").getAttribute("transform");
    
    //Redrawing the axes with redifined scales
    svg.select(".x.axis")
        .call(xAxis.scale(d3.event.transform.rescaleX(xScale)))        
    svg.select(".y.axis")
        .call(yAxis.scale(d3.event.transform.rescaleY(yScale)));           
}   
    
//Legend for colours    
// draw legend colored rectangles
var svgLegend = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height/4 + margin.top + margin.bottom-80)
    .append("g")
    .attr("transform", "translate(" + (margin.left + 150) + "," + -20 + ")");   
       
svgLegend.append("text").text("2018 Estimated Population").attr("x", width/2-200).attr("y",140).attr("font-size","11px");

svgLegend.append("g")
  .attr("class", "legendAsia")
  .attr("transform", "translate(20,70)")
  .append("text");

var legendAsia = d3.legendColor()
  .title("Alameda (Uint:1000)")
  .shapeWidth(25).shapePadding(0)
  .orient('horizontal')
  .labelFormat(d3.format(".0f"))
  .scale(Alameda.nice());

svgLegend.select(".legendAsia")
  .call(legendAsia);  
svgLegend.append("g")
  .attr("class", "legendEurope")
  .attr("transform", "translate(160,70)")
  .append("text");

var legendEurope = d3.legendColor()
  .title("San Mateo (Uint:1000)")
  .shapeWidth(25).shapePadding(0)
  .orient('horizontal').labelFormat(d3.format(".0f"))
  .scale(San_Mateo.nice());

svgLegend.select(".legendEurope")
  .call(legendEurope);
    
svgLegend.append("g")
  .attr("class", "legendNA")
  .attr("transform", "translate(300,70)")
  .append("text");

var legendNA = d3.legendColor()
  .title("Santa Clara (Uint:1000)")
  .shapeWidth(25).shapePadding(0)
  .orient('horizontal')
  .labelFormat(d3.format(".0f"))
  .scale(Santa_Clara.nice());

svgLegend.select(".legendNA")
  .call(legendNA);
    
// svgLegend.append("g")
//   .attr("class", "legendSA")
//   .attr("transform", "translate(440,70)")
//   .append("text");
    
// var legendSA = d3.legendColor()
//   .title("South America")
//   .shapeWidth(25).shapePadding(0)
//   .orient('horizontal').labelFormat(d3.format(".0f"))
//   .scale(SouthA.nice());

// svgLegend.select(".legendSA")
//   .call(legendSA);  
    
// svgLegend.append("g")
//   .attr("class", "legendAus")
//   .attr("transform", "translate(580,70)")
//   .append("text");

// var legendAus = d3.legendColor()
//   .title("Australia")
//   .shapeWidth(25).shapePadding(0)
//   .orient('horizontal')
//   .labelFormat(d3.format(".0f"))
//   .scale(Australia.nice());

// svgLegend.select(".legendAus")
//   .call(legendAus);         
      
/*
var circles = svg.append('circle')
    .attr("id","circles")
    .attr("cx", x(150))
    .attr("cy", y(150))
    .attr('r', 4)
    .call(zoom)      
  */  

/*function zoomed() {
  
    // Defining new Scales
    var new_xScale = d3.event.transform.rescaleX(x);
    var new_yScale = d3.event.transform.rescaleY(y);   
    
    //calling new axis
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
    
    //Redrawing the circle
    svg.selectAll(".dot").attr("transform", d3.event.transform);
}*/