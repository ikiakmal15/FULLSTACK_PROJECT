import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShowerHead,
  Wifi,
  ParkingCircle,
} from "lucide-react";
import api from "../../api/axiosConfig";

const FieldsCatalog = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await api.get("/fields");
        setFields(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat katalog BookingSpace:", error);
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.nama_lapangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.deskripsi &&
        field.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      filterType === "Semua" ||
      field.tipe.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Memuat Berkas Lapangan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={!isLoggedIn ? "bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased min-h-screen pb-24 pt-20 px-6" : "space-y-6 pb-12 animate-in fade-in duration-200"}>
      
      {!isLoggedIn ? (
        <section className="max-w-7xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Explore Sports Arenas
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Cari dan pilih arena olahraga terbaik favoritmu
          </p>
        </section>
      ) : (
        <section className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Pesan Arena Olahraga
          </h2>
          <p className="text-slate-400 text-xs font-medium">
            Pilih jadwal dan amankan slot lapangan favoritmu langsung dari dashboard internal Anda
          </p>
        </section>
      )}

      <div className={!isLoggedIn ? "max-w-7xl mx-auto mt-6 space-y-8" : "max-w-7xl mx-auto mt-4 space-y-6"}>
        
        <div className="flex flex-col gap-4">
          <div className="relative group max-w-xl flex items-center">
            <Search
              className="absolute left-4 text-slate-400 group-focus-within:text-[#004ac6] transition-colors"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by venue name or facilities..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#004ac6] outline-none transition-all text-xs font-semibold text-slate-700 placeholder:text-slate-400/70"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
            <button
              onClick={() => setFilterType("Semua")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filterType === "Semua" ? "bg-[#004ac6] text-white border-[#004ac6]" : "bg-white text-slate-500 border-slate-200"}`}
            >
              <SlidersHorizontal size={12} />
              <span>All Sports</span>
            </button>
            <button
              onClick={() => setFilterType("Futsal")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filterType === "Futsal" ? "bg-[#004ac6] text-white border-[#004ac6]" : "bg-white text-slate-500 border-slate-200"}`}
            >
              <span>⚽ Futsal</span>
            </button>
            <button
              onClick={() => setFilterType("Basketball")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filterType === "Basketball" ? "bg-[#004ac6] text-white border-[#004ac6]" : "bg-white text-slate-500 border-slate-200"}`}
            >
              <span>🏀 Basketball</span>
            </button>
            <button
              onClick={() => setFilterType("Tennis")}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${filterType === "Tennis" ? "bg-[#004ac6] text-white border-[#004ac6]" : "bg-white text-slate-500 border-slate-200"}`}
            >
              <span>🎾 Tennis</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => {
            const imageUrl = field.gambar
              ? `${BACKEND_URL}/uploads/${field.gambar}`
              : "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600";

            return (
              <div
                key={field.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    src={imageUrl}
                    alt={field.nama_lapangan}
                  />
                  <div className="absolute top-3 right-3 bg-emerald-500/10 backdrop-blur-md text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 border border-emerald-500/20 uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Available</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">
                      {field.nama_lapangan}
                    </h3>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase font-mono">
                      {field.tipe}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-semibold leading-relaxed line-clamp-1">
                    {field.deskripsi || "Premium Complex Center"}
                  </p>

                  <div className="flex gap-3 text-slate-400 text-[10px] font-bold pt-1">
                    <div className="flex items-center gap-0.5">
                      <ShowerHead size={12} className="text-blue-500" />
                      <span>Showers</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Wifi size={12} className="text-blue-500" />
                      <span>WiFi</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <ParkingCircle size={12} className="text-blue-500" />
                      <span>Parkir</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wide">
                        Tarif Sewa
                      </span>
                      <p className="font-extrabold text-[#004ac6] text-sm">
                        Rp {field.harga_per_jam?.toLocaleString()}
                        <span className="text-slate-400 text-[10px] font-normal">/jam</span>
                      </p>
                    </div>
                    
                    <button
                      onClick={() => navigate(isLoggedIn ? `/dashboard/book/${field.id}` : `/book/${field.id}`)}
                      className="bg-[#004ac6] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FieldsCatalog;