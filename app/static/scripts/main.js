// var testingAddress = "1A2VHcohqFRAU4DijTx8aWMWmadeEwFRJT";
// var testingAddress = "1XPTgDRhN8RFnzniWCddobD9iKZatrvH4";
var testingAddress = "123f1x9LXV6ea9XDm3FopQ884A32C28SUb";
var loadingIndicator = document.getElementById("loading-indicator")

// var StartingTransactions = [];
var StartingTransactions = []
function getStartingTransactions() {
    loadingIndicator.classList.remove("hidden")
    fetch('/get_transactions_from_address', {
        method: "POST",
        body: JSON.stringify({
            "address": testingAddress
        }),
    })
        .then(response => response.json())
        .then(transactions => {

            StartingTransactions = transactions;
            loadingIndicator.classList.add("hidden")
            initializeGraph();
        });
}
getStartingTransactions();
// for (var i = 0; i < transactions.length; i++) {
//     console.log(transactions[i]);
// }});
// console.log(StartingTransactions);

// set the dimensions and margins of the graph
var margin = { top: 50, right: 10, bottom: 10, left: 10 };
var width = 500 - margin.left - margin.right;
width = window.innerWidth - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
height = window.innerHeight - margin.top - margin.bottom;

// format variables
// var formatNumber = d3.format(",.18f"); // zero decimal places
// var format = function (d) { return formatNumber(d); };
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

var start_data = {
    "nodes": [],
    "links": []
}
function getNodeID(name) {
    var node = start_data.nodes.find(function (node) {
        return node.name === name;
    });
    if (node) {
        return node.node
    }
    else { return null }
}


function initializeGraph() {

    start_data['nodes'].push({ "node": start_data['nodes'].length, "name": StartingTransactions[0].from })
    for (var i = 0; i < StartingTransactions.length; i++) {
        // console.log(StartingTransactions[i]);
        start_data['nodes'].push({ "node": start_data['nodes'].length, "name": StartingTransactions[i].to })
    }
    // console.log(start_data['nodes']);
    for (var i = 0; i < StartingTransactions.length; i++) {
        start_data['links'].push({
            "source": getNodeID(StartingTransactions[i].from),
            "target": getNodeID(StartingTransactions[i].to),
            "value": StartingTransactions[i].amount
        })
    }
    // console.log(start_data);
    // console.log(sankeydata);
    graph = sankey(start_data);
    // console.log(graph);
    // add in the links
    var link = svg.append("g").attr("id", "links")
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) {
            console.log("d", d);
            return d.width;
        });

    // add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + d.value;
            // d.target.name + "\n" + format(d.value);
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
            return d.color = stringToColorHex(d.name);
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            // return d.name + "\n" + format(d.value);
            return d.name + "\n" + d.value;
        });

    // add in the title for the nodes
    // node.append("text")
    //     .attr("x", function (d) { return d.x0 - 6; })
    //     .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    //     .attr("dy", "0.35em")
    //     .attr("text-anchor", "end")
    //     .text(function (d) { return d.name; })
    //     .filter(function (d) { return d.x0 < width / 2; })
    //     .attr("x", function (d) { return d.x1 + 6; })
    //     .attr("text-anchor", "start");
}

function drawGraph() {
    console.log("Drawing graph");
    graph = sankey(start_data);
    // console.log("graph", graph);
    var link = svg.select("#links").selectAll(".link")
        .data(graph.links)
    link.attr("d", d3.sankeyLinkHorizontal());
    link.attr("class", "link")
    link.attr("stroke-width", function (d) {
        // console.log("d", d);
        return d.width;
    });

    function initialLink(sankeyLinkHorizontal, d){
        defaultPath = sankeyLinkHorizontal(d);
        console.log("sankeyLink value", defaultPath);
        var pathCommands = defaultPath.split(/(?=[LMC])/);
        console.log("pathCommands", pathCommands);
        var cX = parseInt(pathCommands[1].split(",")[4]);
        var mX = parseInt(pathCommands[0].split(",")[0].substring(1));
        var offsetX = cX - mX;
        console.log("add this much to all x", cX - mX);
        var newMX = mX + offsetX
        var newM = "M" + (newMX) + "," + pathCommands[0].split(",")[1];
        console.log("newM", newM);
        var newC = "C";
        newC += (parseInt(pathCommands[1].split(",")[0].substring(1)) + offsetX) + ",";
        newC += pathCommands[1].split(",")[1] + ",";
        newC += (parseInt(pathCommands[1].split(",")[2]) + offsetX) + ",";
        newC += pathCommands[1].split(",")[3] + ",";
        newC += (cX + offsetX) + ",";
        newC += pathCommands[1].split(",")[5];
        console.log("newC", newC);
        pathCommands[0] = newM;
        pathCommands[1] = newC;
        console.log("adjusted pathCommands", pathCommands);
        return pathCommands.join(' ');
        // return sankeyLinkHorizontal
    }
    // // Original
    // var newLink = svg.select("#links").selectAll(".link")
    //     .data(graph.links)
    //     .enter().append("path")
    //     .attr("class", "link initial")
    //     .attr("d", d3.sankeyLinkHorizontal())
    //     .attr("stroke-width", function (d) { return d.width; });
    var newLink = svg.select("#links").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link initial")
        .attr("d", function(d) {return initialLink(d3.sankeyLinkHorizontal(), d)})
        .attr("stroke-width", function (d) { return d.width; });
        
    // var newLinks = svg.select("#links").selectAll(".initial")
        // .node().getBBox()
        // .attr("test", function(d){
        //     console.log(d);
        // })
        // console.log(newLinks.d);

    var node = svg.select("#nodes")
        .selectAll(".node")
        // .selectAll("rect")
        .data(graph.nodes)

    node.select("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())

    // node.select("text")
    //     .attr("x", function (d) { return d.x0 - 6; })
    //     .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    //     .filter(function (d) { return d.x0 < width / 2; })
    //     .attr("x", function (d) { return d.x1 + 6; })

    var newNode = svg.select("#nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node initial")
        .on("click", nodeClicked);

    newNode.append("rect")
        .attr("x", function (d) { return d.x0 + sankey.nodeWidth(); })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", 0)
        .style("fill", function (d) {
            return d.color = stringToColorHex(d.name);
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            // return d.name + "\n" + format(d.value);
            return d.name + "\n" + d.value;
        });

    //     // add in the title for the nodes
    // newNode.append("text")
    //     .attr("x", function (d) { return d.x0 - 6; })
    //     .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    //     .attr("dy", "0.35em")
    //     .attr("text-anchor", "end")
    //     .text(function (d) { return d.name; })
    //     .filter(function (d) { return d.x0 < width / 2; })
    //     .attr("x", function (d) { return d.x1 + 6; })
    //     .attr("text-anchor", "start");
}

function nodeClicked(e) {
    console.log("nodeClicked");
    if (!e.srcElement.classList.contains("clicked")) {
        e.srcElement.classList.add("clicked")
        console.log(e);
        console.log(e.srcElement.__data__.name);
        var address = e.srcElement.__data__.name;
        getTransactions(address)
    }
}

function updateInitial() {
    console.log("updateInitial");
    initialNodes = svg.select('#nodes')
        .selectAll('.initial')
        .select('rect')
        .attr("x", function (d) { return d.x0; })

    // initialElements = document.getElementsByClassName("initial");
    // for (var i = 0; i < initialElements.length; i++) {
    //     initialElements[i].classList.remove("initial")
    // }
}

async function getTransactions(address) {
    loadingIndicator.classList.remove("hidden")
    fetch('/get_transactions_from_address', {
        method: "POST",
        body: JSON.stringify({
            "address": address
        }),
    })
        .then(response => response.json())
        .then(transactions => {

            addTransactions(transactions)
            loadingIndicator.classList.add("hidden")

        });
}

async function addTransactions(newTransactions) {
    for (var i = 0; i < newTransactions.length; i++) {
        console.log(newTransactions[i]);
        if (!getNodeID(newTransactions[i].to)) {
            start_data['nodes'].push({ "node": start_data['nodes'].length, "name": newTransactions[i].to })
        }
    }
    console.log(start_data['nodes']);
    for (var i = 0; i < newTransactions.length; i++) {
        start_data['links'].push({
            "source": getNodeID(newTransactions[i].from),
            "target": getNodeID(newTransactions[i].to),
            "value": newTransactions[i].amount
        })
    }
    drawGraph();
    await delay(10);
    drawGraph();
    // await delay(10);
    // drawGraph();
    // updateInitial();
}


document.addEventListener('DOMContentLoaded', (e) => {
    console.log("Ran after DOM was loaded");
    const redrawButton = document.getElementById("force-re-draw");
    redrawButton.addEventListener("click", function(e){
        console.log("Attempting Re-Draw")
        drawGraph();
    })
    //Commented until 500 error is fixed
    // const blockInfoDiv = document.getElementById("last-block-info")
    // const fetchPromise = fetch('/get_last_block');
    // fetchPromise.then(response => {
    //     return response.json();
    // }).then(BlockInfo => {
    //     console.log("BlockInfo.time", BlockInfo.time);
    //     var blockDate = new Date(BlockInfo.time * 1000)
    //     console.log("blockDate", blockDate);
    //     var blockDateStr = blockDate.toDateString()
    //     console.log("blockDateStr", blockDateStr);
    //     blockInfoDiv.innerHTML = `${blockDateStr} - ${BlockInfo.height}`
    //     console.log(BlockInfo);
    // });
});

async function getLastBlock() {
    console.log("in getLastBlock");
    var lastBlockInfo = await fetch('/get_last_block')
        .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
            console.log("301", json);
        })
    // .then(response => response.json())
    // .then(block_data => {
    //     return block_data;
    // });
    console.log("lastBlockInfo", lastBlockInfo);
    console.log("done?");
}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }


  function stringToColorHex(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const red = (hash >> 16) & 0xFF;
    const green = (hash >> 8) & 0xFF;
    const blue = hash & 0xFF;
    const colorHex = ((red << 16) | (green << 8) | blue).toString(16);
    return "#" + colorHex.padStart(6, '0');
}

function normalizeValues(value){
    if (value > 10){return 10}
    if (value < 1){return 1}
    return value;
}