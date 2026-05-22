import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductBySlug } from "./productDetails";
import PageLayout from "./components/PageLayout";

function ProductDetailPage() {
  const { name } = useParams();
  const product = getProductBySlug(name || "");

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] bg-gray-100 px-5 py-32 text-center flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold text-navy mb-4">Product Not Found</h1>
          <p className="text-lg text-text-main mb-8">The requested product detail page is unavailable.</p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-navy pt-32 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             className="relative rounded-xl overflow-hidden shadow-2xl h-80 lg:h-[28rem]"
          >
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Product Specifications</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{product.name}</h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">Request Quote</Link>
              <Link to="/products" className="btn-secondary text-white border-white hover:bg-white hover:text-navy">All Products</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features & Uses */}
      <section className="section-padding bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="modern-card p-8 border-t-4 border-t-orange"
          >
            <h2 className="text-2xl font-extrabold text-navy mb-6">Key Features</h2>
            <ul className="space-y-4 text-text-main">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="modern-card p-8 bg-white"
          >
            <h2 className="text-2xl font-extrabold text-navy mb-6">Ideal Uses</h2>
            <div className="flex flex-col gap-3">
              {product.uses.map((useCase, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded p-4 text-text-main font-medium">
                  {useCase}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-extrabold text-navy">Technical Specifications</h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="modern-card overflow-hidden"
          >
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-200">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <th className="py-4 px-6 font-bold text-navy w-1/3 md:w-1/4 uppercase tracking-wide text-sm">{key}</th>
                    <td className="py-4 px-6 text-text-main font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Media Gallery */}
      {(product.video || (product.gallery && product.gallery.length > 0)) && (
        <section className="diagonal-bg">
          <div className="max-w-7xl mx-auto px-5 md:px-10">
            <h2 className="text-3xl font-extrabold text-white mb-10 text-center">Media Gallery</h2>
            
            {product.video && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-12 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black border border-navy-lighter"
              >
                <video 
                  controls 
                  className="w-full aspect-video object-contain"
                  poster={product.image}
                >
                  <source src={product.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}

            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.gallery.map((imgSrc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-orange transition-colors cursor-pointer"
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} Gallery ${i+1}`}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </PageLayout>
  );
}

export default ProductDetailPage;
