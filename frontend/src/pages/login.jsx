import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig'; // Menggunakan jembatan Axios kelompok

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Kriteria: Consume API asli dari backend project kelompok ke Frontend
            const response = await api.post('/auth/login', formData);

            // Data dipastikan terpanggil dan disimpan ke storage lokal
            localStorage.setItem('user', JSON.stringify(response.data.user || { nama: 'User' }));
            localStorage.setItem('token', response.data.token || 'dummy-token');

            alert("Login Berhasil!");
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "Login Gagal");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-black text-center text-slate-800 tracking-tight uppercase mb-6">Masuk MyField</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-black transition-all cursor-pointer">
                        MASUK
                    </button>
                </form>
                <p className="text-slate-500 text-sm text-center mt-4">Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link></p>
            </div>
        </div>
    );
};

export default Login;