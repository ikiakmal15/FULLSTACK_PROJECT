import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            {/* Navigasi Atas */}
            <Navbar />

            {/* Area Isi Konten Utama yang Dinamis */}
            <main className="flex-grow container mx-auto px-6 py-8">
                {children}
            </main>

            {/* Footer Penutup */}
            <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs mt-auto">
                <p className="font-bold text-slate-300 mb-1">BookingSpace — Kelompok BERES</p>
                <p>&copy; {new Date().getFullYear()} Teknik Informatika STT Terpadu Nurul Fikri. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;