import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Image,
} from "lucide-react";
import api from "../../api/axiosConfig";

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalBookings();
  }, []);

  const fetchGlobalBookings = async () => {
    try {
      const response = await api.get("/bookings/admin/all");
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal menarik data master sewa:", error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin membatalkan penyewaan ini dari sistem?",
      )
    ) {
      try {
        await api.post(`/bookings/admin/cancel/${bookingId}`);
        alert("Status pesanan berhasil diubah menjadi cancelled.");
        fetchGlobalBookings();
      } catch (error) {
        alert(
          error.response?.data?.message || "Gagal mengubah status pesanan.",
        );
      }
    }
  };

  const handleConfirmPayment = async (bookingId, targetStatus) => {
    const pesan =
      targetStatus === "success"
        ? "Apakah Anda yakin menyetujui pembayaran ini?"
        : "Apakah Anda yakin menolak pembayaran ini?";

    if (window.confirm(pesan)) {
      try {
        await api.post("/payments/confirm-by-booking", {
          booking_id: bookingId,
          status: targetStatus,
        });
        alert(`Status transaksi berhasil diperbarui.`);
        fetchGlobalBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Gagal memproses konfirmasi.");
      }
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
      <p className="text-center text-xs font-bold text-slate-400 uppercase py-12">
        Sinkronisasi Log Reservasi...
      </p>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Manage Bookings
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Pantau reservasi dan validasi pembayaran langsung dari satu halaman
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm font-medium text-slate-400 text-center py-8">
            Belum ada data booking di database.
          </p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* 1. Detail Lapangan & Pemesan */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {booking.booking_status === "confirmed" ? (
                    <span className="bg-emerald-50 text-[#006c49] text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-emerald-100 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active / Lunas
                    </span>
                  ) : booking.booking_status === "cancelled" ? (
                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-red-100 inline-flex items-center gap-1">
                      <XCircle size={12} /> Cancelled
                    </span>
                  ) : booking.booking_status === "waiting_confirmation" ? (
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-blue-100 inline-flex items-center gap-1">
                      <AlertCircle size={12} /> Menunggu Verifikasi
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-amber-100 inline-flex items-center gap-1">
                      <AlertCircle size={12} /> Menunggu Pembayaran
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    ID: #BKS-{booking.booking_id}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-800 uppercase tracking-tight">
                  {booking.nama_lapangan}
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  Penyewa:{" "}
                  <span className="text-slate-700 font-extrabold">
                    {booking.nama_user}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-xl lg:bg-transparent lg:p-0 lg:w-60">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#004ac6]" />
                  <div>
                    <p className="text-slate-700 font-bold">
                      {formatTanggal(booking.tanggal)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#004ac6]" />
                  <div>
                    <p className="text-slate-700 font-bold">
                      {booking.jam_mulai} - {booking.jam_selesai}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs lg:w-44 space-y-1 bg-slate-50 p-3 rounded-xl lg:bg-transparent lg:p-0">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                  Bukti Pembayaran
                </p>
                {booking.bukti_bayar ? (
                  <a
                    href={`http://localhost:5000/uploads/${booking.bukti_bayar}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#004ac6] font-extrabold hover:underline text-[11px] cursor-pointer"
                  >
                    <Image size={13} className="text-[#004ac6] flex-shrink-0" />
                    <span className="truncate">Lihat Struk Transfer</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic font-medium block">
                    Belum upload file
                  </span>
                )}
              </div>

              {/* 4. Total Harga & Tombol Tindakan */}
              <div className="pt-4 lg:pt-0 border-t border-slate-100 lg:border-none flex items-center justify-between lg:justify-end gap-6 lg:w-64">
                <div>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                    Total Harga
                  </p>
                  <p className="text-sm font-black text-[#004ac6] mt-0.5">
                    Rp {Number(booking.total_harga).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Opsi Verifikasi Pembayaran untuk status Menunggu Verifikasi */}
                  {booking.booking_status === "waiting_confirmation" && (
                    <>
                      <button
                        onClick={() =>
                          handleConfirmPayment(booking.booking_id, "failed")
                        }
                        className="border border-red-100 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleConfirmPayment(booking.booking_id, "success")
                        }
                        className="border border-emerald-100 text-[#006c49] bg-emerald-50 hover:bg-[#006c49] hover:text-white px-3 py-2 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                    </>
                  )}

                  {/* Tombol Cancel untuk data baru atau data lunas */}
                  {(booking.booking_status === "pending" ||
                    booking.booking_status === "confirmed") && (
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      className="flex items-center gap-1.5 border border-red-100 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminManageBookings;