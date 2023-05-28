// DOM-Elemente
// Select the :root pseudo-class
const root = document.documentElement;
const selectedYearElem = document.querySelector("#selectedYear");
const show = document.querySelector("#show");
const yearsRange = document.querySelector("#range");
const container = document.querySelector(".earth_container");
const countriesElemnts = document.querySelectorAll(".country");
let selectedCountry = "China"; // Startwert für country (Default Wert: Land)
let selectedYear = 1971; // Startwert (Default Wert: Jahr)

// Daten
let year = null;
let anteil_DerWeltCO2_Emissionen = "0.89%";
let energieWirtschaft = null;
let verbrennend = null;
let andereIndustrielleVerbrennung = null;
let transport = null;
let building = null;
// Chartdaten
let chartData = [energieWirtschaft, verbrennend, andereIndustrielleVerbrennung, transport, building];
console.log(chartData);

// update_SelectedCountry nach Klick
const update_SelectedCountry = () => {
    countriesElemnts.forEach((country) => {
        country.addEventListener("click", () => {
            // Entferne die 'active'-Klasse von allen Ländern
            countriesElemnts.forEach((c) => c.classList.remove("active"));

            // Füge die 'active'-Klasse nur dem ausgewählten Land hinzu
            country.classList.add("active");

            selectedCountry = country.textContent;
            console.log("Klick: selectedCountry: " + selectedCountry);
            fetchData(selectedCountry, selectedYear);
            fillEarth();
            createChart();
            console.log(chartData);
        });
    });
};

// update_SelectedYear nach Klick
const update_SelectedYear = () => {
    yearsRange.addEventListener("input", () => {
        selectedYear = yearsRange.value;
        // Aktualisiere das angezeigte Jahr
        selectedYearElem.textContent = selectedYear;
        fetchData(selectedCountry, selectedYear);
        fillEarth();
        console.log(chartData);
        createChart();
        console.log("Klick: selectedYear: " + selectedYear);
    });
};

/**
 * fillEarth
 *
 * Gibt den Prozentsatz der CO2-Emissionen aus
 *
 */
const fillEarth = () => {
    root.style.setProperty("--circle-fill", anteil_DerWeltCO2_Emissionen + "%");
    show.innerHTML = anteil_DerWeltCO2_Emissionen;
};

const fetchData = async (selectedCountry, selectedYear) => {
    try {
        const response = await fetch("data.json");
        const data = await response.json();

        // Überprüfe, ob das ausgewählte Land im JSON vorhanden ist
        if (data[selectedCountry]) {
            const countryData = data[selectedCountry];
            let z_year = null;
            let z_anteil_DerWeltCO2_Emissionen = null;
            let z_energieWirtschaft = null;
            let z_verbrennend = null;
            let z_andereIndustrielleVerbrennung = null;
            let z_transport = null;
            let z_building = null;

            // Durchsuche die Daten für das ausgewählte Land nach dem ausgewählten Jahr
            for (let i = 0; i < countryData.length; i++) {
                if (countryData[i].Jahr == selectedYear) {
                    console.log("SelectedcountryData für " + selectedCountry + " in: " + countryData[i].Jahr);
                    z_year = countryData[i]["Jahr"];
                    z_anteil_DerWeltCO2_Emissionen = countryData[i]["Anteil der Welt CO2-Emissionen"];
                    z_energieWirtschaft = countryData[i]["Energiewirtschaft"];
                    z_verbrennend = countryData[i]["nicht verbrennend"];
                    z_andereIndustrielleVerbrennung = countryData[i]["andere industrielle Verbrennung"];
                    z_transport = countryData[i]["Transport"];
                    z_building = countryData[i]["Building"];
                    break;
                }
            }

            // Überprüfe, ob die Daten für das ausgewählte Jahr vorhanden sind
            if (
                z_anteil_DerWeltCO2_Emissionen !== null &&
                z_energieWirtschaft !== null &&
                z_verbrennend !== null &&
                z_andereIndustrielleVerbrennung !== null &&
                z_transport !== null &&
                z_building !== null
            ) {
                anteil_DerWeltCO2_Emissionen = parseFloat(z_anteil_DerWeltCO2_Emissionen.replace("%", ""));
                energieWirtschaft = parseFloat(z_energieWirtschaft.replace("%", ""));
                verbrennend = parseFloat(z_verbrennend.replace("%", ""));
                andereIndustrielleVerbrennung = parseFloat(z_andereIndustrielleVerbrennung.replace("%", ""));
                transport = parseFloat(z_transport.replace("%", ""));
                building = parseFloat(z_building.replace("%", ""));

                chartData = [energieWirtschaft, verbrennend, andereIndustrielleVerbrennung, transport, building];
                console.log("chartData von fetch function: ", chartData);
                createChart();
            } else {
                console.log("Daten für das ausgewählte Jahr nicht gefunden.");
            }
        } else {
            console.log("Daten für das ausgewählte Land nicht gefunden.");
        }
    } catch (error) {
        console.log("Fehler beim Laden der JSON-Daten: " + error);
    }
};

// Chart
// Deklariere eine globale Variable für die Chart-Instanz
let chartInstance = null;

// Funktion zum Zerstören der Chart-Instanz
const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy();
    }
};

const createChart = () => {
    const ctx = document.getElementById("myChart");
    destroyChart();

    const type = "doughnut"; //doughnut, pie
    const data = {
        labels: ["energieWirtschaft", "verbrennend", "andereIndustrielleVerbrennung", "transport", "building"],
        datasets: [
            {
                label: "",
                data: chartData,
                backgroundColor: ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(201, 203, 207)", "rgb(54, 162, 235)"],
            },
        ],
    };

    const options = {
        responsive: true,
        title: {
            display: true,
            text: "ztddztdztd",
            fontSize: 18,
            fontColor: "#333",
            padding: 20,
        },
        legend: {
            position: "bottom",
            labels: {
                fontSize: 29,
                fontColor: "red",
            },
        },
        scales: {
            x: {
                display: false, // Hier wird die x-Achse ausgeblendet
                type: "category",
                labels: [],
                grid: {
                    display: true,
                    color: "red",
                },
            },
            y: {
                display: false, // Hier wird die y-Achse ausgeblendet
                ticks: {
                    beginAtZero: true,
                    fontColor: "#a66",
                },
                grid: {
                    display: false,
                    color: "#000",
                },
                scaleLabel: {
                    display: true,
                    labelString: "Sales ($)",
                    fontColor: "#333",
                    fontStyle: "bold",
                    fontSize: 16,
                },
            },
        },
    };

    const plugins = [];

    const config = {
        type: type,
        data: data,
        options: options,
        plugins: plugins,
    };

    chartInstance = new Chart(ctx, config);
};

const app = () => {
    update_SelectedCountry();
    update_SelectedYear();
    fetchData(selectedCountry, selectedYear);
    fillEarth();
    createChart();
};

app();
