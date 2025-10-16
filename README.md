
<p align="center">
  <img src="https://github.com/Cyber-Squad-Inc/assets/blob/main/logo.png" width="120" />
</p>

<h1 align="center">🌍 @cyber_squad_inc/world-locations</h1>

<p align="center">
  Complete offline world dataset with countries, states, and cities — maintained by <b>Cyber Squad Inc</b>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@cyber_squad_inc/world-locations">
    <img src="https://img.shields.io/npm/v/@cyber_squad_inc/world-locations.svg?style=flat-square" alt="npm version" />
  </a>
  <a href="https://github.com/Cyber-Squad-Inc/world-locations">
    <img src="https://img.shields.io/github/stars/Cyber-Squad-Inc/world-locations.svg?style=flat-square" alt="GitHub stars" />
  </a>
  <a href="https://github.com/Cyber-Squad-Inc/world-locations/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" />
  </a>
</p>

## ✨ Features

- **249 countries** with complete data
- **States/Provinces** for each country
- **Cities** with coordinates and population data
- **ISO codes** (ISO2, ISO3, numeric)
- **Phone codes** and **timezones**
- **Flags** (rectangular and round)
- **Currencies** and **languages**
- **Regions** and **subregions**
- **Districts** and **suburbs** (where available)
- **Zero dependencies** for runtime usage
- **Offline-first** - no API calls needed

## 📦 Install

```bash
npm install @cyber_squad_inc/world-locations
```

## 🚀 Usage

### Basic Usage

```javascript
import { getCountries, getCountry, getStates, getCities } from '@cyber_squad_inc/world-locations';

// Get all countries (lightweight list)
const countries = getCountries();
console.log(countries);
// [
//   {
//     name: "United States",
//     officialName: "United States of America",
//     iso2: "US",
//     iso3: "USA",
//     phoneCode: "1",
//     flag: "https://flagcdn.com/w320/us.png",
//     capital: "Washington, D.C.",
//     region: "Americas",
//     subregion: "North America",
//     // ... more fields
//   },
//   // ... 248 more countries
// ]

// Get full country data
const usa = getCountry('US');
console.log(usa.name.common); // "United States"
console.log(usa.states.length); // 50+ states

// Get states for a country
const states = getStates('BD');
console.log(states);
// [
//   { name: "Dhaka", code: "13", cities: [...] },
//   { name: "Chittagong", code: "10", cities: [...] },
//   // ... more states
// ]

// Get cities for a specific state
const cities = getCities('BD', 'Dhaka');
console.log(cities);
// [
//   { name: "Dhaka", latlng: [23.8103, 90.4125], population: 10356500 },
//   { name: "Gazipur", latlng: [24.0023, 90.4264], population: 1200000 },
//   // ... more cities
// ]
```

### Advanced Usage

```javascript
import { 
  searchCountries, 
  getCountriesByRegion, 
  getCountriesBySubregion 
} from '@cyber_squad_inc/world-locations';

// Search countries by name
const results = searchCountries('united');
console.log(results);
// [
//   { name: "United States", iso2: "US", ... },
//   { name: "United Kingdom", iso2: "GB", ... },
//   { name: "United Arab Emirates", iso2: "AE", ... }
// ]

// Get countries by region
const europeanCountries = getCountriesByRegion('Europe');
console.log(europeanCountries.length); // 50+ countries

// Get countries by subregion
const scandinavianCountries = getCountriesBySubregion('Northern Europe');
console.log(scandinavianCountries);
// [
//   { name: "Denmark", iso2: "DK", ... },
//   { name: "Finland", iso2: "FI", ... },
//   { name: "Iceland", iso2: "IS", ... },
//   { name: "Norway", iso2: "NO", ... },
//   { name: "Sweden", iso2: "SE", ... }
// ]
```

### Default Import

```javascript
import worldLocations from '@cyber_squad_inc/world-locations';

const countries = worldLocations.getCountries();
const usa = worldLocations.getCountry('US');
const states = worldLocations.getStates('US');
const cities = worldLocations.getCities('US', 'California');
```

## 📊 Data Structure

### Country Object
```typescript
interface Country {
  name: {
    common: string;
    official: string;
  };
  iso2: string;
  iso3: string;
  numericCode: string;
  region: string;
  subregion: string;
  tld: string;
  phoneCode: string;
  capital: string;
  currencies: Record<string, string>;
  timezones: Array<{
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }>;
  flagRect: string;
  flagRound: string;
  states: State[];
}
```

### State Object
```typescript
interface State {
  id: number;
  name: string;
  code: string;
  shortName: string;
  cities: City[];
}
```

### City Object
```typescript
interface City {
  id: number;
  name: string;
  latlng: [number, number];
  population: number | null;
  districts: string[];
  suburbs: string[];
}
```

## 🛠️ Development

This package is built from multiple data sources:
- **REST Countries** for country data, flags, and codes
- **GeoNames** for city coordinates and population
- **OpenStreetMap** for districts and suburbs
- **countriesnow.space** for states and cities

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on [GitHub](https://github.com/Cyber-Squad-Inc/world-locations/issues).
