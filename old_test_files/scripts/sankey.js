document.addEventListener('DOMContentLoaded', (event) => {
    console.log("sankey.js loaded");
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 450 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#sankey-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Color scale used
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(290)
        .size([width, height]);

    // load the data
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_sankey.json", function (error, graph) {

        // Constructs a new Sankey generator with the default settings.
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(1);

        // add in the links
        var link = svg.append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", sankey.link())
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; });

        // add in the nodes
        var node = svg.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
                .subject(function (d) { return d; })
                .on("start", function () { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node
            .append("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
            // Add hover text
            .append("title")
            .text(function (d) { return d.name + "\n" + "There is " + d.value + " stuff in this node"; });

        // add in the title for the nodes
        node
            .append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + d.x + ","
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                    ) + ")");
            sankey.relayout();
            link.attr("d", sankey.link());
        }

    });
    
function addNode() {
    console.log(sankey.nodes());
    var data = {};
    data.nodes = sankey.nodes();
    // Add new node object to the nodes array
    data.nodes.push({ name: "New Node" });

    data.links = sankey.links();
    // Add new link object to the links array
    // You'll need to define source and target according to your nodes indexes or names
    data.links.push({ source: data.nodes.length - 2, target: data.nodes.length - 1, value: 10 });

    // Update and restart the Sankey layout calculation
    sankey
        .nodes(data.nodes)
        .links(data.links)
        .layout(32); // You may have to adjust the iterations for layout calculations

    
    // Re-bind the nodes data to the node elements
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
    // ... append your rectangles / labels here

    // Re-bind the links data to the link elements
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("path")
    // ... set the d attribute for paths here

    // You may need to apply a transition to enter new elements
    // and update existing ones

    // This is a very high-level example, ensuring alignment with your particular code structure is necessary for implementation.
}

//   document.getElementById('your-button-id').addEventListener('click', addNode);
    console.log("Ran after DOM was loaded (sankey)");
    var nodeButton = document.getElementById('addnodesankey');
    // console.log("This is my wallet elements:", wallets)
    nodeButton.addEventListener('click', addNode);
});


// document.addEventListener('DOMContentLoaded', (event) => {
// });
