import { useState, useEffect } from "react";
import {
  DollarSign,
  CalendarDays,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    bookingsCount: 0,
    newUsers: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [topFields, setTopFields] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        let allBookings = [];
        let allUsers = [];

        // 1. Tarik Data Booking (Menggunakan endpoint yang sudah pasti 100% jalan)
        try {
          const bookingResponse = await api.get("/bookings/admin/all", {
            headers,
          });
          allBookings = Array.isArray(bookingResponse.data)
            ? bookingResponse.data
            : [];
        } catch (err) {
          console.error("Gagal memuat data booking di dashboard:", err.message);
        }

        // 2. Tarik Data User (Pakai try-catch terpisah agar kalau 404 tidak merusak data booking)
        try {
          const userResponse = await api.get("/admin/users", { headers }); // 👈 Sembuhkan rute ini kalau ketemu yang asli
          allUsers = Array.isArray(userResponse.data) ? userResponse.data : [];
        } catch (err) {
          console.log("Rute /admin/users masih 404, tapi data booking aman!");
        }

        // 3. Hitung pendapatan hanya dari booking yang VALID / CONFIRMED
        const confirmedRevenue = allBookings
          .filter(
            (b) => b.booking_status === "confirmed" || b.status === "confirmed",
          )
          .reduce((sum, item) => sum + (Number(item.total_harga) || 0), 0);

        // 4. Set state ke widget dashboard
        setStats({
          totalRevenue: confirmedRevenue,
          bookingsCount: allBookings.length,
          newUsers: allUsers.length, // Akan bernilai 0 sementara sampai rutenya dibetulkan
        });

        const dynamicLogs = allBookings.slice(0, 4).map((b) => {
          const currentStatus = b.booking_status || b.status;
          let statusLabel = "Sewa Baru Masuk";
          let statusColor = "text-amber-600 bg-amber-50";
          let icon = "•";

          if (currentStatus === "confirmed") {
            statusLabel = "Sewa Dikonfirmasi";
            statusColor = "text-[#006c49] bg-emerald-50";
            icon = "✓";
          } else if (currentStatus === "cancelled") {
            statusLabel = "Sewa Dibatalkan";
            statusColor = "text-red-600 bg-red-50";
            icon = "✕";
          } else if (
            currentStatus === "waiting_confirmation" ||
            b.bukti_bayar
          ) {
            statusLabel = "Menunggu Verifikasi";
            statusColor = "text-blue-600 bg-blue-50";
            icon = "✏";
          }

          return {
            id: b.booking_id || b.id,
            title: statusLabel,
            subtitle: `${b.nama_user || "Customer"} - ${b.nama_lapangan || "Arena"}`,
            icon: icon,
            color: statusColor,
          };
        });

        setRecentLogs(
          dynamicLogs.length > 0
            ? dynamicLogs
            : [
                {
                  id: 1,
                  title: "Sistem Siap",
                  subtitle: "Belum ada aktivitas booking",
                  icon: "✓",
                  color: "text-slate-500 bg-slate-50",
                },
              ],
        );

        if (allBookings.length > 0) {
          setTopFields([
            {
              id: 1,
              name: allBookings[0].nama_lapangan || "Premium Court",
              type: allBookings[0].nama_lapangan
                ?.toLowerCase()
                .includes("futsal")
                ? "Futsal"
                : "Badminton/Sport",
              demand: "Top Booking",
            },
          ]);
        } else {
          setTopFields([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat rekap database admin:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Sinkronisasi Data Eksekutif...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* TOP BAR REKAP OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Analisis ringkasan data operasional platform BookingSpace secara
            real-time
          </p>
        </div>
      </div>

      {/* STATS KARTU WIDGET GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div className="bg-blue-50 p-3 rounded-xl text-[#004ac6] group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black text-[#00714d] bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide">
              <TrendingUp size={10} /> Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider">
              Total Revenue (Lunas)
            </p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-50 p-3 rounded-xl text-[#006c49] group-hover:scale-110 transition-transform">
              <CalendarDays size={24} />
            </div>
            <span className="text-[10px] font-black text-[#00714d] bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide">
              <TrendingUp size={10} /> Total
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider">
              Bookings Total Log
            </p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              {stats.bookingsCount}
            </h3>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div className="bg-red-50 p-3 rounded-xl text-red-600 group-hover:scale-110 transition-transform">
              <UserPlus size={24} />
            </div>
            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide">
              <TrendingDown size={10} /> User
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider">
              Total Users Registered
            </p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              {stats.newUsers}
            </h3>
          </div>
        </div>
      </section>

      {/* CHART & LOGS ROW CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulated Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
                Tren Aktivitas Booking
              </h4>
              <p className="text-[10px] font-bold text-slate-400">
                Log transaksi masuk dalam rentang waktu operasional
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-52 pt-4 px-2">
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[40%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[65%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[55%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[85%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[45%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[95%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
            <div className="flex-1 bg-blue-600/10 rounded-t-lg h-[75%] relative">
              <div className="absolute inset-0 bg-[#004ac6] opacity-20 rounded-t-lg"></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 px-2 mt-2">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
            <span>Min</span>
          </div>
        </div>

        {/* Recent Logs Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
              Log Aktivitas Terbaru
            </h4>
            <p className="text-[10px] font-bold text-slate-400 mb-4">
              Urutan transaksi terakhir masuk database
            </p>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-3 items-center border-b border-slate-50 pb-3"
                >
                  <div
                    className={`${log.color} p-1.5 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center shrink-0`}
                  >
                    {log.icon}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {log.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {log.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="w-full mt-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            View All Bookings
          </button>
        </div>
      </section>

      {/* TOP PERFORMING FIELDS LOG */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
            Top Performing Fields
          </h4>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="text-[#004ac6] text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto text-xs font-semibold text-slate-600">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wide border-b border-slate-100 text-[10px]">
                <th className="p-3 pl-4">Field Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topFields.length > 0 ? (
                topFields.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50">
                    <td className="p-3 pl-4 font-bold text-slate-800">
                      {f.name}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {f.type}
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-[#006c49] px-2 py-0.5 rounded-md font-bold uppercase text-[9px] tracking-wide border border-emerald-100">
                        {f.demand}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 text-center text-slate-400 text-[11px] uppercase tracking-wider"
                  >
                    Belum ada data performa lapangan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;