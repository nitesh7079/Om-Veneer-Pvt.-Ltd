import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import productImageLinks from "../productImageLinks";

const historyMilestones = [
  {
    year: "Phase 1",
    title: "Small Factory Foundation",
    detail:
      "Om Veneer Pvt. Ltd. began in Birtamod, Jhapa, with a compact factory setup and a simple but serious mission: supply dependable veneer raw material that factories could trust every day. In the early years, operations were handled by a small team that focused on grading discipline, careful stacking, and on-time dispatch for nearby plywood units. Rather than chasing rapid expansion, the company built its base through process consistency and practical service reliability.",
    image: productImageLinks["2.5mm Core"],
  },
  {
    year: "Phase 2",
    title: "Local Market Trust Building",
    detail:
      "As demand increased from local clients, the company strengthened production routines and delivery planning to avoid supply gaps. Factory partners began to rely on Om for predictable quality in core and fali material, and repeat orders became the main growth driver. This phase was defined by relationship-based business: clear commitments, responsive communication, and dependable follow-through during both normal and high-pressure production cycles.",
    image: productImageLinks["2.5mm Fali"],
  },
  {
    year: "Phase 3",
    title: "Nepal-Wide Network Growth",
    detail:
      "With a stronger operational base, Om expanded beyond a single-location model into a branch-supported network serving multiple industrial routes across Nepal. This growth improved dispatch speed, reduced coordination delays, and allowed better regional response to factory production schedules. The focus remained practical and execution-led: maintain quality standards while increasing reach, so clients in different regions could receive material with the same level of reliability.",
    image: productImageLinks["1.8mm Core"],
  },
  {
    year: "Phase 4",
    title: "Cross-Border Supply Confidence",
    detail:
      "After establishing strong trust across Nepal, Om extended supply support toward India-facing demand channels. Cross-border coordination required tighter planning, documentation discipline, and consistent quality matching, all of which were integrated into daily operations. This phase marked a maturity shift: from a local supplier to a structured regional partner capable of supporting long-term manufacturing requirements with stability and confidence.",
    image: productImageLinks["Door Board Ply"],
  },
];

const spreadPoints = [
  "Head Office: Birtamod, Jhapa",
  "Branch Support: Birgunj",
  "Branch Support: Bardibas",
  "Branch Support: Itahari Branch 1",
  "Branch Support: Itahari Branch 2",
];

function HistoryPage() {
  return (
    <PageLayout>
      <section className="bg-navy pt-32 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange mb-4">Our History</p>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 max-w-4xl mx-auto">
            From Small Factory to Nepal-Wide Network.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The history of Om Veneer Pvt. Ltd. is not a story of sudden growth; it is the result of years of steady work, operational honesty, and long-term partnership thinking.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-10 -mt-10 relative z-10 mb-20">
        <div className="modern-card p-8 md:p-12 border-t-4 border-t-orange">
           <div className="grid md:grid-cols-2 gap-8 text-text-main text-lg leading-relaxed">
              <div>
                 <p className="mb-4">
                  Om Veneer Pvt. Ltd. started as a small factory-driven veneer supplier in Birtamod with limited volume,
                  limited manpower, and a clear long-term mindset. In the beginning, the company served nearby plywood
                  manufacturers by focusing on what matters most in raw material supply: dependable grading, stable quality,
                  and timely dispatch.
                 </p>
                 <p>
                  Every order was treated as a relationship commitment, not just a transaction. Over time, this execution style built strong trust among factory clients.
                 </p>
              </div>
              <div>
                 <p className="mb-4">
                  As repeat demand increased, Om invested in better process control, broader logistics coordination, and branch-assisted service
                  coverage. Operations gradually expanded from a local supply model to a Nepal-wide network with improved
                  response speed and more reliable planning support.
                 </p>
                 <p>
                  Today, the company supports clients across Nepal and in India-facing routes through disciplined operations,
                  practical communication, and consistent quality standards.
                 </p>
              </div>
           </div>
        </div>
      </section>

      <section className="section-padding bg-luxury-bg border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="space-y-16">
            {historyMilestones.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <img src={item.image} alt={item.title} className="w-full h-72 object-cover" />
                    <div className="absolute inset-0 bg-navy/10 mix-blend-multiply"></div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="text-sm font-bold uppercase tracking-widest text-orange mb-2">{item.year}</p>
                  <h2 className="text-3xl font-bold font-heading text-navy mb-4">{item.title}</h2>
                  <p className="text-text-main leading-relaxed text-lg">{item.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="diagonal-bg">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <p className="text-sm font-bold uppercase tracking-widest text-orange mb-3">Spread Across Nepal</p>
                <h2 className="text-4xl font-bold font-heading text-white mb-6">Branch-Supported Growth Model</h2>
                <div className="space-y-4 text-gray-300 text-lg">
                   <p>
                     What began with one unit in Birtamod now operates through a branch-backed structure across Nepal. This
                     network model improves order coordination between factories and dispatch teams, enables faster response to
                     regional demand changes, and supports more accurate delivery timelines.
                   </p>
                   <p>
                     Instead of centralizing every activity in one location, Om uses distributed support points to keep
                     communication faster and logistics more practical. The result is a supply system that remains dependable
                     even during peak manufacturing periods.
                   </p>
                </div>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-4">
               {spreadPoints.map((point, index) => (
                 <motion.div
                   key={point}
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className="bg-navy-lighter p-6 rounded-lg border border-navy-light shadow-lg"
                 >
                   <p className="text-xs font-bold uppercase tracking-widest text-orange mb-2">Network Node</p>
                   <p className="text-white font-bold">{point}</p>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </section>

      <section className="section-padding text-center">
         <div className="max-w-4xl mx-auto px-5">
            <h2 className="text-3xl font-bold font-heading text-navy mb-6">Our Current Position</h2>
            <p className="text-lg text-text-main leading-relaxed mb-10">
              Today, Om Veneer Pvt. Ltd. is recognized as a trusted high-volume veneer raw material supplier for
              plywood and door board manufacturing. From sourcing and grading to quality checks and dispatch, each stage
              is managed with professional discipline and operational accountability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-orange/10 text-orange font-bold px-6 py-3 rounded-full text-sm uppercase tracking-widest">10+ Years Journey</span>
              <span className="bg-navy/10 text-navy font-bold px-6 py-3 rounded-full text-sm uppercase tracking-widest">Nepal-Wide Presence</span>
              <span className="bg-orange/10 text-orange font-bold px-6 py-3 rounded-full text-sm uppercase tracking-widest">Trusted by Factories</span>
            </div>
         </div>
      </section>

    </PageLayout>
  );
}

export default HistoryPage;
