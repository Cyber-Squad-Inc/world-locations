export interface World {
  countries: Country[];
}

export interface Country {
  name: { common: string; official?: string };
  iso2: string;
  iso3?: string;
  numericCode?: string;
  region?: string;
  subregion?: string;
  tld?: string;
  phoneCode?: string;
  capital?: string;
  languages?: string[];
  currencies?: Record<string, string>;
  timezones?: Timezone[];
  latlng?: [number, number];
  flagRect?: string;  // https://flagcdn.com/w320/{iso2}.png
  flagRound?: string; // https://hatscripts.github.io/circle-flags/flags/{iso2}.svg
  states: State[];
}

export interface State {
  id?: number;
  name: string;
  code?: string | null;
  shortName?: string | null;
  latlng?: [number, number];
  timezone?: string;
  cities: City[];
}

export interface City {
  id?: number;
  name: string;
  latlng?: [number, number];
  population?: number | null;
  districts?: string[];
  suburbs?: string[];
}

export interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
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