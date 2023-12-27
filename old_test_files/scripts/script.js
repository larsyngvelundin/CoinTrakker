console.log("successful import")
data = d3.tsvParse(
    `source	target	value
Total Plastic Production	Used Once	5800000000
Total Plastic Production	Still in Use	2500000000
Used Once	Sent to Landfill or discarded	4600000000
Used Once	Incinerated	700000000
Used Once	Recycled	500000000
Recycled	Recycled then Incinerated	100000000
Recycled	Recycled then Sent to Landfill or discarded	300000000
Recycled	Recycled and still in use	100000000`,
    d3.autoType
)

console.log(data);

var dimensions = {
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    margins: 10,
    width: window.innerWidth / 2 - 20,
    height: window.innerHeight / 2 - 20
}

// process and manipulate the sankeyData object
function sankeyDataGet(){
    const sankeyData = { nodes: [], links: [] };
    //sankey Arguments
  data.forEach((d) => {
    const nodesList = sankeyData.nodes.map((n) => n.name);
    if (!nodesList.includes(d.source)) {
      sankeyData.nodes.push({ name: d.source });
    }
    if (!nodesList.includes(d.target)) {
      sankeyData.nodes.push({ name: d.target });
    }
    sankeyData.links.push({
      source: d.source,
      target: d.target,
      value: d.value
    });
  });
    sankeyData.links.forEach((l, lNdx) => {
    sankeyData.links[lNdx].source = sankeyData.nodes.indexOf(
      sankeyData.nodes.find((n) => n.name === l.source)
    );
    sankeyData.links[lNdx].target = sankeyData.nodes.indexOf(
      sankeyData.nodes.find((n) => n.name === l.target)
    );
  });
  console.log(sankeyData);
    
  const sankeyViz = d3
  .sankey()
  .nodes(sankeyData.nodes)
  .links(sankeyData.links)
//   .nodeAlign(d3.sankey.sankeyLeft)
  .nodeWidth(175)
//   .extent([
//     [dimensions.margins, dimensions.margins],
//     [
//       dimensions.width - dimensions.margins * 2,
//       dimensions.height - dimensions.margins * 2
//     ]
//   ]);
  return sankeyViz;
    
  }

var sankeyData = sankeyDataGet();

console.log(sankeyData);


function createSankey(){
    var svg = d3.select("#sankey-container").append("svg")
    //   .create("svg")
    //   .attr("height", dimensions.height)
    //   .attr("width", dimensions.width)
    //   .attr("overflow", "visible");
  
    const chart = svg
      .append("g")
      .attr("transform", `translate(${dimensions.margins},${dimensions.margins})`)
      .attr("height", dimensions.height - dimensions.margins * 2)
      .attr("width", dimensions.width - dimensions.margins * 2)
      .attr("overflow", "visible");
  
    const adjustor = (i) => {
      if (i === 8) {
        return 30;
      } else if (i === 6) {
        return -30;
      } else return 0;
    };
  
    chart
      .append("text")
      .text("How Much Plastic do we truly recycle?")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "31.25")
      .attr("font-weight", "600");
  
    const nodes = svg
      .append("g")
      .selectAll("rect")
      .data(sankeyData.nodes)
    //   .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("fill", (d) => colorScale(d.name))
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0);
  
    const links = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.1)
      .selectAll("path")
      .data(sankeyData.links)
    //   .join("path")
    //   .attr("d", d3.sankey.sankeyLinkHorizontal())
      .attr("stroke-width", function (d) {
        return d.width;
      });
  
    const labelNames = svg
      .append("g")
      .selectAll("text")
      .data(sankeyData.nodes)
    //   .join("text")
      .text((d) => d.name)
      .attr("class", (d) => d.depth)
      .attr("x", (d) => d3.mean([d.x0, d.x1]))
      .attr("y", (d) => d3.mean([d.y0, d.y1]))
      .attr("dy", (d) => `${-5 + adjustor(d.index)}px`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => (d.y1 - d.y0 < 20 ? "black" : "white"))
      .attr("font-family", "helvetica")
      .attr("font-weight", "400")
      .attr("font-size", "16")
      .style("text-shadow", ".5px .5px 2px #222");
  
    const labelValues = svg
      .append("g")
      .selectAll("text")
      .data(sankeyData.nodes)
    //   .join("text")
      .text((d) => `${d3.format("~s")(d.value)}`)
      .attr("x", (d) => d3.mean([d.x0, d.x1]))
      .attr("y", (d) => d3.mean([d.y0, d.y1]))
      .attr("dy", (d) => `${15 + adjustor(d.index)}px`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => (d.y1 - d.y0 < 20 ? "black" : "white"))
      .attr("font-family", "helvetica")
      .attr("font-weight", "200")
      .attr("font-size", "24")
      .style("text-shadow", ".5px .5px 2px #222");
  
    return svg.node();
  }

createSankey()