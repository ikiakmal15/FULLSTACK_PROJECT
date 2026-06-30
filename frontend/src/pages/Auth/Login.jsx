import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import api from "../../api/axiosConfig";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);

      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(`Selamat datang kembali, ${response.data.user.nama}!`);

      
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center p-4 font-sans bg-[#f8f9ff]"
      style={{
        backgroundImage:
          "radial-gradient(#d3e4fe 1px, transparent 1px), radial-gradient(#d3e4fe 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
      }}
    >
      {/* Login Container */}
      <main className="w-full max-w-[440px] z-10 my-8">
        {/* Brand Header */}
        <header className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-[#e5eeff] text-[#004ac6] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10">
            <Trophy size={28} />
          </div>
          <h1 className="text-2xl font-black text-[#004ac6] tracking-tight uppercase">
            Booking
            <span className="bg-gradient-to-r from-[#2563eb] to-[#4edea3] bg-clip-text text-transparent">
              Space
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Elite Sports Booking Platform
          </p>
        </header>

        {/* Form Card */}
        <section className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
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
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-sm font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-black uppercase tracking-wider text-slate-500"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#004ac6] hover:underline transition-all"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#004ac6] transition-all outline-none text-sm font-medium text-slate-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
            >
              {loading ? "Signing In..." : "Sign In"}
              <LogIn size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="bg-[#f8f9ff] px-3">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full bg-white border border-slate-200 hover:border-[#004ac6] hover:bg-blue-50/20 text-slate-500 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD1IGqVQe5D6QW1NqoL-E8u2HZnT24oyiJvK_scT6bminOVtFEbLT7L-E3ezRo3_BmyOOKYZY_mQxSTxryRRtjvl7cASfN5UtNVk2iUItMPcUXm03aI96-_836TxrOyK3WvS2FAgqqdwyPBGBdadlLrr2_dkIlmfeSHQibLR3z8VLvjnziVK9Z1QDmNonuj4y9GqyinBupzw4UyszDE1PuIAMHZ-eKiEUMUi91lyD6LMuXQabONRHOZdQgFQqtbp8iFccvx1BdwBFb"
              alt="Google Logo"
              className="w-4 h-4"
            />
            Login with Google
          </button>

          {/* Register Link */}
          <footer className="mt-6 text-center">
            <p className="text-xs font-semibold text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#004ac6] font-black hover:underline"
              >
                Join BookingSpace
              </Link>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Login;