import { embeddedDataBase64 } from "./embedded-data.js";
import { gunzipSync } from "fflate";
import type { Country, State, City, CountrySummary, Timezone, WorldData } from "./types.js";

let cache: { dataVersion: string; countries: Country[] } | null = null;

function toUint8FromBase64(b64: string): Uint8Array {
    // Node.js
    if (typeof Buffer !== "undefined") {
        return new Uint8Array(Buffer.from(b64, "base64"));
    }
    // Browser
    const binary = atob(b64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return arr;
}

function loadEmbeddedData(): { dataVersion: string; countries: Country[] } {
    if (!cache) {
        const binary = toUint8FromBase64(embeddedDataBase64);
        const json = new TextDecoder("utf-8").decode(gunzipSync(binary));
        cache = JSON.parse(json);
    }
    return cache!;
}

// --- Public API ---

/**
 * Get the data version of the world locations dataset
 * @returns ISO date string of when the data was generated
 */
export function getDataVersion(): string {
    return loadEmbeddedData().dataVersion;
}

/**
 * Get a lightweight list of all countries
 * @returns Array of country objects with basic info
 */
export function getCountries(): CountrySummary[] {
    const data = loadEmbeddedData();
    return data.countries.map(c => ({
        name: c.name.common,
        officialName: c.name.official,
        iso2: c.iso2,
        iso3: c.iso3,
        numericCode: c.numericCode,
        phoneCode: c.phoneCode,
        flag: c.flagRect,
        flagRound: c.flagRound,
        capital: c.capital,
        region: c.region,
        subregion: c.subregion,
        tld: c.tld,
        currencies: c.currencies,
        timezones: c.timezones
    }));
}

/**
 * Get full country data by ISO2 code
 * @param iso2 - Two-letter country code (e.g., 'US', 'BD')
 * @returns Complete country object with states and cities
 */
export function getCountry(iso2: string): Country | undefined {
    const data = loadEmbeddedData();
    return data.countries.find(c => c.iso2.toUpperCase() === iso2.toUpperCase());
}

/**
 * Get states/provinces for a specific country
 * @param iso2 - Two-letter country code
 * @returns Array of state objects
 */
export function getStates(iso2: string): State[] {
    const country = getCountry(iso2);
    return country?.states || [];
}

/**
 * Get cities for a specific state in a country
 * @param iso2 - Two-letter country code
 * @param stateName - Name of the state/province
 * @returns Array of city objects
 */
export function getCities(iso2: string, stateName: string): City[] {
    const country = getCountry(iso2);
    const state = country?.states?.find(
        s => s.name.trim().toLowerCase() === stateName.trim().toLowerCase()
    );
    return state?.cities || [];
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

// Re-export types for convenience
export type { Country, State, City, CountrySummary, Timezone, WorldData } from "./types.js";

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