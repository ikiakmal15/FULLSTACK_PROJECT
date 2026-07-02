import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Landmark,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import api from "../../api/axiosConfig";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { field, bookingData } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("ewallet");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!field || !bookingData) {
      alert("Data pemesanan tidak valid atau kedaluwarsa!");
      navigate("/fields");
    }
  }, [field, bookingData, navigate]);

  if (!field || !bookingData) return null;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Menembak endpoint diskon baru kalian
      const response = await api.post("/discounts/check", { kode: promoCode }, { headers });
      const dataPromo = response.data;
      
      // Ambil nilai dari kolom 'potongan_persen' sesuai isi database MariaDB kalian
      const nilaiDiskon = Number(dataPromo.potongan_persen || 0);

      setDiscountPercent(nilaiDiskon);
      alert(
        `Kupon Berhasil Diterapkan! Anda mendapatkan diskon sebesar ${nilaiDiskon}%.`
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Kode promo tidak valid atau expired",
      );
      setDiscountPercent(0);
    }
  };

  const handleFinalizeBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const [jam, menit] = bookingData.jam_mulai.split(":");
      const jamSelesaiHitung = `${String(Number(jam) + Number(bookingData.durasi)).padStart(2, "0")}:${menit}`;

      const payload = {
        field_id: field.id,
        tanggal: bookingData.tanggal,
        jam_mulai: bookingData.jam_mulai,
        jam_selesai: jamSelesaiHitung, 
        total_harga: totalPayment,
      };

      const response = await api.post("/bookings", payload);
      alert(
        response.data.message || "Booking berhasil dibuat! Menunggu pembayaran.",
      );
      navigate("/history");
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal menyimpan transaksi pemesanan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const serviceFee = 5000;
  const courtFeeTotal = (field.harga_per_jam || 0) * bookingData.durasi;
  
  // Rumus matematika hitung nominal potongan berdasarkan persen (Contoh: 10/100 * total_harga)
  const discountAmount = (discountPercent / 100) * courtFeeTotal;
  
  // Hasil total akhir pembayaran setelah dikurangi nominal diskon
  const totalPayment = courtFeeTotal + serviceFee - discountAmount;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased min-h-screen pb-24 pt-4">
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-[#004ac6] transition-all group font-semibold text-xs uppercase tracking-wider"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Field Details</span>
            </button>

            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
              Complete Your Booking
            </h1>

            <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                <span className="p-2 bg-blue-50 text-[#004ac6] rounded-xl">
                  <CheckCircle2 size={18} />
                </span>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Booking Summary
                </h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <img
                      className="w-full h-full object-cover opacity-90"
                      src={
                        field.gambar 
                          ? `http://localhost:5000/uploads/${field.gambar}`
                          : "https://via.placeholder.com/150"
                      }
                      alt="Field Thumbnail"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-[#004ac6] bg-blue-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider mb-1">
                      {field.tipe}
                    </p>
                    <h4 className="font-extrabold text-sm text-slate-800 truncate uppercase tracking-tight">
                      {field.nama_lapangan}
                    </h4>
                    <p className="text-slate-400 text-xs font-semibold flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-[#004ac6]" />{" "}
                      <span>Jakarta, Indonesia</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-semibold text-slate-700">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Main</p>
                    <p className="text-slate-800 font-bold mt-0.5">{bookingData.tanggal}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jam Main</p>
                    <p className="text-slate-800 font-bold mt-0.5">{bookingData.jam_mulai}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Durasi Sewa</p>
                    <p className="text-slate-800 font-bold mt-0.5">{bookingData.durasi} Jam</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kapasitas</p>
                    <p className="text-slate-800 font-bold mt-0.5">Satu Tim Penuh</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                <span className="p-2 bg-blue-50 text-[#004ac6] rounded-xl">💳</span>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Payment Method</h2>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod("va")}
                    className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${paymentMethod === "va" ? "border-[#004ac6] bg-blue-50/20" : "border-slate-100 hover:border-blue-200"}`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-blue-50 text-[#004ac6] rounded-xl flex items-center justify-center">
                        <Landmark size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Virtual Account Transfer</p>
                        <p className="text-[11px] font-medium text-slate-400">Transfer via Bank BCA atau BSI</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "va" ? "border-[#004ac6]" : "border-slate-200"}`}>
                        {paymentMethod === "va" && <div className="w-2.5 h-2.5 bg-[#004ac6] rounded-full"></div>}
                      </div>
                    </div>
                  </label>

                  {paymentMethod === "va" && (
                    <div className="mx-2 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Informasi Rekening Bank:</p>
                      <div className="text-xs font-semibold text-slate-700 space-y-1.5">
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <span>Bank BCA</span>
                          <span className="font-mono font-black text-[#004ac6]">8720-3454-11</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <span>Bank BSI</span>
                          <span className="font-mono font-black text-[#004ac6]">1234-5678-90</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. 📱 PILIHAN KEDUA: E-WALLET */}
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod("ewallet")}
                    className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${paymentMethod === "ewallet" ? "border-[#004ac6] bg-blue-50/20" : "border-slate-100 hover:border-blue-200"}`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                        <Wallet size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-wide">E-Wallet (GoPay, ShopeePay, Dana)</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ewallet" ? "border-[#004ac6]" : "border-slate-200"}`}>
                        {paymentMethod === "ewallet" && <div className="w-2.5 h-2.5 bg-[#004ac6] rounded-full"></div>}
                      </div>
                    </div>
                  </label>

                  {paymentMethod === "ewallet" && (
                    <div className="mx-2 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor Akun E-Wallet / QRIS:</p>
                      <div className="text-xs font-semibold text-slate-700 space-y-1.5">
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <span>DANA</span>
                          <span className="font-mono font-black text-[#004ac6]">0812-3456-7890</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <span>GoPay</span>
                          <span className="font-mono font-black text-[#004ac6]">0812-9876-5432</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                          <span>ShopeePay</span>
                          <span className="font-mono font-black text-[#004ac6]">0812-5555-6666</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </section>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 space-y-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Order Summary</h3>

              <div className="space-y-3 text-xs font-semibold text-slate-500 pb-4 border-b border-slate-50">
                <div className="flex justify-between">
                  <span>Biaya Sewa Lapangan</span>
                  <span className="text-slate-800">Rp {courtFeeTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin Sistem</span>
                  <span className="text-slate-800">Rp {serviceFee.toLocaleString("id-ID")}</span>
                </div>
                {/* ✅ PERBAIKAN VISUAL POTONGAN */}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#006c49] bg-emerald-50 px-2 py-1 rounded-md font-bold">
                    <span className="flex items-center gap-1">🎟️ Kupon ({discountPercent}%) Applied</span>
                    <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Masukkan Kode Voucher"
                  className="w-full pl-4 pr-24 py-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="absolute right-1.5 px-4 py-2 bg-slate-900 text-white font-black text-[10px] rounded-lg tracking-wider hover:bg-[#004ac6] transition-colors cursor-pointer uppercase"
                >
                  APPLY
                </button>
              </div>

              <div className="pt-2 flex justify-between items-end">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#004ac6]">Rp {totalPayment.toLocaleString("id-ID")}</p>
              </div>

              <button
                onClick={handleFinalizeBooking}
                disabled={submitting}
                className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
              >
                {submitting ? "Memproses Transaksi..." : "Konfirmasi Booking & Bayar"}
              </button>

              <div className="p-3 bg-emerald-50/50 rounded-xl flex items-start gap-3 border border-emerald-100">
                <ShieldCheck size={18} className="text-[#006c49] mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  <strong className="text-[#006c49]">Secure Checkout.</strong> Seluruh informasi data transaksi pembayaran Anda telah terenkripsi aman secara berlapis di server database BookingSpace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;