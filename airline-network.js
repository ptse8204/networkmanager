// Sample data of airport nodes and routes
const airports = [
    { id: "JFK", city: "New York" },
    { id: "LAX", city: "Los Angeles" },
    { id: "ORD", city: "Chicago" },
    { id: "ATL", city: "Atlanta" },
    { id: "DFW", city: "Dallas" }
];

const routes = [
    { source: "JFK", target: "LAX", passengers: 5000, planes: 25 },
    { source: "JFK", target: "ORD", passengers: 4000, planes: 15 },
    { source: "ORD", target: "LAX", passengers: 3000, planes: 20 },
    { source: "ATL", target: "DFW", passengers: 2000, planes: 10 },
    { source: "DFW", target: "LAX", passengers: 3500, planes: 18 }
];

// Create SVG container
const width = 1000, height = 700;
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the simulation for force layout
const simulation = d3.forceSimulation(airports)
    .force("link", d3.forceLink(routes).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Create link elements (air routes)
const links = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(routes)
    .enter()
    .append("line")
    .attr("stroke-width", d => d.passengers / 1000) // Line thickness based on number of passengers
    .attr("stroke", "gray");

// Create node elements (airports)
const nodes = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(airports)
    .enter()
    .append("circle")
    .attr("r", d => d.planes) // Node size based on number of planes
    .attr("fill", "steelblue")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

// Create labels for airport codes
const labels = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(airports)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", -10)
    .text(d => d.id);

// Update simulation on each tick
simulation.on("tick", () => {
    links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
});

// Dragging functions
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
