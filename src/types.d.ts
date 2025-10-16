
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
  tld?: string[];
  phoneCode?: string;
  capital?: string | string[];
  languages?: string[];
  currencies?: Record<string, string>;
  timezones?: string[];
  latlng?: [number, number];
  flagRect: string;  // https://flagcdn.com/w320/{iso2}.png
  flagRound: string; // https://hatscripts.github.io/circle-flags/flags/{iso2}.svg
  states: State[];
}

export interface State {
  name: string;
  code?: string | null;
  shortName?: string | null;
  latlng?: [number, number];
  timezone?: string;
  cities: City[];
}

export interface City {
  name: string;
  latlng?: [number, number];
  population?: number | null;
  districts?: string[];
  suburbs?: string[];
}
