import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../out/world-locations.full.json.gz");

export interface City {
    id?: number;
    name: string;
    latlng?: [number, number];
    population?: number | null;
    districts?: string[];
    suburbs?: string[];
}

export interface State {
    id?: number;
    name: string;
    code?: string | null;
    shortName?: string | null;
    cities: City[];
}

export interface Timezone {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}

export interface Country {
    name: {
        common: string;
        official?: string;
    };
    iso2: string;
    iso3?: string;
    numericCode?: string;
    region?: string;
    subregion?: string;
    tld?: string;
    phoneCode?: string;
    capital?: string;
    currencies?: Record<string, string>;
    timezones?: Timezone[];
    flagRect?: string;
    flagRound?: string;
    states: State[];
}

export interface CountrySummary {
    name: string;
    officialName?: string;
    iso2: string;
    iso3?: string;
    numericCode?: string;
    phoneCode?: string;
    flag?: string;
    flagRound?: string;
    capital?: string;
    region?: string;
    subregion?: string;
    tld?: string;
    currencies?: Record<string, string>;
    timezones?: Timezone[];
}

export interface WorldData {
    dataVersion: string;
    countries: Country[];
}

let cache: WorldData | null = null;

function readData(): WorldData {
    if (!cache) {
        const buffer = fs.readFileSync(dataPath);
        const json = zlib.gunzipSync(buffer).toString("utf-8");
        cache = JSON.parse(json) as WorldData;
    }
    return cache;
}

/**
 * Get the data version of the world locations dataset
 * @returns ISO date string of when the data was generated
 */
export function getDataVersion(): string {
    return readData().dataVersion;
}

/**
 * Get a lightweight list of all countries
 * @returns Array of country objects with basic info
 */
export function getCountries(): CountrySummary[] {
    const world = readData();
    return world.countries.map(data => ({
        name: data.name.common,
        officialName: data.name.official,
        iso2: data.iso2,
        iso3: data.iso3,
        numericCode: data.numericCode,
        phoneCode: data.phoneCode,
        flag: data.flagRect,
        flagRound: data.flagRound,
        capital: data.capital,
        region: data.region,
        subregion: data.subregion,
        tld: data.tld,
        currencies: data.currencies,
        timezones: data.timezones
    }));
}

/**
 * Get full country data by ISO2 code
 * @param iso2 - Two-letter country code (e.g., 'US', 'BD')
 * @returns Complete country object with states and cities
 */
export function getCountry(iso2: string): Country {
    const world = readData();
    const country = world.countries.find(
        c => c.iso2.toUpperCase() === iso2.toUpperCase()
    );
    
    if (!country) {
        throw new Error(`Country ${iso2} not found`);
    }
    
    return country;
}

/**
 * Get states/provinces for a specific country
 * @param iso2 - Two-letter country code
 * @returns Array of state objects
 */
export function getStates(iso2: string): State[] {
    const country = getCountry(iso2);
    return country.states || [];
}

/**
 * Get cities for a specific state in a country
 * @param iso2 - Two-letter country code
 * @param stateName - Name of the state/province
 * @returns Array of city objects
 */
export function getCities(iso2: string, stateName: string): City[] {
    const country = getCountry(iso2);
    const state = country.states?.find(
        s => s.name.trim().toLowerCase() === stateName.trim().toLowerCase()
    );
    return state ? state.cities : [];
}

/**
 * Search countries by name (case-insensitive)
 * @param query - Search query
 * @returns Array of matching countries
 */
export function searchCountries(query: string): CountrySummary[] {
    const countries = getCountries();
    const searchTerm = query.toLowerCase();
    return countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm) ||
        (country.officialName && country.officialName.toLowerCase().includes(searchTerm)) ||
        country.iso2.toLowerCase().includes(searchTerm) ||
        (country.iso3 && country.iso3.toLowerCase().includes(searchTerm))
    );
}

/**
 * Get countries by region
 * @param region - Region name (e.g., 'Europe', 'Asia', 'Africa')
 * @returns Array of countries in the region
 */
export function getCountriesByRegion(region: string): CountrySummary[] {
    const countries = getCountries();
    return countries.filter(country =>
        country.region && country.region.toLowerCase() === region.toLowerCase()
    );
}

/**
 * Get countries by subregion
 * @param subregion - Subregion name
 * @returns Array of countries in the subregion
 */
export function getCountriesBySubregion(subregion: string): CountrySummary[] {
    const countries = getCountries();
    return countries.filter(country =>
        country.subregion && country.subregion.toLowerCase() === subregion.toLowerCase()
    );
}

// Default export with all functions
export default {
    getDataVersion,
    getCountries,
    getCountry,
    getStates,
    getCities,
    searchCountries,
    getCountriesByRegion,
    getCountriesBySubregion
};