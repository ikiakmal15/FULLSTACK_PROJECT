import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Activity,
} from "lucide-react";
import api from "../../api/axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    telepon: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    
    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok! Silakan periksa kembali.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        telepon: formData.telepon,
        role: "user",
      };

      await api.post("/auth/register", payload);
      alert("Akun Anda berhasil dibuat! Silakan masuk sistem.");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal melakukan registrasi akun baru.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-between font-sans bg-[#f8f9ff]">
      <main className="flex-grow flex items-center justify-center py-12 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-[960px] grid md:grid-cols-2 shadow-2xl rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/50">
          <div className="hidden md:block relative bg-[#0b1c30] overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC43W_GBYEDyGo0JtEXLIjqkIRMHqzidw-E-5w33uzkM2gob-Gu0vtxHMugtteUvUQe253yVL7flfAAZ9PTMG6Bs29zxmPtF6EYQR0xGQA-IfzyBFZPZF-vO469LZ16WfwQ47y5u_TNhmUelu9FB1xi5S1eWRfTfPA6QQKL_WRet5Tq7AJdAu7f05pfhAPDzqkapTacM4iFQoF-2DOkAPDolKQcZmpbzVAEKjez_eHVjAGv1eRpTRzcIShzA9mXBWZJ1dLVI72Rtfhx"
              alt="BookingSpace Court Visual"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-[#0b1c30]/30 to-transparent"></div>

            <div className="absolute top-15 left-0 p-10 space-y-6">
              <h2 className="text-3xl font-extrabold text-white leading-tight font-mono">
                Tingkatkan Pengalaman Bermainmu
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
                Bergabunglah dengan jaringan elit pecinta olahraga dan sewa
                fasilitas premium dalam hitungan detik bersama kami.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">
                       ⚡ Booking Instan
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pesan lapangan dengan konfirmasi otomatis secara real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">
                      ⭐ Fasilitas Berkualitas
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pilihan fasilitas olahraga terbaik yang telah terverifikasi kualitasnya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Create Account
              </h1>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  className="block text-xs font-black uppercase tracking-wider text-slate-500"
                  htmlFor="nama"
                >
                  Nama Lengkap
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="block text-xs font-black uppercase tracking-wider text-slate-500"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="block text-xs font-black uppercase tracking-wider text-slate-500"
                  htmlFor="telepon"
                >
                  Nomor Telepon
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    id="telepon"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-xs font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    className="block text-xs font-black uppercase tracking-wider text-slate-500"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center group">
                    <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-xs font-semibold text-slate-700"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="block text-xs font-black uppercase tracking-wider text-slate-500"
                    htmlFor="confirmPassword"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative flex items-center group">
                    <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-xs font-semibold text-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 w-4 h-4 rounded border-slate-200 text-[#004ac6] focus:ring-blue-500/20 cursor-pointer"
                  required
                />
                <label
                  className="text-[11px] text-slate-400 font-medium leading-tight cursor-pointer select-none"
                  htmlFor="terms"
                >
                  Saya menyetujui{" "}
                  <a
                    href="#"
                    className="text-[#004ac6] font-bold hover:underline"
                  >
                    Ketentuan Layanan
                  </a>{" "}
                  dan{" "}
                  <a
                    href="#"
                    className="text-[#004ac6] font-bold hover:underline"
                  >
                    Kebijakan Privasi
                  </a>{" "}
                  dari BookingSpace Platform.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] mt-2 cursor-pointer disabled:bg-slate-400"
              >
                {loading ? "Creating Account..." : "Register Account"}
              </button>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-xs font-semibold text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#004ac6] font-black hover:underline"
                >
                  Login here
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;