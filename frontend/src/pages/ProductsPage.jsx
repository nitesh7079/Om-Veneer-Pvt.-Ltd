import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { defaultProducts } from "../siteData";
import { toProductSlug } from "../productDetails";

function ProductsPage() {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://backend-ju5k.onrender.com/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiBase}/products`);
        if (!response.ok) {
          throw new Error("Products fetch failed");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const backendNames = data.map(p => p.name);
          const missingDefaults = defaultProducts.filter(p => !backendNames.includes(p.name));
          setProducts([...data, ...missingDefaults]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiBase]);

  return (
    <PageLayout>
      <section className="bg-navy pt-32 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange mb-4">Our Products</p>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 max-w-4xl mx-auto">
            Raw Materials for Plywood Excellence.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our complete range of core and fali veneer, precision-cut and moisture-balanced for dependable manufacturing.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-10 -mt-10 relative z-10 mb-24">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.article
              key={product._id || product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="modern-card group flex flex-col h-full"
            >
              <Link to={`/product/${toProductSlug(product.name)}`} className="block flex-1 flex flex-col">
                <div className="relative h-60 overflow-hidden bg-luxury-bg">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold font-heading text-navy mb-3">{product.name}</h2>
                  <p className="text-text-main leading-relaxed flex-1">{product.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-orange group-hover:text-orange-light transition-colors">
                      View Details
                    </span>
                    <svg className="w-5 h-5 text-orange transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PREMIUM CTA SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden border-t-4 border-orange">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/company/IMG_6683.jpg" 
            alt="Om Veneer Factory Custom Orders" 
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
              Custom Manufacturing
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold font-heading text-white mb-8 drop-shadow-2xl leading-tight">
            Can't find what <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-yellow-400">you need?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
            We handle bulk custom orders for specific thickness and dimension requirements. Contact our sales team to discuss your exact factory needs.
          </p>
          
          <Link to="/contact" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-orange rounded-lg overflow-hidden hover:scale-105 shadow-[0_0_40px_rgba(255,107,53,0.4)] hover:shadow-[0_0_60px_rgba(255,107,53,0.6)]">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative text-lg tracking-wider uppercase flex items-center gap-3">
              Request Custom Quote
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}

export default ProductsPage;
