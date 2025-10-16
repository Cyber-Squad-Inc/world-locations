
import { z } from "zod";

export const CitySchema = z.object({
  name: z.string(),
  latlng: z.tuple([z.number(), z.number()]).optional(),
  population: z.number().nullable().optional(),
  districts: z.array(z.string()).optional(),
  suburbs: z.array(z.string()).optional(),
});

export const StateSchema = z.object({
  name: z.string(),
  code: z.string().nullable().optional(),
  shortName: z.string().nullable().optional(),
  latlng: z.tuple([z.number(), z.number()]).optional(),
  timezone: z.string().optional(),
  cities: z.array(CitySchema),
});

export const CountrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string().optional(),
  }),
  iso2: z.string().length(2),
  iso3: z.string().length(3).optional(),
  numericCode: z.string().optional(),
  region: z.string().optional(),
  subregion: z.string().optional(),
  tld: z.array(z.string()).optional(),
  phoneCode: z.string().optional(),
  capital: z.union([z.string(), z.array(z.string())]).optional(),
  languages: z.array(z.string()).optional(),
  currencies: z.record(z.string()).optional(),
  timezones: z.array(z.string()).optional(),
  latlng: z.tuple([z.number(), z.number()]).optional(),
  flagRect: z.string().url(),
  flagRound: z.string().url(),
  states: z.array(StateSchema),
});

export const WorldSchema = z.object({
  countries: z.array(CountrySchema)
});
