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
let rankElement = document.getElementById("rank");
let pobulationElement = document.getElementById("population");
let co2_tonnenElement = document.getElementById("co2_tonnen");
// Daten
let year = null;
let anteil_DerWeltCO2_Emissionen = "";
let energieWirtschaft = null;
let verbrennend = null;
let andereIndustrielleVerbrennung = null;
let transport = null;
let building = null;
let rank = null;
let population = null;
let co2_tonnen = null;
// Chartdaten
let chartData = [
    energieWirtschaft,
    verbrennend,
    andereIndustrielleVerbrennung,
    transport,
    building,
];
console.log(chartData);

// update_SelectedCountry nach Klick
const update_SelectedCountry = () => {
    countriesElemnts.forEach((country) => {
        country.addEventListener("click", () => {
            selectedCountry = country.textContent;
            fetchData(selectedCountry, selectedYear);
            fillEarth();
            fillInfo();
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
        console.log(chartData);
        fetchData(selectedCountry, selectedYear);
        fillEarth();
        fillInfo();
        createChart();
        console.log("Klick: selectedYear: " + selectedYear);
    });
};

/**
 * fillEarth
 * Gibt den Prozentsatz der CO2-Emissionen aus
 */
const fillEarth = () => {
    root.style.setProperty("--circle-fill", anteil_DerWeltCO2_Emissionen + "%");
    show.innerHTML = anteil_DerWeltCO2_Emissionen + "%";
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
            let z_rank = null;
            let z_population = null;
            let z_co2_tonnen = null;

            // Durchsuche die Daten für das ausgewählte Land nach dem ausgewählten Jahr
            for (let i = 0; i < countryData.length; i++) {
                if (countryData[i].Jahr == selectedYear) {
                    console.log(
                        "SelectedcountryData für " +
                        selectedCountry +
                        " in: " +
                        countryData[i].Jahr
                    );
                    z_year = countryData[i]["Jahr"];
                    z_anteil_DerWeltCO2_Emissionen =
                        countryData[i]["Anteil der Welt CO2-Emissionen"];
                    z_energieWirtschaft = countryData[i]["Energiewirtschaft"];
                    z_verbrennend = countryData[i]["nicht verbrennend"];
                    z_andereIndustrielleVerbrennung =
                        countryData[i]["andere industrielle Verbrennung"];
                    z_transport = countryData[i]["Transport"];
                    z_building = countryData[i]["Building"];
                    z_rank = countryData[i]["Rank"];
                    z_co2_tonnen = countryData[i]["Fossile CO2-Emissionen (Tonnen)"];
                    z_population = countryData[i]["Bevoelkerung"];
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
                z_building !== null &&
                z_rank !== null &&
                z_population !== null &&
                z_co2_tonnen !== null
            ) {
                anteil_DerWeltCO2_Emissionen = parseFloat(
                    z_anteil_DerWeltCO2_Emissionen.replace("%", "")
                );
                energieWirtschaft = parseFloat(z_energieWirtschaft.replace("%", ""));
                verbrennend = parseFloat(z_verbrennend.replace("%", ""));
                andereIndustrielleVerbrennung = parseFloat(
                    z_andereIndustrielleVerbrennung.replace("%", "")
                );
                transport = parseFloat(z_transport.replace("%", ""));
                building = parseFloat(z_building.replace("%", ""));
                rank = z_rank;
                population = z_population;
                co2_tonnen = z_co2_tonnen;

                chartData = [
                    energieWirtschaft,
                    verbrennend,
                    andereIndustrielleVerbrennung,
                    transport,
                    building,
                ];
                console.log("chartData von fetch function: ", chartData);
                createChart();
                fillEarth();
                fillInfo();
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

    const type = "polarArea"; //doughnut, pie, polarArea, line, bar, bubble
    const data = {
        labels: [
            "energieWirtschaft",
            "verbrennend",
            "andereIndustrielleVerbrennung",
            "transport",
            "building",
        ],
        datasets: [
            {
                label: "Carbon Anteil in %",
                data: chartData,
                backgroundColor: [
                    "rgba(6, 55, 30, 0.7)",
                    "rgba(6, 115, 200, 0.7)",
                    "rgba(255, 55, 30, 0.7)",
                    "rgba(28, 91, 76, 0.7)",
                    "rgba(110, 55, 30, 0.7)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
            title: {
                display: false,
                text: "CO2",
                fontSize: 3,
                fontColor: "#000",
                padding: 20,
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 60,
                    stepSize: 10,
                },
            },
            gridLines: {
                color: "rgba(0, 0, 0, 0.3)",
                circular: true,
            },
            angleLines: {
                color: "rgba(0, 0, 0, 0.3)",
            },
        },
    };

    const config = {
        type: type,
        data: data,
        options: options,
    };

    chartInstance = new Chart(ctx, config);
};
function fillInfo() {
    rankElement.innerHTML = rank;
    pobulationElement.innerHTML = population;
    co2_tonnenElement.innerHTML = co2_tonnen;
}

const app = () => {
    update_SelectedCountry();
    update_SelectedYear();
    fetchData(selectedCountry, selectedYear);
    createChart();
    fillEarth();
    fillInfo();
};

app();

var countries = document.querySelectorAll('.countries .country');
var activeCountry = document.querySelector('.countries .country.active');

countries.forEach((country) => {
    country.addEventListener('click', () => {
        // das aktive Land wird inaktiv
        activeCountry.classList.remove('active');
        // das geklickte Land wird aktiv
        country.classList.add('active');
        // das geklickte Land wird zum neuen aktiven Land
        activeCountry = country;
    });
});


