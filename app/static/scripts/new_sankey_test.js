
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

// Set up SVG container
const svg = d3.select('#sankey-container').append('svg');

// Create initial Sankey diagram
const sankey = d3.sankey().nodeWidth(15).nodePadding(10);
const { nodes, links } = sankey({ nodes: initialNodes, links: initialLinks });

// Draw initial links
svg.append('g')
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .style('stroke', '#000');

// Draw initial nodes
svg.append('g')
    .selectAll('rect')
    .data(nodes)
    .enter().append('rect')
    .attr('x', d => d.x0 * 10)
    .attr('y', d => d.y0 * 10)
    .attr('height', "10")
    // .attr('height', d => (d.y1 - d.y0) )
    .attr('width', d => (d.x1 - d.x0) * 10)
    .style('fill', '#00F');


// Handle node click
svg.selectAll('rect')
    .on('click', handleClick);

// Handle click function
function handleClick(event, d) {
    console.log("HELLO I AM CLICKED");
    // Load new data based on the clicked node (d)
    const newData = {
        nodes: [{name: "H"}],
        links: [{source: 3, target: 7, value: 10}]
    }
    // Load your new data here based on the clicked node

// Update the diagram with new data
    const updatedNodes = [...nodes, ...newData.nodes];
    const updatedLinks = [...links, ...newData.links];

    const { nodes: updatedNodesData, links: updatedLinksData } = sankey({ nodes: updatedNodes, links: updatedLinks });

    // Update links
    svg.selectAll('path')
        .data(updatedLinksData)
        .enter().append('path')
        .attr('d', d3.sankeyLinkHorizontal())
        .style('stroke', '#000');

    // Update nodes
    svg.selectAll('rect')
        .data(updatedNodesData)
        .enter().append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        // .attr('height', d => d.y1 - d.y0)
        .attr('height', "10px")
        .attr('width', d => d.x1 - d.x0)
        .style('fill', '#00F');
}
