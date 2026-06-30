import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;