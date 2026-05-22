import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

function PageLayout({ children }) {
  return (
    <div className="public-layout min-h-screen bg-gray-100 flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export default PageLayout;
