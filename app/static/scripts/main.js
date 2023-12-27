console.log("main.js loaded");



var graph_data = {
    "nodes": [
        {
            "node": 0,
            "name": "node0"
        },
        {
            "node": 1,
            "name": "node1"
        },
        {
            "node": 2,
            "name": "node2"
        },
        {
            "node": 3,
            "name": "node3"
        },
        {
            "node": 4,
            "name": "node4"
        }
    ],
    "links": [
        {
            "source": 0,
            "target": 2,
            "value": 2
        },
        {
            "source": 1,
            "target": 2,
            "value": 2
        },
        {
            "source": 1,
            "target": 3,
            "value": 2
        },
        {
            "source": 0,
            "target": 4,
            "value": 2
        },
        {
            "source": 2,
            "target": 3,
            "value": 2
        },
        {
            "source": 2,
            "target": 4,
            "value": 2
        },
        {
            "source": 3,
            "target": 4,
            "value": 4
        }
    ]
}
function id(d) {
    return d.id;
}
var nodes = [
    { "id": "Alice" },
    { "id": "Bob" },
    { "id": "Carol" }
];

var links = [
    {
        "source": "Alice",
        "target": "Bob"
    },
    {
        "source": "Bob",
        "target": "Carol"
    }
];

//testing other nodes and links
graph_data.nodes = nodes
graph_data.links = links

console.log("nodes", graph_data.nodes);
console.log("links", graph_data.links);

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// sankey.select("#sankey-container")
var svg = d3.select("#sankey-container").append("svg")
    .attr("width", width)
    .attr("height", height)




function sankeylink(d) {
    var curvature = .5;
    console.log("in sankeylink function");
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

function mylink(d) {
    console.log("in mylink");
    var curvature = .5;
    console.log("d", d);
    var x0 = d.source.x + d.source.dx,
        x1 = d.target.x,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature),
        y0 = d.source.y + d.sy + d.dy / 2,
        y1 = d.target.y + d.ty + d.dy / 2;
    console.log("x0", x0);
    console.log("x1", x1);
    console.log("xi", xi);
    console.log("x2", x2);
    console.log("x3", x3);
    console.log("y0", y0);
    console.log("y1", y1);
    return "M" + x0 + "," + y0
        + "C" + x2 + "," + y0
        + " " + x3 + "," + y1
        + " " + x1 + "," + y1;
}

// var path = sankeylink();
// console.log("path:", path);


// .layout(32);

var sankey = d3.sankey().nodeWidth(36).nodePadding(40).size([width, height]);
console.log("sankey:", sankey);
// d3.json(JSON.stringify(graph_data), function (error, graph) {
console.log("before the json call");
d3.json("../static/scripts/sankey.json", function (error, graph) {
    console.log("in the json call");


    sankey.nodes(graph_data.nodes)
        .links(graph_data.links);

    var links = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .join("path")
        .attr("d", mylink)

    console.log("d3.sankeyLinkHorizontal()", d3.sankeyLinkHorizontal(links[0]));

    // svg.append("g")
    //     .attr("fill", "none")
    //     .attr("stroke", "#000")
    //     .attr("stroke-opacity", 0.2)
    //     .selectAll("path")
    //     .data(graph_data.links)
    //     .join("path")
    //     .attr("d", mylink)
    //     .attr("stroke-width", function (d) { return d.width; });

    var nodes = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
});
console.log("after the json call");