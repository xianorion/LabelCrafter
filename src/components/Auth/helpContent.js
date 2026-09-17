const etsySteps = [
  {
    number: '01',
    title: 'Open Orders in Etsy',
    text: "In Etsy Shop Manager, use the side bar to open Orders and start from the orders you need to ship.",
    image: '/images/etsy/Step 1. On the side bar go to orders.png',
  },
  {
    number: '02',
    title: 'Choose orders to ship',
    text: "Select the orders you want to include, then open More Actions to find the packing-slip option.",
    image: "/images/etsy/Step 2. Select the Orders you'd like to ship and then click 'More Actions'.png",
  },
  {
    number: '03',
    title: 'Print Etsy packing slips',
    text: "Choose Print packing slips. Etsy will create a PDF; upload that PDF to ParseLab and choose Etsy before parsing.",
    image: "/images/etsy/Step 3. Select print packing slips and you'll get a pdf of the packing slips that you can grive to ParseLab.png",
  },
]

const shopifySteps = [
  {
    number: '01',
    title: 'Open Orders in Shopify',
    text: "In the Shopify admin side bar, open Orders to find the orders you want to prepare for shipping.",
    image: '/images/shopify/Step 1. Go to Orders in the Shopify Side bar.png',
  },
  {
    number: '02',
    title: 'Print Shopify packing slips',
    text: "Select the orders you want to process, click Print, and choose Print packing slips. Save or download the resulting PDF.",
    image: "/images/shopify/Step 2. Select the orders you'd like to generate labels for and click the 'Print' button and choose print packing slips.png",
  },
  {
    number: '03',
    title: 'Upload the PDF to ParseLab',
    text: "Return to ParseLab, choose Shopify, and upload the packing-slip PDF. ParseLab will collect the address under each Ship to section for your printable labels.",
  },
]

export const helpStepsByPlatform = {
  etsy: etsySteps,
  shopify: shopifySteps,
}

export const helpPlatforms = [
  { id: 'etsy', label: 'Etsy' },
  { id: 'shopify', label: 'Shopify' },
]
