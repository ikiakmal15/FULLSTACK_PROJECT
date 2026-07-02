import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import {
  Star,
  MapPin,
  Wifi,
  ShowerHead,
  ParkingCircle,
  Award,
  Calendar,
  Clock,
  CreditCard,
} from "lucide-react";
import api from "../../api/axiosConfig";

const BookField = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    tanggal: "",
    jam_mulai: "",
    durasi: 1, 
  });
  const [submitting, setSubmitting] = useState(false);

  const BACKEND_URL = "http://localhost:5000"; 

  
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchFieldDetail = async () => {
      try {
        const response = await api.get(`/fields/${id}`);
        setField(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat detail lapangan:", error);
        alert("Lapangan tidak ditemukan!");
        navigate("/fields");
      }
    };
    fetchFieldDetail();
  }, [id, navigate]);

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Wajib Login Terlebih Dahulu!", {
        style: {
          borderRadius: '12px',
          background: '#0b1c30',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        },
      }); 

      setTimeout(() => {
        navigate("/login", { state: { from: `/book/${id}` } });
      }, 2500);
      return;
    }

    if (!bookingData.tanggal || !bookingData.jam_mulai) {
      toast.error("Silakan pilih tanggal dan jam terlebih dahulu!", {
        style: {
          borderRadius: '12px',
          background: '#0b1c30',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
      return;
    }

    navigate("/Checkout", { state: { field, bookingData } });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Menyiapkan Arena Detail...
          </p>
        </div>
      </div>
    );
  }

  const serviceFee = 5000;
  const courtFeeTotal = (field.harga_per_jam || 0) * bookingData.durasi;
  const totalPrice = courtFeeTotal + serviceFee;

  const getFieldImage = () => {
    if (field.gambar) {
      if (!field.gambar.startsWith("http")) {
        return `${BACKEND_URL}/uploads/${field.gambar}`;
      }
      return field.gambar;
    }
    return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop";
  };

  return (
    <div className={!isLoggedIn ? "bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased min-h-screen pb-24 pt-15" : "space-y-6 pb-12 animate-in fade-in duration-200"}>
      <Toaster position="top-center" reverseOrder={false} />

      <section className={!isLoggedIn ? "px-6 max-w-7xl mx-auto" : "max-w-7xl mx-auto"}>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-rows-2 gap-2 h-[260px] md:h-[440px] rounded-2xl overflow-hidden shadow-md group">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-slate-900">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 opacity-90"
              src={getFieldImage()}
              alt={field.nama_lapangan}
            />
          </div>
        </div>
      </section>

      {/* SPLIT LAYOUT MAIN AREA */}
      <div className={!isLoggedIn ? "max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10" : "max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8"}>
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Fasilitas Area
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Wifi size={18} className="text-[#004ac6] shrink-0" />
                <span>Wi-Fi Kencang</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <ShowerHead size={18} className="text-[#004ac6] shrink-0" />
                <span>Hot Shower</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Award size={18} className="text-[#004ac6] shrink-0" />
                <span>
                  {field.tipe?.toLowerCase() === "futsal" ||
                  field.tipe?.toLowerCase() === "sepak bola"
                    ? "Standar PSSI"
                    : field.tipe?.toLowerCase() === "basketball"
                      ? "Standar FIBA"
                      : "Standar PBSI"}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <ParkingCircle size={18} className="text-[#004ac6] shrink-0" />
                <span>Parkir Gratis</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Tentang Lapangan Ini
            </h3>
            <div className="text-xs md:text-sm font-medium text-slate-400 leading-relaxed space-y-4">
              {field.deskripsi && (
                <p className="text-[#004ac6] font-bold bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50 inline-block w-full">
                  <span className="text-slate-700 font-medium">
                    {field.deskripsi}
                  </span>
                </p>
              )}
            </div>
          </section>
        </div>

        {/* GRID SEKTOR KANAN */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleConfirmBooking}
            className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-6"
          >
            <div className="flex justify-between items-start pt-1">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tarif Sewa
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-[#004ac6]">
                    Rp {field.harga_per_jam?.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / jam
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-50 text-[#004ac6] rounded-xl">
                <CreditCard size={18} />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-50">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                  Pilih Tanggal Main
                </label>
                <div className="relative flex items-center group">
                  <Calendar
                    size={14}
                    className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6]"
                  />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        tanggal: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                  Pilih Jam Mulai
                </label>
                <div className="relative flex items-center group">
                  <Clock
                    size={14}
                    className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6]"
                  />
                  <input
                    type="time"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        jam_mulai: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                  Durasi Penggunaan
                </label>
                <select
                  value={bookingData.durasi}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 appearance-none cursor-pointer"
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      durasi: Number(e.target.value),
                    })
                  }
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour} Jam
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Biaya Sewa ({bookingData.durasi} jam)</span>
                <span className="text-slate-700">
                  Rp {courtFeeTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Aplikasi</span>
                <span className="text-slate-700">
                  Rp {serviceFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-800 pt-2 border-t border-slate-50">
                <span>Total Tagihan</span>
                <span className="text-[#004ac6]">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#004ac6] hover:bg-blue-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/10 transition-all active:scale-95 cursor-pointer disabled:bg-slate-400"
            >
              {submitting ? "Memproses Pesanan..." : "Booking"}
            </button>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Konfirmasi Pembayaran Dilakukan di Lokasi
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookField;