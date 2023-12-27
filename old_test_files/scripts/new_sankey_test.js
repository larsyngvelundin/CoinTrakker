
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// import * as d3 from d3-sankey

// let data = {
//     nodes: [
//         { name: "A" },
//         { name: "B" },
//         { name: "C" },
//         { name: "D" },
//         { name: "E" },
//         { name: "F" },
//         { name: "G" }
//     ],
//     links: [
//         // { source: "A", target: "B", value: 10 },
//         // { source: "A", target: "C", value: 10 },
//         // { source: "B", target: "D", value: 10 },
//         // { source: "B", target: "E", value: 10 },
//         // { source: "C", target: "F", value: 10 },
//         // { source: "C", target: "G", value: 10 }
//     ]
// };

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
// Set up initial data
const initialNodes = [
    { name: "A" },
    { name: "B" },
    { name: "C" },
    { name: "D" },
    { name: "E" },
    { name: "F" },
    { name: "G" }
];
const initialLinks = [
    { source: 0, target: 1, value: 10 },
    { source: 0, target: 2, value: 10 },
    { source: 1, target: 3, value: 10 },
    { source: 1, target: 4, value: 10 },
    { source: 2, target: 5, value: 10 },
    { source: 2, target: 6, value: 10 }
];

var graph = {
    "nodes": [
        { "name": "A" },
        { "name": "B" },
        { "name": "C" },
        { "name": "D" },
        { "name": "E" },
        { "name": "F" },
        { "name": "G" }
    ],
    "links": [
        { "source": "A", "target": "B", "value": "4.5" },
        { "source": "A", "target": "C", "value": "5.5" },
        { "source": "B", "target": "D", "value": "2.1" },
        { "source": "B", "target": "E", "value": "2.4" },
        { "source": "C", "target": "F", "value": "3.1" },
        { "source": "C", "target": "G", "value": "2.4" }
    ]
}


//Some version of D3 sankey, i don't know
///////////////////////////////////////////////

d3.sankey = function () {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodePadding = function (_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function (_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function (_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };

    sankey.size = function (_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.sy + d.dy / 2,
                y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;
        }

        link.curvature = function (_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value)
            );
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function (link) {
                    nextNodes.push(link.target);
                });
            });
            remainingNodes = nextNodes;
            ++x;
        }

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
        nodes.forEach(function (node) {
            if (!node.targetLinks.length) {
                node.x = d3.min(node.sourceLinks, function (d) { return d.target.x; }) - 1;
            }
        });
    }

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
        });
    }

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function (d) { return d.x; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function (d) { return d.values; });

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= .99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }

        function initializeNodeDepth() {
            var ky = d3.min(nodesByBreadth, function (nodes) {
                return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
            });

            nodesByBreadth.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
                });
            });

            links.forEach(function (link) {
                link.dy = link.value * ky;
            });
        }

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedSource(link) {
                return center(link.source) * link.value;
            }
        }

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedTarget(link) {
                return center(link.target) * link.value;
            }
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                    dy,
                    y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) node.y -= dy;
                        y0 = node.y;
                    }
                }
            });
        }

        function ascendingDepth(a, b) {
            return a.y - b.y;
        }
    }

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0, ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};

///////////////////////////////////////////////

var units = "BTC";

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = window.innerWidth / 2 - margin.left - margin.right,
    height = window.innerHeight / 2 - margin.top - margin.bottom;

var formatNumber = d3.format(",.2f");    // zero decimal places
var format = function (d) { return formatNumber(d) + " " + units; };
// var color = 


// append the svg canvas to the page
var svg = d3.select("#sankey-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(12)
    .nodePadding(30)
    .size([width, height]);


var path = sankey.link();


// load the data
function drawSankeyDiagram(graph) {

    var nodeMap = {};
    graph.nodes.forEach(function (x) { nodeMap[x.name] = x; });
    console.log('graph', graph);
    console.log('nodeMap', nodeMap);
    graph.links = graph.links.map(function (x) {
        return {
            source: nodeMap[x.source],
            target: nodeMap[x.target],
            value: x.value
        };
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(12);

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) { return Math.max(1, d.dy); })
        .sort(function (a, b) { return b.dy - a.dy; });

    // add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value);
        });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .on('click', addNodes);
    // .call(d3.behavior.drag()
    //     .origin((d) => d)
    //     .on("dragstart", () => {
    //         this.parentNode.appendChild(this);
    //     })
    //     .on("drag", dragmove)
    // );

    // add the rectangles for the nodes

    node.append("rect")
        .attr("height", (d) => d.dy)
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            d.color = "#" + stringToColorHex("example string");
            return d.color;
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
        .attr("x", -6)
        .attr("y", (d) => d.dy / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text((d) => d.name)
        .filter((d) => d.x < width / 2)
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this).attr("transform",
            "translate(" + (
                d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
            ) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }


}
var graph_copy = JSON.parse(JSON.stringify(graph));
drawSankeyDiagram(graph_copy);
await delay(1000);
console.log("Trying again");
graph_copy = JSON.parse(JSON.stringify(graph));
drawSankeyDiagram(graph_copy);

//create new nodes?
function addNodes(d) {
    console.log("Trying to add nodes");
    console.log(d);
    console.log(graph.nodes);
    console.log(graph.links);
    var newNode = {
        name: "H",
        sourceLinks: [],
        targetLinks: [],
        x: 573.5,
        y: 371.635
    }
    graph.nodes.push(newNode)
    graph.nodes.forEach(function(target) {
        if (target.name == "D"){
            graph.links.push({source: newNode, target: target})
        }
    });
    console.log(graph.nodes);
    console.log(graph.links);
    drawSankeyDiagram(graph);
}

function restart() {
    node = node.data(nodes);
  
    node.enter().insert("circle", ".cursor")
        .attr("class", "node")
        .attr("r", 5)
        .on("mousedown", mousedownNode);
  
    node.exit()
        .remove();
  
    link = link.data(links);
  
    link.enter().insert("line", ".node")
        .attr("class", "link");
    link.exit()
        .remove();
  
    force.start();
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
// const hexColor = stringToColorHex("example string");
// console.log(hexColor); // Outputs: Hexadecimal color code e.g. "a1b2c3"