export interface Sector {
  no: string;
  slug: string;
  name: string;
  /** Short name for tags and filter chips. */
  short: string;
}

/** Eight buyer types, one vendor agreement. Verbatim from the profile. */
export const sectors: Sector[] = [
  {
    no: "01",
    slug: "ecommerce-warehousing",
    name: "E-commerce, quick commerce and warehousing",
    short: "Warehousing",
  },
  {
    no: "02",
    slug: "renewable-energy-solar",
    name: "Renewable energy and solar parks",
    short: "Solar",
  },
  {
    no: "03",
    slug: "manufacturing-industrial",
    name: "Manufacturing and industrial units",
    short: "Manufacturing",
  },
  {
    no: "04",
    slug: "commercial-real-estate",
    name: "Commercial real estate and fit-out",
    short: "Fit-out",
  },
  {
    no: "05",
    slug: "hospitality-food-service",
    name: "Hospitality and food service",
    short: "Hospitality",
  },
  {
    no: "06",
    slug: "healthcare-institutional",
    name: "Healthcare and institutional",
    short: "Healthcare",
  },
  {
    no: "07",
    slug: "data-centres-it",
    name: "Data centres and IT infrastructure",
    short: "Data centres",
  },
  {
    no: "08",
    slug: "retail-franchise",
    name: "Retail chains and franchise networks",
    short: "Retail",
  },
];

export const sectorBySlug = (slug: string) =>
  sectors.find((s) => s.slug === slug);
