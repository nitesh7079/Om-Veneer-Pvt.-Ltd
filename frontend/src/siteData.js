import productImageLinks from "./productImageLinks";

export const defaultProducts = [
  {
    _id: "1",
    name: "2.5mm Core",
    description:
      "Premium 2.5mm core veneer for strong plywood structure and long service life.",
    image: productImageLinks["2.5mm Core"],
  },
  {
    _id: "2",
    name: "2.5mm Fali",
    description:
      "Reliable 2.5mm fali veneer with clean grain and dependable adhesive performance.",
    image: productImageLinks["2.5mm Fali"],
  },
  {
    _id: "3",
    name: "1.8mm Core",
    description:
      "Engineered 1.8mm core material for lightweight yet resilient plywood sheets.",
    image: productImageLinks["1.8mm Core"],
  },
  {
    _id: "4",
    name: "1.8mm Fali",
    description:
      "Fine 1.8mm fali veneer that ensures smooth lamination and uniform panel finish.",
    image: productImageLinks["1.8mm Fali"],
  },
  {
    _id: "new-0-core",
    name: "2.4mm Core",
    description: "Premium 2.4mm core veneer for strong plywood structure and consistent performance.",
    image: productImageLinks["2.4mm Core"],
  },
  {
    _id: "new-0-fali",
    name: "2.4mm Fali",
    description: "Reliable 2.4mm fali veneer with clean grain and dependable adhesive performance.",
    image: productImageLinks["2.4mm Fali"],
  },
  {
    _id: "new-1-core",
    name: "2.6mm Core",
    description: "Premium 2.6mm core veneer for strong plywood structure and consistent performance.",
    image: productImageLinks["2.6mm Core"],
  },
  {
    _id: "new-1-fali",
    name: "2.6mm Fali",
    description: "Reliable 2.6mm fali veneer with clean grain and dependable adhesive performance.",
    image: productImageLinks["2.6mm Fali"],
  },
  {
    _id: "new-2-core",
    name: "2.7mm Core",
    description: "Premium 2.7mm core veneer for strong plywood structure and consistent performance.",
    image: productImageLinks["2.7mm Core"],
  },
  {
    _id: "new-2-fali",
    name: "2.7mm Fali",
    description: "Reliable 2.7mm fali veneer with clean grain and dependable adhesive performance.",
    image: productImageLinks["2.7mm Fali"],
  },
];

export const galleryImages = [
  { src: productImageLinks["2.5mm Core"], alt: "2.5mm Core veneer stack" },
  { src: productImageLinks["2.5mm Fali"], alt: "2.5mm Fali veneer sheet" },
  { src: productImageLinks["1.8mm Core"], alt: "1.8mm Core veneer bundle" },
  { src: productImageLinks["1.8mm Fali"], alt: "1.8mm Fali processed veneer" },
  { src: productImageLinks["2.5mm Core"], alt: "Plywood raw veneer inventory" },
];

export const heroSlides = [
  productImageLinks["2.5mm Core"],
  productImageLinks["2.5mm Fali"],
  productImageLinks["1.8mm Core"],
  productImageLinks["1.8mm Fali"],
];

export const navLinks = [
  ["Home", "/"],
  ["Company", "/company"],
  ["Products", "/products"],
  ["History", "/history"],
  ["Contact", "/contact"],
];

export const sectionReveal = {
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};
