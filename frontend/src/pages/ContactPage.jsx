import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";

function ContactPage() {
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    inquiryType: "Raw Material Enquiry",
    message: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.alert("Thank you. Our team will contact you soon.");
    setContact({
      name: "",
      phone: "",
      inquiryType: "Raw Material Enquiry",
      message: "",
    });
  };

  return (
    <PageLayout>
      <section className="bg-navy pt-32 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange mb-4">Contact Us</p>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 max-w-4xl mx-auto">
            Let's discuss your raw material needs.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Share your requirement for core, fali, or door board raw material. Our team will review your inquiry and connect with dispatch and supply details based on your production requirement.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-10 -mt-16 relative z-10 mb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="modern-card p-8 border-l-4 border-l-orange">
              <h3 className="text-2xl font-bold font-heading text-navy mb-4">Head Office</h3>
              <div className="space-y-2 text-text-main">
                <p className="font-bold">Om Veneer Pvt. Ltd.</p>
                <p>Birtamode-3, Jhapa, Nepal</p>
                <p>PAN: 600496320</p>
                <p className="pt-4 border-t border-gray-100 mt-4">
                  <a href="mailto:support@omveneer.online" className="text-orange hover:text-orange-light font-bold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    support@omveneer.online
                  </a>
                </p>
              </div>
            </div>

            <div className="modern-card p-8 bg-luxury-bg">
              <h3 className="text-xl font-bold font-heading text-navy mb-4">Business Support</h3>
              <ul className="space-y-3 text-sm text-text-main">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-navy">Coverage:</span> <span>Nepal + India</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-navy">Response:</span> <span>Within 24 Hours</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="font-bold text-navy">Focus:</span> <span>2.5mm / 1.8mm Core</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="modern-card p-8 md:p-10">
              <h2 className="text-3xl font-bold font-heading text-navy mb-2">Submit Enquiry</h2>
              <p className="text-text-main mb-8">Fill out the form below and we will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={contact.name}
                      onChange={handleInput}
                      className="w-full bg-luxury-bg border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={contact.phone}
                      onChange={handleInput}
                      className="w-full bg-luxury-bg border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={contact.inquiryType}
                    onChange={handleInput}
                    className="w-full bg-luxury-bg border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors"
                  >
                    <option value="Raw Material Enquiry">Raw Material Enquiry</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Branch Coordination">Branch Coordination</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    value={contact.message}
                    onChange={handleInput}
                    placeholder="Share quantity, product type, and delivery location..."
                    rows={5}
                    className="w-full bg-luxury-bg border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="px-6 py-3 font-bold text-sm uppercase tracking-widest text-navy bg-orange border border-orange hover:bg-orange-light transition-all duration-300 w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}

export default ContactPage;
