// Track the state of filter buttons
let filterButton1Active = false;
let filterButton2Active = false;
let jsonData = []; // Global variable to hold fetched JSON data

// Function to fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json"); // Replace 'data.json' with your JSON file's path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize(); // Populate the table and filters after fetching data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item) => {
        const row = document.createElement("tr");
        for (const key in item) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    });
}

// Function to populate dropdown filters dynamically based on filtered data
function populateFilters(filteredData) {
    const detsMeNames = new Set();
    const detsBeats = new Set();
    const fnrMeNames = new Set();
    const fnrBeats = new Set();

    // Populate sets based on filtered data
    filteredData.forEach((row) => {
        if (row["DETS ME Name"]) detsMeNames.add(row["DETS ME Name"]);
        if (row["DETS Beat"]) detsBeats.add(row["DETS Beat"]);
        if (row["FnR ME Name"]) fnrMeNames.add(row["FnR ME Name"]);
        if (row["FnR Beat"]) fnrBeats.add(row["FnR Beat"]);
    });

    // Populate dropdowns
    populateSelectDropdown("filter-deets-me-name", detsMeNames);
    populateSelectDropdown("filter-deets-beat", detsBeats);
    populateSelectDropdown("filter-fnr-me-name", fnrMeNames);
    populateSelectDropdown("filter-fnr-beat", fnrBeats);
}

// Function to populate dropdown options
function populateSelectDropdown(id, optionsSet) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = '<option value="">All</option>'; // Add a default 'All' option
    optionsSet.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Function to apply all filters and update the table
function applyFilters() {
    let filteredData = [...jsonData]; // Start with the original data

    // Search Bar Filter
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (searchQuery) {
        filteredData = filteredData.filter((row) => {
            return (
                row["HUL Code"].toLowerCase().includes(searchQuery) ||
                row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
            );
        });
    }

    // Dropdown Filters
    const filterDetsMeName = document.getElementById("filter-deets-me-name").value;
    const filterDetsBeat = document.getElementById("filter-deets-beat").value;
    const filterFnrMeName = document.getElementById("filter-fnr-me-name").value;
    const filterFnrBeat = document.getElementById("filter-fnr-beat").value;

    if (filterDetsMeName) {
        filteredData = filteredData.filter((row) => row["DETS ME Name"] === filterDetsMeName);
    }
    if (filterDetsBeat) {
        filteredData = filteredData.filter((row) => row["DETS Beat"] === filterDetsBeat);
    }
    if (filterFnrMeName) {
        filteredData = filteredData.filter((row) => row["FnR ME Name"] === filterFnrMeName);
    }
    if (filterFnrBeat) {
        filteredData = filteredData.filter((row) => row["FnR Beat"] === filterFnrBeat);
    }

    // Filter Button Logic
    if (filterButton1Active) {
        filteredData = filteredData.filter((row) => row["ECO"] < 1000);
    }
    if (filterButton2Active) {
        filteredData = filteredData.filter(
            (row) => row["Shikhar"] < 500 && row["Shikhar Onboarding"] === "YES"
        );
    }

    // Update table
    populateTable(filteredData);

    // Update cascading dropdown options
    populateFilters(filteredData); // Use the filtered data to update dropdown options
}

// Event listeners for dropdowns and search bar
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-deets-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-deets-beat").addEventListener("change", applyFilters);
document.getElementById("filter-fnr-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-fnr-beat").addEventListener("change", applyFilters);

// Filter button event listeners
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters(); // Reapply all filters
});

document.getElementById("filter-button-2").addEventListener("click", () => {
    filterButton2Active = !filterButton2Active;
    document.getElementById("filter-button-2").style.backgroundColor = filterButton2Active ? "green" : "blue";
    applyFilters(); // Reapply all filters
});

// Reset button functionality
document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    filterButton2Active = false;

    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("filter-button-2").style.backgroundColor = "blue";

    document.getElementById("search-bar").value = "";
    document.getElementById("filter-deets-me-name").value = "";
    document.getElementById("filter-deets-beat").value = "";
    document.getElementById("filter-fnr-me-name").value = "";
    document.getElementById("filter-fnr-beat").value = "";

    applyFilters(); // Reset filters and update table
});

// Initialize the table and filters
function initialize() {
    populateTable(jsonData);
    populateFilters(jsonData);
}

// Fetch data and initialize the page
fetchData();