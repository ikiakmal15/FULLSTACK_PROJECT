import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';

const HomePlaceholder = () => (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center py-20">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">MYFIELD KATALOG</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
            Inisialisasi komponen navigasi dan layout dasar berhasil diterapkan. Siap menerima integrasi fitur login dan katalog lapangan.
        </p>
    </div>
);

function App(){
    return (
        <Router>
            <Routes>
                {/* Rute Utama dengan Wrapper Navbar & Footer */}
                <Route path="/" element={
                    <MainLayout>
                        <HomePlaceholder />
                    </MainLayout>
                } />

                {/* Rute Otentikasi Polos tanpa Navbar */}
                <Route path="/login" element={<div className="p-10 font-bold">Halaman Login (Polos)</div>} />
                <Route path="/register" element={<div className="p-10 font-bold">Halaman Register (Polos)</div>} />
            </Routes>
        </Router>
    );
}

export default App;