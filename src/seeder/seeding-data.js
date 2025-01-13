// Collectables data
// export const collectablesData = [
//   {
//     name: "Limited Release Wine",
//     description: "Exclusive limited edition wines.",
//     category: "Limited Release Wine",
//   },
//   {
//     name: "Vintage Wine",
//     description: "Wines from exceptional vintages.",
//     category: "Vintage Wine",
//   },
//   {
//     name: "Limited Release Spirits",
//     description: "Exclusive limited edition spirits.",
//     category: "Limited Release Spirits",
//   },
//   {
//     name: "Vintage Spirits",
//     description: "Spirits from exceptional vintages.",
//     category: "Vintage Spirits",
//   },
// ];

// Size data
export const sizeData = [
  { name: "Magnums (1.75L)" },
  { name: "Standard (750ml)" },
  { name: "Half (375ml)" },
  { name: "splits (187ml)" },
];

// Type data
export const typeData = [
  { name: "Screw caps" },
  { name: "Kosher" },
  { name: "Passover" },
  { name: "Mevshal" },
  { name: "Natural" },
]


// Dryness data
export const drynessData = [
  { name: "Born dry" },
  { name: "Dry" },
  { name: "Off dry" },
  { name: "Sweet" },
  { name: "Semi Sweet" },
];

export const wineCategoriesData = [
  {
    name: 'Red Wine',
    subCategories: [{ name: 'Merlot' }, { name: 'Cabernet Sauvignon' }, { name: 'Pinot Noir' },],
  },
  {
    name: 'White Wine',
    subCategories: [{ name: 'Chardonnay' }, { name: 'Sauvignon Blanc' }, { name: 'Riesling' },],
  },
  {
    name: 'Rose Wine',
    subCategories: [{ name: 'Provence Rosé' }, { name: 'Pinot Noir Rosé' }],
  },
  {
    name: 'Champagne & Sparkling',
    subCategories: [{ name: 'Champagne' }, { name: 'Prosecco' }, { name: 'Cava' },],
  },
  {
    name: 'Sake',
    subCategories: [{ name: 'Junmai' }, { name: 'Ginjo' }, { name: 'Daiginjo' }],
  },
  {
    name: 'Spirits',
    subCategories: [{ name: 'Whiskey' }, { name: 'Vodka' }, { name: 'Rum' },],
  },
  {
    name: 'Cans & Cocktails',
    subCategories: [{ name: 'Gin & Tonic' }, { name: 'Margarita' }, { name: 'Moscow Mule' },],
  },
  {
    name: 'Accessories',
    subCategories: [{ name: 'Corkscrews' }, { name: 'Wine Glasses' }],
  },
  {
    name: 'Uncategorized',
    subCategories: [{ name: 'Uncategorized' }],
  },
];

// Wine Regions data
// export const wineRegionsData = [
//   {
//     region: 'Napa Valley',
//     subRegions: [{ name: 'Rutherford' }, { name: 'St. Helena' }, { name: 'Oakville' },],
//   },
//   {
//     region: 'Bordeaux',
//     subRegions: [{ name: 'Médoc' }, { name: 'Saint-Émilion' }, { name: 'Pomerol' },],
//   },
//   {
//     region: 'Tuscany',
//     subRegions: [{ name: 'Chianti' }, { name: 'Montalcino' }, { name: 'Montepulciano' },],
//   },
// ];

export const wineRegionsData = [
  {
      country: 'USA',
      regions: [
          {
              region: 'Napa Valley',
              subRegions: [
                  { name: 'Rutherford' },
                  { name: 'St. Helena' },
                  { name: 'Oakville' },
              ],
          },
          // More regions...
      ],
  },
  {
      country: 'France',
      regions: [
          {
              region: 'Bordeaux',
              subRegions: [
                  { name: 'Médoc' },
                  { name: 'Saint-Émilion' },
                  { name: 'Pomerol' },
              ],
          },
          // More regions...
      ],
  },
];




// Vintages data
export const vintagesData = [
  { year: 2015, description: "Excellent year with balanced acidity and tannins." },
  { year: 2016, description: "Warm growing season resulting in rich flavors." },
  { year: 2017, description: "Cool climate preserved the freshness of the grapes." },
  { year: 2018, description: "Ideal conditions for high-quality harvest." },
  { year: 2019, description: "Exceptional harvest with intense concentration." },
];

// Membership Plan data
export const membershipPlansData = [
  {
    name: "Plan A",
    description: "Basic membership plan.",
    price: 29.99,
    benefits: ["Access to exclusive deals", "Monthly newsletters"],
    duration: "Monthly",
  },
  {
    name: "Plan B",
    description: "Premium membership plan.",
    price: 299.99,
    benefits: [
      "All Plan A benefits",
      "Early access to new releases",
      "Free shipping on all orders",
    ],
    duration: "Yearly",
  },
];


