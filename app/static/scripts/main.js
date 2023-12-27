console.log("main.js loaded");


var clickStartTime = 0;
var clickEndTime = 0;
// var nodes = d3.range(1000).map(function (i) {
//     return {
//         index: i
//     };
// });
var nodes = [{ "id": "starting point" }, { "id": "second point" }, { "id": "third point" }]
console.log(nodes);

var links = d3.range(nodes.length - 1).map(function (i) {
    return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
    };
});

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links).distance(20).strength(1))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;


d3.select(canvas)
    .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    // console.log("nodes", nodes);
    nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();

    context.restore();
}

function addNode(existingNode) {
    console.log("Trying to add");
    console.log("existingNode", existingNode);
    var newNode = {
        "id": "new node",
        // "vx": existingNode.vx,
        // "vy": existingNode.vy,
        "x": existingNode.x,
        "y": existingNode.y,
        "index": nodes.length
    }
    console.log("newNode", newNode);
    nodes.push(newNode)
    console.log("nodes",nodes);
    newLink = {
        source: nodes[existingNode.index],
        target: nodes[newNode.index],
        index: links.length
    }
    console.log("links", links);
    links.push(newLink);
    simulation.restart();
    // links
}

function dragsubject() {
    return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
}

function dragstarted() {
    clickStartTime = Date.now();
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
    // console.log("d3.event.subject.x", d3.event.subject.x);
    console.log("d3.event.subject.y", d3.event.subject.y);
}

function calculateDistance(x1, y1, x2, y2) {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
}

function dragended() {
    console.log("simulation", simulation);
    console.log("simulation..nodes", simulation.nodes());
    clickEndTime = Date.now();
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
    console.log("d3.event.subject", d3.event.subject);
    console.log("d3.event", d3.event);
    // console.log("click ended");
    var timeHeld = clickEndTime - clickStartTime;
    // console.log("clickStartTime", clickStartTime);
    // console.log("clickEndTime", clickEndTime);
    console.log("timeHeld", timeHeld);
    if (timeHeld < 150) {
        console.log("This was probably a click");
        mouseY = d3.event.sourceEvent.clientY - height / 2;
        console.log("mouseY", mouseY);
        mouseX = d3.event.sourceEvent.clientX - width / 2;
        console.log("mouseX", mouseX);
        var distance = calculateDistance(d3.event.subject.x, d3.event.subject.y, mouseX, mouseY)
        console.log("distance", distance);
        if (distance < 5) {
            console.log("probably clicked on node", d3.event.subject.id);
            addNode(d3.event.subject);
        }
        else {
            console.log("Did not click close enough to warrant expansion for", d3.event.subject.id);
        }
    }
    else {
        console.log("This was probably a drag");
    }
}

function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
    context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}
