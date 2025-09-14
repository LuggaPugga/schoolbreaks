import { type FileRouteTypes } from "@/routeTree.gen";
import { Sitemap } from "tanstack-router-sitemap";
import { normalizeSlug } from "./utils";
import { Holiday } from "open-holiday-js";

export type TRoutes = FileRouteTypes["fullPaths"];

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: process.env.VERCEL_URL ?? "http://localhost:3000",
  defaultPriority: 0.5,
  routes: {
    "/": {
      priority: 1,
      changeFrequency: "daily",
    },
    "/$country/{-$subdivision}": async () => {
        const holiday = new Holiday()
        const countries = await holiday.getCountries()

        const dynamicRoutes: string[] = []

        for (const country of countries) {
            if (!country.isoCode || !country.name?.[0]?.text) continue            
            dynamicRoutes.push(`${normalizeSlug(country.name[0].text)}`)
            
            try {
                const subdivisions = await holiday.getSubdivisions(country.isoCode)
                const filteredSubdivisions = subdivisions.filter(subdivision => subdivision.name?.[0]?.text)
                
                if (!filteredSubdivisions || filteredSubdivisions.length === 0) continue
                for (const subdivision of filteredSubdivisions) {
                    if (!subdivision.name?.[0]?.text) continue
                    dynamicRoutes.push(`${normalizeSlug(country.name[0].text)}/${normalizeSlug(subdivision.name[0].text)}`)
                }
            } catch (error) {
                continue
            }
        }

      return dynamicRoutes.map((route) => ({
        path: `/${route}`,
        priority: 0.8,
        changeFrequency: "daily",
      }));
    },
  },
};