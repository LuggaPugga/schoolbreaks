import { type FileRouteTypes } from "@/routeTree.gen";
import { normalizeSlug } from "./utils";
import { Holiday } from "open-holiday-js";

export type TRoutes = FileRouteTypes["fullPaths"];

type SitemapEntry = {
  url: string;
  priority: string;
  changefreq: string;
};

export async function getSitemap(): Promise<string> {
  const siteUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";

  const staticUrls: SitemapEntry[] = [
    { url: "/", priority: "1.0", changefreq: "daily" },
  ];

  const holiday = new Holiday();
  const countries = await holiday.getCountries();

  const dynamicUrls: SitemapEntry[] = [];

  for (const country of countries) {
    const countryName = country.name?.[0]?.text;
    if (!country.isoCode || !countryName) continue;

    const countrySlug = normalizeSlug(countryName);
    dynamicUrls.push({
      url: `/${countrySlug}`,
      priority: "0.8",
      changefreq: "monthly",
    });

    try {
      const subdivisions = await holiday.getSubdivisions(country.isoCode);
      for (const subdivision of subdivisions) {
        const subdivisionName = subdivision.name?.[0]?.text;
        if (!subdivisionName) continue;

        const subdivisionSlug = normalizeSlug(subdivisionName);
        dynamicUrls.push({
          url: `/${countrySlug}/${subdivisionSlug}`,
          priority: "0.8",
          changefreq: "monthly",
        });
      }
    } catch {
      continue;
    }
  }

  const allUrls = [...staticUrls, ...dynamicUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
	.map(
		({ url, priority, changefreq }) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`,
	)
	.join("\n")}
</urlset>`;

  return xmlContent;
}