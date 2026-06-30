import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, TicketPercent, MessageSquare, LogOut, Trophy, Menu, X, Calendar } from 'lucide-react';

const UserLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { path: "/booking-lapangan", name: "Booking Lapangan", icon: <Calendar size={18} />, },
        { name: 'Riwayat Sewa', path: '/history', icon: <Receipt size={16} /> },
        { name: 'Voucher Diskon', path: '/discounts', icon: <TicketPercent size={16} /> },
        { name: 'Tulis Ulasan', path: '/review', icon: <MessageSquare size={16} /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        alert("Keluar sistem sukses.");
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans flex flex-col md:flex-row pt-4">
            
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-950/40 z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* UNIFIED SIDEBAR NAVIGATION (Kiri Permanen) */}
            <aside className={`fixed md:sticky top-4 h-[calc(100vh-32px)] w-72 bg-white border-r border-slate-200/60 p-4 z-40 ml-4 rounded-2xl shadow-sm flex flex-col justify-between transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="space-y-6">
                    {/* Brand Logo Identity */}
                    <div className="flex items-center gap-2 px-2">
                        <div className="p-1.5 bg-[#004ac6] text-white rounded-lg"><Trophy size={14} /></div>
                        <span className="text-sm font-black text-[#004ac6] uppercase tracking-tight">BookingSpace</span>
                    </div>

                    {/* Profile Header Card */}
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 text-[#004ac6] flex items-center justify-center font-black text-sm">
                            {user.nama ? user.nama.charAt(0).toUpperCase() : 'L'}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-xs text-slate-800 truncate">{user.nama || 'Lalu'}</h3>
                            <p className="text-[9px] font-bold text-[#006c49] bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5">Premium Member</p>
                        </div>
                    </div>

                    {/* Navigation Menu Links */}
                    <nav className="flex flex-col gap-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        isActive 
                                            ? 'bg-blue-50 text-[#004ac6] border-l-4 border-[#004ac6] shadow-sm' 
                                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Logout Anchor */}
                <div className="pt-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                        <LogOut size={16} />
                        <span>Keluar Sistem</span>
                    </button>
                </div>
            </aside>

            {/* BAR COMPONENT MOBILE ONLY */}
            <div className="flex items-center justify-between md:hidden bg-white p-4 mx-4 rounded-xl border border-slate-200/50 shadow-sm mb-2">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                    {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
                <span className="font-mono font-black text-xs text-[#004ac6] uppercase tracking-wider">Member Area</span>
            </div>

            {/* DYNAMIC CONTENT AREA (Kanan) */}
            <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;