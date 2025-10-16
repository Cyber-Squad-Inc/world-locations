# Next.js Usage Example

## Installation

```bash
# Using pnpm (recommended)
pnpm add @cyber_squad_inc/world-locations

# Or using npm
npm install @cyber_squad_inc/world-locations

# Or using yarn
yarn add @cyber_squad_inc/world-locations
```

## Usage in Next.js App Router

### Server Component Example

```typescript
// app/page.tsx
import { getCountries, getStates, getCities } from '@cyber_squad_inc/world-locations';

export default async function HomePage() {
  const countries = getCountries();
  const states = getStates('BD');
  const cities = getCities('BD', 'Dhaka');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        World Locations Data
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Countries</h2>
          <p className="text-gray-600">
            Total countries: <span className="font-bold">{countries.length}</span>
          </p>
          <div className="mt-4">
            <h3 className="font-medium">Sample countries:</h3>
            <ul className="list-disc list-inside mt-2">
              {countries.slice(0, 5).map((country) => (
                <li key={country.iso2} className="text-sm">
                  {country.name} ({country.iso2})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bangladesh States</h2>
          <p className="text-gray-600">
            Total states: <span className="font-bold">{states.length}</span>
          </p>
          <div className="mt-4">
            <h3 className="font-medium">States:</h3>
            <ul className="list-disc list-inside mt-2">
              {states.map((state) => (
                <li key={state.id} className="text-sm">
                  {state.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dhaka Cities</h2>
          <p className="text-gray-600">
            Total cities: <span className="font-bold">{cities.length}</span>
          </p>
          <div className="mt-4">
            <h3 className="font-medium">Cities:</h3>
            <ul className="list-disc list-inside mt-2">
              {cities.slice(0, 5).map((city) => (
                <li key={city.id} className="text-sm">
                  {city.name}
                  {city.population && (
                    <span className="text-gray-500 ml-2">
                      ({city.population.toLocaleString()})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Client Component Example

```typescript
// components/CountrySelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { getCountries, getStates, getCities } from '@cyber_squad_inc/world-locations';

interface Country {
  name: string;
  iso2: string;
  region?: string;
}

interface State {
  name: string;
  cities: Array<{
    name: string;
    population?: number | null;
  }>;
}

export default function CountrySelector() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [cities, setCities] = useState<Array<{ name: string; population?: number | null }>>([]);

  useEffect(() => {
    // Load countries on component mount
    const allCountries = getCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = getStates(selectedCountry);
      setStates(countryStates);
      setSelectedState('');
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = getCities(selectedCountry, selectedState);
      setCities(stateCities);
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name} {country.region && `(${country.region})`}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium mb-2">State/Province</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div>
          <label className="block text-sm font-medium mb-2">Cities</label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {cities.length > 0 ? (
              <ul className="space-y-1">
                {cities.map((city, index) => (
                  <li key={index} className="text-sm">
                    {city.name}
                    {city.population && (
                      <span className="text-gray-500 ml-2">
                        ({city.population.toLocaleString()})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No cities found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### API Route Example

```typescript
// app/api/countries/route.ts
import { NextResponse } from 'next/server';
import { getCountries, getCountry, getStates, getCities } from '@cyber_squad_inc/world-locations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const iso2 = searchParams.get('iso2');
  const state = searchParams.get('state');

  try {
    if (iso2 && state) {
      // Get cities for a specific state
      const cities = getCities(iso2, state);
      return NextResponse.json({ cities });
    } else if (iso2) {
      // Get states for a specific country
      const states = getStates(iso2);
      return NextResponse.json({ states });
    } else {
      // Get all countries
      const countries = getCountries();
      return NextResponse.json({ countries });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Country not found' },
      { status: 404 }
    );
  }
}
```

## TypeScript Support

The package includes full TypeScript support with exported interfaces:

```typescript
import type { 
  Country, 
  CountrySummary, 
  State, 
  City 
} from '@cyber_squad_inc/world-locations';

// Use the types in your components
const country: Country = getCountry('US');
const countries: CountrySummary[] = getCountries();
const states: State[] = getStates('US');
const cities: City[] = getCities('US', 'California');
```

## pnpm Workspace Usage

If you're using pnpm workspaces, you can link the package locally:

```bash
# In your world-locations project
pnpm link --global

# In your Next.js project
pnpm link --global @cyber_squad_inc/world-locations
```

This allows you to develop and test changes locally without publishing to npm.
