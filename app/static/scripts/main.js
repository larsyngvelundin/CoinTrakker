// var testingAddress = "1A2VHcohqFRAU4DijTx8aWMWmadeEwFRJT";
// var testingAddress = "1XPTgDRhN8RFnzniWCddobD9iKZatrvH4";
var testingAddress = "123f1x9LXV6ea9XDm3FopQ884A32C28SUb";
var loadingIndicator = document.getElementById("loading-indicator")

var StartingTransactions = []
function getStartingTransactions(address) {
    loadingIndicator.classList.remove("hidden")
    fetch('/get_transactions_from_address', {
        method: "POST",
        body: JSON.stringify({
            "address": address
        }),
    })
        .then(response => response.json())
        .then(transactions => {

            StartingTransactions = transactions;
            loadingIndicator.classList.add("hidden")
            initializeGraph();
        });
}
getStartingTransactions(testingAddress);

var margin = { top: 50, right: 10, bottom: 10, left: 10 };
var width = 500 - margin.left - margin.right;
width = window.innerWidth - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
height = window.innerHeight - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.links();

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
    start_data = {
        "nodes": [],
        "links": []
    }
    svg.selectAll("g").remove();
    start_data['nodes'].push({ "node": start_data['nodes'].length, "name": StartingTransactions[0].from })
    for (var i = 0; i < StartingTransactions.length; i++) {
        start_data['nodes'].push({ "node": start_data['nodes'].length, "name": StartingTransactions[i].to })
    }
    console.log("starting", StartingTransactions);
    for (var i = 0; i < StartingTransactions.length; i++) {
        start_data['links'].push({
            "source": getNodeID(StartingTransactions[i].from),
            "target": getNodeID(StartingTransactions[i].to),
            "value": StartingTransactions[i].amount,
            "hash": StartingTransactions[i].hash
        })
    }
    graph = sankey(start_data);
    var link = svg.append("g").attr("id", "links")
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) {
            return normalizeLinkWidth(d.width); 
        })
        .on("contextmenu", linkMenu);

    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + d.value + " BTC";
        });

    var node = svg.append("g").attr("id", "nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("click", nodeClicked)
        .on("contextmenu", nodeMenu);

    node.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return normalizeLinkWidth(d.y1 - d.y0); })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = stringToColorHex(d.name);
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            return d.name;
            // return d.name + "\n" + d.value;
        });
}

function initialLink(sankeyLinkHorizontal, d) {
    defaultPath = sankeyLinkHorizontal(d);
    var pathCommands = defaultPath.split(/(?=[LMC])/);
    var cX = parseInt(pathCommands[1].split(",")[4]);
    var mX = parseInt(pathCommands[0].split(",")[0].substring(1));
    var offsetX = cX - mX;
    var newMX = mX + offsetX
    var newM = "M" + (newMX) + "," + pathCommands[0].split(",")[1];
    var newC = "C";
    newC += (parseInt(pathCommands[1].split(",")[0].substring(1)) + offsetX) + ",";
    newC += pathCommands[1].split(",")[1] + ",";
    newC += (parseInt(pathCommands[1].split(",")[2]) + offsetX) + ",";
    newC += pathCommands[1].split(",")[3] + ",";
    newC += (cX + offsetX) + ",";
    newC += pathCommands[1].split(",")[5];
    pathCommands[0] = newM;
    pathCommands[1] = newC;
    return pathCommands.join(' ');
}

function drawGraph() {
    console.log("Drawing graph");
    graph = sankey(start_data);
    var link = svg.select("#links").selectAll(".link")
        .data(graph.links)
    link.attr("d", d3.sankeyLinkHorizontal());
    link.attr("class", "link");
    link.attr("stroke-width", function (d) {
        return d.width;
    });
    link.on("contextmenu", linkMenu);


    var newLink = svg.select("#links").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link initial")
        .attr("d", function (d) { return initialLink(d3.sankeyLinkHorizontal(), d) })
        .attr("stroke-width", function (d) { return normalizeLinkWidth(d.width); })
        .append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + d.value + " BTC";
        });

    var node = svg.select("#nodes")
        .selectAll(".node")
        .data(graph.nodes)

    node.select("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return normalizeLinkWidth(d.y1 - d.y0); })
        .attr("width", sankey.nodeWidth())

    var newNode = svg.select("#nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node initial")
        .on("click", nodeClicked)
        .on("contextmenu", nodeMenu);

    newNode.append("rect")
        .attr("x", function (d) { return d.x0 + 800; })
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
            return d.name;
            // return d.name + "\n" + d.value;
        });
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
            "value": newTransactions[i].amount,
            "hash": newTransactions[i].hash
        })
    }
    drawGraph();
    await delay(10);
    drawGraph();
}


document.addEventListener('DOMContentLoaded', (e) => {
    console.log("Ran after DOM was loaded");
    document.addEventListener('click', function (event) {
        // console.log(event.srcElement.id);
        if (event.srcElement.id != "context-menu") {
            document.getElementById("context-menu").classList.add("hidden");
        }
    });
    // const redrawButton = document.getElementById("force-re-draw");
    // redrawButton.addEventListener("click", function (e) {
    //     console.log("Attempting Re-Draw")
    //     drawGraph();
    // })
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
            return a.json();
        })
        .then(function (json) {
            console.log("301", json);
        })
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

function normalizeLinkWidth(value) {
    // if (value > 10) { return 10 }
    if (value < 0.1) { return 0.1 }
    return value;
}


function startNewDiagram(e) {
    console.log("Starting new diagram");
    console.log(e.srcElement.dataset.address);
    getStartingTransactions(e.srcElement.dataset.address)
}

function linkMenu(e) {
    e.preventDefault();
    console.log("link Right-Clicked");
    console.log(e.srcElement.__data__);
    var eHash = e.srcElement.__data__.hash;
    var eFrom = e.srcElement.__data__.source.name;
    var eTo = e.srcElement.__data__.target.name;
    var eAmount = e.srcElement.__data__.value;
    var contextMenu = document.getElementById("context-menu");
    contextMenu.classList.remove("hidden");
    contextMenu.innerHTML = `
        <h3>${eHash}</h3>
        <p>Amount: ${eAmount}</p>
        <p>From: ${eFrom}</p>
        <p>To: ${eTo}</p>
        <a href="https://bitaps.com/${eHash}" target="_blank" class="button">Open on Bitaps</a>
    `;
    var posX = e.pageX;
    var posY = e.pageY;
    if (posX + contextMenu.offsetWidth > window.innerWidth) {
        posX -= contextMenu.offsetWidth;
    }

    if (posY + contextMenu.offsetHeight > window.innerHeight) {
        posY -= contextMenu.offsetHeight;
    }

    contextMenu.style.left = posX + "px"
    contextMenu.style.top = posY + "px"
}

function nodeMenu(e) {
    e.preventDefault();
    console.log("node Right-Clicked");
    console.log(e);
    console.log(e.srcElement.__data__.name);
    console.log("x", e.srcElement.attributes.x.value);
    console.log("y", e.srcElement.attributes.y.value);
    var eAddress = e.srcElement.__data__.name;
    var contextMenu = document.getElementById("context-menu");
    contextMenu.classList.remove("hidden");
    contextMenu.innerHTML = `
        <h3>${eAddress}</h3>
        <button id="start-new-diagram" data-address=${eAddress}>Start new diagram using this address</button>
        <button id="get-incoming-transactions" data-address=${eAddress}>Start new diagram using this address</button>
        <a href="https://bitaps.com/${eAddress}" target="_blank" class="button">Open on Bitaps</a>
    `;

    var startNewDiagramButton = document.getElementById("start-new-diagram");
    startNewDiagramButton.addEventListener("click", startNewDiagram)

    var startNewDiagramButton = document.getElementById("get-incoming-transactions");
    startNewDiagramButton.addEventListener("click", startNewDiagram)


    var posX = parseInt(e.srcElement.attributes.x.value) + margin.left;
    var posY = parseInt(e.srcElement.attributes.y.value) + margin.top;
    posX = e.pageX;
    posY = e.pageY;

    console.log("menu is:", contextMenu.offsetWidth);
    console.log("x is:", posX);
    console.log("window is: ", window.innerWidth);

    if (posX + contextMenu.offsetWidth > window.innerWidth) {
        posX -= contextMenu.offsetWidth;
    }

    if (posY + contextMenu.offsetHeight > window.innerHeight) {
        posY -= contextMenu.offsetHeight;
    }

    contextMenu.style.left = posX + "px"
    contextMenu.style.top = posY + "px"
    // document.appendChild(contextMenu)
}