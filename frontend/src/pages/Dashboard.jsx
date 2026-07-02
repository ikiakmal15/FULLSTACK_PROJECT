import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, MapPin, Calendar, Clock } from "lucide-react";
import api from "../../api/axiosConfig";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    jadwalTerdekatCount: 0,
  });
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/bookings/my-bookings");
        const allBookings = response.data || [];

        // Filter jadwal aktif (confirmed atau waiting_confirmation)
        const activeMatches = allBookings.filter(
          (b) => b.status === "confirmed" || b.status === "waiting_confirmation"
        );

        setDashboardStats({
          totalBookings: allBookings.length,
          jadwalTerdekatCount: activeMatches.length,
        });
        
        // Langsung set tanpa if-conditional agar state tersinkronisasi jika data kosong (null)
        setUpcomingMatch(activeMatches[0] || null);
      } catch (error) {
        console.error("Gagal menarik data database dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Sinkronisasi Database User...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">
              Halo, {user.nama || "Pemain"}!
            </h2>
            <p className="text-xs md:text-sm opacity-90 max-w-md leading-relaxed">
              Siap untuk berkeringat hari ini? Pesan lapangan favoritmu sekarang
              dan dapatkan potongan harga eksklusif.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/booking-lapangan")}
                className="bg-white text-[#004ac6] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 font-bold"
              >
                <PlusCircle size={14} />
                <span>Booking Lapangan</span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block text-8xl opacity-15 rotate-12 select-none">
            ⚽
          </div>
        </div>
      </section>

      {/* Bento Stats Widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px]">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">
            Total Bookings
          </p>
          <h4 className="text-3xl font-black text-slate-800 mt-1">
            {dashboardStats.totalBookings}
          </h4>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px]">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">
            Jadwal Terdekat Tiket Aktif
          </p>
          <h4 className="text-3xl font-black text-[#004ac6] mt-1">
            {dashboardStats.jadwalTerdekatCount}
          </h4>
        </div>
      </section>

      {/* Match Info Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">
            Pertandingan Mendatang
          </h3>

          {upcomingMatch ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-1/3 h-44 sm:h-auto bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
                <img
                  className="w-full h-full object-cover opacity-90"
                  src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop"
                  alt="Venue"
                />
              </div>
              <div className="p-6 sm:w-2/3 flex flex-col justify-between space-y-4">
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                    upcomingMatch.status === "confirmed" 
                      ? "bg-emerald-50 text-[#006c49] border-emerald-100" 
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                    {upcomingMatch.status === "confirmed" ? "Lunas / Terkonfirmasi" : "Menunggu Verifikasi Admin"}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-800 uppercase tracking-tight mt-2">
                    {upcomingMatch.nama_lapangan || "Premium Arena Court"}
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-[#004ac6]" />
                    <span>
                      {upcomingMatch.lokasi || "Gelora Bung Karno, Senayan, Jakarta"}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#004ac6]" />
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Tanggal
                      </p>
                      <p className="text-slate-700 font-bold">
                        {formatTanggal(upcomingMatch.tanggal)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#004ac6]" />
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Jam Main
                      </p>
                      <p className="text-slate-700 font-bold">
                        {upcomingMatch.jam_mulai} - {upcomingMatch.jam_selesai}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              Belum ada jadwal pertandingan aktif terdekat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;