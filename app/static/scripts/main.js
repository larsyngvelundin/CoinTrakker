//console.log("main.js loaded");


var clickStartTime = 0;
var clickEndTime = 0;
// var nodes = d3.range(1000).map(function (i) {
//     return {
//         index: i
//     };
// 1A2VHcohqFRAU4DijTx8aWMWmadeEwFRJT
// 1A3WqJBaFGWM8UvvQVLnzrkB4Z51YA5UBk
// });
var nodes_orig = [
    { "id": "1A1RWwZHpWd3x1q6ZX5gtrxhwAx5pbZGpb" },
    { "id": "1A2VHcohqFRAU4DijTx8aWMWmadeEwFRJT" },
    { "id": "1A3WqJBaFGWM8UvvQVLnzrkB4Z51YA5UBk" }
]
//console.log(nodes_orig);

let nodes = JSON.parse(JSON.stringify(nodes_orig));

var links_orig = []
// d3.range(nodes.length - 1).map(function (i) {
//     return {
//         source: Math.floor(Math.sqrt(i)),
//         target: i + 1
//     };
// });
//console.log("links_orig", links_orig);
let links = JSON.parse(JSON.stringify(links_orig));

// nodes.push({"id": "pushed node"})
// //console.log(nodes);

var forceDistance = 10;
var forceStrength = 0.1;
var forceStrengthModifyer = 0.0;

//send nodes list to a function
//check if svg objects exist, and add new objects for new nodes
//when svg object is clicked, call addNodes() with svg id

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links).distance(forceDistance).strength(forceStrength))
    // .force("x", d3.forceX())
    // .force("y", d3.forceY())
    .on("tick", ticked);

function redosim(old_nodes, spawn_node) {
    // console.log("i get these nodes", nodes);
    // console.log("these are my old nodes:", old_nodes);
    // console.log("spawning new nodes at node number", spawn_node.index);
    simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(links).distance(forceDistance).strength(forceStrength))
        // .force("x", d3.forceX().strength(forceStrengthModifyer))
        // .force("y", d3.forceY().strength(forceStrengthModifyer))
        // .force("charge", d3.forceManyBody().strength(-30))
        // .force("collide", d3.forceCollide().radius(20))
        .on("tick", ticked);
    for (var i = 0; i < old_nodes.length; i++) {
        //console.log("currently checking node", nodes[i].id);
        //console.log("new x", nodes[i].x);

        //console.log("old x", old_nodes[i].x);
        nodes[i].x = old_nodes[i].x;
        nodes[i].y = old_nodes[i].y;
        nodes[i].vx = 0;
        nodes[i].vy = 0;
        // console.log("fixed node number", i);
    }
    for (var i = old_nodes.length; i < nodes.length; i++) {
        var positionfixer = i % 2 * 8
        nodes[i].x = nodes[spawn_node.index].x + 4 - positionfixer
        nodes[i].y = nodes[spawn_node.index].y + 4 - positionfixer
        nodes[i].vx = 0
        nodes[i].vy = 0
        // console.log("fixed node number", i);
    }
    //add code to fix the position of the newly added node(s)
}

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 2;

var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var lastUpdateTime = 0;

d3.select(canvas)
    .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function ticked() {
    // console.log("ticked")
    //add code to multiply force based on the time from the last tick
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    // //console.log("nodes", nodes);
    nodes.forEach(drawNode);
    // context.strokeStyle = "#fff";
    // context.stroke();


    context.restore();
    // redosim();

    // var currentTime = Date.now();
    //if currentime%100 == 0
    // if (currentTime%500 == 0){
    //     //console.log(currentTime);
    //     redosim();
    // }
    //restart sim
    var tickTime = Date.now();
    if (tickTime - lastUpdateTime > 33) {
        console.log("Time to update");
        lastUpdateTime = Date.now();
        updateSvg(nodes, links);
    }
}

async function addNode(existingNode) {
    //console.log("Trying to add");
    var newNodeIDs = await expandTransactions(existingNode.id)
    console.log("new ids", newNodeIDs);
    var numberstirng = Math.floor(Math.random() * 100000).toString()
    console.log(numberstirng);
    //console.log("existingNode", existingNode);
    let sourcenum = Math.floor(Math.sqrt(nodes_orig.length - 1))
    //console.log("newNode", newNode);
    for (var i = 0; i < newNodeIDs.length; i++) {
        var newNode = {
            "id": newNodeIDs[i].to,
        }
        nodes_orig.push(newNode)
        newLink = {
            source: existingNode.index,
            target: nodes_orig.length - 1
        };
        links_orig.push(newLink);
        old_nodes = JSON.parse(JSON.stringify(nodes));
        nodes = JSON.parse(JSON.stringify(nodes_orig));
        links = JSON.parse(JSON.stringify(links_orig));
        redosim(old_nodes, existingNode);
        await delay(50)
    }
    // nodes_orig.push(newNode)
    // newLink = {
    //     source: sourcenum,
    //     target: nodes_orig.length - 1
    // };
    // links_orig.push(newLink);
    // nodes_orig.push(newNode)
    // newLink = {
    //     source: sourcenum,
    //     target: nodes_orig.length - 1
    // };
    // links_orig.push(newLink);
    // nodes_orig.push(newNode)
    // newLink = {
    //     source: sourcenum,
    //     target: nodes_orig.length - 1
    // };
    // links_orig.push(newLink);
    // nodes_orig.push(newNode)
    // newLink = {
    //     source: sourcenum,
    //     target: nodes_orig.length - 1
    // };
    // links_orig.push(newLink);
    //console.log("nodes", nodes);
    // simulation.restart();
    // links
    // //console.log("Waiting to redosim");

    // nodes[nodes.length - 1].x = existingNode.x;
    // nodes[nodes.length - 1].y = existingNode.y;
    // nodes[nodes.length - 1].vx = existingNode.vx;
    // nodes[nodes.length - 1].vy = existingNode.vy;

    // redosim();
    // redosim();
    // redosim();
    // redosim();
    // redosim();
    // redosim();
    // await delay(10);
    // //console.log(nodes[nodes.length - 1].x);
    // //console.log(NaN);
    // if (isNaN(nodes[nodes.length - 1].x)){
    //     //console.log("still NaN");
    // }
    // //console.log("redoing sim");
    // redosim();
    // if (isNaN(nodes[nodes.length - 1].x)){
    //     //console.log("still NaN");
    // // }
    // old_nodes = JSON.parse(JSON.stringify(nodes));
    // nodes = JSON.parse(JSON.stringify(nodes_orig));
    // links = JSON.parse(JSON.stringify(links_orig));
    // redosim(old_nodes, existingNode);
    // redosim();
    // redosim();
    // redosim();
    // await delay(100);
    // redosim();
    // redosim();
    // redosim();
    // await delay(1000);
    // redosim();
    // redosim();


    // newLink = {
    //     source: nodes[existingNode.index],
    //     target: nodes[newNode.index],
    //     // index: links.length
    // }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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
    // //console.log("d3.event.subject.x", d3.event.subject.x);
    //console.log("d3.event.subject.y", d3.event.subject.y);
}

function calculateDistance(x1, y1, x2, y2) {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
}

function dragended() {
    //console.log("simulation", simulation);
    //console.log("simulation..nodes", simulation.nodes());
    clickEndTime = Date.now();
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
    //console.log("d3.event.subject", d3.event.subject);
    //console.log("d3.event", d3.event);
    // //console.log("click ended");
    var timeHeld = clickEndTime - clickStartTime;
    //console.log("clickStartTime", clickStartTime);
    // //console.log("clickEndTime", clickEndTime);
    //console.log("timeHeld", timeHeld);
    if (timeHeld < 150) {
        //console.log("This was probably a click");
        //Fix the MouseX, MouseY position
        mouseY = d3.event.sourceEvent.clientY - height / 2;
        console.log("d3.event.subject.y", d3.event.subject.y);
        console.log("mouseY", mouseY);
        mouseX = d3.event.sourceEvent.clientX - width / 2;
        console.log("d3.event.subject.x", d3.event.subject.x);
        console.log("mouseX", mouseX);
        var distance = calculateDistance(d3.event.subject.x, d3.event.subject.y, mouseX, mouseY)
        console.log("distance", distance);
        if (distance < 50) {
            //console.log("probably clicked on node", d3.event.subject.id);
            addNode(d3.event.subject);
        }
        else {
            //console.log("Did not click close enough to warrant expansion for", d3.event.subject.id);
            // redosim();
            //console.log("links", links);
        }
    }
    else {
        //console.log("This was probably a drag");
    }
}

function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
    //use context.beginPath(); to clear previous colors
    context.beginPath();
    // context.moveTo(d.x + 3, d.y);
    // context.strokeStyle = "#f00";
    // context.stroke
    //set strokeStyle here
    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    context.strokeStyle = "#" + stringToColorHex(d.id);
    // context.strokeText(d.id, d.x+5, d.y+10)
    // context.strokeRect(d.x,d.y,100,20)
    context.fillStyle = "#" + stringToColorHex(d.id);
    context.fill();
    context.stroke();
    context.closePath();
    //use context.stroke() here
}



function stringToColorHex(str) {
    // A simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }

    // Convert the hash to an RGB hexadecimal value
    const red = (hash >> 16) & 0xFF;
    const green = (hash >> 8) & 0xFF;
    const blue = hash & 0xFF;

    // Convert RGB to hexadecimal format
    const colorHex = ((red << 16) | (green << 8) | blue).toString(16);

    // Ensure leading zeros are not removed
    return colorHex.padStart(6, '0');
}


function updateSvg(nodes, links) {
    // console.log("nodes", nodes);
    // console.log("links", links);
    let svgelement = document.getElementById("copy-div")

    for (let i = 0; i < nodes.length; i++) {
        var myNode = document.getElementById(nodes[i].id);
        if (myNode) {
            // console.log("already exists");
            myNode.setAttribute("cx", nodes[i].x + canvas.width / 2);
            myNode.setAttribute("cy", nodes[i].y + canvas.height / 2);
        }
        else {
            let circle = createCircle(nodes[i], 10)
            svgelement.appendChild(circle)
        }
        //         canvas.width
        // canvas.height;

    }
}

function createCircle(node, radius) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x + canvas.width / 2);
    circle.setAttribute("cy", node.y + canvas.height / 2);
    circle.setAttribute("r", radius);
    circle.setAttribute("class", "node");
    circle.id = node.id;

    circle.setAttribute("fill", "#" + stringToColorHex(node.id)); // Change the fill color if needed
    circle.setAttribute("onclick", "iclickedsvg('"+ JSON.stringify(node)+"')")
    let tooltip = document.createElement('span');
    tooltip.innerHTML = "Hello"
    tooltip.classList.add("tooltip")
    circle.appendChild(tooltip)

    circle.setAttribute("title", node.id)
    return circle;
}

function iclickedsvg(e) {
    console.log("test")
    console.log(e);
    var node = JSON.parse(e)
    console.log(node);
    addNode(node);
}

async function expandTransactions(id) {
    walletAddress = id;
    console.log(walletAddress)
    //get transactions from db
    var tx = fetch('/get_transactions_from_address', {
        method: "POST",
        body: JSON.stringify({
            "address": walletAddress
        }),
    })
        .then(response => response.json())
        .then(transactions => {
            // console.log("transactions", transactions);
            return transactions
        })
    // console.log("tx", tx);
    return tx
};