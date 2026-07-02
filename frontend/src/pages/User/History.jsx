import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Upload,
} from "lucide-react";
import api from "../../api/axiosConfig";
import UploadPaymentModal from "../../components/User/UploadPaymentModal";

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk operasional modal pembantu
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [metodeBayar, setMetodeBayar] = useState("Transfer BCA");
  const [fileBukti, setFileBukti] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat riwayat sewa dari database:", error);
      setLoading(false);
    }
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!fileBukti) return alert("Silakan unggah file gambar bukti transfer terlebih dahulu!");

    const formData = new FormData();
    formData.append("booking_id", selectedBooking.id);
    formData.append("metode_bayar", metodeBayar);
    formData.append("bukti", fileBukti);

    setUploading(true);
    try {
      await api.post("/payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Bukti transfer berhasil dikirim! Menunggu validasi dari admin.");
      setSelectedBooking(null);
      setFileBukti(null);
      fetchBookingHistory();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengirimkan bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin membatalkan booking lapangan ini?");
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await api.delete(`/bookings/${bookingId}`, { headers });
      alert(response.data.message || "Booking berhasil dibatalkan!");
      fetchBookingHistory();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal membatalkan booking.");
    }
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <p className="text-center text-xs font-bold text-slate-400 uppercase py-12 animate-pulse">
        Sinkronisasi Nota Sewa...
      </p>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Riwayat Penyewaan Arena
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Daftar seluruh log transaksi booking lapangan Anda di database
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm font-medium text-slate-400 text-center py-8">
            Belum ada riwayat transaksi sewa lapangan.
          </p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-100 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {booking.status === "confirmed" ? (
                    <span className="bg-emerald-50 text-[#006c49] text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-emerald-100 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} /> Lunas / Aktif
                    </span>
                  ) : booking.status === "cancelled" ? (
                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-red-100 inline-flex items-center gap-1">
                      <XCircle size={12} /> Cancelled
                    </span>
                  ) : booking.status === "waiting_confirmation" ? (
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-blue-100 inline-flex items-center gap-1">
                      <AlertCircle size={12} /> Menunggu Verifikasi Admin
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-amber-100 inline-flex items-center gap-1">
                      <AlertCircle size={12} /> Menunggu Pembayaran
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base text-slate-800 uppercase tracking-tight">
                  {booking.nama_lapangan || "Arena Sport"}
                </h3>
                <p className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                  <MapPin size={12} className="text-[#004ac6]" />
                  <span>{booking.lokasi || "Gelora Bung Karno, Jakarta"}</span>
                </p>
              </div>

              {/* Waktu Pelaksanaan */}
              <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-700 bg-slate-50/50 p-3 rounded-xl md:bg-transparent md:p-0">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#004ac6]" />
                  <div>
                    <p className="text-slate-700 font-bold">{formatTanggal(booking.tanggal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#004ac6]" />
                  <div>
                    <p className="text-slate-700 font-bold">{booking.jam_mulai} - {booking.jam_selesai} WIB</p>
                  </div>
                </div>
              </div>

              {/* Total Harga & Sektor Aksi */}
              <div className="md:text-right border-t border-slate-50 pt-3 md:pt-0 md:border-none flex justify-between md:flex-col items-center md:items-end gap-3 md:w-48">
                <div>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Total Bayar</p>
                  <p className="text-sm font-black text-[#004ac6] mt-0.5">
                    Rp {Number(booking.total_harga || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex md:flex-col items-center gap-2 w-full md:w-auto justify-end">
                  {/* Tombol Bayar */}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center justify-center gap-1.5 bg-[#004ac6] text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm w-full md:w-auto font-bold"
                    >
                      <Upload size={13} />
                      <span>Bayar</span>
                    </button>
                  )}

                    {booking.status !== "confirmed" && booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-black rounded-xl transition-all cursor-pointer uppercase tracking-wider active:scale-95 w-full md:w-auto text-center"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <UploadPaymentModal
        booking={selectedBooking}
        onClose={() => {
          setSelectedBooking(null);
          setFileBukti(null);
        }}
        onSubmit={handleUploadPayment}
        metodeBayar={metodeBayar}
        setMetodeBayar={setMetodeBayar}
        fileBukti={fileBukti}
        setFileBukti={setFileBukti}
        uploading={uploading}
      />
    </div>
  );
};

export default History;