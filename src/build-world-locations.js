
/* Build script: fetches Countries → States → Cities + enrichment.
 * Output: out/countries/{ISO2}.json (per-country), resume-safe.
 * Then run: npm run merge
 */
import fs from "fs";
import path from "path";
import axios from "axios";
import PQueue from "p-queue";
import * as dotenv from "dotenv";
import cliProgress from "cli-progress";

dotenv.config();

const OUT_DIR = path.resolve("out");
const COUNTRY_DIR = path.join(OUT_DIR, "countries");
fs.mkdirSync(COUNTRY_DIR, { recursive: true });

// All delays and API configurations removed - using static data only

// Static dataset URLs from dr5hn/countries-states-cities-database
const COUNTRIES_DATA_URL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";
const STATES_DATA_URL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/states.json";
const CITIES_DATA_URL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/states+cities.json";

const circleFlag = (iso2) => `https://hatscripts.github.io/circle-flags/flags/${iso2.toLowerCase()}.svg`;
const rectFlag = (iso2) => `https://flagcdn.com/w320/${iso2.toLowerCase()}.png`;

// Global cache for static datasets
let countriesData = null;
let statesData = null;
let citiesData = null;

// Load static datasets once
async function loadStaticDatasets() {
  if (!countriesData) {
    try {
      console.log("📥 Loading countries data...");
      const { data } = await axios.get(COUNTRIES_DATA_URL);
      countriesData = data;
      console.log(`✅ Loaded ${countriesData.length} countries`);
    } catch (e) {
      console.warn("⚠️ Failed to load countries data:", e.message);
      countriesData = [];
    }
  }

  if (!statesData) {
    try {
      console.log("📥 Loading states data...");
      const { data } = await axios.get(STATES_DATA_URL);
      statesData = data;
      console.log(`✅ Loaded ${statesData.length} states`);
    } catch (e) {
      console.warn("⚠️ Failed to load states data:", e.message);
      statesData = [];
    }
  }

  if (!citiesData) {
    try {
      console.log("📥 Loading cities data...");
      const { data } = await axios.get(CITIES_DATA_URL);
      citiesData = data;
      console.log(`✅ Loaded ${citiesData.length} cities`);
    } catch (e) {
      console.warn("⚠️ Failed to load cities data:", e.message);
      citiesData = [];
    }
  }
}

async function fetchCountries() {
  if (!countriesData) {
    console.warn("⚠️ Countries data not loaded");
    return [];
  }

  return countriesData.map(c => ({
    name: { common: c.name, official: c.name },
    iso2: c.iso2,
    iso3: c.iso3,
    numericCode: c.numeric_code,
    region: c.region,
    subregion: c.subregion,
    tld: c.tld,
    phoneCode: c.phonecode || "",
    capital: c.capital,
    languages: undefined, // Not available in dr5hn dataset
    currencies: c.currency ? { [c.currency]: c.currency_name } : undefined,
    timezones: c.timezones || [],
    latlng: undefined, // Not available in dr5hn dataset
    flagRect: rectFlag(c.iso2),
    flagRound: circleFlag(c.iso2),
    states: []
  }));
}

// New function to get states with cities for a country using ID-based mapping
async function getStatesWithCities(countryIso2) {
  try {
    if (!citiesData) {
      console.warn("⚠️ Cities data not loaded for:", countryIso2);
      return [];
    }

    // The states+cities.json file contains states with embedded cities
    // Find states for this country using country_id
    const countryId = countriesData.find(c => c.iso2 === countryIso2)?.id;
    if (!countryId) {
      console.warn("⚠️ Country ID not found for:", countryIso2);
      return [];
    }

    const countryStates = citiesData.filter(s => s.country_id === countryId);

    return countryStates.map(s => {
      const cities = s.cities || [];

      return {
        id: s.id,
        name: s.name.trim(),
        code: s.state_code || null,
        shortName: s.state_code || s.name.trim(),
        cities: cities.map(city => ({
          id: city.id,
          name: city.name.trim(),
          latlng: [Number(city.latitude) || null, Number(city.longitude) || null],
          population: city.population || null,
          districts: [],
          suburbs: []
        }))
      };
    });
  } catch (e) {
    console.warn("⚠️ Skipping states for:", countryIso2, e.message);
    return [];
  }
}

async function enrichCityGeoNames(cityName, countryCode) {
  // Disabled: Using static data only, no live API calls
  return { latlng: undefined, population: null };
}

// Disabled: Using static data only, no live API calls
async function fetchSubAreasOSM(cityName, latlng) {
  return { districts: [], suburbs: [] };
}

async function build() {
  // Load static datasets first
  await loadStaticDatasets();

  const countries = await fetchCountries();
  // Progress bars
  const bar = new cliProgress.SingleBar({ format: "Building |{bar}| {percentage}% | {value}/{total} countries" }, cliProgress.Presets.shades_classic);
  bar.start(countries.length, 0);

  // Resume support — skip if file for ISO2 exists
  for (const c of countries) {
    const outFile = path.join(COUNTRY_DIR, `${c.iso2}.json`);
    if (fs.existsSync(outFile)) {
      bar.increment();
      continue;
    }

    // Validate country data before processing
    if (!c.name?.common) {
      console.warn("⚠️ Skipping invalid country:", c);
      continue;
    }

    // Get states with cities using ID-based mapping
    c.states = await getStatesWithCities(c.iso2);

    fs.writeFileSync(outFile, JSON.stringify(c, null, 2));
    bar.increment();
  }

  bar.stop();
  console.log("✅ Per-country files written to:", COUNTRY_DIR);
}

build().catch(err => {
  console.error("Build failed:", err?.message);
  process.exit(1);
});
