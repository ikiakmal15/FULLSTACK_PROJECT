import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react"; 
import api from "../../api/axiosConfig";

const Home = () => {
  const [fields, setFields] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Semua");
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Ambil semua data lapangan
        const fieldsResponse = await api.get("/fields");
        const fieldsData = fieldsResponse.data;
        setFields(fieldsData);

        // 2. Tarik review untuk setiap lapangan secara bersamaan
        const reviewPromises = fieldsData.map((field) =>
          api
            .get(`/reviews/${field.id}`)
            .then((res) => res.data)
            .catch(() => [])
        );

        const allFieldReviews = await Promise.all(reviewPromises);

        // 3. Gabungkan semua review menjadi satu array tunggal
        const mergedReviews = allFieldReviews.flat();

        // 4. Cukup ambil maksimal 3 review teratas/terbaru agar home tidak kepanjangan
        const limitedReviews = mergedReviews.slice(0, 3);
        setReviews(limitedReviews);

        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat data halaman utama:", error);
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const filteredFields = fields.filter((field) => {
    if (filterType === "Semua") return true;
    return field.tipe.toLowerCase() === filterType.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <span className="p-4 bg-blue-100 rounded-full inline-block animate-bounce text-blue-600">
            ⚽
          </span>
          <p className="font-bold text-slate-500 text-sm tracking-wide uppercase">
            Memuat Arena MyField...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased overflow-x-hidden">

      <section className="relative min-h-[650px] flex items-center overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff] via-[#f8f9ff]/70 to-transparent z-10"></div>
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200"
            alt="MyField Premium Arena"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full border border-blue-600/20">
              <span className="text-xs font-bold uppercase tracking-wider">
                🌟 TOP RATED ARENA PLATFORM
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-mono text-[#0b1c30]">
              Booking Lapangan Jadi{" "}
              <span className="bg-gradient-to-r from-[#004ac6] to-[#2563eb] bg-clip-text text-transparent">
                Lebih Mudah
              </span>{" "}
              & Cepat
            </h1>
            <p className="text-base md:text-lg text-[#434655] leading-relaxed">
              Temukan lapangan olahraga terbaik di sekitarmu. Dari Futsal,
              Basketball, hingga Badminton, pesan jadwal favoritmu dalam
              hitungan detik bersama kelompok BERES.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#katalog"
                className="bg-[#004ac6] hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all text-center"
              >
                Cari Lapangan Sekarang
              </a>
            </div>
          </div>

          <div className="hidden lg:block relative h-full min-h-[300px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-12 right-12 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#00714d]">
                  ⚽
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0b1c30]">
                    Next Match Info
                  </h4>
                  <p className="text-xs text-slate-400">
                    Malam ini pukul 20:00 WIB
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#004ac6] w-3/4"></div>
              </div>
              <p className="text-[10px] mt-2 text-right font-bold text-slate-500">
                75% Lapangan Terbooking Hari Ini
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="katalog" className="max-w-7xl mx-auto px-6 -mt-16 relative z-30">
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                Tipe Olahraga
              </label>
              <input
                type="text"
                list="tipe-olahraga-list"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                placeholder="Ketik atau pilih tipe olahraga..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 p-3.5 text-sm font-semibold text-slate-700 outline-none bg-white"
              />
              <datalist id="tipe-olahraga-list">
                <option value="Semua" />
                <option value="Futsal" />
                <option value="Basketball" />
                <option value="Badminton" />
                <option value="Tenis" />
                <option value="Volleyball" />
                <option value="Sepak Bola" />
                <option value="Lainnya" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                Pilih Tanggal
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 p-3.5 text-sm outline-none"
              />
            </div>
            <div>
              <a
                href="#daftar-lapangan"
                className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider text-center block py-4 rounded-xl shadow-md transition-all"
              >
                Cek Ketersediaan Lapangan
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="daftar-lapangan" className="pt-20 pb-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0b1c30] uppercase tracking-tight">
              Katalog Lapangan Populer
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Pilihan terbaik dari database MyField untuk performa maksimalmu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredFields.length > 0 ? (
            filteredFields.map((field) => {
              const imageUrl = field.gambar
                ? `${BACKEND_URL}/uploads/${field.gambar}`
                : "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600";

              return (
                <div
                  key={field.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={imageUrl}
                      alt={field.nama_lapangan}
                    />
                    <div className="absolute top-4 right-4 bg-[#006c49] text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 z-20">
                      ⭐ 4.9
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#004ac6] shadow-sm z-20 uppercase tracking-wider">
                      {field.tipe}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                      {field.nama_lapangan}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                      <MapPin size={12} className="text-[#004ac6]" />
                      <span>Gelora Bung Karno, Senayan, Jakarta</span>
                    </p>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">
                      {field.deskripsi || "Fasilitas premium dengan standar internasional, pencahayaan merata, and ruang tunggu nyaman."}
                    </p>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">
                          Tarif Sewa
                        </span>
                        <p className="font-extrabold text-[#004ac6] text-lg">
                          Rp {field.harga_per_jam?.toLocaleString()}
                          <span className="text-slate-400 text-xs font-normal"> /jam</span>
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/book/${field.id}`)}
                        className="bg-[#004ac6] hover:bg-slate-900 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        SEWA SEKARANG
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-slate-400 font-bold text-sm">
              Tidak ada lapangan tipe "{filterType}" yang tersedia saat ini.
            </div>
          )}
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-[#004ac6] p-8 md:p-16 text-white shadow-xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block bg-[#996100] text-[#ffeedd] text-[10px] font-black px-3 py-1 rounded-lg tracking-wider uppercase">
                LIMITED TIME OFFER
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Jadilah Member Premium & Dapatkan Diskon 30%
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed">
                Nikmati akses prioritas booking, pembatalan jadwal gratis tanpa
                pinalti, dan perolehan poin reward untuk setiap booking lapangan
                di MyField.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-[#004ac6] font-black text-xs tracking-wider px-6 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition-all uppercase"
              >
                Daftar Sekarang
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="text-[120px] opacity-40 animate-pulse">🏆</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#0b1c30]">
              APA KATA MEREKA?
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Ribuan atlet dan komunitas olahraga telah mempercayai sistem MyField.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="bg-[#f8f9ff] p-6 rounded-2xl border border-slate-100 space-y-4 flex flex-col justify-between hover:border-blue-100 transition-colors">
                  <div className="space-y-4">

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(Number(r.rating || 5))].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-xs font-medium italic text-slate-500 leading-relaxed">
                      "{r.ulasan}"
                    </p>
                  </div>
                  <h4 className="font-bold text-xs text-[#0b1c30] uppercase pt-2 border-t border-slate-100/50">
                    — {r.nama || "Anonymous Member"}
                  </h4>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                Belum ada ulasan dari pengguna di sistem saat ini.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <ContactAndLocation />
      </div>
    </div>
  );
};

const ContactAndLocation = () => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      <div className="space-y-4 flex flex-col justify-center">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Lokasi GOR Arena Kami
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Seluruh arena olahraga GOR Merdeka berada di satu komplek terpadu yang
          strategis, dilengkapi dengan fasilitas parkir luas, ruang ganti, dan
          kantin.
        </p>
        <div className="text-xs font-bold text-slate-600 space-y-2">
          <p className="flex items-center gap-1">
            📍 <span>Alamat: Gelora Bung Karno, Komplek Olahraga, Jakarta</span>
          </p>
          <p>📞 Kontak Admin: 0812-3456-7890</p>
        </div>
      </div>

      <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
        <iframe
          title="Lokasi GOR Arena"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.317520772105!2d106.8300486739914!3d-6.352924493636993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec6b07b68ea5%3A0x17da46bdf9308386!2sSTT%20Terpadu%20Nurul%20Fikri%20-%20Kampus%20B!5e0!3m2!1sen!2sid!4v1780597041729!5m2!1sen!2sid"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default Home;