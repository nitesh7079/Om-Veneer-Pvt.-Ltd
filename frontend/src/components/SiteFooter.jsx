import { Link } from "react-router-dom";
import { navLinks } from "../siteData";

function SiteFooter() {
  return (
    <footer className="bg-navy py-12 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/products/logo.png"
                alt="Om Veneer logo"
                className="h-20 w-auto rounded bg-white p-2"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-300">
              Your dependable partner for premium veneer raw material, ensuring stable and consistent supply for plywood and door board manufacturing across Nepal and India.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400">Company</p>
            <nav className="mt-5 flex flex-col space-y-3">
              {navLinks.map(([label, href]) => (
                <Link key={label} to={href} className="w-fit text-sm text-gray-300 transition hover:text-orange">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3">
            <p className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400">Contact</p>
            <div className="mt-5 flex flex-col space-y-3 text-sm text-gray-300">
              <p>Birtamode-3, Jhapa, Nepal</p>
              <p>PAN: 600496320</p>
              <p>
                Tel:{" "}
                <a href="tel:+9779860218415" className="hover:text-orange transition">
                  +977 9860218415
                </a>
              </p>
              <a
                href="mailto:support@omveneer.online"
                className="text-orange transition hover:text-orange-light hover:underline"
              >
                support@omveneer.online
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-700 pt-8 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Om Veneer Pvt. Ltd. All rights reserved.</p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <Link to="/contact" className="hover:text-white">Support</Link>
            <Link to="/products" className="hover:text-white">Products</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
