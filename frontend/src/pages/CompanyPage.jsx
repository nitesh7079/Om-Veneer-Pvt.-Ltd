import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useState, useEffect } from "react";

const companyPhotos = [
  "/images/company/IMG_6675.jpg",
  "/images/company/IMG_6680.jpg",
  "/images/company/IMG_6683.jpg",
  "/images/company/IMG_6685.jpg",
  "/images/company/IMG_6702.jpg",
];

const sliderImages = [
  "/images/company/IMG_6675.jpg",
  "/images/goliya/IMG_6656.jpg",
  "/images/products/2-5mm-core.jpg",
  "/images/goliya/IMG_6662.jpg",
  "/images/company/IMG_6683.jpg",
  "/images/products/1-8mm-core.jpg"
];

const branchNetwork = [
  {
    branch: "Head Office - Birtamod, Jhapa",
    note: "Primary operations, quality control, and dispatch coordination center.",
  },
  {
    branch: "Birgunj Branch",
    note: "Client coordination and supply support for central Nepal market.",
  },
  {
    branch: "Bardibas Branch",
    note: "Supply facilitation for western-side plywood production partners.",
  },
  {
    branch: "Itahari Branch 1",
    note: "Regional handling and fast-response dispatch support in eastern corridor.",
  },
  {
    branch: "Itahari Branch 2",
    note: "Second Itahari branch for expanded dispatch capacity and faster regional supply support.",
  },
];

function CompanyPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 text-white border-b-4 border-orange overflow-hidden">
        {/* Automatic Slider Background */}
        <div className="absolute inset-0 z-0">
          {sliderImages.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt={`Company Background ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          {/* Lighter Navy Overlays so photos pop, with bottom gradient for the stats grid */}
          <div className="absolute inset-0 bg-navy/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-navy/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-sm font-bold uppercase tracking-widest text-orange mb-4 drop-shadow-md"
          >
            Company Profile
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 max-w-5xl mx-auto text-white drop-shadow-xl"
          >
            A Professional Veneer Supply Network Built on Trust.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-white max-w-3xl mx-auto drop-shadow-lg font-medium"
          >
            Om Veneer Pvt. Ltd. has been serving the plywood industry for over a decade, providing consistent, high-quality veneer raw materials for scalable plywood production.
          </motion.p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["10+ Years", "Experience"],
            ["5 Branches", "Across Nepal"],
            ["Nepal + India", "Active Markets"],
            ["Core + Fali", "Focus Areas"],
          ].map(([value, label], i) => (
            <motion.div 
              key={label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + (i*0.1) }}
              className="modern-card p-6 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold font-heading text-navy">{value}</p>
              <p className="text-sm text-text-main font-semibold mt-1 uppercase tracking-wide">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Our History</p>
            <h2 className="text-4xl font-bold font-heading text-navy mb-6">Built on Trust, Delivered with Precision.</h2>
            <div className="space-y-4 text-text-main leading-relaxed">
              <p>
                Based in Birtamod, Jhapa, Om Veneer Pvt. Ltd. has spent the last 10 years perfecting the supply of 2.5mm and 1.8mm core and fali veneer.
              </p>
              <p>
                Our philosophy is simple: plywood factories need predictability. By maintaining strict quality controls on thickness and moisture, and ensuring reliable dispatch, we help factories reduce waste and maintain steady production lines.
              </p>
              <p>
                We have expanded beyond our head office with 4 additional branches across Nepal to ensure rapid response and localized supply chain support for all our partners.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/contact" className="px-6 py-3 font-bold text-sm uppercase tracking-widest text-navy bg-orange border border-orange hover:bg-orange-light transition-all duration-300">Partner With Us</Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img src={companyPhotos[0]} alt="Facility" className="w-full h-64 object-cover rounded-lg shadow-md transform translate-y-8" />
            <img src={companyPhotos[2]} alt="Facility" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <img src={companyPhotos[1]} alt="Facility" className="w-full h-48 object-cover rounded-lg shadow-md col-span-2 mt-4" />
          </div>
        </div>
      </section>

      {/* Timber Selection */}
      <section className="section-padding bg-luxury-bg border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-5 md:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Raw Material Sourcing</p>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-navy">Massive Scale, Premium Quality.</h2>
              <p className="mt-6 text-text-main text-lg leading-relaxed">
                We manufacture our veneer on a massive scale. To ensure uninterrupted supply for our partners, we maintain a vast, carefully curated inventory of high-grade Goliya (timber). This allows us to guarantee consistency, strength, and precise thickness across every single dispatch.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 17 }, (_, i) => `IMG_${6668 + i}.jpg`).map((img, index) => {
                // Pseudo-random duration and delay so they blink completely out of sync
                const duration = 3 + ((index * 7) % 5); // between 3s and 7s
                const delay = ((index * 13) % 10) * 0.5; // between 0s and 4.5s
                
                return (
                  <div 
                    key={index} 
                    className="modern-card overflow-hidden group border border-gray-200 shadow-sm hover:shadow-xl transition-all animate-random-blink"
                    style={{
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`
                    }}
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={`/images/goliya/${img}`} 
                        alt={`Timber Inventory ${index + 1}`} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
               <p className="text-sm font-bold font-heading uppercase tracking-widest text-navy bg-orange/10 inline-block px-6 py-2 rounded-full border border-orange/20">
                 Over 500+ Tons Processed Monthly
               </p>
            </div>
         </div>
      </section>

      {/* Timber Species Specifications */}
      <section className="section-padding bg-navy text-white relative overflow-hidden border-y-4 border-orange">
         {/* Abstract background elements */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Wood Species</p>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Premium Timber Varieties.</h2>
              <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                The foundation of our high-quality veneer is the raw timber itself. We selectively source and process specific species to match the exact density, peeling behavior, and bonding requirements of premium plywood manufacturing.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pure Utis */}
              <div className="bg-navy-light p-8 rounded-xl border border-navy-lighter hover:border-orange transition-colors group">
                <h3 className="text-2xl font-bold font-heading text-white mb-2">Pure Utis</h3>
                <p className="text-orange text-sm font-bold uppercase tracking-widest mb-8 border-b border-navy-lighter pb-4 group-hover:border-orange transition-colors">Himalayan Alder</p>
                <ul className="space-y-5 text-gray-300 text-sm">
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Density & Peeling</strong> Medium-soft density, making it excellent for uniform peeling and smooth core layers.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Resin Bonding</strong> Absorbs resin perfectly and evenly, ensuring a highly durable glue-line in plywood pressing.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Best Application</strong> Ideal for inner core layers requiring stability, uniform thickness, and balanced moisture.</div>
                  </li>
                </ul>
              </div>

              {/* Chilaune */}
              <div className="bg-navy-light p-8 rounded-xl border border-navy-lighter hover:border-orange transition-colors group">
                <h3 className="text-2xl font-bold font-heading text-white mb-2">Chilaune</h3>
                <p className="text-orange text-sm font-bold uppercase tracking-widest mb-8 border-b border-navy-lighter pb-4 group-hover:border-orange transition-colors">Schima Wallichii</p>
                <ul className="space-y-5 text-gray-300 text-sm">
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Structural Strength</strong> A high-density hardwood offering vastly superior structural strength and rigidity.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">High Durability</strong> Exceptionally resistant to warping, bending, and structural stress under load.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Best Application</strong> Perfect for outer core layers or structural-grade plywood where extreme strength is required.</div>
                  </li>
                </ul>
              </div>

              {/* Mixed Timber */}
              <div className="bg-navy-light p-8 rounded-xl border border-navy-lighter hover:border-orange transition-colors group">
                <h3 className="text-2xl font-bold font-heading text-white mb-2">Mixed Timber</h3>
                <p className="text-orange text-sm font-bold uppercase tracking-widest mb-8 border-b border-navy-lighter pb-4 group-hover:border-orange transition-colors">Select Local Hardwoods</p>
                <ul className="space-y-5 text-gray-300 text-sm">
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Composition</strong> A carefully calibrated mix of native timber species graded for manufacturing compatibility.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Cost-Efficiency</strong> Provides a perfect balance between manufacturing cost and physical strength.</div>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-orange mt-1">✦</span> 
                     <div><strong className="text-white block mb-1 text-base">Best Application</strong> Extremely versatile. Widely used in commercial plywood and standard door boards.</div>
                  </li>
                </ul>
              </div>
            </div>
         </div>
      </section>

      {/* Leadership */}
      <section className="diagonal-bg">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="border-4 border-orange rounded-lg overflow-hidden relative z-10">
               <img src="/images/owner/IMG_6722.jpg" alt="Founder" className="w-full h-[500px] object-cover" />
             </div>
             <div className="absolute -bottom-6 -right-6 w-48 h-48 border-4 border-white rounded-lg overflow-hidden z-20 hidden md:block shadow-xl">
               <img src="/images/owner/IMG_6712.jpg" alt="Founder" className="w-full h-full object-cover" />
             </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Leadership</p>
            <h2 className="text-4xl font-bold font-heading text-white mb-6">Message from the Founder</h2>
            <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
              <p>
                "Driven by decades of industry experience, our foundation was built on a simple premise: to provide plywood factories with veneer raw material they can trust without second-guessing."
              </p>
              <p>
                "Over the last 10 years, we have scaled our operations across Nepal and India, but our commitment to uncompromising quality, transparent communication, and timely dispatch remains exactly the same as day one."
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-navy-lighter">
              <p className="font-bold font-heading text-xl text-white">Founder & Managing Director</p>
              <p className="text-orange font-bold uppercase tracking-widest text-sm mt-1">Om Veneer Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Network */}
      <section className="section-padding bg-luxury-bg">
         <div className="max-w-7xl mx-auto px-5 md:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Our Reach</p>
              <h2 className="text-4xl font-bold font-heading text-navy">5 Branch Presence Across Nepal</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branchNetwork.map((item, index) => (
                <div key={index} className="modern-card p-6 border-t-4 border-t-orange">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Branch {index + 1}</p>
                  <h3 className="text-xl font-bold font-heading text-navy mb-3">{item.branch}</h3>
                  <p className="text-text-main text-sm">{item.note}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

    </PageLayout>
  );
}

export default CompanyPage;
