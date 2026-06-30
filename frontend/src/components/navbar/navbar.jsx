import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { LogOut, User, Trophy, Menu } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isScrolled, setIsScrolled] = useState(false);
    const handleProfileClick = () => {
        if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    // Deteksi scroll untuk efek glassmorphic shadow seperti ArenaPro
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Deteksi perubahan login storage secara real-time
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            setUser(JSON.parse(localStorage.getItem('user') || '{}'));
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(handleStorageChange, 1000); 

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        setUser({});
        alert("Keluar sistem sukses.");
        navigate('/');
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-md' 
                : 'bg-white/40 backdrop-blur-md border-b border-transparent'
        }`}>
            <nav className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
                
                {/* LOGO BRAND: GANTI MENJADI BOOKINGSPACE */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-[#004ac6] text-white rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200">
                        <Trophy size={20} />
                    </div>
                    <span className="font-sans text-xl font-black text-[#004ac6] tracking-tight uppercase">
                        Booking<span className="bg-gradient-to-r from-[#2563eb] to-[#6cf8bb] bg-clip-text text-transparent">Space</span>
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION CENTER */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                   <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `text-xs font-black uppercase tracking-wider py-2 border-b-2 transition-all ${
                                isActive 
                                    ? 'text-[#004ac6] border-[#004ac6]' // Menyala biru kalau rute aktif di "/"
                                    : 'text-slate-400 border-transparent hover:text-slate-600' // Abu-abu biasa kalau tidak aktif
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    {/* MENU LAPANGAN (MENGARAH KE KATALOG) */}
                    <NavLink 
                        to="/fields" 
                        className={({ isActive }) => 
                            `text-xs font-black uppercase tracking-wider py-2 border-b-2 transition-all ${
                                isActive 
                                    ? 'text-[#004ac6] border-[#004ac6]' // Menyala biru kalau rute aktif di "/fields"
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`
                        }
                    >
                        Lapangan
                    </NavLink>
                </div>

                {/* RIGHT ACCENT: AUTHENTICATION BUTTONS */}
                <div className="flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleProfileClick} 
                                className="flex items-center gap-2 bg-[#eff4ff] text-[#004ac6] px-4 py-2 rounded-full font-sans text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all cursor-pointer"
                            >
                                <span>{user.nama || 'Profile'}</span>
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-xl cursor-pointer transition-colors"
                                title="Log Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/login" 
                                className="hidden md:block text-xs font-bold uppercase tracking-wider text-[#004ac6] hover:bg-[#004ac6]/5 px-4 py-2.5 rounded-xl transition-all"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-[#004ac6] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:scale-95 hover:bg-blue-700 duration-200 transition-all block"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button className="md:hidden flex items-center justify-center p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                        <Menu size={20} />
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;