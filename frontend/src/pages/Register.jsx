import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig'; 

const Register = () => {
    // KOREKSI: Properti 'role' dihapus total dari state awal
    const [formData, setFormData] = useState({ nama: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Murni mengirim data identitas saja ke API backend kelompok
            await api.post('/auth/register', formData);
            alert("Pendaftaran Berhasil! Silakan Login.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error || "Pendaftaran Gagal");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-black text-center text-slate-800 tracking-tight uppercase mb-6">Daftar Akun</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Nama Lengkap" className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                    <input type="email" placeholder="Email" className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-black transition-all cursor-pointer">
                        DAFTAR SEKARANG
                    </button>
                </form>
                <p className="text-slate-500 text-sm text-center mt-4">Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link></p>
            </div>
        </div>
    );
};

export default Register;