import { useMemo, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { heroSlides } from "../siteData";
import productImageLinks from "../productImageLinks";
import { toProductSlug } from "../productDetails";

/* ── Data ─────────────────────────────────────────── */
const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Factory Partners" },
  { value: "10", label: "Core Products" },
  { value: "2", label: "Countries Served" },
];

const products = [
  { name: "2.5mm Core", tag: "Core Veneer", image: productImageLinks["2.5mm Core"] },
  { name: "2.5mm Fali", tag: "Fali Veneer", image: productImageLinks["2.5mm Fali"] },
  { name: "2.4mm Core", tag: "Core Veneer", image: productImageLinks["2.4mm Core"] },
  { name: "2.4mm Fali", tag: "Fali Veneer", image: productImageLinks["2.4mm Fali"] },
  { name: "2.6mm Core", tag: "Core Veneer", image: productImageLinks["2.6mm Core"] },
  { name: "2.6mm Fali", tag: "Fali Veneer", image: productImageLinks["2.6mm Fali"] },
  { name: "2.7mm Core", tag: "Core Veneer", image: productImageLinks["2.7mm Core"] },
  { name: "2.7mm Fali", tag: "Fali Veneer", image: productImageLinks["2.7mm Fali"] },
  { name: "1.8mm Core", tag: "Core Veneer", image: productImageLinks["1.8mm Core"] },
  { name: "1.8mm Fali", tag: "Fali Veneer", image: productImageLinks["1.8mm Fali"] },
];

/* ── Animation Variants ───────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* ── Main Component ───────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const heroSliderImages = useMemo(() => [
    "/images/company/IMG_6675.jpg",
    "/images/core/IMG_6689.jpg",
    "/images/goliya/IMG_6656.jpg",
    "/images/core/IMG_6692.jpg",
    "/images/company/IMG_6683.jpg",
    "/images/goliya/IMG_6662.jpg",
    "/images/core/IMG_6690.jpg"
  ], []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSliderImages.length]);

  return (
    <PageLayout>
      {/* ══════════════════════════════════════════════
          FULLSCREEN HERO SECTION
      ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-32 overflow-hidden border-b-4 border-orange">
        {/* Automatic Slider Background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-105">
            {heroSliderImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Veneer Manufacturing Facility ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </motion.div>
          {/* Lighter Navy Overlays so photos pop, with bottom gradient for the stats grid */}
          <div className="absolute inset-0 bg-navy/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-navy/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-sm font-bold uppercase tracking-widest text-orange mb-4 drop-shadow-md"
          >
            Premium Supply Partner
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-6xl lg:text-8xl font-extrabold text-white leading-tight mb-6 drop-shadow-xl max-w-5xl mx-auto"
          >
            Precision <span className="text-orange">Veneer</span> <br />
            For Plywood.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium"
          >
            Trusted by factories across Nepal and India for consistent thickness, moisture balance, and reliable dispatch.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products" className="btn-primary shadow-xl">
              View Products
            </Link>
            <Link to="/contact" className="px-8 py-3 font-bold text-sm uppercase tracking-widest text-white border-2 border-white/50 hover:border-white hover:bg-white/10 rounded transition-all duration-300">
              Get A Quote
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-200">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-navy mb-1">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-text-main font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INFINITE TIMBER MARQUEE SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 overflow-hidden border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-10 mb-12 text-center relative z-20">
          <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Massive Scale Inventory</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy">Over 500+ Tons Processed Monthly</h2>
        </div>

        <div className="relative w-full flex flex-col gap-6 overflow-hidden group">
          {/* Row 1: Left to Right (Reverse) */}
          <div className="animate-marquee-scroll" style={{ animationDirection: "reverse", animationDuration: "70s" }}>
            {[...Array.from({ length: 15 }, (_, i) => `IMG_${6656 + i}.jpg`), ...Array.from({ length: 15 }, (_, i) => `IMG_${6656 + i}.jpg`)].map((img, index) => (
              <div key={`row1-${index}`} className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 mx-3 overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white p-2">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={`/images/goliya/${img}`}
                    alt="Timber Stock"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/10 hover:bg-transparent transition-colors duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Right to Left (Normal) */}
          <div className="animate-marquee-scroll" style={{ animationDuration: "60s" }}>
            {[...Array.from({ length: 14 }, (_, i) => `IMG_${6671 + i}.jpg`), ...Array.from({ length: 14 }, (_, i) => `IMG_${6671 + i}.jpg`)].map((img, index) => (
              <div key={`row2-${index}`} className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 mx-3 overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white p-2">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={`/images/goliya/${img}`}
                    alt="Timber Stock"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/10 hover:bg-transparent transition-colors duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Edge gradients for smooth fade */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT / DIAGONAL SECTION
      ══════════════════════════════════════════════ */}
      <section className="diagonal-bg mt-16 mb-16">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-orange mb-4">Our Approach</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Built for Factory Performance.</h2>
              <p className="text-gray-300 mb-6 text-lg">
                Plywood manufacturing requires predictability. We focus entirely on delivering 2.5mm and 1.8mm core and fali that meet strict thickness and moisture standards, reducing press variation and waste.
              </p>
              <ul className="space-y-4 mb-8">
                {['Batch-checked thickness consistency', 'Moisture balanced for bonding reliability', 'Seamless cross-border dispatch'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 bg-orange rounded-full p-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-white font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/company" className="text-orange hover:text-white font-bold inline-flex items-center gap-2 transition-colors">
                Learn about our company <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="/images/company/IMG_6675.jpg" alt="Factory" className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg transform translate-y-8" />
              <img src="/images/company/IMG_6702.jpg" alt="Wood" className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRODUCTS SHOWCASE
      ══════════════════════════════════════════════ */}
      <section className="section-padding bg-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Core Products</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy">Engineered for Strength.</h2>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-6 md:mt-0">
              <Link to="/products" className="btn-secondary">View Complete Range</Link>
            </motion.div>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 -mx-5 px-5">
            {products.map((p, i) => (
              <motion.article
                key={p.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="modern-card group cursor-pointer w-[85vw] sm:w-[320px] lg:w-[360px] flex-shrink-0 snap-start"
              >
                <Link to={`/product/${toProductSlug(p.name)}`} className="block">
                  <div className="relative overflow-hidden h-56 md:h-48">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider text-navy rounded shadow-sm">
                      {p.tag}
                    </div>
                  </div>
                  <div className="p-6 md:p-5">
                    <h3 className="text-xl font-bold text-navy mb-2">{p.name}</h3>
                    <p className="text-sm text-text-main font-medium flex items-center gap-1 group-hover:text-orange transition-colors">
                      Explore Details <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PREMIUM CTA SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden border-t-4 border-orange">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/company/IMG_6675.jpg"
            alt="Om Veneer Factory"
            className="w-full h-full object-cover object-center"
          />
          {/* Deep Navy to Transparent Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/40 mix-blend-multiply"></div>
          {/* Secondary Vignette Overlay for maximum text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto px-5 text-center"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-orange font-bold uppercase tracking-[0.2em] text-sm drop-shadow-md">
              Start Your Supply Partnership
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-2xl leading-tight">
            Ready to scale your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-yellow-400">plywood production?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
            Join the top factories across Nepal and India. Partner with Om Veneer Pvt. Ltd. for flawless consistency, transparent communication, and guaranteed timely dispatch.
          </p>

          <Link to="/contact" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-orange rounded-lg overflow-hidden hover:scale-105 shadow-[0_0_40px_rgba(255,107,53,0.4)] hover:shadow-[0_0_60px_rgba(255,107,53,0.6)]">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative text-lg tracking-wider uppercase flex items-center gap-3">
              Contact Sales Team
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}
