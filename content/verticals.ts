/**
 * The eight verticals.
 *
 * Item lists are verbatim from `Proserv Company Profile 2026.pdf` with ONE
 * documented exception — vertical 08, see the comment on it and NOTES.md item 4.
 */

export type SupplyModel = "stock-backed" | "indent";

export interface Vertical {
  no: string; // "01" … "08" — rendered as a display numeral
  slug: string;
  name: string;
  kicker: string; // the profile's own subtitle
  /** One-line positioning for the detail page. */
  positioning: string;
  items: string[];
  /** Sector slugs that typically consolidate this category. */
  sectors: string[];
  supplyModels: SupplyModel[];
  /** Indices into process.ts → regulatoryNotes that genuinely touch this vertical. */
  regulatory: number[];
}

export const verticals: Vertical[] = [
  {
    no: "01",
    slug: "building-materials",
    name: "Building Materials",
    kicker: "Structural, finishing and site supply",
    positioning:
      "Structure, envelope and finishing supplied against a bill of quantities, from foundation to handover.",
    items: [
      "Cement, TMT bars and structural steel sections",
      "Tiles, sanitaryware and bathroom fittings",
      "Plywood, laminates, boards and modular panels",
      "Paints, primers, waterproofing and adhesives",
      "Doors, windows, aluminium and uPVC systems",
    ],
    sectors: [
      "commercial-real-estate",
      "ecommerce-warehousing",
      "manufacturing-industrial",
      "hospitality-food-service",
      "healthcare-institutional",
      "retail-franchise",
    ],
    supplyModels: ["stock-backed", "indent"],
    regulatory: [0, 4, 5],
  },
  {
    no: "02",
    slug: "white-goods-appliances",
    name: "White Goods & Appliances",
    kicker: "Bulk and institutional supply",
    positioning:
      "Appliances in institutional quantity, with declared energy ratings and OEM warranty passed through in writing.",
    items: [
      "Refrigerators, washing machines, dishwashers",
      "Split, window, cassette and VRF air conditioners",
      "Water heaters, purifiers and dispensers",
      "Kitchen appliances, chimneys, hobs and microwaves",
      "Televisions and small domestic appliances",
    ],
    sectors: [
      "hospitality-food-service",
      "healthcare-institutional",
      "commercial-real-estate",
      "retail-franchise",
    ],
    supplyModels: ["stock-backed", "indent"],
    regulatory: [0, 1, 2, 3, 5],
  },
  {
    no: "03",
    slug: "commercial-refrigeration",
    name: "Commercial Refrigeration",
    kicker: "Cold chain and food service",
    positioning:
      "Cold chain from the display counter to the walk-in, specified against load, duty cycle and refrigerant compliance.",
    items: [
      "Deep freezers, chest freezers and visi coolers",
      "Cold rooms, modular walk-ins and blast chillers",
      "Display counters, bakery and deli merchandisers",
      "Condensing units, compressors and evaporator coils",
      "Refrigerated transport and cold chain solutions",
    ],
    sectors: [
      "hospitality-food-service",
      "retail-franchise",
      "ecommerce-warehousing",
      "healthcare-institutional",
    ],
    supplyModels: ["stock-backed", "indent"],
    regulatory: [1, 2, 5],
  },
  {
    no: "04",
    slug: "electrical-electronics",
    name: "Electrical & Electronics",
    kicker: "Power, protection and safety",
    positioning:
      "Power conditioning, backup and site safety systems sized to the connected load and the criticality of what sits behind it.",
    items: [
      "Lithium and lead-acid battery banks",
      "UPS and inverter systems, 1 kVA to 200 kVA",
      "Distribution and isolation transformers",
      "Servo and static voltage stabilizers",
      "CCTV, NVR systems and fire detection panels",
    ],
    sectors: [
      "manufacturing-industrial",
      "data-centres-it",
      "commercial-real-estate",
      "healthcare-institutional",
      "ecommerce-warehousing",
      "renewable-energy-solar",
    ],
    supplyModels: ["stock-backed", "indent"],
    regulatory: [0, 3, 5],
  },
  {
    no: "05",
    slug: "hvac-cooling",
    name: "HVAC & Cooling",
    kicker: "Air, cooling and ventilation",
    positioning:
      "Comfort and process cooling from packaged rooftop units to precision cooling for a white-space rack row.",
    items: [
      "Centralized, packaged and rooftop systems",
      "Precision cooling for data centres",
      "Air handling units and ducted systems",
      "Chillers, AHUs, FCUs and VRF systems",
      "Industrial ventilation and exhaust fans",
    ],
    sectors: [
      "data-centres-it",
      "commercial-real-estate",
      "manufacturing-industrial",
      "healthcare-institutional",
      "hospitality-food-service",
    ],
    supplyModels: ["indent"],
    regulatory: [1, 2, 5],
  },
  {
    no: "06",
    slug: "it-hardware",
    name: "IT Hardware",
    kicker: "Compute, storage and endpoints",
    positioning:
      "Compute, storage and endpoints for build-outs and refresh cycles, including tested refurbished fleet where budget requires it.",
    items: [
      "NAS, SAN and enterprise storage arrays",
      "GPU and CPU units for AI and ML workloads",
      "Rack, tower and blade servers",
      "Refurbished laptops and desktops, tested",
      "Workstations and edge computing devices",
    ],
    sectors: [
      "data-centres-it",
      "manufacturing-industrial",
      "commercial-real-estate",
      "healthcare-institutional",
      "retail-franchise",
    ],
    supplyModels: ["stock-backed", "indent"],
    regulatory: [3, 5],
  },
  {
    no: "07",
    slug: "material-handling",
    name: "Material Handling",
    kicker: "Lifting, moving and storage",
    positioning:
      "Fleet and storage for a warehouse floor, specified against load, lift height, aisle width and duty cycle.",
    items: [
      "Electric forklifts, 1.5T to 5T, lithium options",
      "Scissor lifts, 1.5 m to 6 m working height",
      "Pallet trucks, manual and semi-electric, to 3T",
      "Pallet racking and heavy-duty shelving",
      "Reach trucks, stackers and mobile cranes",
    ],
    sectors: [
      "ecommerce-warehousing",
      "manufacturing-industrial",
      "retail-franchise",
      "renewable-energy-solar",
    ],
    supplyModels: ["indent"],
    regulatory: [0, 5],
  },
  {
    no: "08",
    slug: "renewable-energy",
    name: "Renewable Energy",
    kicker: "Solar parks and balance of system",
    positioning:
      "Generation equipment and the balance of system that surrounds it, supplied to solar park and rooftop EPC schedules.",
    /**
     * ⚠️ EXTENDED BEYOND THE 2026 PROFILE — see NOTES.md item 4.
     *
     * The profile lists only the five balance-of-system lines (cables, conduit,
     * PPE, tools) under this heading — no generation equipment at all, despite
     * the "Solar parks" subtitle. A solar EPC buyer landing here would find
     * nothing they recognise as a solar purchase.
     *
     * The first five lines below are ADDITIONS, confirmed by the client as
     * categories Proserv supplies. They are not in the 2026 profile PDF.
     * ACTION: fold these into the next profile revision so the two documents
     * agree, or delete them here.
     */
    items: [
      "Monocrystalline PV modules, TOPCon and bifacial",
      "String and central inverters",
      "Module mounting structures, fixed-tilt and tracker",
      "DC cable, MC4 connectors and string combiner boxes",
      "Earthing, lightning protection and site SCADA",
      "HT and LT power cables, copper and aluminium",
      "Data, control and communication cables",
      "HDPE pipes, conduits and cable protection",
      "Safety equipment, PPE kits and site signage",
      "Hand and power tools, installation hardware",
    ],
    sectors: [
      "renewable-energy-solar",
      "manufacturing-industrial",
      "commercial-real-estate",
      "ecommerce-warehousing",
    ],
    supplyModels: ["indent", "stock-backed"],
    regulatory: [0, 4, 5],
  },
];

export const verticalBySlug = (slug: string) =>
  verticals.find((v) => v.slug === slug);

export const supplyModels: {
  id: SupplyModel;
  title: string;
  body: string;
}[] = [
  {
    id: "stock-backed",
    title: "Stock-backed lines",
    body: "Selected fast-moving lines held against demand. Quotation the same day, dispatch within 4 to 5 working days of a confirmed order.",
  },
  {
    id: "indent",
    title: "Indent and project supply",
    body: "Sourced against confirmed order from verified OEMs and authorised channel partners. Lead times confirmed in writing at quotation stage, never estimated verbally.",
  },
];

export const supplyModelById = (id: SupplyModel) =>
  supplyModels.find((m) => m.id === id)!;

/** Verbatim caveat. Must appear under the verticals grid. */
export const verticalsCaveat =
  "These are our standing categories, not the limit of what we source. Send a specification, a drawing or an OEM part number and we will revert with availability, lead time and a firm price.";
