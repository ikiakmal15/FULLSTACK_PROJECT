import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, CalendarDays } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        alert("Anda telah keluar dari sistem.");
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Brand Logo */}
                <Link to="/" className="text-2xl font-black uppercase tracking-tighter text-blue-400 italic">
                    MyField
                </Link>

                {/* Menu Tengah */}
                <div className="flex items-center gap-6 font-semibold text-sm">
                    <Link to="/" className="hover:text-blue-400 transition-colors">Katalog</Link>
                    {token && (
                        <Link to="/history" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                            <CalendarDays size={16} /> Riwayat
                        </Link>
                    )}
                </div>

                {/* Status Autentikasi */}
                <div className="flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                                <User size={14} className="text-blue-400" />
                                <span className="text-xs font-bold text-slate-300">{user.nama || 'User'}</span>
                            </div>
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 p-2 rounded-xl text-white transition-all cursor-pointer">
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white">Masuk</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-black rounded-xl transition-all">DAFTAR</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;