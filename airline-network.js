// Sample data for airport coordinates (not using...)
airportCoords = {
    "JFK": [-73.7781, 40.6413],
    "LAX": [-118.4085, 33.9416],
    "ORD": [-87.9073, 41.9742],
    "ATL": [-84.4277, 33.6407],
    "DFW": [-97.0404, 32.8998]
};

function getRandomEntries(data, numEntries) {
    return data
        .sort(() => 0.5 - Math.random()) // Shuffle the array
        .slice(0, numEntries);           // Get first numEntries entries
}

csv_return = d3.csv("airports.csv").then(function(data) {
    // Filter the data to only include rows where country == "United States"
    const filteredData = data.filter(d => d.country == "United States");
    const randomEntries = getRandomEntries(filteredData, 5);

    // Convert randomEntries to the format of airportCoords
    newAirportCoords = {};
    randomEntries.forEach(entry => {
        newAirportCoords[entry.iata_code] = [parseFloat(entry.longitude), parseFloat(entry.latitude)];
    });
    airportCoords = newAirportCoords
    updateVisualization();
});

// Allow return from csv_return
//csv_return.then(result => console.log(result));

const width = 975, height = 610;
const routes = [];


// Create SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define map projection
const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])

const path = d3.geoPath();


// Load and display the map
us_map = d3.json("https://d3js.org/us-10m.v2.json").then(function(us) {
    svg.append("g")
        //.attr("class", "state")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")        
        .attr("fill", "#ccc")
        .attr("stroke", "#333")
        .attr("d", path);
        
        return "Something";
});

// Allow return from us_map
//us_map.then(result => console.log(result));

// Function to update the network visualization
function updateVisualization() {
    // Clear previous routes
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();
    svg.selectAll(".label").remove();

    // Draw the routes
    svg.selectAll(".link")
        .data(routes)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => projection(airportCoords[d.source])[0])
        .attr("y1", d => projection(airportCoords[d.source])[1])
        .attr("x2", d => projection(airportCoords[d.target])[0])
        .attr("y2", d => projection(airportCoords[d.target])[1])
        .attr("stroke-width", d => d.passengers / 1000) // Line thickness based on passengers
        .attr("stroke", "blue");

    // Draw the airport nodes
    svg.selectAll(".node")
        .data(Object.keys(airportCoords))
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", d => projection(airportCoords[d])[0])
        .attr("cy", d => projection(airportCoords[d])[1])
        .attr("r", 5)
        .attr("fill", "red");

    // Add labels for airports
    svg.selectAll(".label")
        .data(Object.keys(airportCoords))
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => projection(airportCoords[d])[0])
        .attr("y", d => projection(airportCoords[d])[1])
        .attr("dy", -10)
        .attr("text-anchor", "middle")
        .text(d => d);
}

// Form submission handler to add new routes
const form = document.getElementById('route-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const origin = document.getElementById('origin').value.toUpperCase();
    const destination = document.getElementById('destination').value.toUpperCase();
    const passengers = parseInt(document.getElementById('passengers').value);
    const planes = parseInt(document.getElementById('planes').value);

    // Check if the airports exist in the airportCoords
    if (!airportCoords[origin] || !airportCoords[destination]) {
        alert("Invalid airport codes.");
        return;
    }

    // Add the new route
    routes.push({
        source: origin,
        target: destination,
        passengers: passengers,
        planes: planes
    });

    // Update the visualization with the new route
    updateVisualization();

    // Reset the form
    form.reset();
});

