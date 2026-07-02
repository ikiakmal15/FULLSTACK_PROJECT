import { Link } from 'react-router-dom';
import { Trophy, Globe, Mail, Smartphone, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full py-12 bg-white border-t border-slate-200/60 mt-16 font-sans">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* KOLOM 1: BRAND IDENTITY & SOSIAL MEDIA */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#004ac6] text-white rounded-xl shadow-sm">
                            <Trophy size={18} />
                        </div>
                        <span className="text-lg font-black text-[#004ac6] tracking-tight uppercase">
                            Booking<span className="bg-gradient-to-r from-[#2563eb] to-[#4edea3] bg-clip-text text-transparent">Space</span>
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Solusi modern pencarian dan penyewaan lapangan olahraga untuk gaya hidup aktif komunitas Anda.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <a href="#" className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#004ac6] hover:bg-[#004ac6] hover:text-white transition-all duration-200 border border-slate-100">
                            <Globe size={14} />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#004ac6] hover:bg-[#004ac6] hover:text-white transition-all duration-200 border border-slate-100">
                            <Mail size={14} />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#004ac6] hover:bg-[#004ac6] hover:text-white transition-all duration-200 border border-slate-100">
                            <Smartphone size={14} />
                        </a>
                    </div>
                </div>

                {/* KOLOM 2: QUICK LINKS */}
                <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Bantuan & Informasi</h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-400">
                        <li><a href="#" className="hover:text-[#004ac6] transition-colors">Tentang Kami</a></li>
                        <li><a href="#" className="hover:text-[#004ac6] transition-colors">Syarat & Ketentuan</a></li>
                        <li><a href="#" className="hover:text-[#004ac6] transition-colors">Kebijakan Privasi</a></li>
                        <li><a href="#" className="hover:text-[#004ac6] transition-colors">Hubungi Support</a></li>
                    </ul>
                </div>

                {/* KOLOM 3: KATEGORI OLAHRAGA */}
                <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Kategori Arena</h4>
                    <ul className="space-y-2 text-xs font-medium text-slate-400">
                        <li><Link to="/" className="hover:text-[#004ac6] transition-colors uppercase">Futsal</Link></li>
                        <li><Link to="/" className="hover:text-[#004ac6] transition-colors uppercase">Basketball</Link></li>
                        <li><Link to="/" className="hover:text-[#004ac6] transition-colors uppercase">Badminton</Link></li>
                        <li><Link to="/" className="hover:text-[#004ac6] transition-colors uppercase">Volleyball</Link></li>
                        <li><Link to="/" className="hover:text-[#004ac6] transition-colors uppercase">Sepak Bola</Link></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Langganan Info Promo</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Dapatkan info potongan harga sewa kupon bulanan langsung di email kamu.
                    </p>
                </div>
            </div>

            {/* COPYRIGHT LINE AT BOTTOM */}
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    &copy; {new Date().getFullYear()} BookingSpace System. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;