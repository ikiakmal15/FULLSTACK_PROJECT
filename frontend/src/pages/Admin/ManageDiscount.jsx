import { useState, useEffect } from "react";
import { Tag, Trash2 } from "lucide-react"; 
import api from "../../api/axiosConfig";

const AdminManageDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    kode_promo: "",
    potongan: "",
    masa_berlaku: "",
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await api.get("/discounts/all");
      setDiscounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data diskon:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        kode_promo: formData.kode_promo,
        potongan_persen: Number(formData.potongan),
        masa_berlaku: formData.masa_berlaku,
      };

      await api.post("/discounts/add", payload);
      setFormData({
        kode_promo: "",
        potongan: "",
        masa_berlaku: "",
      });
      fetchDiscounts();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan voucher.");
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Hapus kupon promo [${code}] secara permanen dari database?`)) {
      try {
        // Menembak rute delete backend kelompok kamu
        await api.delete(`/discounts/${id}`); 
        alert("Kupon promo berhasil dihapus!");
        fetchDiscounts(); // Refresh list data kupon
      } catch (error) {
        alert(error.response?.data?.message || "Gagal menghapus kupon.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Manage Discounts
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Tambah dan kontrol data voucher langsung ke tabel database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM INPUT VOUCHER */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 h-fit"
        >
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={14} /> Generate Promo Code
          </h3>

          <input
            type="text"
            placeholder="KODE PROMO (CONTOH: BERES62)"
            value={formData.kode_promo}
            onChange={(e) =>
              setFormData({
                ...formData,
                kode_promo: e.target.value.toUpperCase(),
              })
            }
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            placeholder="Nominal Potongan (%)"
            value={formData.potongan}
            onChange={(e) =>
              setFormData({ ...formData, potongan: e.target.value })
            }
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            value={formData.masa_berlaku}
            onChange={(e) =>
              setFormData({ ...formData, masa_berlaku: e.target.value })
            }
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#004ac6] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            Publish Coupon
          </button>
        </form>

        {/* LIST KUPON AKTIF */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Kupon Aktif Terdaftar (Database)
          </h3>

          {loading ? (
            <p className="text-center text-xs font-bold text-slate-400 py-6">
              Sinkronisasi data kupon...
            </p>
          ) : (
            <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto pr-2">
              {discounts.length > 0 ? (
                discounts.map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between items-center py-3 group"
                  >
                    <div>
                      <p className="text-xs font-mono font-black text-slate-800 uppercase tracking-wide">
                        {d.kode_promo}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400">
                        {d.nama_promo || "Voucher Potongan"} •{" "}
                        <span className="text-red-500">
                          Exp:{" "}
                          {new Date(d.masa_berlaku).toLocaleDateString("id-ID")}
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-black text-[#006c49] bg-emerald-50 px-2 py-1 rounded">
                        {d.potongan_persen}%
                      </p>
                      <button
                        onClick={() => handleDelete(d.id, d.kode_promo)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Belum ada kupon di database
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageDiscounts;