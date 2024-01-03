testingAddress = "1A2VHcohqFRAU4DijTx8aWMWmadeEwFRJT"
fetch('/get_transactions_from_address', {
    method: "POST",
    body: JSON.stringify({
        "address": testingAddress
    }),
})
    .then(response => response.json())
    .then(transactions => {
        for (var i = 0; i < transactions.length; i++) {
            console.log(transactions[i]);
        }});


// set the dimensions and margins of the graph
var margin = { top: 50, right: 10, bottom: 10, left: 10 };
var width = 500 - margin.left - margin.right;
width = window.innerWidth- margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
height = window.innerHeight - margin.top - margin.bottom;

// format variables
var formatNumber = d3.format(",.0f"); // zero decimal places
var format = function (d) { return formatNumber(d); };
var color = d3.scaleOrdinal(d3.schemeCategory10);

// function createDiagram(){}
// append the svg object to the body of the page
var svg = d3.select("svg")//.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.links();
var test_data = {
    "nodes": [
        { "node": 0, "name": "node0" },
        { "node": 1, "name": "node1" },
        { "node": 2, "name": "node2" },
        { "node": 3, "name": "node3" },
        { "node": 4, "name": "node4" }
    ],
    "links": [
        { "source": 0, "target": 2, "value": 2 },
        { "source": 1, "target": 2, "value": 2 },
        { "source": 1, "target": 3, "value": 2 },
        { "source": 0, "target": 4, "value": 2 },
        { "source": 2, "target": 3, "value": 2 },
        { "source": 2, "target": 4, "value": 2 },
        { "source": 3, "target": 4, "value": 4 }
    ]
}
// load the data
// d3.json("sankey.json").then(function (sankeydata) {
function initializeGraph() {
    // console.log(sankeydata);
    graph = sankey(test_data);
    console.log(graph);
    // add in the links
    var link = svg.append("g").attr("id", "links")
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) { return d.width; });

    // add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value);
        });

    // add in the nodes
    var node = svg.append("g").attr("id", "nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("click", nodeClicked);

    // add the rectangles for the nodes
    node.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            return d.name + "\n" + format(d.value);
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", function (d) { return d.x0 - 6; })
        .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr("x", function (d) { return d.x1 + 6; })
        .attr("text-anchor", "start");
}
// initializeGraph();

function getTransactions(address){

}


function drawGraph() {
    graph = sankey(test_data);
    console.log("graph", graph);
    var link = svg.select("#links").selectAll(".link")
        .data(graph.links)
    link.attr("d", d3.sankeyLinkHorizontal());

    var newLink = svg.select("#links").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) { return d.width; });

    var node = svg.select("#nodes")
        .selectAll(".node")
        // .selectAll("rect")
        .data(graph.nodes)

    node.select("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())

    node.select("text")
        .attr("x", function (d) { return d.x0 - 6; })
        .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr("x", function (d) { return d.x1 + 6; })

    var newNode = svg.select("#nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("click", nodeClicked);
    newNode.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            return d.name + "\n" + format(d.value);
        });

    // add in the title for the nodes
    newNode.append("text")
        .attr("x", function (d) { return d.x0 - 6; })
        .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr("x", function (d) { return d.x1 + 6; })
        .attr("text-anchor", "start");
}
// });
function nodeClicked(e) {
    console.log("nodeClicked");
    console.log(e);
    console.log(e.srcElement.__data__.name);
    newNode = { "node": 5, "name": "node5" }
    test_data.nodes.push(newNode)
    newLink = { "source": 4, "target": 5, "value": 4 }
    test_data.links.push(newLink)
    drawGraph()

}